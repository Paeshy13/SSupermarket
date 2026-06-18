from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ['email', 'username', 'first_name', 'last_name', 'phone_number', 'is_active']
    fieldsets = UserAdmin.fieldsets + (
        ('Extra', {'fields': ('phone_number', 'address', 'preferred_language')}),
    )
