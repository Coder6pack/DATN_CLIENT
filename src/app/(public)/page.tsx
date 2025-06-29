"use client";

import HeroSlideshow from "@/components/hero-slideshow";
import BrandsSection from "@/components/brands-section";
import CategoriesCarousel from "@/components/categories-carousel";
import ProductsSection from "@/components/products-section";
import Newsletter from "@/components/new-sletter";
import { useListSlideShow } from "../queries/useSlideShow";
import { useListBrand } from "../queries/useBrand";
import { useListCategories } from "../queries/useCategory";
import { useListProducts } from "../queries/useProduct";

export default function HomePage() {
  // State for all data
  const { data: slideShows } = useListSlideShow();
  const { data: brands } = useListBrand();
  const { data: categories } = useListCategories();

  if (!slideShows || !brands || !categories) {
    return;
  }
  const handleViewAllProducts = () => {
    console.log("View all products");
    // Navigate to products page
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSlideshow slides={slideShows.payload.data} />

      <BrandsSection brands={brands.payload.data} />

      <CategoriesCarousel categories={categories.payload.data} />

      <ProductsSection onViewAll={handleViewAllProducts} />
      <Newsletter />
    </div>
  );
}
