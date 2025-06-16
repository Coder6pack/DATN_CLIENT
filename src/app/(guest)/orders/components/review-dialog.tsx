"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Send, X, Camera, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface OrderItem {
  id: number;
  name: string;
  image: string;
  price: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: OrderItem[];
  orderId: string;
}

interface ItemReview {
  itemId: number;
  rating: number;
  comment: string;
  images: string[];
}

export default function ReviewDialog({
  isOpen,
  onClose,
  orderItems,
  orderId,
}: ReviewDialogProps) {
  const [reviews, setReviews] = useState<ItemReview[]>(
    orderItems.map((item) => ({
      itemId: item.id,
      rating: 0,
      comment: "",
      images: [],
    }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleRatingChange = (itemId: number, rating: number) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.itemId === itemId ? { ...review, rating } : review
      )
    );
  };

  const handleCommentChange = (itemId: number, comment: string) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.itemId === itemId ? { ...review, comment } : review
      )
    );
  };

  const handleSubmitReviews = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Here you would send reviews to your backend
    console.log("Submitting reviews:", reviews);

    setIsSubmitting(false);
    onClose();

    // Show success message (you can implement toast notification)
    alert(
      "Cảm ơn bạn đã đánh giá! Đánh giá của bạn sẽ giúp ích cho những khách hàng khác."
    );
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return "Rất không hài lòng";
      case 2:
        return "Không hài lòng";
      case 3:
        return "Bình thường";
      case 4:
        return "Hài lòng";
      case 5:
        return "Rất hài lòng";
      default:
        return "Chưa đánh giá";
    }
  };

  const canSubmit = reviews.every((review) => review.rating > 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <span>Đánh giá đơn hàng {orderId}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="text-sm font-medium">Đánh giá sản phẩm</span>
            </div>
          </div>

          {/* Review Form */}
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">
                Chia sẻ trải nghiệm của bạn
              </h3>
              <p className="text-muted-foreground">
                Đánh giá của bạn sẽ giúp những khách hàng khác có thêm thông tin
                để đưa ra quyết định mua hàng
              </p>
            </div>

            {orderItems.map((item, index) => {
              const review = reviews.find((r) => r.itemId === item.id);

              return (
                <Card
                  key={item.id}
                  className="border-2 rounded-2xl transition-all duration-300 hover:shadow-lg"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 mb-6">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2">
                          {item.name}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                          {item.size && (
                            <Badge variant="outline">Size: {item.size}</Badge>
                          )}
                          {item.color && (
                            <Badge variant="outline">Màu: {item.color}</Badge>
                          )}
                          <Badge variant="outline">SL: {item.quantity}</Badge>
                        </div>
                        <p className="text-lg font-semibold text-primary">
                          {item.price}₫
                        </p>
                      </div>
                    </div>

                    <Separator className="mb-6" />

                    {/* Rating Section */}
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="font-medium mb-3">
                          Bạn cảm thấy sản phẩm này như thế nào?
                        </p>
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleRatingChange(item.id, star)}
                              className="transition-all duration-200 hover:scale-110"
                            >
                              <Star
                                className={`h-8 w-8 ${
                                  star <= (review?.rating || 0)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300 hover:text-yellow-400"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        <p className="text-sm font-medium text-primary">
                          {getRatingText(review?.rating || 0)}
                        </p>
                      </div>

                      {/* Comment Section */}
                      {(review?.rating || 0) > 0 && (
                        <div className="space-y-3">
                          <label className="block text-sm font-medium">
                            Chia sẻ thêm về sản phẩm này (không bắt buộc)
                          </label>
                          <Textarea
                            placeholder="Hãy chia sẻ cảm nhận của bạn về chất lượng, thiết kế, độ vừa vặn... để giúp những khách hàng khác"
                            value={review?.comment || ""}
                            onChange={(e) =>
                              handleCommentChange(item.id, e.target.value)
                            }
                            className="min-h-[100px] resize-none rounded-xl border-2 focus:border-primary"
                          />
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                              Tối thiểu 10 ký tự để đánh giá có ý nghĩa
                            </span>
                            <span>{review?.comment?.length || 0}/500</span>
                          </div>
                        </div>
                      )}

                      {/* Photo Upload Section */}
                      {(review?.rating || 0) > 0 && (
                        <div className="space-y-3">
                          <label className="block text-sm font-medium">
                            Thêm hình ảnh (không bắt buộc)
                          </label>
                          <div className="border-2 border-dashed border-muted rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer">
                            <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Thêm hình ảnh thực tế của sản phẩm
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Tối đa 5 ảnh, mỗi ảnh không quá 5MB
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Submit Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {canSubmit ? (
                  <span className="text-green-600 font-medium">
                    ✓ Sẵn sàng gửi đánh giá
                  </span>
                ) : (
                  <span>Vui lòng đánh giá tất cả sản phẩm</span>
                )}
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Để sau
                </Button>
                <Button
                  onClick={handleSubmitReviews}
                  disabled={!canSubmit || isSubmitting}
                  className="px-8"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Gửi đánh giá
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
