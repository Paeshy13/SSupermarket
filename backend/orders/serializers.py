from rest_framework import serializers
from .models import Order, OrderItem, Receipt
from products.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price', 'subtotal']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()
    
    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
    
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['order_id', 'user', 'created_at', 'updated_at']

class ReceiptSerializer(serializers.ModelSerializer):
    order = OrderSerializer(read_only=True)
    
    class Meta:
        model = Receipt
        fields = '__all__'

class CreateOrderSerializer(serializers.Serializer):
    items = serializers.ListField(child=serializers.DictField())
    payment_method = serializers.ChoiceField(choices=['mpesa', 'bank', 'card'])
    mpesa_phone = serializers.CharField(required=False, allow_blank=True)
    bank_reference = serializers.CharField(required=False, allow_blank=True)
