from django.contrib import admin
from django.urls import include, path
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    # API-Endpunkte für React Frontend - KOMPLETT API-basiert
    path('api/', include('api.urls')),
    
    # DRF Browsable API Login (nur für Development)
    path('api-auth/', include('rest_framework.urls')),
    
    # Admin
    path('admin/', admin.site.urls),
    
    # ALLE HTML-Templates entfernt - nur noch API-Endpunkte!
    # auth/ URLs komplett entfernt da durch /api/auth/ ersetzt
]
