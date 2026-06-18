# 🛒 Samrat Supermarket — Nyeri, Kenya

A full-stack supermarket website with Next.js frontend + Django REST backend.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 + TypeScript + Tailwind CSS |
| Backend | Django 5 + Django REST Framework |
| Auth | JWT (SimpleJWT) |
| Payments | M-Pesa (Daraja API) + Bank Transfer |
| Maps | Google Maps JavaScript API |
| Database | SQLite (dev) → PostgreSQL (prod) |

---

## 🚀 Quick Start

### Backend (Django)

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Admin: http://localhost:8000/admin  
Login: admin / samrat2024

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Site: http://localhost:3000

---

## ⚙️ Configuration

### M-Pesa (Daraja API)
1. Register at https://developer.safaricom.co.ke
2. Create an app in Sandbox
3. Update `backend/samrat_backend/settings.py`:
```python
MPESA_CONSUMER_KEY = 'your-key'
MPESA_CONSUMER_SECRET = 'your-secret'
MPESA_SHORTCODE = '174379'
MPESA_PASSKEY = 'your-passkey'
MPESA_CALLBACK_URL = 'https://yourdomain.com/api/orders/mpesa/callback/'
MPESA_ENV = 'sandbox'  # or 'production'
```

### Google Maps
1. Get API key: https://console.cloud.google.com → Maps JavaScript API
2. Add to `frontend/.env.local`:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key-here
```

### Bank Integration
For real bank API integration, contact your bank for Open Banking APIs:
- **Equity Bank**: https://developer.equitybank.com
- **KCB**: https://developer.kcbgroup.com
- **Co-op Bank**: https://developer.co-opbank.co.ke

Update `backend/samrat_backend/settings.py` with bank credentials.

---

## 📋 Features

### Customer Features
- ✅ Account registration & login (JWT)
- ✅ Product browsing by category
- ✅ Search products
- ✅ Add to cart, manage quantities
- ✅ M-Pesa STK Push payment
- ✅ Bank transfer payment option
- ✅ Digital receipt with QR code
- ✅ Order history
- ✅ Multilingual UI (EN/SW/HI/FR/AR/ZH/DE/ES)
- ✅ Google Maps store location

### Management Features
- ✅ Django Admin panel
- ✅ Receipt QR code verification: `GET /api/orders/verify/{receipt_number}/`
- ✅ Product & category management
- ✅ Order management

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register/ | Register new user |
| POST | /api/auth/login/ | Login → returns JWT |
| GET/PUT | /api/auth/profile/ | User profile |
| GET | /api/products/ | List products |
| GET | /api/products/categories/ | List categories |
| POST | /api/orders/create/ | Create order + initiate payment |
| POST | /api/orders/{id}/confirm-payment/ | Confirm payment → generate receipt |
| GET | /api/orders/{id}/receipt/ | Get receipt + QR code |
| GET | /api/orders/verify/{receipt_no}/ | Verify receipt (for store staff) |
| POST | /api/orders/mpesa/callback/ | M-Pesa webhook |

---

## 🌍 Languages Supported
English · Kiswahili · हिंदी · Français · العربية · 中文 · Deutsch · Español

---

## 📍 Store Location
Samrat Supermarket  
Nyeri Town Centre, Nyeri County, Kenya  
Mon–Sat: 8AM–8PM | Sun: 9AM–6PM
