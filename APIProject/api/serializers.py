from rest_framework import serializers
from .models import Article
from django.contrib.auth.models import User
from rest_framework.authtoken.views import Token


class ArticleSerializer(serializers.ModelSerializer):
    # title = serializers.CharField(max_length=100)
    # description = serializers.CharField(max_length=100) 

    # def create(self, validate_data):
    #     return Article.objects.create(validate_data)

    # def update(self, instance, validate_data):
    #     instance.title = validate_data.get('title', instance.title)
    #     instance.description = validate_data.get('description', instance.description)

    class Meta:
        model = Article
        fields = ['id', 'title', 'description']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']

        extra_kwargs = {'password': {
            'write_only': True,
            'required': True,
        }}
    
    def create(self, validated_data):
        user = User.objects.all(**validated_data)
        Token.objects.create(user=user)
        return user



