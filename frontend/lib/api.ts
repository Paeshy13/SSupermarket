import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/token/refresh/`, { refresh });
          localStorage.setItem('access_token', data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: Record<string, string>) => api.post('/auth/register/', data),
  login: (email: string, password: string) => api.post('/auth/login/', { email, password }),
  profile: () => api.get('/auth/profile/'),
  updateProfile: (data: Record<string, string>) => api.patch('/auth/profile/', data),
};

export const productsAPI = {
  getCategories: () => api.get('/products/categories/'),
  getProducts: (params?: Record<string, string>) => api.get('/products/', { params }),
  getProduct: (id: number) => api.get(`/products/${id}/`),
};

export const ordersAPI = {
  createOrder: (data: Record<string, unknown>) => api.post('/orders/create/', data),
  getOrders: () => api.get('/orders/'),
  getOrder: (orderId: string) => api.get(`/orders/${orderId}/`),
  confirmPayment: (orderId: string, data: Record<string, string>) =>
    api.post(`/orders/${orderId}/confirm-payment/`, data),
  getReceipt: (orderId: string) => api.get(`/orders/${orderId}/receipt/`),
  verifyReceipt: (receiptNumber: string) =>
    api.get(`/orders/verify/${receiptNumber}/`),
};

export default api;
