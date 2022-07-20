from django.contrib import admin

from .models import Article

#admin.site.register(Article) firstway

@admin.register(Article)
class ArticleModel(admin.ModelAdmin): #seond way
    list_filter = ('title', 'description')
    list_display = ('title', 'description')