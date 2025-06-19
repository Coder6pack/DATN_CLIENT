import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import productApiRequest from "../apiRequests/product";
import { UpdateProductBodyType } from "@/schemaValidations/product.model";

interface ListProductsParams {
  page?: number;
  limit?: number;
}
export const useListProducts = ({ page, limit }: ListProductsParams) => {
  return useQuery({
    queryKey: ["list-products", page, limit],
    queryFn: () => productApiRequest.listProduct({ page, limit }),
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
