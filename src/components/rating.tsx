import { useListReview } from "@/app/queries/useReview";
import { Star } from "lucide-react";

export default function Rating({ productId }: { productId: number }) {
  const { data } = useListReview({ productId });
  if (!data) {
    return;
  }
  const getReviews = data.payload.data;
  const avgRating =
    getReviews.reduce((acc, item) => acc + item.rating, 0) / getReviews.length;
  if (Number.isNaN(avgRating)) {
    return (
      <div className="flex items-center mb-3">
        <div className="flex items-center">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="ml-1 text-sm font-medium">{0}</span>
        </div>
        <span className="text-sm text-muted-foreground ml-2">
          ({0} đánh giá)
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center mb-3">
      <div className="flex items-center">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="ml-1 text-sm font-medium">{avgRating}</span>
      </div>
      <span className="text-sm text-muted-foreground ml-2">
        ({getReviews.length} đánh giá)
      </span>
    </div>
  );
}
