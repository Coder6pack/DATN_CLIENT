"use client";

import Image from "next/image";
import { Star, Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  viewMode: "grid" | "list";
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
}

export default function ProductCard({
  product,
  viewMode,
  onProductClick,
  onAddToCart,
  onToggleFavorite,
}: ProductCardProps) {
  return (
    <Card
      className={`group cursor-pointer hover:shadow-xl transition-all duration-500 border-2 rounded-3xl overflow-hidden ${
        viewMode === "list" ? "flex" : ""
      }`}
      onClick={() => onProductClick(product)}
    >
      <div
        className={`relative overflow-hidden ${
          viewMode === "list" ? "w-48 flex-shrink-0" : ""
        }`}
      >
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={300}
          height={400}
          className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
            viewMode === "list" ? "w-full h-full" : "w-full h-80"
          }`}
        />
        <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
          {product.originalPrice ? "Sale" : "New"}
        </Badge>
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
          <Badge variant="outline">{product.category}</Badge>
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 text-sm font-medium">{product.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.reviews} đánh giá)
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-primary text-lg">
                {product.price}₫
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {product.originalPrice}₫
                </span>
              )}
            </div>
          </div>
          <Button
            size="sm"
            className="rounded-xl"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
          >
            <ShoppingBag className="h-4 w-4 mr-1" />
            Thêm
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
