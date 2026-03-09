# --- THIS CODE IS FOR: flowtrack/core/urls.py ---
# This is the detailed "address book" for your main application.
# It lists every specific API endpoint.

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CustomerViewSet,
    DealViewSet,
    RegisterView,
    LoginView,
    ProfileView,
    UserProfileView,
    ContactFormView,
    SendSignupOTPView,
    VerifySignupOTPView,
    ForgotPasswordView,
    VerifyResetOTPView,
    ResetPasswordView,
)

# The router handles the Customer and Deal ViewSets automatically.
router = DefaultRouter()
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'deals', DealViewSet, basename='deal')

# This is the detailed list of all URLs for our core app.
urlpatterns = [
    # This line includes all URLs the router generated (for customers and deals).
    path('', include(router.urls)),
    
    # URL for user registration
    path('register/', RegisterView.as_view(), name='register'),
    path('send-signup-otp/', SendSignupOTPView.as_view(), name='send-signup-otp'),
    path('verify-signup-otp/', VerifySignupOTPView.as_view(), name='verify-signup-otp'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('verify-reset-otp/', VerifyResetOTPView.as_view(), name='verify-reset-otp'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('login/', LoginView.as_view(), name='login'),
    
    # URL for the business owner's profile
    path('profile/', ProfileView.as_view(), name='profile'),
    
    # URL for user profile
    path('user/profile/', UserProfileView.as_view(), name='user-profile'),
    
    # Contact form endpoint
    path('contact/', ContactFormView.as_view(), name='contact-form'),
    
    # This adds the "Log in" / "Log out" button to the browsable API for easy testing.
    path('auth/', include('rest_framework.urls')),
]
