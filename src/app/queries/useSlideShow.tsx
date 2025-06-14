import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UpdateBrandBodyType } from "@/schemaValidations/brand.model";
import slideShowApiRequest from "../apiRequests/slideShow";
import { UpdateSlideShowBodyType } from "@/schemaValidations/slide-show.model";

export const useListSlideShow = () => {
  return useQuery({
    queryKey: ["list-slide-show"],
    queryFn: slideShowApiRequest.listSlideShow,
  });
};

export const useAddSlideShowMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: slideShowApiRequest.createSlideShow,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-slide-show"],
      });
    },
  });
};

export const useGetSlideShow = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["slide-show", id],
    queryFn: () => slideShowApiRequest.getSlideShow(id),
    enabled,
  });
};

export const useUpdateSlideShowMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateSlideShowBodyType & { id: number }) =>
      slideShowApiRequest.updateSlideShow(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-slide-show"],
      });
    },
  });
};

export const useDeleteSlideShowMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: slideShowApiRequest.deleteSlideShow,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-slide-show"],
      });
    },
  });
};
