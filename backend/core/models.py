import uuid
from django.db import models
from django.contrib.auth.models import User

# --- Model 1: Business Owner Profile ---
# This model extends Django's built-in User model to store extra, app-specific information.
class BusinessOwnerProfile(models.Model):
    # Creates a one-to-one link with Django's User model.
    # If a User is deleted, their profile is also deleted.
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    # These fields store the business owner's public and payment information.
    full_name = models.CharField(max_length=200, blank=True, help_text="The full name of the business owner.")
    business_name = models.CharField(max_length=200, blank=True, help_text="The official name of the business.")
    upi_id = models.CharField(max_length=100, blank=True, help_text="The UPI ID where the business owner receives payments.")

    def __str__(self):
        return f"Profile for {self.user.username}"


# --- Model 2: Customer ---
# This model stores the information for the clients of a business owner.
class Customer(models.Model):
    # Each customer is linked to a specific business owner.
    # This is crucial for security, ensuring owners only see their own customers.
    owner = models.ForeignKey(BusinessOwnerProfile, on_delete=models.CASCADE, related_name='customers')
    
    name = models.CharField(max_length=200, help_text="The full name of the customer.")
    
    # --- THIS IS THE CORRECT, FINAL STRUCTURE ---
    # We use two separate, optional fields for contact information.
    # This is cleaner and more flexible for sending different types of reminders.
    email = models.EmailField(max_length=254, blank=True, null=True, help_text="The customer's email address (for email reminders).")
    phone_number = models.CharField(max_length=20, blank=True, null=True, help_text="The customer's phone number in E.164 format (e.g., +919876543210).")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} (Client of {self.owner.user.username})"


# --- Model 3: Deal ---
# This is the core model of the application. It represents a single transaction.
class Deal(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Paid', 'Paid'),
    ]

    # This is the UNIQUE ID for the secure payment link. We use a UUID to make it unguessable.
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Each deal is linked to one customer.
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='deals')
    
    description = models.CharField(max_length=255, help_text="A brief description of the deal, e.g., 'Wedding Photoshoot'.")
    amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="The total amount due for this deal.")
    due_date = models.DateField(help_text="The date the payment is due.")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pending', help_text="The current status of the payment.")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Deal for {self.amount} with {self.customer.name}"


# --- Model 4: ReminderLog (Bonus Feature) ---
# This model keeps a record of every reminder sent for a deal.
class ReminderLog(models.Model):
    deal = models.ForeignKey(Deal, on_delete=models.CASCADE, related_name='reminders')
    sent_at = models.DateTimeField(auto_now_add=True)
    method = models.CharField(max_length=20, help_text="The method used for the reminder (e.g., 'Email', 'WhatsApp').")

    def __str__(self):
        return f"Reminder for Deal {self.deal.id} sent at {self.sent_at}"

