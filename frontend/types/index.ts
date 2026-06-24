export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  preferred_language: string;
}

export interface Category {
  id: number;
  name: string;
  name_sw: string;
  slug: string;
  icon: string;
}

export interface Product {
  id: number;
  name: string;
  name_sw: string;
  description: string;
  description_sw: string;
  price: string;
  stock: number;
  unit: string;
  image_url: string;
  is_available: boolean;
  is_featured: boolean;
  category: number;
  category_name: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  price: string;
  subtotal: string;
}

export interface Order {
  id: number;
  order_id: string;
  status: string;
  payment_method: string;
  payment_status: string;
  mpesa_transaction_id: string;
  total_amount: string;
  items: OrderItem[];
  created_at: string;
}

export interface Receipt {
  id: number;
  receipt_number: string;
  qr_code: string;
  generated_at: string;
  verified: boolean;
  order: Order;
}
