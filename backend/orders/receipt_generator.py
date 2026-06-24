import qrcode
import base64
import io
import random
import string
from datetime import datetime

def generate_receipt_number():
    chars = string.ascii_uppercase + string.digits
    return 'SMR-' + ''.join(random.choices(chars, k=8))

def generate_qr_code(data: str) -> str:
    """Generate QR code and return as base64 string."""
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    return base64.b64encode(buffer.getvalue()).decode()

def generate_receipt_data(order):
    """Generate receipt data dictionary."""
    items = []
    for item in order.items.all():
        items.append({
            'name': item.product.name,
            'quantity': item.quantity,
            'price': float(item.price),
            'subtotal': float(item.subtotal),
            'unit': item.product.unit,
        })
    
    receipt_data = {
        'receipt_number': generate_receipt_number(),
        'order_id': str(order.order_id),
        'customer_name': f"{order.user.first_name} {order.user.last_name}",
        'customer_phone': order.user.phone_number,
        'customer_email': order.user.email,
        'items': items,
        'total': float(order.total_amount),
        'payment_method': order.payment_method,
        'payment_status': order.payment_status,
        'mpesa_transaction_id': order.mpesa_transaction_id,
        'timestamp': order.created_at.strftime('%Y-%m-%d %H:%M:%S EAT'),
        'store_name': 'Samrat Supermarket',
        'store_location': 'Nyeri Town, Nyeri County, Kenya',
        'store_phone': '+254-XXX-XXXXXX',
    }
    return receipt_data
