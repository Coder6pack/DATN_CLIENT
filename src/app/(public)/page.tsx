"use client";

import { useState, useEffect } from "react";
import type { Slide, Brand, Category, Product, User } from "@/types";
import {
  mockSlides,
  mockBrands,
  mockCategories,
  mockProducts,
} from "@/lib/mockData";
import HeroSlideshow from "@/components/hero-slideshow";
import BrandsSection from "@/components/brands-section";
import CategoriesCarousel from "@/components/categories-carousel";
import ProductsSection from "@/components/products-section";
import Newsletter from "@/components/new-sletter";

export default function HomePage() {
  // State for all data
  const [slides, setSlides] = useState<Slide[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | undefined>();
  const [cartItemsCount, setCartItemsCount] = useState(0);

  // Load mock data
  useEffect(() => {
    const loadData = async () => {
      // Simulate API loading delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSlides(mockSlides);
      setBrands(mockBrands);
      setCategories(mockCategories);
      setProducts(mockProducts);
    };

    loadData();
  }, []);

  // Event handlers
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // Implement search logic
  };

  const handleCategoryClick = (category: Category) => {
    console.log("Category clicked:", category);
    // Navigate to category page
  };

  const handleProductClick = (product: Product) => {
    console.log("Product clicked:", product);
    // Navigate to product detail page
    window.location.href = `/product/${product.id}`;
  };

  const handleAddToCart = (product: Product) => {
    console.log("Add to cart:", product);
    setCartItemsCount((prev) => prev + 1);
    // Add to cart logic
  };

  const handleToggleFavorite = (product: Product) => {
    console.log("Toggle favorite:", product);
    // Toggle favorite logic
  };

  const handleViewAllProducts = () => {
    console.log("View all products");
    // Navigate to products page
  };

  const handleNewsletterSubscribe = async (email: string) => {
    console.log("Newsletter subscribe:", email);
    // Newsletter subscription logic
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSlideshow slides={slides} />

      <BrandsSection brands={brands} />

      <CategoriesCarousel
        categories={categories}
        onCategoryClick={handleCategoryClick}
      />

      <ProductsSection
        products={products}
        onProductClick={handleProductClick}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
        onViewAll={handleViewAllProducts}
      />

      <Newsletter onSubscribe={handleNewsletterSubscribe} />
    </div>
  );
}
