from django.contrib import admin
from .models import BusinessOwnerProfile, Customer, Deal, ReminderLog

# Register your models here.
admin.site.register(BusinessOwnerProfile)
admin.site.register(Customer)
admin.site.register(Deal)
admin.site.register(ReminderLog)