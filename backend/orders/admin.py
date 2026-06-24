from django.contrib import admin
from .models import Order, OrderItem, Receipt

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_id', 'user', 'status', 'payment_method', 'payment_status', 'total_amount', 'created_at']
    list_filter = ['status', 'payment_method', 'payment_status']
    inlines = [OrderItemInline]

@admin.register(Receipt)
class ReceiptAdmin(admin.ModelAdmin):
    list_display = ['receipt_number', 'order', 'verified', 'generated_at']
