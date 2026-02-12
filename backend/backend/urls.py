from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Add this line to include your API's URLs
    path('api/', include('core.urls')),
]
