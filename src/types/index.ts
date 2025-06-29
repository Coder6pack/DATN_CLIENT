export interface Slide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
}

export interface Brand {
  name: string;
  logo: string;
}

export interface Category {
  name: string;
  image: string;
  count: string;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string | null;
  image: string;
  rating: number;
  reviews: number;
  category: string;
}

export interface ProductDetail extends Product {
  images: string[];
  description: string;
  features: string[];
  sizes: string[];
  colors: { name: string; value: string }[];
  stock: number;
  sku: string;
  brand: string;
  material: string;
  careInstructions: string[];
}

export interface Review {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export interface User {
  name?: string;
  avatar?: string;
  email?: string;
}
