'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { ordersAPI } from '@/lib/api';
import ReceiptModal from '@/components/ReceiptModal';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, removeFromCart, updateQty, clearCart, cartTotal, user, translate: tr } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'bank' | 'card'>('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState(user?.phone_number || '');
  const [bankRef, setBankRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [receiptData, setReceiptData] = useState<Record<string, unknown> | null>(null);
  const [qrCode, setQrCode] = useState('');
  const [step, setStep] = useState<'cart' | 'checkout' | 'paying'>('cart');
  const router = useRouter();

  if (cart.length === 0 && !receiptData) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">{tr('empty_cart')}</h2>
        <Link href="/shop" className="bg-green-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-600 transition inline-flex items-center gap-2">
          <ShoppingBag size={20} /> {tr('shop_now')}
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!user) { router.push('/login'); return; }
    setLoading(true);
    try {
      const items = cart.map(i => ({ product_id: i.product.id, quantity: i.quantity }));
      const orderRes = await ordersAPI.createOrder({
        items,
        payment_method: paymentMethod,
        mpesa_phone: mpesaPhone,
        bank_reference: bankRef,
      });
      const order = orderRes.data.order;
      setStep('paying');
      
      if (paymentMethod === 'mpesa') {
        toast.success(tr('check_phone'), { duration: 5000, icon: '📱' });
        // Simulate confirmation after 3 seconds for demo
        await new Promise(r => setTimeout(r, 3000));
      }

      // Confirm payment
      const confirmRes = await ordersAPI.confirmPayment(order.order_id, {
        transaction_id: paymentMethod === 'mpesa' ? `TXN${Date.now()}` : bankRef,
      });
      
      setReceiptData(confirmRes.data.receipt_data);
      setQrCode(confirmRes.data.qr_code);
      clearCart();
      toast.success(tr('payment_success'), { icon: '✅' });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e.response?.data?.error || tr('payment_failed'));
      setStep('checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">🛒 {tr('your_cart')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.product.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                {item.product.image_url ? (
                  <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">🛒</div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                <p className="text-green-700 font-bold">KSh {parseFloat(item.product.price).toLocaleString()}/{item.product.unit}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => updateQty(item.product.id, item.quantity - 1)} className="bg-gray-100 hover:bg-gray-200 rounded-lg p-1.5 transition"><Minus size={14} /></button>
                  <span className="font-semibold w-8 text-center">{item.quantity}</span>
                  <button onClick={() => updateQty(item.product.id, item.quantity + 1)} className="bg-gray-100 hover:bg-gray-200 rounded-lg p-1.5 transition"><Plus size={14} /></button>
                  <span className="ml-auto text-sm font-bold text-gray-700">KSh {(parseFloat(item.product.price) * item.quantity).toLocaleString()}</span>
                  <button onClick={() => removeFromCart(item.product.id)} className="text-red-400 hover:text-red-600 transition"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary + Checkout */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{tr('order_summary')}</h2>
          
          <div className="space-y-2 mb-4">
            {cart.map(i => (
              <div key={i.product.id} className="flex justify-between text-sm text-gray-600">
                <span>{i.product.name} x{i.quantity}</span>
                <span>KSh {(parseFloat(i.product.price) * i.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-3 mb-6">
            <div className="flex justify-between font-bold text-lg">
              <span>{tr('total')}</span>
              <span className="text-green-700">KSh {cartTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-4">
            <p className="font-semibold text-gray-700 mb-3">{tr('payment_method')}</p>
            <div className="space-y-2">
              {[
                { value: 'mpesa', label: '📱 M-Pesa', desc: 'Pay via Safaricom M-Pesa' },
                { value: 'bank', label: '🏦 Bank Transfer', desc: 'Equity Bank transfer' },
                { value: 'card', label: '💳 Card', desc: 'Debit/Credit card' },
              ].map(opt => (
                <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${paymentMethod === opt.value ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value={opt.value} checked={paymentMethod === opt.value as typeof paymentMethod} onChange={e => setPaymentMethod(e.target.value as typeof paymentMethod)} className="accent-green-600" />
                  <div>
                    <div className="font-medium text-sm">{opt.label}</div>
                    <div className="text-xs text-gray-500">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* M-Pesa Phone */}
          {paymentMethod === 'mpesa' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">{tr('mpesa_phone')}</label>
              <input
                type="tel"
                value={mpesaPhone}
                onChange={e => setMpesaPhone(e.target.value)}
                placeholder="07XXXXXXXX or 254XXXXXXXXX"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          {/* Bank Info */}
          {paymentMethod === 'bank' && (
            <div className="mb-4 bg-blue-50 rounded-xl p-3 text-xs text-blue-800 space-y-1">
              <p className="font-semibold">Bank Transfer Details:</p>
              <p>🏦 Equity Bank – Nyeri Branch</p>
              <p>💳 Account: 1234567890</p>
              <p>👤 Samrat Supermarket Ltd</p>
              <p className="text-blue-600">Use your email as reference</p>
            </div>
          )}

          {step === 'paying' ? (
            <div className="text-center py-4">
              <div className="text-3xl animate-spin mb-2">⏳</div>
              <p className="text-sm text-gray-600">{paymentMethod === 'mpesa' ? tr('check_phone') : tr('paying')}</p>
            </div>
          ) : (
            <button
              onClick={handlePlaceOrder}
              disabled={loading || !user}
              className="w-full bg-green-700 hover:bg-green-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
            >
              {!user ? (
                <Link href="/login" className="text-white">{tr('login')} to {tr('checkout')}</Link>
              ) : (
                <>{loading ? '⏳' : '✅'} {tr('place_order')}</>
              )}
            </button>
          )}

          {!user && (
            <p className="text-center text-sm text-gray-500 mt-2">
              <Link href="/login" className="text-green-700 font-semibold">{tr('login')}</Link> or{' '}
              <Link href="/register" className="text-green-700 font-semibold">{tr('register')}</Link>
            </p>
          )}
        </div>
      </div>

      {receiptData && qrCode && (
        <ReceiptModal
          receiptData={receiptData as unknown as Parameters<typeof ReceiptModal>[0]["receiptData"]}
          qrCode={qrCode}
          onClose={() => { setReceiptData(null); router.push('/orders'); }}
        />
      )}
    </div>
  );
}
