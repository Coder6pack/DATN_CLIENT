import http from "@/lib/http";
import {
  CreateCategoryBodyType,
  GetAllCategoriesResType,
  GetCategoryDetailResType,
  UpdateCategoryBodyType,
} from "@/schemaValidations/category.model";
import {
  CreateReviewBodyType,
  CreateReviewResType,
  GetReviewDetailResType,
  GetReviewParamType,
  GetReviewsParamsType,
  GetReviewsType,
  UpdateReviewBodyType,
  UpdateReviewResType,
} from "@/schemaValidations/review.model";

const reviewApiRequest = {
  listReview: (params: GetReviewsParamsType) =>
    http.get<GetReviewsType>(`/reviews/products/${params.productId}`),
  getDetail: (params: GetReviewParamType) =>
    http.get<GetReviewDetailResType>(
      `/reviews/${params.orderId}/${params.productId}`
    ),
  createReview: (body: CreateReviewBodyType) =>
    http.post<CreateReviewResType>("/reviews", body),
  updateReview: (params: GetReviewsParamsType, body: UpdateReviewBodyType) =>
    http.put<UpdateReviewResType>(`/reviews/${params.productId}`, body),
};

export default reviewApiRequest;
