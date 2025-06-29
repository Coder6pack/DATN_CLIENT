import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import reviewApiRequest from "../apiRequests/review";
import {
  GetReviewParamType,
  GetReviewsParamsType,
  UpdateReviewBodyType,
} from "@/schemaValidations/review.model";

export const useListReview = (params: GetReviewsParamsType) => {
  return useQuery({
    queryKey: ["reviews", params],
    queryFn: () => reviewApiRequest.listReview(params),
  });
};

export const useGetReview = (params: GetReviewParamType, enabled: boolean) => {
  return useQuery({
    queryKey: ["reviews", params],
    queryFn: () => reviewApiRequest.getDetail(params),
    enabled,
  });
};

export const useAddReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewApiRequest.createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
    },
  });
};

export const useUpdateReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateReviewBodyType & { id: number }) =>
      reviewApiRequest.updateReview({ productId: id }, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
    },
  });
};
