from django.shortcuts import get_object_or_404, render, redirect
from .models import Article
from .serializers import (
    ArticleSerializer, UserSerializer, UserRegistrationSerializer, UserLoginSerializer,
    PasswordResetSerializer, PasswordResetConfirmSerializer, PasswordChangeSerializer, UserProfileSerializer
)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import APIView, api_view, permission_classes
from rest_framework import generics, mixins
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.db.models import Q

# Auth-Related Imports - nur noch für API benötigt

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

# API Views für React Frontend mit Serializers
from rest_framework.authtoken.models import Token

@api_view(['POST'])
@permission_classes([AllowAny])
def register_api(request):
    """
    User registration API endpoint with proper validation
    """
    serializer = UserRegistrationSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'message': 'Registrierung erfolgreich',
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_api(request):
    """
    User login API endpoint with proper validation
    """
    serializer = UserLoginSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'message': 'Login erfolgreich',
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }, status=status.HTTP_200_OK)
    
    return Response({
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_api(request):
    """
    User logout API endpoint
    """
    try:
        # Delete token
        request.user.auth_token.delete()
        return Response({
            'message': 'Logout erfolgreich'
        }, status=status.HTTP_200_OK)
    except:
        return Response({
            'error': 'Logout fehlgeschlagen'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_api(request):
    """
    Password reset API endpoint - sends reset email
    """
    serializer = PasswordResetSerializer(data=request.data)
    
    if serializer.is_valid():
        email = serializer.validated_data['email']
        # In production: send actual email with reset link
        # For now, just return success message
        return Response({
            'message': f'Passwort-Reset E-Mail wurde an {email} gesendet'
        }, status=status.HTTP_200_OK)
    
    return Response({
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm_api(request):
    """
    Password reset confirm API endpoint
    """
    serializer = PasswordResetConfirmSerializer(data=request.data)
    
    if serializer.is_valid():
        # In production: validate token and reset password
        # For now, just return success message
        return Response({
            'message': 'Passwort wurde erfolgreich zurückgesetzt'
        }, status=status.HTTP_200_OK)
    
    return Response({
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def password_change_api(request):
    """
    Password change API endpoint
    """
    serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        user = request.user
        new_password = serializer.validated_data['new_password1']
        user.set_password(new_password)
        user.save()
        
        # Update token after password change
        Token.objects.filter(user=user).delete()
        token = Token.objects.create(user=user)
        
        return Response({
            'message': 'Passwort wurde erfolgreich geändert',
            'token': token.key  # New token after password change
        }, status=status.HTTP_200_OK)
    
    return Response({
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def user_profile_api(request):
    """
    User profile API endpoint
    """
    user = request.user
    
    if request.method == 'GET':
        serializer = UserProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method in ['PUT', 'PATCH']:
        partial = request.method == 'PATCH'
        serializer = UserProfileSerializer(user, data=request.data, partial=partial)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Profil wurde erfolgreich aktualisiert',
                'user': serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response({
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)