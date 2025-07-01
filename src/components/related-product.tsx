import { useFilterProducts, useListProducts } from "@/app/queries/useProduct";
import Rating from "@/components/rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function RelatedProduct({
  categories,
}: {
  categories: number[];
}) {
  const { data: products } = useListProducts({
    page: 1,
    limit: 10,
  });
  const { data } = useFilterProducts({
    page: 1,
    limit: 10,
    orderBy: "desc",
    sortBy: "createdAt",
    categories,
  });
  if (!data || !products) {
    return;
  }
  console.log("data", data);
  const relatedProducts = data ? data.payload.data : products.payload.data;
  return (
    <>
      {/* Related Products */}
      <div className="mt-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Sản Phẩm Liên Quan</h2>
          <p className="text-lg text-muted-foreground">
            Khám phá thêm những sản phẩm tương tự
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map((relatedProduct) => (
            <Card
              key={relatedProduct.id}
              className="group cursor-pointer hover:shadow-xl transition-all duration-500 border-2 rounded-3xl overflow-hidden"
              onClick={() =>
                (window.location.href = `/product/${relatedProduct.id}`)
              }
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <Image
                    src={relatedProduct.images[0] || "/placeholder.svg"}
                    alt={relatedProduct.name}
                    width={300}
                    height={400}
                    className="object-cover w-full h-80 group-hover:scale-105 transition-transform duration-500"
                  />
                  <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                    {relatedProduct.virtualPrice ? "Sale" : "New"}
                  </Badge>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Add to favorites:", relatedProduct);
                    }}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Rating productId={relatedProduct.id} />
                  </div>
                  <h3 className="text-lg font-semibold">
                    {relatedProduct.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-primary text-lg">
                          {relatedProduct.virtualPrice.toLocaleString()}₫
                        </span>
                        {relatedProduct.basePrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {(
                              relatedProduct.virtualPrice + 30000
                            ).toLocaleString()}
                            ₫
                          </span>
                        )}
                      </div>
                    </div>
                    <Link href={`/product/${relatedProduct.id}`}>
                      <Button size="sm" className="rounded-xl">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
