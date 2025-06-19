"use client";

import Image from "next/image";
import { Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductType } from "@/shared/models/shared-product.model";
import Link from "next/link";
import { useAppContext } from "./app-provider";

interface ProductsSectionProps {
  products: ProductType[];
  title?: string;
  showViewAll?: boolean;
  onToggleFavorite?: (product: ProductType) => void;
  onViewAll?: () => void;
}

export default function ProductsSection({
  products,
  title = "Sản Phẩm Nổi Bật",
  showViewAll = true,
  onToggleFavorite,
  onViewAll,
}: ProductsSectionProps) {
  // Lọc sản phẩm hợp lệ
  const validProducts = products.filter((product) => product && product.id);

  if (validProducts.length === 0) {
    return (
      <section className="py-16 bg-muted/30 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            Không có sản phẩm nào để hiển thị.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/30 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {validProducts.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id}>
              <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={400}
                      className="object-cover w-full h-80 group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-red-500">
                      {product.virtualPrice !== product.basePrice
                        ? "Sale"
                        : "New"}
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
                    <h3 className="text-lg font-semibold mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-sm font-medium">{5}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-primary">
                          {product.virtualPrice.toLocaleString("vi-VN")}₫
                        </span>
                        {product.virtualPrice !== product.basePrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {product.basePrice.toLocaleString("vi-VN")}₫
                          </span>
                        )}
                      </div>
                      <Button size="sm">Xem chi tiết</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
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
