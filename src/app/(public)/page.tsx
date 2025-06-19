"use client";

import { useState, useEffect } from "react";
import type { Slide, Brand, Category, Product, User } from "@/types";
import { mockSlides, mockBrands, mockCategories } from "@/lib/mockData";
import HeroSlideshow from "@/components/hero-slideshow";
import BrandsSection from "@/components/brands-section";
import CategoriesCarousel from "@/components/categories-carousel";
import ProductsSection from "@/components/products-section";
import Newsletter from "@/components/new-sletter";
import { useListSlideShow } from "../queries/useSlideShow";
import { useListBrand } from "../queries/useBrand";
import { useListCategories } from "../queries/useCategory";
import { CategoryType } from "@/schemaValidations/category.model";
import { useListProducts } from "../queries/useProduct";
import { ProductType } from "@/shared/models/shared-product.model";
import { useAppContext } from "@/components/app-provider";

export default function HomePage() {
  // State for all data
  const { addToCart } = useAppContext();
  const { data: slideShows } = useListSlideShow();
  const { data: brands } = useListBrand();
  const { data: categories } = useListCategories();
  const { data: products } = useListProducts({
    page: 1,
    limit: 100,
  });

  if (!slideShows || !brands || !categories || !products) {
    return;
  }

  // Event handlers
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // Implement search logic
  };

  const handleCategoryClick = (category: CategoryType) => {
    console.log("Category clicked:", category);
    // Navigate to category page
  };
  const handleAddToCart = (product: ProductType) => {
    addToCart(product);
  };

  const handleToggleFavorite = (product: ProductType) => {
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
      <HeroSlideshow slides={slideShows.payload.data} />

      <BrandsSection brands={brands.payload.data} />

      <CategoriesCarousel
        categories={categories.payload.data}
        onCategoryClick={handleCategoryClick}
      />

      <ProductsSection
        products={products.payload.data}
        onToggleFavorite={handleToggleFavorite}
        onViewAll={handleViewAllProducts}
      />

      <Newsletter />
    </div>
  );
}
