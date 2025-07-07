"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductType } from "@/shared/models/shared-product.model";
import Link from "next/link";
import Rating from "./rating";
import { useListProducts } from "@/app/queries/useProduct";
import { useState, useEffect } from "react";

interface ProductsSectionProps {
  title?: string;
  showViewAll?: boolean;
}

export default function ProductsSection({
  title = "Sản Phẩm Nổi Bật",
  showViewAll = true,
}: ProductsSectionProps) {
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const limit = 9;
  const { data: listProduct, isLoading } = useListProducts({ page, limit });

  // Append new products to the existing list when new data is fetched
  useEffect(() => {
    if (listProduct?.payload?.data) {
      const newProducts = listProduct.payload.data.filter(
        (product) =>
          product && product.id && !allProducts.some((p) => p.id === product.id)
      );
      setAllProducts((prevProducts) => [...prevProducts, ...newProducts]);
    }
  }, [listProduct]);

  // Remove duplicates by id using Map
  const validProducts = Array.from(
    new Map(allProducts.map((product) => [product.id, product])).values()
  ).filter((product) => product && product.id);

  // Check if there are more products to load
  const hasMoreProducts =
    listProduct?.payload?.totalItems &&
    validProducts.length < listProduct.payload.totalItems;

  if (validProducts.length === 0 && !isLoading) {
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

  const handleViewMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

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
                      }}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">
                      {product.name}
                    </h3>
                    <Rating productId={product.id} />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-primary">
                          {product.virtualPrice.toLocaleString()}₫
                        </span>
                        {product.virtualPrice !== product.basePrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {(product.virtualPrice + 30000).toLocaleString()}₫
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
        {showViewAll && hasMoreProducts && (
          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              onClick={handleViewMore}
              disabled={isLoading}
            >
              {isLoading ? "Đang tải..." : "Xem Thêm Sản Phẩm"}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
