import http from "@/lib/http";
import { WebhookPaymentBodyType } from "@/schemaValidations/payment.model";
import { MessageResType } from "@/shared/models/response.model";

const paymentApiRequest = {
  receiver: (body: WebhookPaymentBodyType) =>
    http.post<MessageResType>("/payment/receiver", body),
};

export default paymentApiRequest;
