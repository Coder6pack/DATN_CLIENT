import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  discount,
  image,
}: ProductCardProps) {
  return (
    <Link href={`/product/${id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:scale-105">
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold line-clamp-2 mb-2">{name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-red-600">
              {price.toLocaleString('vi-VN')}đ
            </span>
            <span className="text-sm text-gray-500 line-through">
              {originalPrice.toLocaleString('vi-VN')}đ
            </span>
            <span className="bg-red-600 text-white text-sm px-2 py-1 rounded">
              -{discount}%
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
} 