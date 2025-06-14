"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GetAllCategoriesResType } from "@/schemaValidations/category.model";

interface CategorySectionProps {
  categories: GetAllCategoriesResType["data"];
}

const CategorySection = ({ categories }: CategorySectionProps) => {
  const [tab, setTab] = useState<'nam' | 'nu'>('nam');
  const [mounted, setMounted] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <h2 className="text-2xl text-black font-bold mb-8 px-8">DANH MỤC SẢN PHẨM</h2>
      <div className="w-full px-8">
        <div className="flex justify-center gap-6 mb-12">
          <button
            className={`px-8 py-3 rounded-full font-semibold text-lg ${tab === 'nam' ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}
            onClick={() => setTab('nam')}
          >
            ĐỒ NAM
          </button>
          <button
            className={`px-8 py-3 rounded-full font-semibold text-lg ${tab === 'nu' ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}
            onClick={() => setTab('nu')}
          >
            ĐỒ NỮ
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-10 pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="group block flex-none snap-start"
                style={{ width: 'calc(16.666% - 8.333px)' }}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-sm bg-white">
                  <div className="aspect-[3/4] relative w-full min-h-[340px]">
                    <Image
                      src={category.logo || "/placeholder.png"}
                      alt={category.name}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16.666vw"
                      priority={false}
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-center py-4 font-bold text-base uppercase tracking-wide text-black group-hover:text-blue-600 transition-colors duration-200">
                    {category.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategorySection; 