"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import CategorySection from '@/components/home/CategorySection';
import CategoryProductsList from '@/components/home/CategoryProductsList';
import Footer from "@/components/layout/Footer";
import AdBannerSlider from '@/components/AdBannerSlider';
import { Loader2 } from "lucide-react";
import productApiRequest from "@/app/apiRequests/product";
import categoryApiRequest from "@/app/apiRequests/category";
import { GetProductsResType } from "@/schemaValidations/product.model";
import { GetAllCategoriesResType } from "@/schemaValidations/category.model";

export default function Home() {
  const [products, setProducts] = useState<GetProductsResType["data"]>([]);
  const [categories, setCategories] = useState<GetAllCategoriesResType["data"]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productApiRequest.listProduct();
      console.log('Product response:', response);
      setProducts(response.payload.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryApiRequest.listCategory();
      console.log('Category response:', response);
      setCategories(response.payload.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-900">
      <main className="pt-12">
        <AdBannerSlider />
        <CategorySection categories={categories} />
        <section className="bg-white dark:bg-gray-900">
          <CategoryProductsList products={products} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
