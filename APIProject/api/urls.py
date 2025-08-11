from django.urls import path, include
from .views import (
    ArticleViewSet, UserViewSet, user_info, health_check, search_articles, 
    register_api, login_api, logout_api, password_change_api, user_profile_api,
    password_reset_api_view, password_reset_confirm_api_view
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('articles', ArticleViewSet, basename='articles')
router.register('users', UserViewSet)

urlpatterns = [
    # API Endpunkte für React Frontend
    path('', include(router.urls)),  # /api/articles/, /api/users/
    path('user/me/', user_info, name='user_info'),  # /api/user/me/
    path('health/', health_check, name='health_check'),  # /api/health/
    path('search/', search_articles, name='search_articles'),  # /api/search/
    
    # Auth API Endpunkte - Using Django's built-in views for password reset
    path('auth/register/', register_api, name='register_api'),  # /api/auth/register/
    path('auth/login/', login_api, name='login_api'),  # /api/auth/login/
    path('auth/logout/', logout_api, name='logout_api'),  # /api/auth/logout/
    path('auth/password-change/', password_change_api, name='password_change_api'),  # /api/auth/password-change/
    path('user/profile/', user_profile_api, name='user_profile_api'),  # /api/user/profile/
    
    # Auth API Endpunkte - Komplett API-basiert für React Frontend
    path('auth/password-reset/', password_reset_api_view, name='password_reset_api'),
    path('auth/password-reset-confirm/', password_reset_confirm_api_view, name='password_reset_confirm_api'),
]