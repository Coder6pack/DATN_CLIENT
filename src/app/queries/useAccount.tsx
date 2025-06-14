import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import accountApiRequest from "../apiRequests/account";
import { UpdateUserBodyType } from "@/schemaValidations/user.model";

export const useAccountMe = () => {
  return useQuery({
    queryKey: ["account-me"],
    queryFn: accountApiRequest.me,
  });
};

export const useUpdateAccountProfileMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.updateMe,
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.changePassword,
  });
};

export const useListAccount = () => {
  return useQuery({
    queryKey: ["list-account"],
    queryFn: accountApiRequest.listAccount,
  });
};

export const useAddAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountApiRequest.addAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-account"],
      });
    },
  });
};

export const useGetAccount = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["accounts", id],
    queryFn: () => accountApiRequest.getAccount(id),
    enabled,
  });
};

export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateUserBodyType & { id: number }) =>
      accountApiRequest.updateAccount(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-account"],
      });
    },
  });
};

export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountApiRequest.deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-account"],
      });
    },
  });
};
