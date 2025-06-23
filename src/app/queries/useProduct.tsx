import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import productApiRequest from "../apiRequests/product";
import {
  GetProductsQueryType,
  UpdateProductBodyType,
} from "@/schemaValidations/product.model";
import { PaginationQueryType } from "@/shared/models/request.model";

export const useListProducts = ({ page, limit }: PaginationQueryType) => {
  return useQuery({
    queryKey: ["list-products", page, limit],
    queryFn: () => productApiRequest.listProduct({ page, limit }),
  });
};

export const useFilterProducts = (params: GetProductsQueryType) => {
  return useQuery({
    queryKey: [
      "list-product",
      params.brandIds,
      params.categories,
      params.name,
      params.maxPrice,
      params.orderBy,
      params.page,
      params.sortBy,
    ],
    queryFn: () => productApiRequest.filterProduct(params),
    gcTime: 0,
    staleTime: 0,
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
