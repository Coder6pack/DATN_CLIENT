"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Star,
  Send,
  MessageCircle,
  Edit3,
  RotateCcw,
  Camera,
  CheckCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import MediaUpload, {
  ExistingMedia,
  isMediaFile,
  MediaFile,
  MediaItem,
  MediaType,
} from "./media-upload";
import {
  CreateReviewBodyType,
  CreateReviewResType,
  ReviewMediaType,
} from "@/schemaValidations/review.model";
import {
  useAddReviewMutation,
  useGetReview,
  useUpdateReviewMutation,
} from "@/app/queries/useReview";
import { useUploadFileMediaMutation } from "@/app/queries/useMedia";
import { toast } from "@/hooks/use-toast";

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

interface ReviewFormData {
  productId: number;
  orderId: number;
  rating: number;
  content: string;
  medias: MediaItem[];
}

interface SingleProductReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: OrderItem;
  orderId: string;
  existingReview?: CreateReviewResType;
  isEdit: boolean;
  onSubmitSuccess: (review: CreateReviewResType) => void;
}

export default function SingleProductReviewDialog({
  isOpen,
  onClose,
  item,
  orderId,
  existingReview,
  isEdit,
  onSubmitSuccess,
}: SingleProductReviewDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const initialMedias: MediaItem[] =
    existingReview?.medias?.map(
      (media): ExistingMedia => ({
        type: media.type as MediaType,
        url: media.url,
      })
    ) || [];

  const form = useForm<ReviewFormData>({
    defaultValues: {
      productId: item.productId || 0,
      orderId: Number.parseInt(orderId) || 0, // Ensure orderId is a number
      rating: existingReview?.rating || 0,
      content: existingReview?.content || "",
      medias: initialMedias,
    },
  });

  const { watch, setValue, handleSubmit, reset } = form;

  const watchedRating = watch("rating");
  const watchedContent = watch("content");
  const watchedMedias = watch("medias");

  const addReviewMutation = useAddReviewMutation();
  const updateReviewMutation = useUpdateReviewMutation();
  const uploadMediaMutation = useUploadFileMediaMutation();

  // Calculate progress
  const getProgress = () => {
    let progress = 0;
    if (watchedRating > 0) progress += 40;
    if (watchedContent.length >= 10) progress += 30;
    if (watchedMedias.length > 0) progress += 30;
    return Math.min(progress, 100);
  };

  // Track changes for edit mode
  useEffect(() => {
    if (isEdit && existingReview) {
      const hasRatingChange = watchedRating !== existingReview.rating;
      const hasContentChange = watchedContent !== existingReview.content;
      const hasNewFiles = watchedMedias.some((media) => isMediaFile(media));
      const currentExistingMedias = watchedMedias.filter(
        (media) => !isMediaFile(media)
      );
      const hasMediaRemoved =
        currentExistingMedias.length < (existingReview.medias?.length || 0);

      setHasChanges(
        hasRatingChange || hasContentChange || hasNewFiles || hasMediaRemoved
      );
    }
  }, [watchedRating, watchedContent, watchedMedias, existingReview, isEdit]);

  const handleRatingChange = (rating: number) => {
    setValue("rating", rating, { shouldDirty: true });
    if (rating > 0 && currentStep === 1) {
      setTimeout(() => setCurrentStep(2), 500);
    }
  };

  const handleMediasChange = (medias: MediaItem[]) => {
    setValue("medias", medias, { shouldDirty: true });
  };

  const handleReset = () => {
    reset({
      productId: item.productId || 0,
      orderId: Number.parseInt(orderId) || 0,
      rating: existingReview?.rating || 0,
      content: existingReview?.content || "",
      medias: initialMedias,
    });
    setCurrentStep(1);
  };

  const getRatingText = (rating: number) => {
    const texts = {
      1: { text: "Rất không hài lòng", emoji: "😞", color: "text-red-500" },
      2: { text: "Không hài lòng", emoji: "😕", color: "text-orange-500" },
      3: { text: "Bình thường", emoji: "😐", color: "text-yellow-500" },
      4: { text: "Hài lòng", emoji: "😊", color: "text-blue-500" },
      5: { text: "Rất hài lòng", emoji: "😍", color: "text-green-500" },
    };
    return (
      texts[rating as keyof typeof texts] || {
        text: "Chưa đánh giá",
        emoji: "⭐",
        color: "text-gray-500",
      }
    );
  };

  const uploadFiles = async (
    files: MediaFile[]
  ): Promise<Array<{ url: string; type: MediaType }>> => {
    try {
      const uploadPromises = files.map(async (mediaFile) => {
        const formData = new FormData();
        formData.append("files", mediaFile.file);
        const uploadMediaResult = await uploadMediaMutation.mutateAsync(
          formData
        );
        if (!uploadMediaResult.payload?.data?.[0]?.url) {
          throw new Error("Media upload failed: No URL returned");
        }
        return {
          url: uploadMediaResult.payload.data[0].url,
          type: mediaFile.type,
        };
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Error uploading files:", error);
      throw new Error("Failed to upload media files");
    }
  };

  const validateForm = (data: ReviewFormData): string | null => {
    if (data.rating < 1 || data.rating > 5) {
      return "Vui lòng chọn số sao từ 1 đến 5";
    }
    if (data.content.length < 10) {
      return "Bình luận phải có ít nhất 10 ký tự";
    }
    if (!data.productId || data.productId <= 0) {
      return "ID sản phẩm không hợp lệ";
    }
    if (!data.orderId || data.orderId <= 0) {
      return "ID đơn hàng không hợp lệ";
    }
    return null;
  };

  const onSubmit = async (data: ReviewFormData) => {
    // Manual validation
    const validationError = validateForm(data);
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      console.log(
        `${isEdit ? "Updating" : "Creating"} review with medias:`,
        data.medias
      );

      // Separate new files from existing medias
      const newFiles = data.medias.filter(isMediaFile);
      const existingMedias = data.medias.filter(
        (media): media is ExistingMedia => !isMediaFile(media)
      );

      // Upload new files and get URLs
      let uploadedNewMedias: Array<{ url: string; type: MediaType }> = [];
      if (newFiles.length > 0) {
        uploadedNewMedias = await uploadFiles(newFiles);
      }

      // Combine existing medias with newly uploaded ones
      const allMedias = [
        ...existingMedias.map((media) => ({
          url: media.url,
          type: media.type,
        })),
        ...uploadedNewMedias,
      ];

      // Create API payload with URLs instead of File objects
      const apiPayload: CreateReviewBodyType = {
        productId: data.productId,
        orderId: data.orderId,
        rating: data.rating,
        content: data.content,
        medias: allMedias,
      };

      console.log("API Payload:", apiPayload);

      // Send review to backend
      if (isEdit && existingReview && existingReview.updateCount < 1) {
        const result = await updateReviewMutation.mutateAsync({
          id: existingReview.id,
          ...apiPayload,
        });
        onSubmitSuccess(result.payload);
      } else {
        const result = await addReviewMutation.mutateAsync(apiPayload);
        onSubmitSuccess(result.payload);
      }
      onClose();

      const message = isEdit
        ? "Đánh giá đã được cập nhật thành công!"
        : "Cảm ơn bạn đã đánh giá! Đánh giá của bạn sẽ giúp ích cho những khách hàng khác.";
      toast({
        title: isEdit ? "Đã cập nhật" : "Đã thêm",
        description: message,
      });
    } catch (error: any) {
      console.error("Error submitting review:", error);
      let errorMessage = "Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.";
      if (error.message) {
        errorMessage = `Lỗi: ${error.message}`;
      } else if (error.status) {
        errorMessage = `Lỗi HTTP ${error.status}: ${
          error.message || "Không xác định"
        }`;
      }
      toast({
        title: "Lỗi",
        variant: "destructive",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = watchedRating > 0 && (!isEdit || hasChanges);
  const ratingInfo = getRatingText(watchedRating);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-auto p-0 gap-0">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <span>Đánh giá đơn hàng #{orderId}</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>Xin hãy đánh giá</DialogDescription>
        <div className="flex flex-col h-full">
          {/* Header với gradient background */}
          <div className="relative bg-gradient-to-r from-primary/10 via-blue-50 to-purple-50 dark:from-primary/20 dark:via-blue-900/20 dark:to-purple-900/20 p-6 border-b">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                {isEdit ? (
                  <Edit3 className="h-6 w-6 text-primary" />
                ) : (
                  <MessageCircle className="h-6 w-6 text-primary" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isEdit ? "Cập nhật đánh giá" : "Đánh giá sản phẩm"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Chia sẻ trải nghiệm của bạn với sản phẩm này
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Tiến độ hoàn thành</span>
                <span>{getProgress()}%</span>
              </div>
              <Progress value={getProgress()} className="h-2" />
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Product Hero Section */}
                <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 mb-6">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.productName}
                        width={80}
                        height={80}
                        className="rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2">
                          {item.productName}
                        </h4>
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
                  </CardContent>
                </Card>

                {/* Rating Section */}
                <Card className="border-2 rounded-3xl overflow-hidden">
                  <CardContent className="p-8">
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <div className="text-center space-y-6">
                            <div>
                              <h4 className="text-xl font-semibold mb-2">
                                {isEdit
                                  ? "Thay đổi đánh giá của bạn"
                                  : "Bạn cảm thấy sản phẩm này như thế nào?"}
                              </h4>
                              <p className="text-gray-600 dark:text-gray-300">
                                Nhấn vào số sao để đánh giá
                              </p>
                            </div>

                            <FormControl>
                              <div className="flex items-center justify-center space-x-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleRatingChange(star)}
                                    className="group transition-all duration-300 hover:scale-125 focus:outline-none focus:scale-125"
                                  >
                                    <Star
                                      className={`h-12 w-12 transition-all duration-300 ${
                                        star <= watchedRating
                                          ? "fill-yellow-400 text-yellow-400 drop-shadow-lg"
                                          : "text-gray-300 hover:text-yellow-400 hover:scale-110"
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </FormControl>

                            {watchedRating > 0 && (
                              <div className="animate-fade-in">
                                <div className={`text-2xl mb-2`}>
                                  {ratingInfo.emoji}
                                </div>
                                <p
                                  className={`text-lg font-semibold ${ratingInfo.color}`}
                                >
                                  {ratingInfo.text}
                                </p>
                              </div>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Comment & Media Section - Only show when rating is selected */}
                {watchedRating > 0 && (
                  <div className="space-y-6 animate-slide-up">
                    {/* Comment Section */}
                    <Card className="border-2 rounded-3xl">
                      <CardContent className="p-6">
                        <FormField
                          control={form.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg font-semibold flex items-center space-x-2">
                                <MessageCircle className="h-5 w-5 text-primary" />
                                <span>
                                  {isEdit
                                    ? "Cập nhật bình luận"
                                    : "Chia sẻ chi tiết về sản phẩm"}
                                </span>
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Hãy chia sẻ cảm nhận của bạn về chất lượng, thiết kế, độ vừa vặn, màu sắc... để giúp những khách hàng khác có thêm thông tin hữu ích"
                                  className="min-h-[120px] resize-none rounded-2xl border-2 focus:border-primary text-base leading-relaxed"
                                  {...field}
                                />
                              </FormControl>
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-4 text-gray-500">
                                  <span
                                    className={
                                      watchedContent.length >= 10
                                        ? "text-green-600"
                                        : ""
                                    }
                                  >
                                    {watchedContent.length >= 10 ? "✓" : "•"}{" "}
                                    Tối thiểu 10 ký tự
                                  </span>
                                </div>
                                <span className="text-gray-400">
                                  {field.value?.length || 0}/500
                                </span>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>

                    {/* Media Upload Section */}
                    <Card className="border-2 rounded-3xl">
                      <CardContent className="p-6">
                        <FormField
                          control={form.control}
                          name="medias"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg font-semibold flex items-center space-x-2">
                                <Camera className="h-5 w-5 text-primary" />
                                <span>
                                  {isEdit
                                    ? "Cập nhật ảnh/video"
                                    : "Thêm ảnh hoặc video"}
                                  <span className="text-sm font-normal text-gray-500 ml-2">
                                    (không bắt buộc)
                                  </span>
                                </span>
                              </FormLabel>
                              <FormControl>
                                <MediaUpload
                                  value={field.value}
                                  onChange={handleMediasChange}
                                  maxFiles={5}
                                  maxFileSize={10}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}
              </form>
            </Form>
          </div>

          {/* Footer Actions */}
          <div className="border-t bg-gray-50 dark:bg-gray-800/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {isEdit && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={isSubmitting}
                    className="flex items-center space-x-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Khôi phục</span>
                  </Button>
                )}
                <div className="text-sm">
                  {canSubmit ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">
                        {isEdit ? "Sẵn sàng cập nhật" : "Sẵn sàng gửi đánh giá"}
                      </span>
                    </div>
                  ) : isEdit ? (
                    <span className="text-gray-500">Chưa có thay đổi nào</span>
                  ) : (
                    <span className="text-gray-500">
                      Vui lòng chọn số sao để tiếp tục
                    </span>
                  )}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={!canSubmit || isSubmitting}
                  className="px-8 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      {isEdit ? "Đang cập nhật..." : "Đang gửi..."}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {isEdit ? "Cập nhật đánh giá" : "Gửi đánh giá"}
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
