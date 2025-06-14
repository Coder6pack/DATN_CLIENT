import http from "@/lib/http";
import {
  ChangePasswordBodyType,
  UpdateMeBodyType,
} from "@/schemaValidations/profile.model";
import {
  CreateUserBodyType,
  GetUsersResType,
  UpdateUserBodyType,
} from "@/schemaValidations/user.model";
import { MessageResType } from "@/shared/models/response.model";
import {
  GetProfileType,
  UpdateUserProfileResType,
} from "@/shared/models/shared-user.model";

const accountApiRequest = {
  me: () => http.get<GetProfileType>("/profile"),
  sMe: (accessToken: string) =>
    http.get<GetProfileType>("/profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  updateMe: (body: UpdateMeBodyType) =>
    http.put<UpdateUserProfileResType>("/profile", body),
  changePassword: (body: ChangePasswordBodyType) =>
    http.put<MessageResType>("/profile/change-password", body),
  listAccount: () => http.get<GetUsersResType>("/user"),
  addAccount: (body: CreateUserBodyType) =>
    http.post<UpdateUserProfileResType>("/user", body),
  updateAccount: (id: number, body: UpdateUserBodyType) =>
    http.put<UpdateUserProfileResType>(`/user/${id}`, body),
  getAccount: (id: number) => http.get<UpdateUserProfileResType>(`/user/${id}`),
  deleteAccount: (id: number) => http.delete(`/user/${id}`),
};

export default accountApiRequest;
