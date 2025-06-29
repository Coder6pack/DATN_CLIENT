"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Brand } from "@/types";
import { BrandType } from "@/shared/models/shared-brand.model";
import Link from "next/link";
import { useListBrand } from "@/app/queries/useBrand";

interface BrandsSectionProps {
  brands: BrandType[];
  title?: string;
  itemsPerView?: number;
}

export default function BrandsSection({
  brands,
  title = "Thương Hiệu Nổi Tiếng",
  itemsPerView = 6,
}: BrandsSectionProps) {
  const bufferSize = Math.min(itemsPerView, brands.length); // Number of items to duplicate at each end
  const [currentIndex, setCurrentIndex] = useState(bufferSize); // Start at the first real brand
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Create extended brands array for seamless looping
  const extendedBrands = useMemo(() => {
    if (brands.length === 0) return [];
    return [
      ...brands.slice(-bufferSize),
      ...brands,
      ...brands.slice(0, bufferSize),
    ];
  }, [brands, bufferSize]);

  const handleTransitionEnd = useCallback(() => {
    // If we've transitioned to the duplicated start (end of original brands + buffer), jump to the real start
    if (currentIndex >= brands.length + bufferSize) {
      setIsTransitioning(false);
      setCurrentIndex(bufferSize);
    }
    // If we've transitioned to the duplicated end (beginning of original brands - buffer), jump to the real end
    else if (currentIndex < bufferSize) {
      setIsTransitioning(false);
      setCurrentIndex(brands.length + currentIndex); // Adjust to the corresponding real index
    }
  }, [currentIndex, brands.length, bufferSize]);

  useEffect(() => {
    // Re-enable transition after a short delay if it was disabled for a jump
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50); // A small delay to allow the browser to render the non-transitioned state
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);
  const nextBrands = () => {
    setCurrentIndex((prev) => prev + itemsPerView);
  };

  const prevBrands = () => {
    setCurrentIndex((prev) => prev - itemsPerView);
  };

  if (brands.length === 0) {
    return (
      <section className="py-16 bg-muted/20 transition-colors duration-300 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Đang tải thương hiệu...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/20 transition-colors duration-300 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
        <div className="relative max-w-full">
          <div className="overflow-hidden">
            <div
              className="flex"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / itemsPerView)
                }%)`,
                transition: isTransitioning
                  ? "transform 0.5s ease-in-out"
                  : "none",
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedBrands.map((brand, index) => (
                <div
                  key={`${brand.name}-${index}`} // Use index as part of key for duplicated items
                  className="flex-shrink-0 px-2 sm:px-4"
                  style={{
                    width: `${100 / itemsPerView}%`,
                    minWidth: `${100 / itemsPerView}%`,
                  }} // Each item takes up its share of the visible width
                >
                  <Link
                    href={`/products?page=${1}&limit=${9}&orderBy=desc&sortBy=createdAt&brandId=${
                      brand.id
                    }`}
                  >
                    <div className="flex items-center justify-center p-4 sm:p-8 bg-card rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border border-border hover:border-primary/50">
                      <Image
                        src={brand.logo || "/placeholder.svg"}
                        alt={brand.name}
                        width={120}
                        height={80}
                        className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300 max-w-full h-auto"
                      />
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white shadow-lg hover:shadow-xl border-2 border-gray-100 hover:border-primary transition-all duration-300 rounded-full"
            onClick={prevBrands}
          >
            <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white shadow-lg hover:shadow-xl border-2 border-gray-100 hover:border-primary transition-all duration-300 rounded-full"
            onClick={nextBrands}
          >
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
          </Button>
        </div>
      </div>
    </section>
  );
}
