"use client";

import { useState, useEffect, use } from "react";
import ProductDetailContent from "./product-detail-content";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [loading, setLoading] = useState(true);
  const { id } = use(params);
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
            {/* Image skeleton */}
            <div className="space-y-6">
              <div className="aspect-[4/5] bg-muted rounded-3xl animate-pulse"></div>
              <div className="flex space-x-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="w-24 h-24 bg-muted rounded-2xl animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            {/* Content skeleton */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                <div className="h-12 bg-muted rounded w-3/4 animate-pulse"></div>
                <div className="h-6 bg-muted rounded w-1/2 animate-pulse"></div>
              </div>
              <div className="h-16 bg-muted rounded animate-pulse"></div>
              <div className="h-32 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProductDetailContent productId={Number.parseInt(id)} />
    </div>
  );
}
