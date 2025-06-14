import http from "@/lib/http";
import {
  ForgotPasswordBodyType,
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
  RegisterBodyType,
  RegisterResType,
  SendOPTBodyType,
} from "@/schemaValidations/auth.model";

export const authApiRequest = {
  refreshTokenRequest: null as Promise<{
    status: number;
    payload: RefreshTokenResType;
  }> | null,
  sLogin: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),
  login: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", body, {
      baseUrl: "",
    }),
  sLogout: (
    body: LogoutBodyType & {
      accessToken: string;
    }
  ) =>
    http.post(
      "/auth/logout",
      {
        refreshToken: body.refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      }
    ),
  logout: () => http.post("/api/auth/logout", null, { baseUrl: "" }),
  sRefreshToken: (body: RefreshTokenBodyType) => {
    return http.post<RefreshTokenResType>("/auth/refresh-token", body);
  },

  async refreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest;
    }
    this.refreshTokenRequest = http.post<RefreshTokenResType>(
      "/api/auth/refresh-token",
      null,
      {
        baseUrl: "",
      }
    );
    const result = await this.refreshTokenRequest;
    this.refreshTokenRequest = null;
    return result;
  },

  async register(body: RegisterBodyType) {
    return http.post<RegisterResType>("/auth/register", body);
  },

  sendOTP: (body: SendOPTBodyType) => http.post("/auth/otp", body),

  forgotPassword: (body: ForgotPasswordBodyType) =>
    http.post("/auth/forgot-password", body),
};
