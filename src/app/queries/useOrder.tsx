import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import orderApiRequest from "../apiRequests/order";
import {
  GetOrderListQueryType,
  UpdateOrderBodyType,
} from "@/schemaValidations/order.model";

export const useListOrderManage = (query: GetOrderListQueryType) => {
  return useQuery({
    queryKey: ["orders", query],
    queryFn: () => orderApiRequest.listOrderManage(query),
    retry: 1,
    // Tăng staleTime để giảm refetch liên tục (ví dụ: 5 phút)
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 10 * 60 * 1000, // 10 phút
    // Chỉ fetch khi page và limit hợp lệenabled: query.page > 0 && query.limit > 0,
    refetchOnWindowFocus: false, // Ngăn refetch khi focus window
    refetchOnMount: false, // Ngăn refetch khi mount lại
    refetchInterval: false, // Tắt refetch tự động theo interval
  });
};

export const useListOrder = (query: GetOrderListQueryType) => {
  return useQuery({
    queryKey: ["orders", query],
    queryFn: () => orderApiRequest.listOrder(query),
  });
};

export const useAddOrderMutation = () => {
  return useMutation({
    mutationFn: orderApiRequest.createOrder,
  });
};

export const useGetOrder = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => orderApiRequest.getOrder(id),
    enabled,
  });
};

export const useGetOrderManage = ({
  orderId,
  enabled,
}: {
  orderId: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => orderApiRequest.getOrderManage({ orderId }),
    enabled,
  });
};

export const useUpdateOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateOrderBodyType & { id: number }) =>
      orderApiRequest.updateOrder(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
};

export const useCancelOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: number) => orderApiRequest.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
};
