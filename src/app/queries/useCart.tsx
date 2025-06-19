import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import cartApiRequest from "../apiRequests/cart";
import {
  DeleteCartBodyType,
  UpdateCartItemBodyType,
} from "@/schemaValidations/cart.model";
import { PaginationQueryType } from "@/shared/models/request.model";

export const useListCart = ({ page, limit }: PaginationQueryType) => {
  return useQuery({
    queryKey: ["carts", page, limit],
    queryFn: () => cartApiRequest.listCart({ page, limit }),
  });
};

export const useAddCartMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cartApiRequest.createCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["carts"],
      });
    },
  });
};

export const useUpdateCartMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateCartItemBodyType & { id: number }) =>
      cartApiRequest.updateCart(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["carts"],
      });
    },
  });
};

export const useDeleteCartMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: DeleteCartBodyType) => cartApiRequest.deleteCart(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["carts"],
      });
    },
  });
};
