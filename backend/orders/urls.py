from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.CreateOrderView.as_view(), name='create-order'),
    path('', views.OrderListView.as_view(), name='order-list'),
    path('<uuid:order_id>/', views.OrderDetailView.as_view(), name='order-detail'),
    path('<uuid:order_id>/confirm-payment/', views.ConfirmPaymentView.as_view(), name='confirm-payment'),
    path('<uuid:order_id>/receipt/', views.ReceiptView.as_view(), name='receipt'),
    path('mpesa/callback/', views.MpesaCallbackView.as_view(), name='mpesa-callback'),
    path('verify/<str:receipt_number>/', views.VerifyReceiptView.as_view(), name='verify-receipt'),
]
