"use client";

import Image from "next/image";
import { Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types";

interface ProductsSectionProps {
  products: Product[];
  title?: string;
  showViewAll?: boolean;
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  onViewAll?: () => void;
}

export default function ProductsSection({
  products,
  title = "Sản Phẩm Nổi Bật",
  showViewAll = true,
  onProductClick,
  onAddToCart,
  onToggleFavorite,
  onViewAll,
}: ProductsSectionProps) {
  if (products.length === 0) {
    return (
      <section className="py-16 bg-muted/30 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Đang tải sản phẩm...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/30 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onProductClick?.(product)}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={300}
                    height={400}
                    className="object-cover w-full h-80 group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-red-500">
                    {product.originalPrice ? "Sale" : "New"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite?.(product);
                    }}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-6">
                  <Badge variant="outline" className="mb-2">
                    {product.category}
                  </Badge>
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm font-medium">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({product.reviews} đánh giá)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-primary">
                        {product.price}₫
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {product.originalPrice}₫
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart?.(product);
                      }}
                    >
                      Thêm vào giỏ
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {showViewAll && (
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" onClick={onViewAll}>
              Xem Tất Cả Sản Phẩm
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
