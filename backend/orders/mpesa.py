import requests
import base64
from datetime import datetime
from django.conf import settings

def get_mpesa_token():
    consumer_key = settings.MPESA_CONSUMER_KEY
    consumer_secret = settings.MPESA_CONSUMER_SECRET
    if settings.MPESA_ENV == 'sandbox':
        url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    else:
        url = "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    credentials = base64.b64encode(f"{consumer_key}:{consumer_secret}".encode()).decode()
    headers = {"Authorization": f"Basic {credentials}"}
    try:
        response = requests.get(url, headers=headers, timeout=10)
        return response.json().get('access_token')
    except Exception:
        return None

def initiate_stk_push(phone, amount, order_id):
    token = get_mpesa_token()
    if not token:
        return {'success': False, 'error': 'Could not get M-Pesa token'}
    
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    shortcode = settings.MPESA_SHORTCODE
    passkey = settings.MPESA_PASSKEY
    password = base64.b64encode(f"{shortcode}{passkey}{timestamp}".encode()).decode()
    
    if settings.MPESA_ENV == 'sandbox':
        url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    else:
        url = "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    
    # Normalize phone: 0712345678 -> 254712345678
    phone = phone.strip().replace('+', '')
    if phone.startswith('0'):
        phone = '254' + phone[1:]
    
    payload = {
        "BusinessShortCode": shortcode,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(amount),
        "PartyA": phone,
        "PartyB": shortcode,
        "PhoneNumber": phone,
        "CallBackURL": settings.MPESA_CALLBACK_URL,
        "AccountReference": f"SAMRAT-{str(order_id)[:8].upper()}",
        "TransactionDesc": "Samrat Supermarket Purchase"
    }
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        data = response.json()
        if data.get('ResponseCode') == '0':
            return {'success': True, 'checkout_request_id': data.get('CheckoutRequestID')}
        return {'success': False, 'error': data.get('errorMessage', 'STK push failed')}
    except Exception as e:
        return {'success': False, 'error': str(e)}
