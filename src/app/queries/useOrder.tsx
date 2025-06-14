import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import orderApiRequest from "../apiRequests/order";
import { UpdateOrderBodyType } from "@/schemaValidations/order.model";

export const useListOrder = () => {
  return useQuery({
    queryKey: ["list-orders"],
    queryFn: orderApiRequest.listOrder,
  });
};

export const useAddOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderApiRequest.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-orders"],
      });
    },
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

export const useUpdateOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateOrderBodyType & { id: number }) =>
      orderApiRequest.updateOrder(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-orders"],
      });
    },
  });
};

export const useCancelOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: {} }) =>
      orderApiRequest.cancelOrder(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-orders"],
      });
    },
  });
};
