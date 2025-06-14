import http from "@/lib/http";
import {
  CreateProductBodyType,
  GetProductDetailResType,
  GetProductsResType,
  UpdateProductBodyType,
} from "@/schemaValidations/product.model";

const productApiRequest = {
  listProduct: () => http.get<GetProductsResType>("/products"),
  getProduct: (id: number) =>
    http.get<GetProductDetailResType>(`/products/${id}`),
  createProduct: (body: CreateProductBodyType) =>
    http.post<GetProductDetailResType>("/products", body),
  updateProduct: (id: number, body: UpdateProductBodyType) =>
    http.put<GetProductDetailResType>(`/products/${id}`, body),
  deleteProduct: (id: number) => http.delete(`/products/${id}`),
};

export default productApiRequest;
