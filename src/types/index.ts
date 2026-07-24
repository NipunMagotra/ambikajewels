export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // in paise
  display_price: string;
  category: string;
  images: string[];
  badges: string[];
  metal_finishes: string[];
  stock_status: 'in_stock' | 'limited' | 'out_of_stock';
  is_featured: boolean;
  collection: string;
  craftsmanship_story: string;
  created_at: string;
  updated_at: string;
};

export type CartItem = {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  metal_finish: string;
};

export type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_address: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending_confirmation' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  payment_id?: string;
  payment_status: 'unpaid' | 'paid' | 'refunded';
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  category: string;
  sort_order: number;
};
