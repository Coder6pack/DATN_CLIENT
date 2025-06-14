import { useMutation } from "@tanstack/react-query";
import { authApiRequest } from "../apiRequests/auth";

export const useLoginMutation = () =>
  useMutation({
    mutationFn: authApiRequest.login,
  });

export const useLogoutMutation = () =>
  useMutation({
    mutationFn: authApiRequest.logout,
  });

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: authApiRequest.register,
  });

export const useSendOTPMutation = () =>
  useMutation({
    mutationFn: authApiRequest.sendOTP,
  });

export const useForgotPasswordMutation = () =>
  useMutation({
    mutationFn: authApiRequest.forgotPassword,
  });
