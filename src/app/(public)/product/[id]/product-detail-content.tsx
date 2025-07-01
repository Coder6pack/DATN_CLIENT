"use client";

import { useState } from "react";
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
  Edit3,
  ImageIcon,
  Video,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import type { Review } from "@/types";
import { useGetProduct } from "@/app/queries/useProduct";
import { formatCurrency } from "@/lib/utils";
import { useAddCartMutation } from "@/app/queries/useCart";
import { toast } from "@/hooks/use-toast";
import { useListReview } from "@/app/queries/useReview";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import RelatedProduct from "@/components/related-product";

interface ProductDetailContentProps {
  productId: number;
  initialReviews?: Review[];
}

interface ReduceRating {
  stars: number;
  count: number;
  percentage: number;
}

interface ReviewFilter {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  productId: number;
  userId: number;
  content: string;
  orderId: number;
  rating: number;
  updateCount: number;
  medias: {
    id: number;
    type: "IMAGE" | "VIDEO";
    createdAt: Date;
    url: string;
    reviewId: number;
  }[];
  user: {
    id: number;
    name: string;
    avatar: string | null;
  };
}
interface MediaType {
  type: "IMAGE" | "VIDEO";
  url: string;
}

const careInstructions = [
  {
    value: "Giặt máy ở nhiệt độ không quá 40°C",
  },
  {
    value: "Không sử dụng chất tẩy có chứa clo",
  },
  {
    value: "Phơi khô tự nhiên, tránh ánh nắng trực tiếp",
  },
  {
    value: "Ủi ở nhiệt độ trung bình",
  },
  {
    value: "Có thể giặt khô",
  },
];
export default function ProductDetailContent({
  productId,
  initialReviews,
}: ProductDetailContentProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews || []);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: string | null;
  }>({});
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [selectedReviewMedia, setSelectedReviewMedia] = useState<MediaType[]>(
    []
  );
  const { data, isLoading } = useGetProduct({
    id: productId || 0,
    enabled: Boolean(productId),
  });
  const { data: reviewData } = useListReview({ productId });
  const addToCartMutation = useAddCartMutation();
  if (!data || !reviewData) {
    return;
  }
  const getReviews = reviewData.payload.data;
  const avgRating =
    getReviews.reduce((acc, item) => acc + item.rating, 0) / getReviews.length;
  const productDetail = data.payload;
  const totalStock = productDetail.skus.reduce(
    (acc, item) => acc + item.stock,
    0
  );
  const cateArr = productDetail.categories.map((cate) => cate.id);
  console.log("productDetail", productDetail);
  console.log("cateArr", cateArr);
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
    let result: ReduceRating[] = [];
    let getTotal: ReviewFilter[] = [];
    for (let i = 1; i < 6; i++) {
      const total = getReviews.filter((review) => review.rating === i);
      getTotal.push(...total);
    }
    for (let i = 1; i < 6; i++) {
      const itemTotal = getTotal.filter((item) => item.rating === i);
      result.push({
        stars: i,
        count: itemTotal.length,
        percentage: Math.ceil((itemTotal.length / getReviews.length) * 100),
      });
    }
    return result.reverse();
  };
  const openMediaGallery = (media: MediaType[], startIndex = 0) => {
    setSelectedReviewMedia(media);
    setSelectedMediaIndex(startIndex);
    setIsGalleryOpen(true);
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
                  src={productDetail.images[selectedImage]}
                  alt={productDetail.name}
                  fill
                  className={`object-cover transition-all duration-700 ${
                    isImageZoomed
                      ? "scale-150"
                      : "scale-100 group-hover:scale-105"
                  }`}
                  priority
                />
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
                        src={image}
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
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i <
                          Math.floor(Number.isNaN(avgRating) ? 0 : avgRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold">
                    {Number.isNaN(avgRating) ? "" : avgRating}
                  </span>
                  <span className="text-muted-foreground">
                    ({getReviews.length} đánh giá)
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-bold text-primary">
                  {productDetail.virtualPrice.toLocaleString()}₫
                </span>
                {productDetail.basePrice && (
                  <span className="text-2xl text-muted-foreground line-through">
                    {(productDetail.virtualPrice + 30000).toLocaleString()}₫
                  </span>
                )}
              </div>
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
              {/* <Button
                variant="outline"
                size="lg"
                className="w-full text-lg font-semibold py-6 rounded-2xl border-2"
              >
                <Zap className="h-6 w-6 mr-3" />
                Mua ngay
              </Button> */}
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
                  {/* Description */}
                  <div className="flex justify-center">
                    <h3 className="text-2xl font-bold mb-6">
                      Thông tin sản phẩm
                    </h3>
                  </div>
                  <div>
                    <p
                      className="text-muted-foreground leading-relaxed text-lg"
                      dangerouslySetInnerHTML={{
                        __html: productDetail.description,
                      }}
                    />
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
                        {Number.isNaN(avgRating) ? "" : avgRating}
                      </div>
                      <div className="flex justify-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-6 w-6 ${
                              i <
                              Math.floor(
                                Number.isNaN(avgRating) ? 0 : avgRating
                              )
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground">
                        {Number.isNaN(avgRating)
                          ? ""
                          : `Dựa trên ${getReviews.length} đánh giá`}
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
                    {getReviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-muted pb-8 last:border-b-0"
                      >
                        <div className="flex items-start space-x-4">
                          <Image
                            src={review.user.avatar || "/avatar.jpg"}
                            alt={review.user.name}
                            width={50}
                            height={50}
                            className="rounded-full"
                          />
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <h4 className="font-semibold text-lg">
                                  {review.user.name}
                                </h4>
                                {review.updateCount > 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    <Edit3 className="h-3 w-3 mr-1" />
                                    Đã chỉnh sửa {review.updateCount} lần
                                  </Badge>
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {new Date(review.updatedAt).toDateString()}
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
                              {review.content}
                            </p>

                            {/* Review Media */}
                            {review.medias.length > 0 && (
                              <div className="space-y-3">
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <ImageIcon className="h-4 w-4" />
                                  <span>
                                    {
                                      review.medias.filter(
                                        (m) => m.type === "IMAGE"
                                      ).length
                                    }{" "}
                                    hình ảnh
                                  </span>
                                  {review.medias.filter(
                                    (m) => m.type === "VIDEO"
                                  ).length > 0 && (
                                    <>
                                      <Video className="h-4 w-4 ml-2" />
                                      <span>
                                        {
                                          review.medias.filter(
                                            (m) => m.type === "VIDEO"
                                          ).length
                                        }{" "}
                                        video
                                      </span>
                                    </>
                                  )}
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                  {review.medias
                                    .slice(0, 4)
                                    .map((media, index) => (
                                      <div
                                        key={index}
                                        className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group hover:opacity-80 transition-opacity"
                                        onClick={() =>
                                          openMediaGallery(review.medias, index)
                                        }
                                      >
                                        <Image
                                          src={media.url || "/placeholder.svg"}
                                          alt={`Review media ${index + 1}`}
                                          fill
                                          sizes=""
                                          className="object-cover"
                                        />
                                        {media.type === "VIDEO" && (
                                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                            <Play className="h-8 w-8 text-white" />
                                          </div>
                                        )}
                                        {index === 3 &&
                                          review.medias.length > 4 && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white font-semibold">
                                              +{review.medias.length - 4}
                                            </div>
                                          )}
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
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
                      <ul className="space-y-4">
                        {careInstructions.map((instruction, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-3"
                          >
                            <Check className="h-6 w-6 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground leading-relaxed">
                              {instruction.value}
                            </span>
                          </li>
                        ))}
                      </ul>
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

        <RelatedProduct categories={cateArr} />
      </div>
      {/* Media Gallery Dialog */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        {/* <DialogHeader>
          <DialogTitle>Hiển thị</DialogTitle>
        </DialogHeader>
        <DialogDescription>Bạn đang xem hình ảnh và video</DialogDescription> */}
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <div className="relative">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              {selectedReviewMedia[selectedMediaIndex]?.type === "VIDEO" ? (
                <div className="flex items-center justify-center h-full text-white">
                  <Play className="h-16 w-16" />
                  <span className="ml-4 text-lg">Video Player</span>
                </div>
              ) : (
                <Image
                  src={
                    selectedReviewMedia[selectedMediaIndex]?.url ||
                    "/placeholder.svg"
                  }
                  alt="Review media"
                  fill
                  className="object-contain"
                />
              )}
            </div>

            {/* Navigation */}
            {selectedReviewMedia.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                  onClick={() =>
                    setSelectedMediaIndex(
                      (prev) =>
                        (prev - 1 + selectedReviewMedia.length) %
                        selectedReviewMedia.length
                    )
                  }
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                  onClick={() =>
                    setSelectedMediaIndex(
                      (prev) => (prev + 1) % selectedReviewMedia.length
                    )
                  }
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
              {selectedMediaIndex + 1} / {selectedReviewMedia.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
