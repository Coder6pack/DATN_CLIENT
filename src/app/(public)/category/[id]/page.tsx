"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import categoryApiRequest from "@/app/apiRequests/category";
import { GetCategoryDetailResType } from "@/schemaValidations/category.model";

export default function CategoryDetailPage() {
  const params = useParams();
  const [category, setCategory] = useState<GetCategoryDetailResType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategory();
  }, [params.id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await categoryApiRequest.getCategory(Number(params.id));
      setCategory(response);
    } catch (error) {
      console.error("Error fetching category:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold">Không tìm thấy danh mục</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Category Image */}
        <div className="aspect-square relative">
          <img
            src={category.logo || "/placeholder.png"}
            alt={category.name}
            className="object-cover w-full h-full rounded-lg"
          />
        </div>

        {/* Category Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Danh mục cha:</span>
              <span>{category.parentCategoryId ? "Có" : "Không có"}</span>
            </div>
          </div>

          <Button
            className="w-full"
            onClick={() => window.location.href = `/product?categoryId=${category.id}`}
          >
            Xem sản phẩm
          </Button>
        </div>
      </div>
    </div>
  );
} 