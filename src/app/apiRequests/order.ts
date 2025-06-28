import http from "@/lib/http";
import {
  CreateOrderBodyType,
  CreateOrderResType,
  GetOrderDetailResType,
  GetOrderListQueryType,
  GetOrderListResType,
  UpdateOrderBodyType,
  UpdateOrderResType,
} from "@/schemaValidations/order.model";

function buildQueryString(params: GetOrderListQueryType): string {
  const queryParts: string[] = [];
  Object.entries(params).forEach(([key, value]) => {
    // Bỏ qua nếu value là undefined hoặc null
    if (value == null) return; // Thay value === undefined

    if (Array.isArray(value)) {
      if (value.length > 0) {
        queryParts.push(`${key}=${encodeURIComponent(value.join(","))}`);
      }
    } else {
      // Chuyển value thành chuỗi để tránh lỗi type, đảm bảo giá trị hợp lệ
      const encodedValue = encodeURIComponent(String(value));
      queryParts.push(`${key}=${encodedValue}`);
    }
  });
  return queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
}
const orderApiRequest = {
  listOrderManage: (query: GetOrderListQueryType) => {
    const queryString = buildQueryString(query);
    return http.get<GetOrderListResType>(`/orders/manage${queryString}`);
  },

  listOrder: (query: GetOrderListQueryType) => {
    const queryString = buildQueryString(query);
    return http.get<GetOrderListResType>(`/orders${queryString}`);
  },

  getOrder: (id: number) => http.get<GetOrderDetailResType>(`/orders/${id}`),

  createOrder: (body: CreateOrderBodyType) =>
    http.post<CreateOrderResType>("/orders", body),

  updateOrder: (id: number, body: UpdateOrderBodyType) =>
    http.put<UpdateOrderResType>(`/orders/update-status/${id}`, body),

  cancelOrder: (id: number, body: {}) => http.put(`/orders/${id}`, body),
};

export default orderApiRequest;
