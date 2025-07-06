from django.shortcuts import get_object_or_404
from .models import Article
from .serializers import ArticleSerializer, UserSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import APIView, api_view, permission_classes
from rest_framework import generics, mixins
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.db.models import Q

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    # permission_classes = [IsAuthenticated]
    # authentications_classes = (TokenAuthentication,)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def search_articles(request):
    """
    Search articles by title and description
    """
    query = request.GET.get('q', '')
    
    if not query:
        return Response({
            'results': [],
            'count': 0,
            'message': 'No search query provided'
        })
    
    # Search in both title and description fields
    articles = Article.objects.filter(
        Q(title__icontains=query) | Q(description__icontains=query)
    ).distinct()
    
    serializer = ArticleSerializer(articles, many=True)
    
    return Response({
        'results': serializer.data,
        'count': articles.count(),
        'query': query,
        'message': f'Found {articles.count()} articles matching "{query}"'
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def user_info(request):
    """
    Get current user information for navbar
    """
    if request.user.is_authenticated:
        return Response({
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'is_authenticated': True
        })
    else:
        return Response({
            'is_authenticated': False
        })

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Simple health check endpoint
    """
    return Response({
        'status': 'healthy',
        'message': 'Django API is running'
    })