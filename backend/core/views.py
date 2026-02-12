# --- THIS IS THE FINAL and CORRECTED views.py FILE ---
# It includes a security fix to resolve the 403 Forbidden error.

from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication # Import JWTAuthentication
from django.contrib.auth import authenticate
from django.utils import timezone

from .models import BusinessOwnerProfile, Customer, Deal
from .serializers import (
    UserSerializer,
    BusinessOwnerProfileSerializer,
    CustomerSerializer,
    DealSerializer
)


# --- SECURITY & PERMISSIONS (Unchanged) ---

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, BusinessOwnerProfile):
            return obj.user == request.user
        if isinstance(obj, Customer):
            return obj.owner.user == request.user
        if isinstance(obj, Deal):
            return obj.customer.owner.user == request.user
        return False


# --- API ENDPOINTS FOR THE LOGGED-IN BUSINESS OWNER ---

class CustomerViewSet(viewsets.ModelViewSet):
    serializer_class = CustomerSerializer
    # --- FIX: Explicitly define the authentication and permission classes ---
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        owner_profile = BusinessOwnerProfile.objects.get(user=self.request.user)
        return Customer.objects.filter(owner=owner_profile)

    def perform_create(self, serializer):
        owner_profile = BusinessOwnerProfile.objects.get(user=self.request.user)
        serializer.save(owner=owner_profile)


class DealViewSet(viewsets.ModelViewSet):
    serializer_class = DealSerializer
    # --- FIX: Explicitly define the authentication and permission classes ---
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        owner_profile = BusinessOwnerProfile.objects.get(user=self.request.user)
        return Deal.objects.filter(customer__owner=owner_profile)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def send_reminder(self, request, pk=None):
        deal = self.get_object()
        if deal.status == 'Paid':
            return Response({'error': 'This deal has already been paid.'}, status=status.HTTP_400_BAD_REQUEST)

        BASE_URL = "https://your-frontend-ngrok-url.io" # <-- Point to React App
        verification_link = f"{BASE_URL}/verify/{deal.id}/"
        
        customer_name = deal.customer.name
        customer_contact_email = deal.customer.email
        amount = deal.amount
        
        if not customer_contact_email:
            return Response({'error': 'This customer does not have an email address saved.'}, status=status.HTTP_400_BAD_REQUEST)

        subject = f"Payment Reminder: {deal.description}"
        html_message = ( f"<h3>Hi {customer_name},</h3>" f"<p>This is a friendly reminder that your payment of <strong>₹{amount}</strong> is due.</p>" f"<p>Please use the secure link below to verify and complete your payment:</p>" f"<p><a href='{verification_link}' style='background-color:#4F46E5; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;'><strong>Click Here to Pay</strong></a></p>" )
        plain_message = f"Hi {customer_name}, your payment of ₹{amount} is due. Pay here: {verification_link}"
        
        try:
            send_mail(subject, plain_message, settings.EMAIL_HOST_USER, [customer_contact_email], html_message=html_message)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'success': 'Reminder email sent successfully!', 'link': verification_link})


# --- USER MANAGEMENT & PROFILE ENDPOINTS (Unchanged) ---

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({ "user": UserSerializer(user).data, "refresh": str(refresh), "access": str(refresh.access_token), }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if not user:
             try:
                user_obj = User.objects.get(email=username)
                user = authenticate(username=user_obj.username, password=password)
             except User.DoesNotExist:
                pass
        if user:
            refresh = RefreshToken.for_user(user)
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])
            return Response({ "refresh": str(refresh), "access": str(refresh.access_token), })
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = BusinessOwnerProfileSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    def get_object(self):
        return self.request.user.businessownerprofile


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


# --- PUBLIC-FACING ENDPOINTS (Unchanged) ---

class ClientVerificationView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request, deal_id, format=None):
        try:
            deal = Deal.objects.get(id=deal_id)
            submitted_name = request.data.get('full_name', '').strip()
            if submitted_name.lower() == deal.customer.name.strip().lower():
                return Response({ 'success': True, 'deal': DealSerializer(deal).data })
            else:
                return Response({'success': False, 'error': 'Name does not match.'}, status=status.HTTP_400_BAD_REQUEST)
        except Deal.DoesNotExist:
            return Response({'success': False, 'error': 'Invalid invoice link.'}, status=status.HTTP_404_NOT_FOUND)

class SimulatedPaymentView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request, deal_id, format=None):
        try:
            deal = Deal.objects.get(id=deal_id)
            if deal.status == 'Paid':
                 return Response({'success': False, 'message': 'This deal has already been paid.'}, status=status.HTTP_400_BAD_REQUEST)
            deal.status = 'Paid'
            deal.save()
            return Response({'success': True, 'message': 'Payment successful! Thank you.'})
        except Deal.DoesNotExist:
            return Response({'success': False, 'error': 'Invalid invoice link.'}, status=status.HTTP_404_NOT_FOUND)


# --- CONTACT FORM EMAIL ENDPOINT ---

class ContactFormView(APIView):
    permission_classes = [permissions.AllowAny]  # Allow anyone to send contact form

    def post(self, request, format=None):
        try:
            name = request.data.get('name', '').strip()
            email = request.data.get('email', '').strip()
            subject = request.data.get('subject', '').strip()
            message = request.data.get('message', '').strip()

            # Validate required fields
            if not all([name, email, subject, message]):
                return Response(
                    {'success': False, 'error': 'All fields are required.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validate email format (basic check)
            if '@' not in email or '.' not in email:
                return Response(
                    {'success': False, 'error': 'Please enter a valid email address.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Admin email from settings (from .env file)
            admin_email = getattr(settings, 'ADMIN_EMAIL', 'bhavinmeta009@gmail.com')

            # Email content
            email_subject = f"New Contact Form Submission: {subject}"
            email_body = f"""
New contact form submission received:

Name: {name}
Email: {email}
Subject: {subject}

Message:
{message}

---
This message was sent from the BizPulse contact form.
            """

            # Send email to admin
            send_mail(
                subject=email_subject,
                message=email_body,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[admin_email],
                fail_silently=False,
            )

            return Response({
                'success': True,
                'message': 'Thank you for your message! We\'ll get back to you soon.'
            })

        except Exception as e:
            return Response({
                'success': False,
                'error': f'Failed to send message. Please try again later. Error: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
