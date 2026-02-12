from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import BusinessOwnerProfile

# This single function handles BOTH creating and saving the profile.
@receiver(post_save, sender=User)
def create_or_update_business_profile(sender, instance, created, **kwargs):
    """
    This signal is triggered whenever a User object is saved.
    - If the user was just created, it creates a new BusinessOwnerProfile for them.
    - If the user already existed, it just saves the profile (in case of changes).
    """
    if created:
        # If the User was just created, create a new profile linked to them.
        BusinessOwnerProfile.objects.create(user=instance)
    
    # In either case (created or updated), save the related profile.
    # This ensures that if a User's details change, the profile is also saved.
    instance.businessownerprofile.save()

