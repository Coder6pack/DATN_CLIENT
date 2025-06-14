import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import productApiRequest from "../apiRequests/product";
import { UpdateProductBodyType } from "@/schemaValidations/product.model";

export const useListProducts = () => {
  return useQuery({
    queryKey: ["list-products"],
    queryFn: productApiRequest.listProduct,
  });
};

export const useAddProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productApiRequest.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-products"],
      });
    },
  });
};

export const useGetProduct = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productApiRequest.getProduct(id),
    enabled,
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateProductBodyType & { id: number }) =>
      productApiRequest.updateProduct(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-products"],
      });
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productApiRequest.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-products"],
      });
    },
  });
};
