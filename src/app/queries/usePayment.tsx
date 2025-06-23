import { useMutation } from "@tanstack/react-query";
import paymentApiRequest from "../apiRequests/payment";

export const usePaymentReceiverMutation = () => {
  return useMutation({
    mutationFn: paymentApiRequest.receiver,
  });
};
