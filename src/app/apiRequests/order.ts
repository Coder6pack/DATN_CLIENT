import http from "@/lib/http";
import {
  CreateOrderBodyType,
  CreateOrderResType,
  GetOrderDetailResType,
  GetOrderListResType,
  UpdateOrderBodyType,
  UpdateOrderResType,
} from "@/schemaValidations/order.model";

const orderApiRequest = {
  listOrder: () => http.get<GetOrderListResType>("/orders"),

  getOrder: (id: number) => http.get<GetOrderDetailResType>(`/orders/${id}`),

  createOrder: (body: CreateOrderBodyType) =>
    http.post<CreateOrderResType>("/orders", body),

  updateOrder: (id: number, body: UpdateOrderBodyType) =>
    http.put<UpdateOrderResType>(`/orders/update-status/${id}`, body),

  cancelOrder: (id: number, body: {}) => http.put(`/orders/${id}`, body),
};

export default orderApiRequest;
