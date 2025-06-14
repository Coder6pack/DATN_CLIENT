import http from "@/lib/http";
import {
  CreateBrandBodyType,
  GetBrandDetailResType,
  GetBrandsResType,
  UpdateBrandBodyType,
} from "@/schemaValidations/brand.model";

const brandApiRequest = {
  listBrand: () => http.get<GetBrandsResType>("/brands"),
  getBrand: (id: number) => http.get<GetBrandDetailResType>(`/brands/${id}`),
  createBrand: (body: CreateBrandBodyType) =>
    http.post<GetBrandDetailResType>("/brands", body),
  updateBrand: (id: number, body: UpdateBrandBodyType) =>
    http.put<GetBrandDetailResType>(`/brands/${id}`, body),
  deleteBrand: (id: number) => http.delete(`/brands/${id}`),
};

export default brandApiRequest;
