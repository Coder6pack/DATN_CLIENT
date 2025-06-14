import http from "@/lib/http";
import {
  CreateProductBodyType,
  GetProductDetailResType,
  GetProductsResType,
  GetProductsQueryType,
  UpdateProductBodyType,
} from "@/schemaValidations/product.model";

const productApiRequest = {
  listProduct: (params?: GetProductsQueryType) => {
    const query = new URLSearchParams();
    if (params) {
      for (const key in params) {
        const value = params[key as keyof GetProductsQueryType];
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => query.append(key, String(v)));
          } else {
            query.append(key, String(value));
          }
        }
      }
    }
    const queryString = query.toString();
    return http.get<GetProductsResType>(`/products${queryString ? `?${queryString}` : ''}`);
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
