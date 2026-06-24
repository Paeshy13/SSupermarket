'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { useApp } from '@/contexts/AppContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { setUser, translate: tr } = useApp();
  const [form, setForm] = useState({ username: '', email: '', first_name: '', last_name: '', phone_number: '', address: '', password: '', confirm_password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      const { data } = await authAPI.register(form);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      setUser(data.user);
      toast.success(`Welcome to Samrat, ${data.user.first_name}! 🎉`);
      router.push('/');
    } catch (err: unknown) {
      const e = err as { response?: { data?: Record<string, string[]> } };
      const errors = e.response?.data;
      if (errors) {
        const first = Object.values(errors)[0];
        toast.error(Array.isArray(first) ? first[0] : 'Registration failed');
      } else toast.error('Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🛒</div>
          <h1 className="text-2xl font-bold text-gray-800">{tr('create_account')}</h1>
          <p className="text-gray-500 text-sm mt-1">Join Samrat Supermarket today</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">{tr('first_name')}</label>
              <input type="text" value={form.first_name} onChange={set('first_name')} required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">{tr('last_name')}</label>
              <input type="text" value={form.last_name} onChange={set('last_name')} required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{tr('username')}</label>
            <input type="text" value={form.username} onChange={set('username')} required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{tr('email')}</label>
            <input type="email" value={form.email} onChange={set('email')} required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{tr('phone')} (for M-Pesa)</label>
            <input type="tel" value={form.phone_number} onChange={set('phone_number')} placeholder="07XXXXXXXX" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{tr('address')}</label>
            <input type="text" value={form.address} onChange={set('address')} placeholder="Nyeri Town, Kenya" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">{tr('password')}</label>
              <input type="password" value={form.password} onChange={set('password')} required minLength={6} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">{tr('confirm_password')}</label>
              <input type="password" value={form.confirm_password} onChange={set('confirm_password')} required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-green-700 hover:bg-green-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-bold transition">
            {loading ? '⏳ Creating account...' : tr('create_account')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          {tr('have_account')}{' '}
          <Link href="/login" className="text-green-700 font-semibold">{tr('sign_in')}</Link>
        </p>
      </div>
    </div>
  );
}
