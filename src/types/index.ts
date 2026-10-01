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
  material: string; // e.g. "22K Solid Gold (BIS Hallmarked)", "925 Sterling Silver"
  purity: string; // e.g. "22K (916)", "18K (750)", "925 Silver"
  bis_hallmark: string; // e.g. "BIS Hallmarked with HUID", "IGI / GIA Certified"
  is_hallmarked?: boolean; // Data-driven: true if piece has undergone BIS/govt hallmarking
  hallmark_type?: string; // e.g. "BIS 916 (22K)", "925 Sterling Silver"
  has_huid?: boolean; // Data-driven: true if serialized with 6-character alphanumeric HUID
  huid?: string; // Serialized HUID laser inscription
  weight_grams: number; // Net precious metal weight in grams
  gross_weight_grams?: number; // Total weight with stones/findings
  dimensions: {
    length_cm: number;
    breadth_cm: number;
    height_cm: number;
  };
  hsn_code: string; // e.g. "7113" for precious jewelry
  country_of_origin: string; // "India"
  seller_details: string; // "Ambika Jewels, Lower Roop Nagar, Jammu 180013"
  care_instructions?: string;
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
  slug?: string;
  weight_grams?: number;
  dimensions?: {
    length_cm: number;
    breadth_cm: number;
    height_cm: number;
  };
};

export type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_address: string;
  pincode?: string;
  pan_number?: string; // Mandated for transactions > ₹2,00,000 under CBDT Rule 114B
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending_confirmation' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  payment_id?: string;
  payment_status: 'unpaid' | 'paid' | 'refunded';
  bvc_docket_number?: string;
  bvc_shipment_id?: string;
  bvc_status?: string;
  bvc_security_bag_number?: string;
  shiprocket_order_id?: string;
  shiprocket_status?: string;
  shiprocket_awb?: string;
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
