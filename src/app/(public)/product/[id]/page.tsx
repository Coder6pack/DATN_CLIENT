"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import productApiRequest from "@/app/apiRequests/product";
import { GetProductDetailResType } from "@/schemaValidations/product.model";
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { products, Product } from '@/data/products';
import CategoryProducts from '@/components/home/CategoryProducts';

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<GetProductDetailResType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productApiRequest.findById(Number(params.id));
      setProduct(response);
    } catch (error) {
      console.error("Error fetching product:", error);
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

  if (!product) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold">Không tìm thấy sản phẩm</h2>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.basePrice,
      originalPrice: product.virtualPrice ?? undefined,
      image: product.images[selectedImage] || '',
      quantity: 1,
      color: product.variants[0].options[0],
      size: product.variants[1].options[0],
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative">
            <img
              src={product.images[selectedImage] || "/placeholder.png"}
              alt={product.name}
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square relative ${
                  selectedImage === index ? "ring-2 ring-primary" : ""
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} - ${index + 1}`}
                  className="object-cover w-full h-full rounded-lg"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-primary">
                {product.basePrice.toLocaleString("vi-VN")}đ
              </span>
              <span className="text-sm text-gray-500">
                Giá ảo: {product.virtualPrice.toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Danh mục:</span>
              <span>{product.categories[0]?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Thương hiệu:</span>
              <span>{product.brand.name}</span>
            </div>
          </div>

          <Button className="w-full" onClick={handleAddToCart}>Thêm vào giỏ hàng</Button>

          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Mô tả</TabsTrigger>
              <TabsTrigger value="specifications">Thông số kỹ thuật</TabsTrigger>
              <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <div className="prose max-w-none">
                <p>{product.description}</p>
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="mt-4">
              <div className="space-y-4">
                {product.variants.map((variant) => (
                  <div key={variant.value}>
                    <h3 className="font-semibold mb-2">{variant.value}</h3>
                    <div className="flex flex-wrap gap-2">
                      {variant.options.map((option) => (
                        <span
                          key={option}
                          className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                        >
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <div className="text-center py-8">
                <p>Chưa có đánh giá nào</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Mô tả sản phẩm</h3>
        <p className="text-gray-600 dark:text-gray-400">{product.description}</p>
      </div>

      {/* Lọc sản phẩm liên quan */}
      const relatedProducts = product
        ? products.filter((p: Product) => p.category === product.category && p.id !== product.id)
        : [];

      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <CategoryProducts
            title="CÓ THỂ BẠN CŨNG THÍCH"
            products={relatedProducts}
            category={product.category}
          />
        </div>
      )}
    </div>
  );
} 