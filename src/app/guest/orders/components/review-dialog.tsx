// "use client";

// import { useState, useEffect } from "react"; // Thêm useEffect
// import { X, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import ProductReviewCard from "./product-review-card";
// import SingleProductReviewDialog from "./single-product-review-dialog";
// import { CreateReviewResType } from "@/schemaValidations/review.model";
// import { useGetReview } from "@/app/queries/useReview";

// interface OrderItem {
//   productId: number | null;
//   orderId: number | null;
//   id: number;
//   createdAt: Date;
//   image: string;
//   productName: string;
//   skuPrice: number;
//   skuValue: string;
//   skuId: number | null;
//   quantity: number;
// }

// interface ReviewDialogProps {
//   isOpen: boolean;
//   onClose: () => void;
//   orderItems: OrderItem[];
//   orderId: string;
//   existingReviews?: Record<number, CreateReviewResType>;
// }

// export default function ReviewDialog({
//   isOpen,
//   onClose,
//   orderItems,
//   orderId,
//   existingReviews = {},
// }: ReviewDialogProps) {
//   const [selectedProduct, setSelectedProduct] = useState<{
//     item: OrderItem;
//     isEdit: boolean;
//     existingReview?: CreateReviewResType;
//   } | null>(null);

//   const [reviews, setReviews] =
//     useState<Record<number, CreateReviewResType>>(existingReviews);
//   const [currentSlide, setCurrentSlide] = useState(0);

//   // Gọi useGetReview cho từng sản phẩm
//   const reviewQueries = orderItems.map((item) =>
//     useGetReview(
//       {
//         orderId,
//         productId: item.productId?.toString() || "",
//       },
//       !!orderId && !!item.productId // Chỉ gọi API nếu orderId và productId hợp lệ
//     )
//   );

//   // Cập nhật reviews từ dữ liệu API
//   useEffect(() => {
//     const newReviews: Record<number, CreateReviewResType> = {
//       ...existingReviews,
//     };
//     reviewQueries.forEach((query, index) => {
//       const item = orderItems[index];
//       if (query.data && item.productId) {
//         newReviews[item.id] = {
//           ...query.data.payload,
//           // Đảm bảo createdAt và updatedAt là đối tượng Date
//           createdAt: query.data.payload.createdAt
//             ? new Date(query.data.payload.createdAt)
//             : new Date(),
//           updatedAt: query.data.payload.updatedAt
//             ? new Date(query.data.payload.updatedAt)
//             : new Date(),
//           medias:
//             query.data.payload.medias?.map((media) => ({
//               ...media,
//               createdAt: media.createdAt
//                 ? new Date(media.createdAt)
//                 : new Date(),
//             })) || [],
//         };
//       }
//     });

//     // Chỉ cập nhật state nếu có thay đổi
//     if (JSON.stringify(newReviews) !== JSON.stringify(reviews)) {
//       setReviews(newReviews);
//     } else if (
//       Object.keys(reviews).length === 0 &&
//       Object.keys(existingReviews).length > 0
//     ) {
//       setReviews(existingReviews); // Khôi phục existingReviews nếu không có dữ liệu từ API
//     }
//   }, [reviewQueries, orderItems, existingReviews, reviews]);

//   const handleProductReview = (productId: number, isEdit: boolean) => {
//     const item = orderItems.find((item) => item.id === productId);
//     if (!item) return;

//     setSelectedProduct({
//       item,
//       isEdit,
//       existingReview: reviews[productId],
//     });
//   };

//   const handleReviewSubmitSuccess = (
//     productId: number,
//     review: CreateReviewResType
//   ) => {
//     setReviews((prev) => ({
//       ...prev,
//       [productId]: {
//         ...review,
//         // Đảm bảo createdAt và updatedAt là Date
//         createdAt: new Date(review.createdAt),
//         updatedAt: new Date(review.updatedAt),
//         medias:
//           review.medias?.map((media) => ({
//             ...media,
//             createdAt: new Date(media.createdAt),
//           })) || [],
//       },
//     }));
//     setSelectedProduct(null);
//   };
//   console.log(reviews);
//   const getReviewStats = () => {
//     const totalProducts = orderItems.length;
//     const reviewedProducts = Object.keys(reviews).length;
//     return { totalProducts, reviewedProducts };
//   };

//   const { totalProducts, reviewedProducts } = getReviewStats();

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % Math.ceil(orderItems.length / 2));
//   };

