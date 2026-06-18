'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Menu, X, LogOut, Globe } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { supportedLanguages } from '@/lib/translations';
import { authAPI } from '@/lib/api';

export default function Navbar() {
  const { user, setUser, cartCount, lang, setLang, translate: tr } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const currentLang = supportedLanguages.find(l => l.code === lang);

  return (
    <nav className="bg-green-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <div>
              <div className="font-bold text-lg leading-tight">SAMRAT</div>
              <div className="text-green-300 text-xs leading-tight">Supermarket · Nyeri</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-green-300 transition">{tr('home')}</Link>
            <Link href="/shop" className="hover:text-green-300 transition">{tr('shop')}</Link>
            {user && <Link href="/orders" className="hover:text-green-300 transition">{tr('orders')}</Link>}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language picker */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 bg-green-700 hover:bg-green-600 px-3 py-1.5 rounded-lg text-sm transition"
              >
                <Globe size={14} />
                <span>{currentLang?.flag} {currentLang?.code.toUpperCase()}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-10 bg-white text-gray-800 rounded-xl shadow-xl w-44 z-50 overflow-hidden">
                  {supportedLanguages.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 hover:bg-green-50 text-sm ${lang === l.code ? 'bg-green-100 font-semibold' : ''}`}
                    >
                      <span>{l.flag}</span> {l.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link href="/cart" className="relative bg-green-700 hover:bg-green-600 p-2 rounded-lg transition">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/profile" className="bg-green-700 hover:bg-green-600 p-2 rounded-lg transition hidden md:flex">
                  <User size={20} />
                </Link>
                <button onClick={logout} className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition hidden md:flex">
                  <LogOut size={20} />
                </button>
                <span className="text-sm hidden md:block text-green-300">Hi, {user.first_name}!</span>
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <Link href="/login" className="bg-white text-green-800 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-green-100 transition">
                  {tr('login')}
                </Link>
                <Link href="/register" className="bg-yellow-400 text-green-900 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-yellow-300 transition">
                  {tr('register')}
                </Link>
              </div>
            )}

            {/* Mobile menu */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-green-900 px-4 pb-4 space-y-2">
          <Link href="/" className="block py-2 hover:text-green-300" onClick={() => setMenuOpen(false)}>{tr('home')}</Link>
          <Link href="/shop" className="block py-2 hover:text-green-300" onClick={() => setMenuOpen(false)}>{tr('shop')}</Link>
          {user ? (
            <>
              <Link href="/orders" className="block py-2 hover:text-green-300" onClick={() => setMenuOpen(false)}>{tr('orders')}</Link>
              <Link href="/profile" className="block py-2 hover:text-green-300" onClick={() => setMenuOpen(false)}>{tr('profile')}</Link>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="block py-2 text-red-400">{tr('logout')}</button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-2" onClick={() => setMenuOpen(false)}>{tr('login')}</Link>
              <Link href="/register" className="block py-2 text-yellow-400" onClick={() => setMenuOpen(false)}>{tr('register')}</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
