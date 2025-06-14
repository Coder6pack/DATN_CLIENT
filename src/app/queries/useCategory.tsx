import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import categoryApiRequest from "../apiRequests/category";
import { UpdateCategoryBodyType } from "@/schemaValidations/category.model";

export const useListCategories = () => {
  return useQuery({
    queryKey: ["list-categories"],
    queryFn: categoryApiRequest.listCategory,
  });
};

export const useAddCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoryApiRequest.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-categories"],
      });
    },
  });
};

export const useGetCategory = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["brands", id],
    queryFn: () => categoryApiRequest.getCategory(id),
    enabled,
  });
};

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateCategoryBodyType & { id: number }) =>
      categoryApiRequest.updateCategory(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-categories"],
      });
    },
  });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoryApiRequest.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-categories"],
      });
    },
  });
};
