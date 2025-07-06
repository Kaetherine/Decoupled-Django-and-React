from django.urls import path, include
from .views import ArticleViewSet, UserViewSet, user_info, health_check, search_articles
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('articles', ArticleViewSet, basename='articles')
router.register('users', UserViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/user/me/', user_info, name='user_info'),
    path('api/health/', health_check, name='health_check'),
    path('api/search/', search_articles, name='search_articles'),
]