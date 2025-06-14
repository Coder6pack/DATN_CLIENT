'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { GetProductsResType } from "@/schemaValidations/product.model";

interface CategoryProductsProps {
  title: string;
  products: GetProductsResType["data"];
  category: string;
}

export default function CategoryProducts({ title, products, category }: CategoryProductsProps) {
  const [firstIndex, setFirstIndex] = useState(0);
  const productsPerPage = 4;
  const numPages = Math.ceil(products.length / productsPerPage);
  const maxFirstIndex = Math.max(0, numPages - 1);

  const handlePrev = () => {
    setFirstIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setFirstIndex((prev) => Math.min(maxFirstIndex, prev + 1));
  };

  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              disabled={firstIndex === 0}
              className={`rounded-full transition-all duration-300 ${
                firstIndex === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-100 hover:scale-110 active:scale-95'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={firstIndex === maxFirstIndex}
              className={`rounded-full transition-all duration-300 ${
                firstIndex === maxFirstIndex
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-100 hover:scale-110 active:scale-95'
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            {firstIndex + 1}/{numPages}
          </div>
        </div>
      </div>

      <div className="overflow-hidden w-full">
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(-${firstIndex * 100}%)`,
          }}
        >
          {Array.from({ length: numPages }).map((_, pageIndex) => (
            <div key={pageIndex} className="flex-shrink-0 basis-full grid grid-cols-4 gap-4">
              {products.slice(pageIndex * productsPerPage, (pageIndex + 1) * productsPerPage).map((product) => (
                <div
                  key={product.id}
                >
                  <Link
                    href={`/product/${product.id}`}
                    className="block h-full transform transition-all duration-300 hover:scale-105"
                  >
                    <div className="bg-white rounded-2xl shadow p-3 flex flex-col relative group transition-all duration-300 hover:shadow-lg h-full">
                      {/* Ảnh sản phẩm */}
                      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 mb-3 flex-shrink-0">
                        <Image
                          src={product.images[0] || "/placeholder.png"}
                          alt={product.name}
                          width={500}
                          height={500}
                          className="h-full w-full object-cover object-center group-hover:opacity-75"
                        />
                      </div>
                      {/* Wrapper cho tên sản phẩm và giá */}
                      <div className="flex flex-col flex-grow justify-between">
                        {/* Tên sản phẩm */}
                        <h3 className="text-sm text-gray-700 dark:text-gray-300 font-bold text-center line-clamp-2 min-h-[2.5em]">
                          <span aria-hidden="true" className="absolute inset-0" />
                          {product.name}
                        </h3>
                        {/* Giá */}
                        <div className="flex items-center gap-2 justify-center mt-auto">
                          <span className="text-black font-bold text-sm">{product.basePrice.toLocaleString('vi-VN')}đ</span>
                          {product.virtualPrice && (
                            <span className="text-gray-400 line-through text-xs">{product.virtualPrice.toLocaleString('vi-VN')}đ</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 