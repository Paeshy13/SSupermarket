'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Clock, Phone, Shield } from 'lucide-react';
import { productsAPI } from '@/lib/api';
import { Product, Category } from '@/types';
import ProductCard from '@/components/ProductCard';
import GoogleMap from '@/components/GoogleMap';
import { useApp } from '@/contexts/AppContext';

export default function HomePage() {
  const { translate: tr } = useApp();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productsAPI.getProducts({ featured: 'true' }),
      productsAPI.getCategories(),
    ]).then(([prodRes, catRes]) => {
      setFeatured(prodRes.data.results || prodRes.data);
      setCategories(catRes.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-green-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl">🥦</div>
          <div className="absolute top-20 right-20 text-7xl">🥩</div>
          <div className="absolute bottom-10 left-1/3 text-8xl">🍞</div>
          <div className="absolute bottom-5 right-10 text-6xl">🥛</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-20 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <MapPin size={14} /> Nyeri Town, Kenya 🇰🇪
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {tr('hero_title')}
            </h1>
            <p className="text-green-200 text-lg mb-8 max-w-xl">{tr('hero_sub')}</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop" className="bg-yellow-400 text-green-900 px-8 py-3 rounded-xl font-bold text-lg hover:bg-yellow-300 transition flex items-center gap-2">
                {tr('shop_now')} <ArrowRight size={20} />
              </Link>
              <a href="#map" className="border border-white/40 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition flex items-center gap-2">
                <MapPin size={20} /> {tr('find_us')}
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '📱', title: 'M-Pesa', desc: 'Pay with M-Pesa instantly' },
            { icon: '🏦', title: 'Bank Transfer', desc: 'Equity Bank accepted' },
            { icon: '🧾', title: 'Digital Receipt', desc: 'QR receipt on purchase' },
            { icon: '📍', title: 'Easy Pickup', desc: 'Collect from our store' },
          ].map(f => (
            <div key={f.title} className="bg-green-50 rounded-2xl p-5 text-center border border-green-100">
              <div className="text-4xl mb-3">{f.icon}</div>
              <div className="font-bold text-green-800 text-sm">{f.title}</div>
              <div className="text-gray-500 text-xs mt-1">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{tr('categories')}</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="flex-shrink-0 bg-white border border-gray-200 hover:border-green-500 hover:bg-green-50 rounded-2xl px-5 py-3 flex items-center gap-2 transition"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{tr('featured')}</h2>
          <Link href="/shop" className="text-green-700 hover:text-green-600 font-medium flex items-center gap-1">
            {tr('view_all')} <ArrowRight size={16} />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Map */}
      <section id="map" className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">📍 {tr('find_us')}</h2>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Clock size={14} /> Mon–Sat: 8AM–8PM</span>
            <span className="flex items-center gap-1"><Phone size={14} /> +254-700-000-000</span>
          </div>
        </div>
        <GoogleMap />
        <div className="mt-4 bg-green-50 rounded-xl p-4 flex items-center gap-3 text-sm text-green-800">
          <Shield size={20} className="text-green-600 flex-shrink-0" />
          <span>Present your <strong>digital QR receipt</strong> at the store for quick and secure pickup verification.</span>
        </div>
      </section>
    </div>
  );
}
