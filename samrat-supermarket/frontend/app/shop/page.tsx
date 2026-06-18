'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { productsAPI } from '@/lib/api';
import { Product, Category } from '@/types';
import ProductCard from '@/components/ProductCard';
import { useApp } from '@/contexts/AppContext';

function ShopContent() {
  const { translate: tr } = useApp();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '');

  const fetchProducts = async (cat?: string, q?: string) => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (cat) params.category = cat;
    if (q) params.search = q;
    const res = await productsAPI.getProducts(params);
    setProducts(res.data.results || res.data);
    setLoading(false);
  };

  useEffect(() => {
    productsAPI.getCategories().then(r => setCategories(r.data));
    fetchProducts(searchParams.get('category') || '', '');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(activeCategory, search);
  };

  const handleCategory = (slug: string) => {
    setActiveCategory(slug);
    fetchProducts(slug, search);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{tr('all_products')}</h1>
      
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={tr('search_placeholder')}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>
        <button type="submit" className="bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition">
          {tr('search_placeholder').split('...')[0]}
        </button>
      </form>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-8">
        <button
          onClick={() => handleCategory('')}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition ${!activeCategory ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          {tr('all')}
        </button>
        {categories.map(cat => (
          <button
            key={cat.slug}
            onClick={() => handleCategory(cat.slug)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition ${activeCategory === cat.slug ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <span>{cat.icon}</span> {cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return <Suspense fallback={<div className="flex justify-center py-20"><div className="text-4xl animate-spin">🛒</div></div>}><ShopContent /></Suspense>;
}
