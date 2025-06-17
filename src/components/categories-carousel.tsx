"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Category } from "@/types";
import { CategoryType } from "@/schemaValidations/category.model";

interface CategoriesCarouselProps {
  categories: CategoryType[];
  title?: string;
  itemsPerView?: number;
  onCategoryClick?: (category: CategoryType) => void;
}

export default function CategoriesCarousel({
  categories,
  title = "Khám Phá Danh Mục",
  itemsPerView = 3,
  onCategoryClick,
}: CategoriesCarouselProps) {
  const bufferSize = Math.min(itemsPerView, categories.length); // Number of items to duplicate at each end
  const [currentIndex, setCurrentIndex] = useState(bufferSize); // Start at the first real category
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Create extended categories array for seamless looping
  const extendedCategories = useMemo(() => {
    if (categories.length === 0) return [];
    return [
      ...categories.slice(-bufferSize),
      ...categories,
      ...categories.slice(0, bufferSize),
    ];
  }, [categories, bufferSize]);

  const handleTransitionEnd = useCallback(() => {
    // If we've transitioned to the duplicated start (end of original categories + buffer), jump to the real start
    if (currentIndex >= categories.length + bufferSize) {
      setIsTransitioning(false);
      setCurrentIndex(bufferSize);
    }
    // If we've transitioned to the duplicated end (beginning of original categories - buffer), jump to the real end
    else if (currentIndex < bufferSize) {
      setIsTransitioning(false);
      setCurrentIndex(categories.length + currentIndex); // Adjust to the corresponding real index
    }
  }, [currentIndex, categories.length, bufferSize]);

  useEffect(() => {
    // Re-enable transition after a short delay if it was disabled for a jump
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50); // A small delay to allow the browser to render the non-transitioned state
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const nextCategory = () => {
    setCurrentIndex((prev) => prev + itemsPerView);
  };

  const prevCategory = () => {
    setCurrentIndex((prev) => prev - itemsPerView);
  };

  if (categories.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-muted/30 to-background transition-colors duration-300 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Đang tải danh mục...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-muted/30 to-background transition-colors duration-300 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tìm kiếm phong cách hoàn hảo cho bạn từ bộ sưu tập đa dạng của chúng
            tôi
          </p>
        </div>

        <div className="relative max-w-full">
          <div className="overflow-hidden">
            <div
              className="flex"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / itemsPerView)
                }%)`,
                transition: isTransitioning
                  ? "transform 0.7s ease-out"
                  : "none",
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedCategories.map((category, index) => (
                <div
                  key={`${category.name}-${index}`} // Use index as part of key for duplicated items
                  className="flex-shrink-0 px-2 sm:px-4"
                  style={{
                    width: `${100 / itemsPerView}%`,
                    minWidth: `${100 / itemsPerView}%`,
                  }}
                >
                  <Card
                    className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-card overflow-hidden"
                    onClick={() => onCategoryClick?.(category)}
                  >
                    <CardContent className="p-0 relative">
                      <div className="relative overflow-hidden">
                        <Image
                          src={category.logo || "/placeholder.svg"}
                          alt={category.name}
                          width={400}
                          height={500}
                          className="object-cover w-full h-72 sm:h-96 group-hover:scale-110 transition-transform duration-700"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all duration-500" />

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 text-white">
                          <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-xl sm:text-2xl font-bold mb-2 group-hover:text-yellow-300 transition-colors duration-300">
                              {category.name}
                            </h3>
                            {/* Call to Action */}
                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                              <span className="text-sm font-medium mr-2">
                                Khám phá ngay
                              </span>
                              <ArrowRight className="h-4 w-4" />
                            </div>
                          </div>
                        </div>

                        {/* Decorative Element */}
                        <div className="absolute top-4 right-4 w-12 h-12 border-2 border-white/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-75 group-hover:scale-100">
                          <ArrowRight className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 bg-card shadow-xl hover:shadow-2xl border-0 hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-full w-10 h-10 sm:w-12 sm:h-12"
            onClick={prevCategory}
          >
            <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 bg-card shadow-xl hover:shadow-2xl border-0 hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-full w-10 h-10 sm:w-12 sm:h-12"
            onClick={nextCategory}
          >
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
          </Button>
        </div>

        {/* Dots Indicator - Adjust for extendedCategories */}
        <div className="flex justify-center mt-12 space-x-2">
          {Array.from({
            length: Math.ceil(categories.length / itemsPerView),
          }).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                Math.floor((currentIndex - bufferSize) / itemsPerView) === index
                  ? "bg-primary w-8"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              onClick={() => setCurrentIndex(bufferSize + index * itemsPerView)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