//   const prevSlide = () => {
//     setCurrentSlide(
//       (prev) =>
//         (prev - 1 + Math.ceil(orderItems.length / 2)) %
//         Math.ceil(orderItems.length / 2)
//     );
//   };

//   const renderProductCards = () => {
//     if (orderItems.length === 1) {
//       return (
//         <div className="flex justify-center">
//           <div className="w-full max-w-md">
//             <ProductReviewCard
//               item={orderItems[0]}
//               orderId={orderId}
//               existingReview={reviews[orderItems[0].id]}
//               onReview={handleProductReview}
//             />
//           </div>
//         </div>
//       );
//     }

//     const itemsPerSlide = 2;
//     const totalSlides = Math.ceil(orderItems.length / itemsPerSlide);
//     const startIndex = currentSlide * itemsPerSlide;
//     const endIndex = Math.min(startIndex + itemsPerSlide, orderItems.length);
//     const currentItems = orderItems.slice(startIndex, endIndex);

//     return (
//       <div className="space-y-4">
//         <div className="flex items-center justify-between">
//           <h4 className="text-lg font-semibold">
//             Sản phẩm trong đơn hàng ({orderItems.length})
//           </h4>
//           {totalSlides > 1 && (
//             <div className="flex items-center space-x-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={prevSlide}
//                 disabled={currentSlide === 0}
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </Button>
//               <span className="text-sm text-muted-foreground">
//                 {currentSlide + 1} / {totalSlides}
//               </span>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={nextSlide}
//                 disabled={currentSlide === totalSlides - 1}
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div>
//           )}
//         </div>

//         <div className="relative">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[300px]">
//             {currentItems.map((item) => (
//               <div
//                 key={item.id}
//                 className="transform transition-all duration-300 hover:scale-[1.02]"
//               >
//                 <ProductReviewCard
//                   item={item}
//                   orderId={orderId}
//                   existingReview={reviews[item.id]}
//                   onReview={handleProductReview}
//                 />
//               </div>
//             ))}
//           </div>

//           {totalSlides > 1 && (
//             <div className="flex justify-center mt-4 space-x-2">
//               {Array.from({ length: totalSlides }).map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrentSlide(index)}
//                   className={`w-2 h-2 rounded-full transition-colors ${
//                     index === currentSlide
//                       ? "bg-primary"
//                       : "bg-muted-foreground/30"
//                   }`}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <Dialog open={isOpen} onOpenChange={onClose}>
//         <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <MessageCircle className="h-5 w-5 text-primary" />
//                 <span>Đánh giá đơn hàng #{orderId}</span>
//               </div>
//             </DialogTitle>
//           </DialogHeader>
//           <DialogDescription>Xin hãy đánh giá</DialogDescription>
//           <div className="space-y-6">
//             <div className="text-center bg-muted/30 rounded-xl p-4">
//               <div className="flex items-center justify-center space-x-4 mb-2">
//                 <div className="text-2xl font-bold text-primary">
//                   {reviewedProducts}
//                 </div>
//                 <div className="text-muted-foreground">/</div>
//                 <div className="text-2xl font-bold">{totalProducts}</div>
//               </div>
//               <p className="text-sm text-muted-foreground">
//                 {reviewedProducts === totalProducts
//                   ? "Bạn đã đánh giá tất cả sản phẩm"
//                   : `Đã đánh giá ${reviewedProducts} trong ${totalProducts} sản phẩm`}
//               </p>
//             </div>

//             <div className="text-center">
//               <h3 className="text-xl font-semibold mb-2">
//                 Đánh giá từng sản phẩm
//               </h3>
//               <p className="text-muted-foreground">
//                 {orderItems.length === 1
//                   ? "Nhấn vào sản phẩm để bắt đầu đánh giá."
//                   : "Chọn sản phẩm bạn muốn đánh giá. Sử dụng nút điều hướng để xem thêm sản phẩm."}
//               </p>
//             </div>

//             {renderProductCards()}

//             <div className="text-center text-sm text-muted-foreground border-t pt-4">
//               <p>Bạn có thể đánh giá và sửa đánh giá bất cứ lúc nào</p>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {selectedProduct && (
//         <SingleProductReviewDialog
//           isOpen={!!selectedProduct}
//           onClose={() => setSelectedProduct(null)}
//           item={selectedProduct.item}
//           orderId={orderId}
//           existingReview={selectedProduct.existingReview}
//           isEdit={selectedProduct.isEdit}
//           onSubmitSuccess={(review) =>
//             handleReviewSubmitSuccess(selectedProduct.item.id, review)
//           }
//         />
//       )}
//     </>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { X, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductReviewCard from "./product-review-card";
import SingleProductReviewDialog from "./single-product-review-dialog";
import { CreateReviewResType } from "@/schemaValidations/review.model";
import { useGetReview } from "@/app/queries/useReview";

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

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: OrderItem[];
  orderId: string;
  existingReviews?: Record<number, CreateReviewResType>[];
}

