'use client';
import React, { useEffect, useState } from 'react';

const banners = [
  '/banner.png',
  '/images/T-SHIRT__POLO_THE_THAO_-_Desktop-2.jpg',
  '/images/mceclip33.png',
  '/images/Polo.jpg',
  '/images/Do_boiz.jpg',
];

const AdBannerSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const goTo = (idx: number) => setCurrent(idx);
  const prev = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  const next = () => setCurrent((prev) => (prev + 1) % banners.length);

  return (
    <div className="relative w-full mx-auto rounded-lg overflow-hidden shadow-lg group">
      <img
        src={banners[current]}
        alt={`Banner ${current + 1}`}
        className="w-full h-[600px] object-cover transition-all duration-700 group-hover:scale-105"
      />
      {/* Nút chuyển trái/phải */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow"
        aria-label="Trước"
      >
        &#8592;
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow"
        aria-label="Sau"
      >
        &#8594;
      </button>
      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`w-3 h-3 rounded-full ${current === idx ? 'bg-blue-500' : 'bg-gray-300'} border border-white`}
            aria-label={`Chọn banner ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AdBannerSlider; 