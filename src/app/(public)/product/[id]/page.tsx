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
import CategoryProducts from '@/components/home/CategoryProducts';

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<GetProductDetailResType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productApiRequest.getProduct(Number(params.id));
      if (response && response.payload) {
        setProduct(response.payload);
      } else {
        console.error("Invalid response format:", response);
        setProduct(null);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setProduct(null);
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
    console.log('Thêm vào giỏ:', selectedColor, selectedSize);
    if (!product || !product.variants || product.variants.length === 0) {
      console.error("Product variants not available");
      alert("Sản phẩm không có biến thể. Vui lòng kiểm tra lại.");
      return;
    }
    if (product.variants.length === 1) {
      addToCart({
        id: String(product.id),
        name: product.name,
        price: product.basePrice,
        originalPrice: product.virtualPrice ?? undefined,
        image: product.images[selectedImage] || '',
        quantity: quantity,
        color: product.variants[0].options[0] || '',
        size: '',
      });
    } else {
      if (!selectedColor || !selectedSize) {
        alert("Vui lòng chọn đầy đủ biến thể (màu sắc và kích thước).");
        return;
      }
      addToCart({
        id: String(product.id),
        name: product.name,
        price: product.basePrice,
        originalPrice: product.virtualPrice ?? undefined,
        image: product.images[selectedImage] || '',
        quantity: quantity,
        color: selectedColor,
        size: selectedSize,
      });
    }
  };

  // Lọc sản phẩm liên quan
  const relatedProducts: GetProductDetailResType[] = [];

  // Render các biến thể linh hoạt
  const renderVariants = () => (
    <div className="space-y-4">
      {product.variants.map((variant, variantIdx) => (
        <div key={variant.value + '-' + variantIdx}>
          <h3 className="font-semibold mb-2">{variant.value}</h3>
          <div className="flex flex-wrap gap-2">
            {variant.options.map((option, optionIdx) => (
              <button
                key={`${variantIdx}-${optionIdx}-${option}`}
                onClick={() => {
                  if (variantIdx === 0) setSelectedColor(option);
                  if (variantIdx === 1) setSelectedSize(option);
                }}
                className={`px-3 py-1 rounded-full ${
                  (variantIdx === 0 ? selectedColor : selectedSize) === option
                    ? 'bg-primary text-white'
                    : 'bg-gray-100'
                }`}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

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

          <div className="mb-4 flex items-center gap-4">
            <label htmlFor="quantity" className="font-semibold">Số lượng:</label>
            <input
              id="quantity"
              type="number"
              min={1}
              max={product.inventory ?? 99}
              value={quantity}
              onChange={e => setQuantity(Math.max(1, Math.min(Number(e.target.value), product.inventory ?? 99)))}
              className="w-20 px-2 py-1 border rounded"
            />
            {typeof product.inventory === 'number' && (
              <span className="text-gray-500">Tồn kho: {product.inventory}</span>
            )}
          </div>

          {renderVariants()}

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
              {renderVariants()}
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

      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <CategoryProducts
            title="CÓ THỂ BẠN CŨNG THÍCH"
            products={relatedProducts}
            category={product.categories[0]?.name || ''}
          />
        </div>
      )}
    </div>
  );
} 