export default function ReviewDialog({
  isOpen,
  onClose,
  orderItems,
  orderId,
  existingReviews = [],
}: ReviewDialogProps) {
  const [selectedProduct, setSelectedProduct] = useState<{
    item: OrderItem;
    isEdit: boolean;
    existingReview?: CreateReviewResType;
  } | null>(null);

  const [reviews, setReviews] =
    useState<Record<number, CreateReviewResType>[]>(existingReviews);

  const [currentSlide, setCurrentSlide] = useState(0);

  // Gọi useGetReview cho từng sản phẩm
  const reviewQueries = orderItems.map((item) =>
    useGetReview(
      {
        orderId,
        productId: item.productId?.toString() || "",
      },
      !!orderId && !!item.productId
    )
  );

  // Cập nhật reviews từ dữ liệu API
  useEffect(() => {
    const newReviews: Record<number, CreateReviewResType>[] = [...reviews];

    reviewQueries.forEach((query, index) => {
      const item = orderItems[index];
      if (query.data && item.productId) {
        const reviewData: CreateReviewResType = {
          ...query.data.payload,
          createdAt: query.data.payload.createdAt
            ? new Date(query.data.payload.createdAt)
            : new Date(),
          updatedAt: query.data.payload.updatedAt
            ? new Date(query.data.payload.updatedAt)
            : new Date(),
          medias:
            query.data.payload.medias?.map((media) => ({
              ...media,
              createdAt: media.createdAt
                ? new Date(media.createdAt)
                : new Date(),
            })) || [],
        };

        // Kiểm tra xem đã có record cho productId này chưa
        let existingRecord = newReviews.find((record) =>
          Object.prototype.hasOwnProperty.call(record, item.id)
        );

        if (!existingRecord) {
          // Tạo record mới nếu chưa tồn tại
          existingRecord = { [item.id]: reviewData };
          newReviews.push(existingRecord);
        } else {
          // Cập nhật record hiện có
          existingRecord[item.id] = reviewData;
        }
      }
    });

    // Cập nhật state nếu có thay đổi
    if (JSON.stringify(newReviews) !== JSON.stringify(reviews)) {
      setReviews(newReviews);
    } else if (
      newReviews.length === 0 &&
      existingReviews &&
      existingReviews.length > 0
    ) {
      setReviews(existingReviews);
    }
  }, [reviewQueries, orderItems, existingReviews, reviews]);

  const handleProductReview = (productId: number, isEdit: boolean) => {
    const item = orderItems.find((item) => item.id === productId);
    if (!item) return;

    // Tìm tất cả đánh giá cho sản phẩm này
    const productReviews = reviews
      .filter((record) =>
        Object.prototype.hasOwnProperty.call(record, productId)
      )
      .map((record) => record[productId]);

    // Chọn đánh giá đầu tiên (có thể điều chỉnh để chọn đánh giá cụ thể)
    const existingReview = productReviews[0] || undefined;

    setSelectedProduct({
      item,
      isEdit,
      existingReview,
    });
  };

  const handleReviewSubmitSuccess = (
    productId: number,
    review: CreateReviewResType
  ) => {
    setReviews((prev) => {
      const newReviews = [...prev];
      const reviewData: CreateReviewResType = {
        ...review,
        createdAt: new Date(review.createdAt),
        updatedAt: new Date(review.updatedAt),
        medias:
          review.medias?.map((media) => ({
            ...media,
            createdAt: new Date(media.createdAt),
          })) || [],
      };

      // Tìm record hiện có
      const existingRecordIndex = newReviews.findIndex((record) =>
        Object.prototype.hasOwnProperty.call(record, productId)
      );

      if (existingRecordIndex >= 0) {
        // Cập nhật record hiện có
        newReviews[existingRecordIndex] = {
          ...newReviews[existingRecordIndex],
          [productId]: reviewData,
        };
      } else {
        // Thêm record mới
        newReviews.push({ [productId]: reviewData });
      }

      return newReviews;
    });
    setSelectedProduct(null);
  };

  const getReviewStats = () => {
    const totalProducts = orderItems.length;
    // Đếm số lượng sản phẩm có ít nhất một đánh giá
    const reviewedProducts = new Set(
      reviews.flatMap((record) => Object.keys(record).map(Number))
    ).size;
    return { totalProducts, reviewedProducts };
  };

  const { totalProducts, reviewedProducts } = getReviewStats();

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(orderItems.length / 2));
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.ceil(orderItems.length / 2)) %
        Math.ceil(orderItems.length / 2)
    );
  };

  const renderProductCards = () => {
    if (orderItems.length === 1) {
      const item = orderItems[0];
      const productReviews = reviews
        .filter((record) =>
          Object.prototype.hasOwnProperty.call(record, item.id)
        )
        .map((record) => record[item.id]);

      return (
        <div className="flex justify-center">
          <div className="w-full max-w-md space-y-4">
            {productReviews.length > 0 ? (
              productReviews.map((review, index) => (
                <ProductReviewCard
                  key={`${item.id}-${index}`}
                  item={item}
                  orderId={orderId}
                  existingReview={review}
                  onReview={handleProductReview}
                />
              ))
            ) : (
              <ProductReviewCard
                item={item}
                orderId={orderId}
                existingReview={undefined}
                onReview={handleProductReview}
              />
            )}
          </div>
        </div>
      );
    }

    const itemsPerSlide = 2;
    const totalSlides = Math.ceil(orderItems.length / itemsPerSlide);
    const startIndex = currentSlide * itemsPerSlide;
    const endIndex = Math.min(startIndex + itemsPerSlide, orderItems.length);
    const currentItems = orderItems.slice(startIndex, endIndex);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold">
            Sản phẩm trong đơn hàng ({orderItems.length})
          </h4>
          {totalSlides > 1 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                disabled={currentSlide === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentSlide + 1} / {totalSlides}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                disabled={currentSlide === totalSlides - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[300px]">
            {currentItems.map((item) => {
              const productReviews = reviews
                .filter((record) =>
                  Object.prototype.hasOwnProperty.call(record, item.id)
                )
                .map((record) => record[item.id]);

              return productReviews.length > 0 ? (
                productReviews.map((review, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="transform transition-all duration-300 hover:scale-[1.02]"
                  >
                    <ProductReviewCard
                      item={item}
                      orderId={orderId}
                      existingReview={review}
                      onReview={handleProductReview}
                    />
                  </div>
                ))
              ) : (
                <div
                  key={item.id}
                  className="transform transition-all duration-300 hover:scale-[1.02]"
                >
                  <ProductReviewCard
                    item={item}
                    orderId={orderId}
                    existingReview={undefined}
                    onReview={handleProductReview}
                  />
                </div>
              );
            })}
          </div>

          {totalSlides > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide
                      ? "bg-primary"
                      : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            Three
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <span>Đánh giá đơn hàng #{orderId}</span>
              </div>
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>Xin hãy đánh giá</DialogDescription>
          <div className="space-y-6">
            <div className="text-center bg-muted/30 rounded-xl p-4">
              <div className="flex items-center justify-center space-x-4 mb-2">
                <div className="text-2xl font-bold text-primary">
                  {reviewedProducts}
                </div>
                <div className="text-muted-foreground">/</div>
                <div className="text-2xl font-bold">{totalProducts}</div>
              </div>
              <p className="text-sm text-muted-foreground">
                {reviewedProducts === totalProducts
                  ? "Bạn đã đánh giá tất cả sản phẩm"
                  : `Đã đánh giá ${reviewedProducts} trong ${totalProducts} sản phẩm`}
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                Đánh giá từng sản phẩm
              </h3>
              <p className="text-muted-foreground">
                {orderItems.length === 1
                  ? "Nhấn vào sản phẩm để bắt đầu đánh giá."
                  : "Chọn sản phẩm bạn muốn đánh giá. Sử dụng nút điều hướng để xem thêm sản phẩm."}
              </p>
            </div>

            {renderProductCards()}

            <div className="text-center text-sm text-muted-foreground border-t pt-4">
              <p>Bạn có thể đánh giá và sửa đánh giá bất cứ lúc nào</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedProduct && (
        <SingleProductReviewDialog
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          item={selectedProduct.item}
          orderId={orderId}
          existingReview={selectedProduct.existingReview}
          isEdit={selectedProduct.isEdit}
          onSubmitSuccess={(review) =>
            handleReviewSubmitSuccess(selectedProduct.item.id, review)
          }
        />
      )}
    </>
  );
}
