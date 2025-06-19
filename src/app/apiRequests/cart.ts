import http from "@/lib/http";
import {
  AddToCartBodyType,
  CartItemType,
  DeleteCartBodyType,
  GetCartResType,
  UpdateCartItemBodyType,
} from "@/schemaValidations/cart.model";
import { PaginationQueryType } from "@/shared/models/request.model";

const cartApiRequest = {
  listCart: (query: PaginationQueryType) =>
    http.get<GetCartResType>(`/cart?page=${query.page}&limit=${query.limit}`),
  createCart: (body: AddToCartBodyType) =>
    http.post<CartItemType>("/cart", body),
  updateCart: (id: number, body: UpdateCartItemBodyType) =>
    http.put<CartItemType>(`/cart/${id}`, body),
  deleteCart: (body: DeleteCartBodyType) => http.post(`/cart/delete`, body),
};

export default cartApiRequest;
