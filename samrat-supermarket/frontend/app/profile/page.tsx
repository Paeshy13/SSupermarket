'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, setUser, translate: tr } = useApp();
  const router = useRouter();
  const [form, setForm] = useState({ first_name: '', last_name: '', phone_number: '', address: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    setForm({ first_name: user.first_name, last_name: user.last_name, phone_number: user.phone_number, address: user.address });
  }, [user]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.updateProfile(form);
      setUser(data);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
            {user.first_name?.[0]?.toUpperCase() || '👤'}
          </div>
          <h1 className="text-xl font-bold text-gray-800">{user.first_name} {user.last_name}</h1>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">{tr('first_name')}</label>
              <input type="text" value={form.first_name} onChange={set('first_name')} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">{tr('last_name')}</label>
              <input type="text" value={form.last_name} onChange={set('last_name')} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{tr('phone')} (M-Pesa)</label>
            <input type="tel" value={form.phone_number} onChange={set('phone_number')} placeholder="07XXXXXXXX" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{tr('address')}</label>
            <input type="text" value={form.address} onChange={set('address')} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-green-700 hover:bg-green-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-bold transition">
            {loading ? '⏳ Saving...' : '💾 Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
