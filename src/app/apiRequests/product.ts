import http from "@/lib/http";
import {
  CreateProductBodyType,
  GetProductDetailResType,
  GetProductsQueryType,
  GetProductsResType,
  UpdateProductBodyType,
} from "@/schemaValidations/product.model";
import { PaginationQueryType } from "@/shared/models/request.model";

function buildQueryString(params: GetProductsQueryType): string {
  const queryParts: string[] = [];
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return; // Bỏ qua hoàn toàn nếu value là undefined
    if (Array.isArray(value)) {
      if (value.length > 0) {
        queryParts.push(`${key}=${encodeURIComponent(value.join(","))}`);
      }
    } else if (value !== "" || value !== null) {
      queryParts.push(`${key}=${encodeURIComponent(value)}`);
    }
  });
  return queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
}
const productApiRequest = {
  listProduct: ({ page, limit }: PaginationQueryType) =>
    http.get<GetProductsResType>(`/products?page=${page}&limit=${limit}`),
  filterProduct: (params: GetProductsQueryType) => {
    const queryString = buildQueryString(params);
    return http.get<GetProductsResType>(`/products${queryString}`);
  },
  getProduct: (id: number) =>
    http.get<GetProductDetailResType>(`/products/${id}`),
  createProduct: (body: CreateProductBodyType) =>
    http.post<GetProductDetailResType>("/products", body),
  updateProduct: (id: number, body: UpdateProductBodyType) =>
    http.put<GetProductDetailResType>(`/products/${id}`, body),
  deleteProduct: (id: number) => http.delete(`/products/${id}`),
};

export default productApiRequest;
