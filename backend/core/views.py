# --- THIS IS THE FINAL and CORRECTED views.py FILE ---
# It includes a security fix to resolve the 403 Forbidden error.

import secrets
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.core.cache import cache
from django.conf import settings
from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
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

        customer_name = deal.customer.name
        customer_contact_email = deal.customer.email
        amount = deal.amount
        description = deal.description

        if not customer_contact_email:
            return Response({'error': 'This customer does not have an email address saved.'}, status=status.HTTP_400_BAD_REQUEST)

        subject = f"Payment Reminder: {description}"
        html_message = (
            f"<h3>Hi {customer_name},</h3>"
            f"<p>This is a friendly reminder that your payment of <strong>₹{amount}</strong> for <strong>{description}</strong> is due.</p>"
            f"<p>Please pay the business directly (cash, UPI, or bank transfer) when convenient.</p>"
        )
        plain_message = f"Hi {customer_name}, your payment of ₹{amount} for {description} is due. Please pay the business directly."

        try:
            send_mail(subject, plain_message, settings.EMAIL_HOST_USER, [customer_contact_email], html_message=html_message)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'success': 'Reminder email sent successfully!'})


# --- OTP SIGNUP (real email: OTP sent to email, only real inbox can verify) ---

def _send_otp_email(email, otp, subject_prefix="Your verification code"):
    subject = f"{subject_prefix} - BizPulse"
    message = f"Your OTP is: {otp}. Valid for 10 minutes. Do not share."
    html = f"<p>Your verification code is: <strong>{otp}</strong></p><p>Valid for 10 minutes. Do not share.</p>"
    send_mail(subject, message, settings.EMAIL_HOST_USER, [email], html_message=html, fail_silently=False)


class SendSignupOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = (request.data.get("email") or "").strip().lower()
        first_name = (request.data.get("first_name") or "").strip()
        last_name = (request.data.get("last_name") or "").strip()
        password = request.data.get("password") or ""

        if not all([email, first_name, last_name, password]):
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists():
            return Response({"error": "An account already exists with this email."}, status=status.HTTP_400_BAD_REQUEST)

        otp = str(secrets.randbelow(900000) + 100000)  # 6 digits
        expire = getattr(settings, "OTP_EXPIRE_SECONDS", 600)
        cache.set(f"otp_signup_{email}", otp, expire)
        cache.set(f"signup_data_{email}", {
            "first_name": first_name,
            "last_name": last_name,
            "password": password,
        }, expire)

        try:
            _send_otp_email(email, otp, "Signup verification")
        except Exception as e:
            return Response({"error": "Failed to send OTP. Please try again."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"success": True, "message": "OTP sent to your email."})


class VerifySignupOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = (request.data.get("email") or "").strip().lower()
        otp = (request.data.get("otp") or "").strip()

        if not email or not otp:
            return Response({"error": "Email and OTP are required."}, status=status.HTTP_400_BAD_REQUEST)

        cached_otp = cache.get(f"otp_signup_{email}")
        if not cached_otp or cached_otp != otp:
            return Response({"error": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)

        data = cache.get(f"signup_data_{email}")
        if not data:
            return Response({"error": "Session expired. Please sign up again."}, status=status.HTTP_400_BAD_REQUEST)

        first_name = data["first_name"]
        last_name = data["last_name"]
        password = data["password"]

        base_username = (first_name + last_name).lower().replace(" ", "") or email.split("@")[0]
        username = base_username
        c = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{c}"
            c += 1

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )
        BusinessOwnerProfile.objects.get_or_create(user=user)

        cache.delete(f"otp_signup_{email}")
        cache.delete(f"signup_data_{email}")

        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


# --- FORGOT / RESET PASSWORD (only registered email, OTP to inbox) ---

class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = (request.data.get("email") or "").strip().lower()
        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Email not registered."}, status=status.HTTP_404_NOT_FOUND)

        otp = str(secrets.randbelow(900000) + 100000)
        expire = getattr(settings, "OTP_EXPIRE_SECONDS", 600)
        cache.set(f"otp_reset_{email}", otp, expire)

        try:
            _send_otp_email(email, otp, "Password reset")
        except Exception as e:
            return Response({"error": "Failed to send OTP. Please try again."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"success": True, "message": "OTP sent to your email."})


class VerifyResetOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = (request.data.get("email") or "").strip().lower()
        otp = (request.data.get("otp") or "").strip()
        if not email or not otp:
            return Response({"error": "Email and OTP are required."}, status=status.HTTP_400_BAD_REQUEST)

        cached_otp = cache.get(f"otp_reset_{email}")
        if not cached_otp or cached_otp != otp:
            return Response({"error": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)

        reset_token = secrets.token_urlsafe(32)
        expire = getattr(settings, "RESET_TOKEN_EXPIRE_SECONDS", 600)
        cache.set(f"reset_token_{email}", reset_token, expire)
        cache.delete(f"otp_reset_{email}")

        return Response({"success": True, "reset_token": reset_token, "email": email})


class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = (request.data.get("email") or "").strip().lower()
        reset_token = (request.data.get("reset_token") or "").strip()
        new_password = request.data.get("new_password") or ""

        if not email or not reset_token or not new_password:
            return Response({"error": "Email, reset token and new password are required."}, status=status.HTTP_400_BAD_REQUEST)

        cached_token = cache.get(f"reset_token_{email}")
        if not cached_token or cached_token != reset_token:
            return Response({"error": "Invalid or expired reset link. Please request a new one."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        user.set_password(new_password)
        user.save()
        cache.delete(f"reset_token_{email}")

        refresh = RefreshToken.for_user(user)
        return Response({
            "success": True,
            "message": "Password updated. You are now logged in.",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })


# --- USER MANAGEMENT & PROFILE ENDPOINTS ---

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # Create empty BusinessOwnerProfile so /profile/ works; user fills UPI/phone/bank on Business Profile page
        BusinessOwnerProfile.objects.get_or_create(user=user)
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
        # Ensure every user has a profile (e.g. old users created before we added get_or_create on register)
        profile, _ = BusinessOwnerProfile.objects.get_or_create(user=self.request.user)
        return profile


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


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
