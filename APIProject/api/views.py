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

# API-friendly views using Django's built-in password reset functionality

from django.contrib.auth.forms import SetPasswordForm
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_decode

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_api_view(request):
    """
    API-only password reset - generates token and returns reset info for React frontend
    """
    try:
        email = request.data.get('email')
        if not email:
            return Response({
                'errors': {'email': ['This field is required.']}
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate email format
        from django.core.validators import validate_email
        from django.core.exceptions import ValidationError
        
        try:
            validate_email(email)
        except ValidationError:
            return Response({
                'errors': {'email': ['Invalid email format.']}
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user exists
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # For security, don't reveal if email exists or not
            return Response({
                'message': f'If an account with email {email} exists, a password reset link has been sent.'
            }, status=status.HTTP_200_OK)
        
        # Generate reset token
        from django.contrib.auth.tokens import default_token_generator
        from django.utils.http import urlsafe_base64_encode
        from django.utils.encoding import force_bytes
        
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # In a real application, you would send an email here
        # For development, we'll log the reset link
        reset_link = f"http://localhost:8080/reset-confirm?uid={uid}&token={token}"
        
        print(f"🔗 PASSWORD RESET LINK for {email}:")
        print(f"   Link: {reset_link}")
        print(f"   User: {user.username} (ID: {user.id})")
        print(f"   Token: {token}")
        print(f"   UID: {uid}")
        
        return Response({
            'message': f'Password reset email sent to {email}',
            'reset_link': reset_link,  # Remove this in production
            'uid': uid,  # For development purposes
            'token': token  # For development purposes
        }, status=status.HTTP_200_OK)
            
    except Exception as e:
        print(f"❌ Password reset error: {str(e)}")
        return Response({
            'error': 'An error occurred processing your request'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm_api_view(request):
    """
    API-friendly password reset confirm using Django's built-in functionality
    """
    try:
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        new_password1 = request.data.get('new_password1')
        new_password2 = request.data.get('new_password2')
        
        if not all([uidb64, token, new_password1, new_password2]):
            return Response({
                'errors': {'non_field_errors': ['All fields are required.']}
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Decode user ID
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({
                'errors': {'non_field_errors': ['Invalid reset link.']}
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check token validity
        if not default_token_generator.check_token(user, token):
            return Response({
                'errors': {'non_field_errors': ['Invalid or expired reset link.']}
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Use Django's built-in SetPasswordForm
        form = SetPasswordForm(user, data={
            'new_password1': new_password1,
            'new_password2': new_password2
        })
        
        if form.is_valid():
            form.save()  # This saves the new password
            
            return Response({
                'message': 'Password reset successfully'
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'errors': form.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def password_change_api(request):
    """
    Password change API endpoint
    """
    print(f"🔄 PASSWORD CHANGE REQUEST for user: {request.user.username}")
    serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        user = request.user
        new_password = serializer.validated_data['new_password1']
        
        print(f"👤 Changing password for: {user.username} (ID: {user.id})")
        
        user.set_password(new_password)
        user.save()
        
        print(f"✅ Password updated successfully")
        
        # Update token after password change
        Token.objects.filter(user=user).delete()
        token = Token.objects.create(user=user)
        
        print(f"🔑 New token generated: {token.key[:10]}...")
        
        return Response({
            'message': 'Passwort wurde erfolgreich geändert',
            'token': token.key  # New token after password change
        }, status=status.HTTP_200_OK)
    else:
        print(f"❌ Password change validation errors: {serializer.errors}")
    
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