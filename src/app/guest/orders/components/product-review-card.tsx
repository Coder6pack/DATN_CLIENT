"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Star,
  MessageSquare,
  Edit3,
  Check,
  Calendar,
  RotateCcw,
  ImageIcon,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OrderItem {
  productId: number | null;
  orderId: number | null;
  id: number;
  createdAt: Date;
  image: string;
  productName: string;
  skuPrice: number;
  skuValue: string;
  skuId: number | null;
  quantity: number;
}

interface ExistingReview {
  id: number;
  rating: number;
  content: string;
  medias: Array<{ url: string; type: "IMAGE" | "VIDEO" }>;
  createdAt: Date;
  updateCount: number;
}

interface ProductReviewCardProps {
  item: OrderItem;
  orderId: string;
  existingReview?: ExistingReview;
  onReview: (productId: number, isEdit: boolean) => void;
}

export default function ProductReviewCard({
  item,
  orderId,
  existingReview,
  onReview,
}: ProductReviewCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // product-review-card.tsx
  function formatDate(date: Date) {
    // Ví dụ: định dạng ngày
    return new Date(date).toLocaleString(); // Lỗi nếu `date` không hợp lệ
  }
  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return {
          text: "Rất không hài lòng",
          color: "text-red-600",
          emoji: "😞",
        };
      case 2:
        return {
          text: "Không hài lòng",
          color: "text-orange-600",
          emoji: "😕",
        };
      case 3:
        return { text: "Bình thường", color: "text-yellow-600", emoji: "😐" };
      case 4:
        return { text: "Hài lòng", color: "text-blue-600", emoji: "😊" };
      case 5:
        return { text: "Rất hài lòng", color: "text-green-600", emoji: "😍" };
      default:
        return { text: "Chưa đánh giá", color: "text-gray-500", emoji: "⭐" };
    }
  };

  const ratingInfo = existingReview
    ? getRatingText(existingReview.rating)
    : getRatingText(0);
  return (
    <Card
      className={`border-2 rounded-2xl transition-all duration-300 hover:shadow-lg ${
        existingReview
          ? "border-green-200 bg-green-50/30 dark:border-green-800 dark:bg-green-950/20"
          : "border-gray-200 hover:border-primary/50"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-6">
        {/* Product Info */}
        <div className="flex items-start space-x-4 mb-4">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.productName}
            width={80}
            height={80}
            className="rounded-xl object-cover"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-lg mb-2">{item.productName}</h4>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
              {item.skuValue.split("-").map((val) => (
                <Badge key={val} variant="outline">
                  {val}
                </Badge>
              ))}
              <Badge variant="outline">SL: {item.quantity}</Badge>
            </div>
            <p className="text-lg font-semibold text-primary">
              {item.skuPrice.toLocaleString()}₫
            </p>
          </div>
        </div>

        {/* Review Status */}
        {existingReview ? (
          <div className="space-y-4">
            {/* Review Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= existingReview.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{ratingInfo.emoji}</span>
                <span className={`text-sm font-medium ${ratingInfo.color}`}>
                  {ratingInfo.text}
                </span>
              </div>
              <Badge
                variant="secondary"
                className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              >
                <Check className="h-3 w-3 mr-1" />
                Đã đánh giá
              </Badge>
            </div>

            {/* Review Content */}
            <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
              {existingReview.content && (
                <div className="mb-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed">
                    {existingReview.content}
                  </p>
                </div>
              )}

              {/* Media Preview */}
              {existingReview.medias.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <ImageIcon className="h-3 w-3" />
                      <span>
                        {
                          existingReview.medias.filter(
                            (m) => m.type === "IMAGE"
                          ).length
                        }{" "}
                        ảnh
                      </span>
                    </div>
                    {existingReview.medias.some((m) => m.type === "VIDEO") && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Video className="h-3 w-3" />
                        <span>
                          {
                            existingReview.medias.filter(
                              (m) => m.type === "VIDEO"
                            ).length
                          }{" "}
                          video
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {existingReview.medias.slice(0, 3).map((media, index) => (
                      <div
                        key={index}
                        className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700"
                      >
                        {media.type === "IMAGE" ? (
                          <img
                            src={media.url || "/placeholder.svg"}
                            alt={`Review ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="h-4 w-4 text-gray-500" />
                          </div>
                        )}
                      </div>
                    ))}
                    {existingReview.medias.length > 3 && (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400">
                        +{existingReview.medias.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Review Meta */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Đánh giá lúc: {formatDate(existingReview.createdAt)}
                  </span>
                </div>
                {existingReview.updateCount > 0 && (
                  <div className="flex items-center space-x-1">
                    <RotateCcw className="h-3 w-3" />
                    <span>Đã sửa {existingReview.updateCount} lần</span>
                  </div>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReview(item.id, true)}
              className={`w-full transition-all duration-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 dark:hover:bg-blue-950 ${
                isHovered ? "scale-105" : ""
              }`}
              disabled={existingReview.updateCount > 0}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {existingReview.updateCount < 1
                ? "Sửa đánh giá"
                : "Bạn chỉ có thể sửa 1 lần"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* No Review State */}
            <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50/50 dark:bg-gray-800/30">
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Chưa có đánh giá
                  </p>
                  <p className="text-xs text-gray-500">
                    Chia sẻ trải nghiệm của bạn về sản phẩm này
                  </p>
                </div>
              </div>
            </div>

            {/* Review Button */}
            <Button
              onClick={() => onReview(item.id, false)}
              className={`w-full transition-all duration-300 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 ${
                isHovered ? "scale-105 shadow-lg" : ""
              }`}
            >
              <Star className="h-4 w-4 mr-2" />
              Đánh giá sản phẩm
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
