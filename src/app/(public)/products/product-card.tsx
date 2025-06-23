"use client";

import Image from "next/image";
import { Star, Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductType } from "@/shared/models/shared-product.model";
import { useGetProduct } from "@/app/queries/useProduct";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface ProductCardProps {
  product: ProductType;
  viewMode: "grid" | "list";
  onToggleFavorite: (product: ProductType) => void;
}

export default function ProductCard({
  product,
  viewMode,
  onToggleFavorite,
}: ProductCardProps) {
  const { data } = useGetProduct({
    id: product.id || 0,
    enabled: Boolean(product.id),
  });
  const getProductDetail = data?.payload;
  return (
    <Link href={`/product/${product.id}`}>
      <Card
        className={`group cursor-pointer hover:shadow-xl transition-all duration-500 border-2 rounded-3xl overflow-hidden ${
          viewMode === "list" ? "flex" : ""
        }`}
      >
        <div
          className={`relative overflow-hidden ${
            viewMode === "list" ? "w-48 flex-shrink-0" : ""
          }`}
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={400}
            className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
              viewMode === "list" ? "w-full h-full" : "w-full h-80"
            }`}
          />
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product);
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <CardContent
          className={`p-6 space-y-3 ${
            viewMode === "list" ? "flex-1 flex flex-col justify-between" : ""
          }`}
        >
          <div className="space-y-3">
            {getProductDetail?.categories.map((cate) => (
              <Badge variant="outline" key={cate.id}>
                {cate.name}
              </Badge>
            ))}
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm font-medium">5</span>
              </div>
              <span className="text-sm text-muted-foreground">
                (100 đánh giá)
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-primary text-lg">
                  {formatCurrency(product.basePrice)}₫
                </span>
                {formatCurrency(product.virtualPrice) && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatCurrency(product.virtualPrice)}₫
                  </span>
                )}
              </div>
            </div>
            <Button size="sm" className="rounded-xl">
              <ShoppingBag className="h-4 w-4 mr-1" />
              Mua ngay
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
