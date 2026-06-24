'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Eye } from 'lucide-react';
import { ordersAPI } from '@/lib/api';
import { Order } from '@/types';
import { useApp } from '@/contexts/AppContext';
import ReceiptModal from '@/components/ReceiptModal';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  ready: 'bg-blue-100 text-blue-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const { user, translate: tr } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [receipt, setReceipt] = useState<{ data: Record<string, unknown>; qr: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    ordersAPI.getOrders().then(r => setOrders(r.data.results || r.data)).finally(() => setLoading(false));
  }, [user]);

  const viewReceipt = async (orderId: string) => {
    try {
      const res = await ordersAPI.getReceipt(orderId);
      setReceipt({ data: res.data.receipt_data, qr: res.data.qr_code });
    } catch {
      alert('No receipt available yet for this order.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">📦 {tr('orders')}</h1>
      
      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-24 animate-pulse" />)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No orders yet</p>
          <a href="/shop" className="text-green-700 font-semibold mt-2 inline-block">{tr('shop_now')}</a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.order_id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-mono text-sm text-gray-400">#{order.order_id.slice(0, 8).toUpperCase()}</p>
                  <p className="font-bold text-gray-800">KSh {parseFloat(order.total_amount).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">{order.payment_method}</span>
                </div>
              </div>
              <div className="border-t pt-3 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {order.items?.length || 0} items
                </div>
                {(order.payment_status === 'paid' || order.payment_status === 'demo_mode') && (
                  <button
                    onClick={() => viewReceipt(order.order_id)}
                    className="flex items-center gap-2 text-green-700 hover:text-green-600 text-sm font-semibold transition"
                  >
                    <Eye size={16} /> View Receipt
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {receipt && (
        <ReceiptModal
          receiptData={receipt.data as unknown as Parameters<typeof ReceiptModal>[0]["receiptData"]}
          qrCode={receipt.qr}
          onClose={() => setReceipt(null)}
        />
      )}
    </div>
  );
}
