"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Heart,
  Share2,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  Check,
  ChevronLeft,
  Zap,
  MessageCircle,
  ThumbsUp,
  Eye,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import type { ProductDetail, Review, Product } from "@/types";
import { useGetProduct } from "@/app/queries/useProduct";
import { ProductType } from "@/shared/models/shared-product.model";
import { formatCurrency } from "@/lib/utils";
import { useAddCartMutation } from "@/app/queries/useCart";
import { toast } from "@/hooks/use-toast";

interface ProductDetailContentProps {
  productId: number;
  initialProduct?: ProductDetail;
  initialReviews?: Review[];
  initialRelatedProducts?: ProductType[];
}

export default function ProductDetailContent({
  productId,
  initialProduct,
  initialReviews,
  initialRelatedProducts,
}: ProductDetailContentProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews || []);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: string | null;
  }>({});
  const { data, isLoading } = useGetProduct({
    id: productId || 0,
    enabled: Boolean(productId),
  });
  const addToCartMutation = useAddCartMutation();
  if (!data) {
    return;
  }
  const productDetail = data.payload;

  const totalStock = productDetail.skus.reduce(
    (acc, item) => acc + item.stock,
    0
  );
  const handleQuantityChange = (change: number) => {
    setQuantity((prev) =>
      Math.max(1, Math.min(totalStock || 1, prev + change))
    );
  };
  const handleAddToCart = async () => {
    // Kiểm tra xem tất cả các biến thể đã được chọn chưa
    const allVariantsSelected = productDetail.variants.every(
      (variant) => selectedVariants[variant.value]
    );

    if (!allVariantsSelected) {
      alert("Vui lòng chọn đầy đủ các biến thể (ví dụ: màu sắc, kích thước)");
      return;
    }

    // Tạo chuỗi tổ hợp biến thể từ selectedVariants với định dạng "Trắng-XL"
    const variantString = Object.values(selectedVariants).join("-");

    // Tìm SKU khớp với tổ hợp biến thể
    const matchedSku = productDetail.skus.find(
      (sku) => sku.value === variantString
    );
    console.log("matchedSku", matchedSku);
    if (!matchedSku) {
      alert("Không tìm thấy SKU phù hợp với tổ hợp biến thể đã chọn");
      return;
    }

    // Xử lý thêm vào giỏ hàng với thông tin SKU
    console.log("SKU đã chọn:", matchedSku);
    const result = await addToCartMutation.mutateAsync({
      skuId: matchedSku.id,
      quantity,
    });
    if (result) {
      toast({
        description: "Đã thêm vào giỏ hàng!",
      });
    }
  };

  const getRatingDistribution = () => {
    return [
      { stars: 5, count: 189, percentage: 77 },
      { stars: 4, count: 41, percentage: 17 },
      { stars: 3, count: 12, percentage: 5 },
      { stars: 2, count: 3, percentage: 1 },
      { stars: 1, count: 2, percentage: 0 },
    ];
  };

  if (isLoading) {
    return (
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
    );
  }

  if (!productDetail) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
        <p className="text-muted-foreground mb-8">
          Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Button asChild>
          <Link href="/">Về trang chủ</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-6">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link
              href="/"
              className="hover:text-primary transition-colors font-medium"
            >
              Trang Chủ
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href="/products"
              className="hover:text-primary transition-colors font-medium"
            >
              Sản Phẩm
            </Link>
            <ChevronRight className="h-4 w-4" />
            {productDetail.categories.map((cate) => (
              <Link
                key={cate.id}
                href={`/category/${cate.id}`}
                className="hover:text-primary transition-colors font-medium"
              >
                {cate.name}
              </Link>
            ))}
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-semibold">
              {productDetail.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
          {/* Product Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative group">
              <div
                className={`relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted/20 border-2 border-muted/20 transition-all duration-500 ${
                  isImageZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                }`}
                onClick={() => setIsImageZoomed(!isImageZoomed)}
              >
                <Image
                  src={
                    productDetail.images[selectedImage] || "/placeholder.svg"
                  }
                  alt={productDetail.name}
                  fill
                  className={`object-cover transition-all duration-700 ${
                    isImageZoomed
                      ? "scale-150"
                      : "scale-100 group-hover:scale-105"
                  }`}
                  priority
                />
                {/* {calculateDiscount() > 0 && (
                  <Badge className="absolute top-6 left-6 bg-destructive text-destructive-foreground text-lg px-4 py-2 font-bold">
                    -{calculateDiscount()}%
                  </Badge>
                )} */}
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-6 right-6 bg-background/80 backdrop-blur-sm hover:bg-background rounded-full shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFavorite(!isFavorite);
                  }}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isFavorite ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </Button>
              </div>

              {/* Image Navigation */}
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() =>
                  setSelectedImage(
                    (prev) =>
                      (prev - 1 + productDetail.images.length) %
                      productDetail.images.length
                  )
                }
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() =>
                  setSelectedImage(
                    (prev) => (prev + 1) % productDetail.images.length
                  )
                }
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Thumbnail Images */}
            <div className="relative">
              <div className="flex space-x-3 overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-in-out space-x-3"
                  style={{
                    transform: `translateX(-${
                      Math.max(0, selectedImage - 2) * 108
                    }px)`,
                  }}
                >
                  {productDetail.images.map((image, index) => (
                    <button
                      key={index}
                      className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-3 transition-all duration-300 ${
                        selectedImage === index
                          ? "border-primary shadow-lg shadow-primary/25"
                          : "border-muted hover:border-muted-foreground/50"
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${productDetail.name} ${index + 1}`}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons for Thumbnails */}
              {productDetail.images.length > 5 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white shadow-lg hover:shadow-xl border-2 border-gray-100 hover:border-primary transition-all duration-300 rounded-full w-8 h-8"
                    onClick={() =>
                      setSelectedImage(Math.max(0, selectedImage - 1))
                    }
                    disabled={selectedImage === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white shadow-lg hover:shadow-xl border-2 border-gray-100 hover:border-primary transition-all duration-300 rounded-full w-8 h-8"
                    onClick={() =>
                      setSelectedImage(
                        Math.min(
                          productDetail.images.length - 1,
                          selectedImage + 1
                        )
                      )
                    }
                    disabled={selectedImage === productDetail.images.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                {productDetail.categories.map((cate) => (
                  <Badge
                    key={cate.id}
                    variant="secondary"
                    className="text-sm px-3 py-1"
                  >
                    {cate.name}
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Chia sẻ
                </Button>
              </div>
              <h1 className="text-4xl font-bold text-foreground leading-tight">
                {productDetail.name}
              </h1>
              rating
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(5)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold">{5}</span>
                  <span className="text-muted-foreground">({5} đánh giá)</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Eye className="h-4 w-4 mr-1" />
                  <span className="text-sm">1,247 lượt xem</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-bold text-primary">
                  {formatCurrency(productDetail.basePrice)}₫
                </span>
                {formatCurrency(productDetail.basePrice) && (
                  <span className="text-2xl text-muted-foreground line-through">
                    {formatCurrency(productDetail.virtualPrice)}₫
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-gray max-w-none">
              <p
                className="text-muted-foreground leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ __html: productDetail.description }}
              />
            </div>

            {/* variants */}
            <div className="space-y-4">
              {productDetail.variants.map((variant, ind) => (
                <div key={variant.value} className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">
                    {variant.value}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {variant.options.map((option, index) => (
                      <button
                        key={index}
                        className={`relative group flex items-center space-x-3 p-3 rounded-2xl border-2 transition-all duration-300 ${
                          selectedVariants[variant.value] === option
                            ? "border-primary bg-primary/5"
                            : "border-muted hover:border-muted-foreground/50"
                        }`}
                        onClick={() =>
                          setSelectedVariants((prev) => ({
                            ...prev,
                            [variant.value]:
                              prev[variant.value] === option ? null : option,
                          }))
                        }
                      >
                        <span className="font-medium">{option}</span>
                        {selectedVariants[variant.value] === option && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* Quantity */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Số lượng</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center border-2 border-muted rounded-2xl">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="rounded-l-2xl"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-6 py-3 font-semibold text-lg min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= totalStock}
                    className="rounded-r-2xl"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-muted-foreground">
                  Còn lại{" "}
                  <span className="font-semibold text-foreground">
                    {totalStock}
                  </span>{" "}
                  sản phẩm
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full text-lg font-semibold py-6 rounded-2xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="h-6 w-6 mr-3" />
                Thêm vào giỏ hàng
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full text-lg font-semibold py-6 rounded-2xl border-2"
              >
                <Zap className="h-6 w-6 mr-3" />
                Mua ngay
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t">
              <div className="flex items-center space-x-4 p-4 rounded-2xl bg-muted/30">
                <Truck className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold">Miễn phí vận chuyển</p>
                  <p className="text-sm text-muted-foreground">
                    Đơn hàng từ 500k
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 rounded-2xl bg-muted/30">
                <RotateCcw className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold">Đổi trả 30 ngày</p>
                  <p className="text-sm text-muted-foreground">
                    Miễn phí đổi trả
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 rounded-2xl bg-muted/30">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold">Bảo hành chất lượng</p>
                  <p className="text-sm text-muted-foreground">
                    Cam kết chính hãng
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-20">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-14 p-1 bg-muted/30 rounded-2xl">
              <TabsTrigger
                value="description"
                className="text-lg font-semibold rounded-xl"
              >
                Mô tả sản phẩm
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="text-lg font-semibold rounded-xl"
              >
                Đánh giá {/*({product.reviews})*/}
              </TabsTrigger>
              <TabsTrigger
                value="care"
                className="text-lg font-semibold rounded-xl"
              >
                Hướng dẫn bảo quản
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-8">
              <Card className="border-2 rounded-3xl">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold mb-6">
                        Thông tin sản phẩm
                      </h3>
                      <div className="space-y-4">
                        {[
                          { label: "Thương hiệu", value: productDetail.brand },
                          { label: "Mã sản phẩm", value: productDetail.skus },
                          // { label: "Chất liệu", value: product.material },
                          { label: "Xuất xứ", value: "Việt Nam" },
                          {
                            label: "Tình trạng",
                            value: "Còn hàng",
                            color: "text-green-600",
                          },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-3 border-b border-muted"
                          >
                            <span className="text-muted-foreground font-medium">
                              {item.label}:
                            </span>
                            <span
                              className={`font-semibold ${item.color || ""}`}
                            >
                              {/* {item.value} */}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold mb-6">
                        Đặc điểm nổi bật
                      </h3>
                      {/* <ul className="space-y-4">
                        {product.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-3"
                          >
                            <Check className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground leading-relaxed">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <Card className="border-2 rounded-3xl">
                <CardContent className="p-8">
                  {/* Rating Summary */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <div className="text-center space-y-4">
                      <div className="text-6xl font-bold text-primary">
                        {/* {product.rating} */}
                      </div>
                      <div className="flex justify-center">
                        {/* {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-6 w-6 ${
                              i < Math.floor(product.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted"
                            }`}
                          />
                        ))} */}
                      </div>
                      <p className="text-muted-foreground">
                        Dựa trên {/*product.reviews*/} đánh giá
                      </p>
                    </div>

                    <div className="lg:col-span-2 space-y-3">
                      {getRatingDistribution().map((item) => (
                        <div
                          key={item.stars}
                          className="flex items-center space-x-4"
                        >
                          <div className="flex items-center space-x-2 w-20">
                            <span className="text-sm font-medium">
                              {item.stars}
                            </span>
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          </div>
                          <Progress
                            value={item.percentage}
                            className="flex-1 h-3"
                          />
                          <span className="text-sm text-muted-foreground w-12">
                            {item.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-8">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-muted pb-8 last:border-b-0"
                      >
                        <div className="flex items-start space-x-4">
                          <Image
                            src={review.avatar || "/placeholder.svg"}
                            alt={review.user}
                            width={50}
                            height={50}
                            className="rounded-full"
                          />
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-lg">
                                {review.user}
                              </h4>
                              <span className="text-sm text-muted-foreground">
                                {review.date}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-5 w-5 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-muted"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                              {review.comment}
                            </p>
                            <div className="flex items-center space-x-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <ThumbsUp className="h-4 w-4 mr-2" />
                                Hữu ích ({review.helpful})
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Trả lời
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="care" className="mt-8">
              <Card className="border-2 rounded-3xl">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold mb-6">
                        Hướng dẫn bảo quản
                      </h3>
                      {/* <ul className="space-y-4">
                        {product.careInstructions.map((instruction, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-3"
                          >
                            <Check className="h-6 w-6 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground leading-relaxed">
                              {instruction}
                            </span>
                          </li>
                        ))}
                      </ul> */}
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold mb-6">
                        Lưu ý quan trọng
                      </h3>
                      <div className="space-y-4 text-muted-foreground">
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
                          <p className="font-medium text-yellow-800 mb-2">
                            ⚠️ Chú ý đặc biệt
                          </p>
                          <p className="text-yellow-700">
                            Sản phẩm làm từ chất liệu cao cấp, cần được bảo quản
                            cẩn thận để duy trì chất lượng tốt nhất.
                          </p>
                        </div>
                        <ul className="space-y-2">
                          <li>
                            • Tránh tiếp xúc với hóa chất mạnh và chất tẩy có
                            clo
                          </li>
                          <li>
                            • Bảo quản nơi khô ráo, thoáng mát, tránh ẩm mốc
                          </li>
                          <li>• Không phơi trực tiếp dưới ánh nắng mặt trời</li>
                          <li>
                            • Ủi mặt trái của sản phẩm để bảo vệ bề mặt vải
                          </li>
                          <li>
                            • Treo áo bằng móc áo chuyên dụng để giữ form dáng
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {/* <div className="mt-20">
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
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      width={300}
                      height={400}
                      className="object-cover w-full h-80 group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                      {relatedProduct.originalPrice ? "Sale" : "New"}
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
                    <Badge variant="outline">{relatedProduct.category}</Badge>
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-sm font-medium">
                          {relatedProduct.rating}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({relatedProduct.reviews})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-primary text-lg">
                            {relatedProduct.price}₫
                          </span>
                          {relatedProduct.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {relatedProduct.originalPrice}₫
                            </span>
                          )}
                        </div>
                      </div>
                      <Button size="sm" className="rounded-xl">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div> */}
      </div>
    </>
  );
}
