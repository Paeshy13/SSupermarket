from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from .models import Order, OrderItem, Receipt
from .serializers import OrderSerializer, ReceiptSerializer, CreateOrderSerializer
from .mpesa import initiate_stk_push
from .receipt_generator import generate_receipt_data, generate_receipt_number, generate_qr_code
from products.models import Product
import json

class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        items_data = data['items']
        
        # Calculate total
        total = 0
        validated_items = []
        for item in items_data:
            product = get_object_or_404(Product, id=item['product_id'], is_available=True)
            qty = int(item.get('quantity', 1))
            price = float(product.price)
            total += price * qty
            validated_items.append({'product': product, 'quantity': qty, 'price': price})
        
        # Create order
        order = Order.objects.create(
            user=request.user,
            payment_method=data['payment_method'],
            total_amount=total,
            mpesa_phone=data.get('mpesa_phone', ''),
        )
        for vi in validated_items:
            OrderItem.objects.create(
                order=order,
                product=vi['product'],
                quantity=vi['quantity'],
                price=vi['price'],
            )
        
        # Handle payment
        if data['payment_method'] == 'mpesa':
            phone = data.get('mpesa_phone') or request.user.phone_number
            if phone:
                mpesa_result = initiate_stk_push(phone, total, order.order_id)
                if mpesa_result.get('success'):
                    order.payment_status = 'awaiting_confirmation'
                    order.save()
                    return Response({
                        'order': OrderSerializer(order).data,
                        'mpesa_initiated': True,
                        'message': 'M-Pesa payment request sent to your phone.',
                    }, status=status.HTTP_201_CREATED)
                # For demo/sandbox: proceed anyway
                order.payment_status = 'demo_mode'
                order.save()
            
        elif data['payment_method'] == 'bank':
            order.payment_status = 'pending_bank_transfer'
            order.save()
        
        return Response({
            'order': OrderSerializer(order).data,
            'message': 'Order created. Complete payment to receive receipt.',
        }, status=status.HTTP_201_CREATED)

class ConfirmPaymentView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, order_id):
        order = get_object_or_404(Order, order_id=order_id, user=request.user)
        
        # In production this is triggered by M-Pesa callback
        # Here we simulate confirmation for demo
        order.payment_status = 'paid'
        order.status = 'paid'
        order.mpesa_transaction_id = request.data.get('transaction_id', 'DEMO-TXN-' + str(order.order_id)[:8].upper())
        order.save()
        
        # Generate receipt
        receipt_data = generate_receipt_data(order)
        qr_data = json.dumps({
            'receipt': receipt_data['receipt_number'],
            'order': str(order.order_id),
            'total': receipt_data['total'],
            'store': 'Samrat Supermarket Nyeri'
        })
        qr_b64 = generate_qr_code(qr_data)
        
        receipt, _ = Receipt.objects.get_or_create(
            order=order,
            defaults={
                'receipt_number': receipt_data['receipt_number'],
                'qr_code': qr_b64,
            }
        )
        
        return Response({
            'receipt': ReceiptSerializer(receipt).data,
            'receipt_data': receipt_data,
            'qr_code': qr_b64,
            'message': 'Payment confirmed! Your receipt has been generated.',
        })

class MpesaCallbackView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        data = request.data
        body = data.get('Body', {}).get('stkCallback', {})
        result_code = body.get('ResultCode')
        checkout_id = body.get('CheckoutRequestID', '')
        
        if result_code == 0:
            metadata = body.get('CallbackMetadata', {}).get('Item', [])
            txn_id = next((i['Value'] for i in metadata if i['Name'] == 'MpesaReceiptNumber'), '')
            phone = next((i['Value'] for i in metadata if i['Name'] == 'PhoneNumber'), '')
            # Find and update order (match by phone/time)
            # In production, store checkout_request_id on order
        return Response({'ResultCode': 0, 'ResultDesc': 'Accepted'})

class OrderListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

class OrderDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer
    
    def get_object(self):
        return get_object_or_404(Order, order_id=self.kwargs['order_id'], user=self.request.user)

class ReceiptView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, order_id):
        order = get_object_or_404(Order, order_id=order_id, user=request.user)
        receipt = get_object_or_404(Receipt, order=order)
        receipt_data = generate_receipt_data(order)
        return Response({
            'receipt': ReceiptSerializer(receipt).data,
            'receipt_data': receipt_data,
            'qr_code': receipt.qr_code,
        })

class VerifyReceiptView(APIView):
    """For store management to verify receipt on pickup."""
    permission_classes = [AllowAny]
    
    def get(self, request, receipt_number):
        receipt = get_object_or_404(Receipt, receipt_number=receipt_number)
        receipt_data = generate_receipt_data(receipt.order)
        receipt.verified = True
        receipt.save()
        return Response({
            'valid': True,
            'receipt_data': receipt_data,
            'verified': True,
        })
