from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from .models import BusinessOwnerProfile, Customer, Deal

# --- This file defines how your database models are translated into JSON for the API ---

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model. Handles registration.
    Includes explicit validation to ensure username and email are unique.
    """
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="An account with this email already exists.")]
    )
    username = serializers.CharField(
        validators=[UniqueValidator(queryset=User.objects.all(), message="This username is already taken.")]
    )
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {
            'password': {'write_only': True} # Ensures password is not sent back in API responses
        }

    def create(self, validated_data):
        # Use create_user to properly handle password hashing
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class BusinessOwnerProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the Business Owner's profile information.
    """
    class Meta:
        model = BusinessOwnerProfile
        fields = ['full_name', 'business_name', 'upi_id']


class CustomerSerializer(serializers.ModelSerializer):
    """
    Serializer for the Customer model.
    """
    class Meta:
        model = Customer
        # Includes all fields needed for the frontend dashboard
        fields = ['id', 'name', 'email', 'phone_number', 'created_at']


class DealSerializer(serializers.ModelSerializer):
    """
    Serializer for the Deal model.
    """
    # This nests the full customer details within the deal data, which is
    # very efficient for the frontend to display.
    customer = CustomerSerializer(read_only=True)
    
    # This field is used only when CREATING a new deal from the frontend.
    # It allows the frontend to just send the 'customer_id'.
    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all(), source='customer', write_only=True
    )

    class Meta:
        model = Deal
        # Includes all fields needed for the frontend dashboard
        fields = ['id', 'customer', 'customer_id', 'description', 'amount', 'due_date', 'status', 'created_at']

from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from .models import BusinessOwnerProfile, Customer, Deal

# --- This file defines how your database models are translated into JSON for the API ---

# class UserSerializer(serializers.ModelSerializer):
#     """
#     Serializer for the User model. Handles registration.
#     Includes explicit validation to ensure username and email are unique.
#     """
#     email = serializers.EmailField(
#         required=True,
#         validators=[UniqueValidator(queryset=User.objects.all(), message="An account with this email already exists.")]
#     )
#     username = serializers.CharField(
#         validators=[UniqueValidator(queryset=User.objects.all(), message="This username is already taken.")]
#     )
#     class Meta:
#         model = User
#         fields = ('id', 'username', 'email', 'password')
#         extra_kwargs = {
#             'password': {'write_only': True} # Ensures password is not sent back in API responses
#         }

#     def create(self, validated_data):
#         # Use create_user to properly handle password hashing
#         user = User.objects.create_user(
#             username=validated_data['username'],
#             email=validated_data['email'],
#             password=validated_data['password']
#         )
#         return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
class BusinessOwnerProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the Business Owner's profile information.
    """
    class Meta:
        model = BusinessOwnerProfile
        fields = ['full_name', 'business_name', 'upi_id']


class CustomerSerializer(serializers.ModelSerializer):
    """
    Serializer for the Customer model.
    """
    class Meta:
        model = Customer
        # Includes all fields needed for the frontend dashboard
        fields = ['id', 'name', 'email', 'phone_number', 'created_at']


class DealSerializer(serializers.ModelSerializer):
    """
    Serializer for the Deal model.
    """
    # This nests the full customer details within the deal data, which is
    # very efficient for the frontend to display.
    customer = CustomerSerializer(read_only=True)
    
    # This field is used only when CREATING a new deal from the frontend.
    # It allows the frontend to just send the 'customer_id'.
    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all(), source='customer', write_only=True
    )

    class Meta:
        model = Deal
        # Includes all fields needed for the frontend dashboard
        fields = ['id', 'customer', 'customer_id', 'description', 'amount', 'due_date', 'status', 'created_at']

