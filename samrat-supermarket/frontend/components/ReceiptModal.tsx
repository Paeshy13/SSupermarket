'use client';
import { X, Download, CheckCircle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface ReceiptData {
  receipt_number: string;
  order_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  items: { name: string; quantity: number; price: number; subtotal: number; unit: string }[];
  total: number;
  payment_method: string;
  mpesa_transaction_id: string;
  timestamp: string;
  store_name: string;
  store_location: string;
  store_phone: string;
}

interface Props {
  receiptData: ReceiptData;
  qrCode: string;
  onClose: () => void;
}

export default function ReceiptModal({ receiptData, qrCode, onClose }: Props) {
  const { translate: tr } = useApp();

  const printReceipt = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <html><head><title>Receipt ${receiptData.receipt_number}</title>
      <style>
        body { font-family: 'Courier New', monospace; max-width: 400px; margin: 0 auto; padding: 20px; }
        .center { text-align: center; }
        .divider { border-top: 1px dashed #000; margin: 10px 0; }
        .row { display: flex; justify-content: space-between; margin: 4px 0; font-size: 13px; }
        .bold { font-weight: bold; }
        img { display: block; margin: 10px auto; width: 120px; }
        h2 { font-size: 18px; margin: 5px 0; }
        p { margin: 3px 0; font-size: 12px; }
      </style>
      </head><body>
      <div class="center">
        <h2>🛒 ${receiptData.store_name}</h2>
        <p>${receiptData.store_location}</p>
        <p>${receiptData.store_phone}</p>
      </div>
      <div class="divider"></div>
      <div class="row"><span>Receipt #:</span><span class="bold">${receiptData.receipt_number}</span></div>
      <div class="row"><span>Date:</span><span>${receiptData.timestamp}</span></div>
      <div class="row"><span>Customer:</span><span>${receiptData.customer_name}</span></div>
      <div class="row"><span>Phone:</span><span>${receiptData.customer_phone}</span></div>
      <div class="divider"></div>
      ${receiptData.items.map(item => `
        <div class="row"><span>${item.name} x${item.quantity}</span><span>KSh ${item.subtotal.toLocaleString()}</span></div>
      `).join('')}
      <div class="divider"></div>
      <div class="row bold"><span>TOTAL:</span><span>KSh ${receiptData.total.toLocaleString()}</span></div>
      <div class="row"><span>Payment:</span><span>${receiptData.payment_method.toUpperCase()}</span></div>
      ${receiptData.mpesa_transaction_id ? `<div class="row"><span>Txn ID:</span><span>${receiptData.mpesa_transaction_id}</span></div>` : ''}
      <div class="divider"></div>
      <div class="center">
        <img src="data:image/png;base64,${qrCode}" alt="QR Code" />
        <p>Scan QR code for pickup verification</p>
        <p class="bold">Thank you for shopping at Samrat!</p>
      </div>
      </body></html>
    `);
    w.document.close();
    w.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-green-700 text-white p-6 rounded-t-2xl text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-1">
            <X size={20} />
          </button>
          <CheckCircle size={40} className="mx-auto mb-2" />
          <h2 className="text-xl font-bold">{tr('receipt')}</h2>
          <p className="text-green-200 text-sm">{receiptData.receipt_number}</p>
        </div>

        {/* Store info */}
        <div className="text-center border-b border-dashed py-4 px-6">
          <div className="font-bold text-gray-800">🛒 {receiptData.store_name}</div>
          <div className="text-gray-500 text-sm">{receiptData.store_location}</div>
          <div className="text-gray-500 text-sm">{receiptData.timestamp}</div>
        </div>

        {/* Customer */}
        <div className="px-6 py-3 border-b border-dashed text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Customer</span><span className="font-medium">{receiptData.customer_name}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Phone</span><span>{receiptData.customer_phone}</span></div>
        </div>

        {/* Items */}
        <div className="px-6 py-3 border-b border-dashed">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs">
                <th className="text-left pb-2">{tr('item')}</th>
                <th className="text-center pb-2">{tr('qty')}</th>
                <th className="text-right pb-2">{tr('subtotal')}</th>
              </tr>
            </thead>
            <tbody>
              {receiptData.items.map((item, i) => (
                <tr key={i}>
                  <td className="py-1">{item.name}</td>
                  <td className="text-center">x{item.quantity}</td>
                  <td className="text-right font-medium">KSh {item.subtotal.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="px-6 py-3 border-b border-dashed">
          <div className="flex justify-between font-bold text-lg">
            <span>{tr('total')}</span>
            <span className="text-green-700">KSh {receiptData.total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>Payment</span>
            <span className="capitalize">{receiptData.payment_method}</span>
          </div>
          {receiptData.mpesa_transaction_id && (
            <div className="flex justify-between text-sm text-gray-500">
              <span>Txn ID</span>
              <span className="font-mono text-xs">{receiptData.mpesa_transaction_id}</span>
            </div>
          )}
        </div>

        {/* QR Code */}
        {qrCode && (
          <div className="px-6 py-4 text-center border-b border-dashed">
            <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" className="w-32 h-32 mx-auto mb-2" />
            <p className="text-xs text-gray-500">{tr('pickup_info')}</p>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 text-center">
          <p className="text-green-700 font-semibold text-sm mb-4">{tr('thank_you')}</p>
          <button
            onClick={printReceipt}
            className="w-full bg-green-700 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
          >
            <Download size={18} /> {tr('download_receipt')}
          </button>
        </div>
      </div>
    </div>
  );
}
