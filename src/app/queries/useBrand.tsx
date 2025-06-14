import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import brandApiRequest from "../apiRequests/brand";
import { UpdateBrandBodyType } from "@/schemaValidations/brand.model";

export const useListBrand = () => {
  return useQuery({
    queryKey: ["list-brand"],
    queryFn: brandApiRequest.listBrand,
  });
};

export const useAddBrandMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: brandApiRequest.createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-brand"],
      });
    },
  });
};

export const useGetBrand = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["brands", id],
    queryFn: () => brandApiRequest.getBrand(id),
    enabled,
  });
};

export const useUpdateBrandMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateBrandBodyType & { id: number }) =>
      brandApiRequest.updateBrand(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-brand"],
      });
    },
  });
};

export const useDeleteBrandMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: brandApiRequest.deleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-brand"],
      });
    },
  });
};
