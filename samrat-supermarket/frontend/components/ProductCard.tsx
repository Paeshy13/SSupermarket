'use client';
import { useState } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { Product } from '@/types';
import { useApp } from '@/contexts/AppContext';
import toast from 'react-hot-toast';

interface Props { product: Product; }

export default function ProductCard({ product }: Props) {
  const { addToCart, cart, updateQty, lang, translate: tr } = useApp();
  const [imgError, setImgError] = useState(false);
  const cartItem = cart.find(i => i.product.id === product.id);
  
  const displayName = lang === 'sw' && product.name_sw ? product.name_sw : product.name;

  const handleAdd = () => {
    addToCart(product);
    toast.success(`${displayName} added to cart!`, { icon: '🛒', duration: 1500 });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 group">
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {!imgError && product.image_url ? (
          <img
            src={product.image_url}
            alt={displayName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🛒
          </div>
        )}
        {product.is_featured && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
            ⭐ Featured
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-green-600 font-medium mb-1">{product.category_name}</p>
        <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2 min-h-[2.5rem]">{displayName}</h3>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-green-700 font-bold text-lg">KSh {parseFloat(product.price).toLocaleString()}</span>
            <span className="text-gray-400 text-xs">/{product.unit}</span>
          </div>
        </div>

        {/* Cart controls */}
        {cartItem ? (
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => updateQty(product.id, cartItem.quantity - 1)}
              className="bg-green-100 hover:bg-green-200 text-green-800 rounded-lg p-2 transition"
            >
              <Minus size={16} />
            </button>
            <span className="flex-1 text-center font-semibold text-gray-800">{cartItem.quantity}</span>
            <button
              onClick={() => updateQty(product.id, cartItem.quantity + 1)}
              className="bg-green-100 hover:bg-green-200 text-green-800 rounded-lg p-2 transition"
            >
              <Plus size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            disabled={!product.is_available}
            className="mt-3 w-full bg-green-700 hover:bg-green-600 disabled:bg-gray-300 text-white py-2 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
          >
            <ShoppingCart size={16} />
            {product.is_available ? tr('add_to_cart') : tr('out_of_stock')}
          </button>
        )}
      </div>
    </div>
  );
}
