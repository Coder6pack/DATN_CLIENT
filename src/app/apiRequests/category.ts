import http from "@/lib/http";
import {
  CreateCategoryBodyType,
  GetAllCategoriesResType,
  GetCategoryDetailResType,
  UpdateCategoryBodyType,
} from "@/schemaValidations/category.model";

const categoryApiRequest = {
  listCategory: () => http.get<GetAllCategoriesResType>("/categories"),
  getCategory: (id: number) =>
    http.get<GetCategoryDetailResType>(`/categories/${id}`),
  createCategory: (body: CreateCategoryBodyType) =>
    http.post<GetCategoryDetailResType>("/categories", body),
  updateCategory: (id: number, body: UpdateCategoryBodyType) =>
    http.put<GetCategoryDetailResType>(`/categories/${id}`, body),
  deleteCategory: (id: number) => http.delete(`/categories/${id}`),
};

export default categoryApiRequest;
