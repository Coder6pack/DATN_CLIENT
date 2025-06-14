import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UseFormSetError } from "react-hook-form";
import { EntityError } from "./http";
import { toast } from "@/hooks/use-toast";
import { authApiRequest } from "@/app/apiRequests/auth";
import { AccessTokenPayload } from "@/types/token.type";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Hàm đặt cookie
const setCookie = (name: string, value: string, seconds: number) => {
  const date = new Date();
  date.setTime(date.getTime() + seconds * 1000);
  const expires = `; expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Strict`;
};

export const decodeExpiresToken = (token: string) => {
  const { exp } = jwt.decode(token) as { exp: number };
  return exp;
};

export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const handleHttpErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error?.payload?.errors?.forEach((error) => {
      setError(error.field, {
        type: "server",
        message: error?.message,
      });
    });
  } else {
    toast({
      title: "Lỗi",
      description: error?.payload?.message ?? "Lỗi không xác định",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }
};

const isBrowser = typeof window !== "undefined";

export const getAccessTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("accessToken") : null;

export const getRefreshTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("refreshToken") : null;
export const setAccessTokenToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem("accessToken", value);

export const setRefreshTokenToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem("refreshToken", value);
export const removeTokensFromLocalStorage = () => {
  isBrowser && localStorage.removeItem("accessToken");
  isBrowser && localStorage.removeItem("refreshToken");
};

export const decodeToken = (token: string) => {
  return jwt.decode(token) as AccessTokenPayload;
};
export const checkAndRefreshToken = async (param?: {
  onError?: () => void;
  onSuccess?: (tokens: { accessToken: string; refreshToken: string }) => void;
}) => {
  const accessToken = getAccessTokenFromLocalStorage();
  const refreshToken = getRefreshTokenFromLocalStorage();

  // Nếu không có token, không thực hiện gì
  if (!accessToken || !refreshToken) {
    param?.onError?.();
    return;
  }

  try {
    // Giải mã token
    const decodedAccessToken = decodeToken(accessToken);
    const decodedRefreshToken = decodeToken(refreshToken);
    // Kiểm tra token hợp lệ
    if (!decodedAccessToken?.exp || !decodedRefreshToken?.exp) {
      console.error("Invalid token format");
      removeTokensFromLocalStorage();
      param?.onError?.();
      return;
    }

    const now = new Date().getTime() / 1000 - 1; // Thời gian hiện tại (giây)

    // Nếu refreshToken hết hạn, xóa token và gọi onError
    if (decodedRefreshToken.exp <= now) {
      console.log("Refresh token has expired");
      removeTokensFromLocalStorage();
      param?.onError?.();
      return;
    }

    // Kiểm tra nếu accessToken sắp hết hạn (dưới 1/3 thời gian sống)
    const tokenLifetime = decodedAccessToken.exp - decodedAccessToken.iat;
    if (decodedAccessToken.exp - now < tokenLifetime / 3) {
      try {
        // Gọi API làm mới token
        const res = await authApiRequest.refreshToken();
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          res.payload;

        // Cập nhật localStorage
        setAccessTokenToLocalStorage(newAccessToken);
        setRefreshTokenToLocalStorage(newRefreshToken);

        // Cập nhật cookies (nếu không phải HTTP-only)
        setCookie("accessToken", newAccessToken, tokenLifetime); // Thời gian sống của accessToken
        setCookie("refreshToken", newRefreshToken, 7 * 24 * 60 * 60); // Ví dụ: 7 ngày cho refreshToken

        // Gọi callback onSuccess với token mới
        param?.onSuccess?.({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
      } catch (error) {
        console.error("Failed to refresh token:", error);
        removeTokensFromLocalStorage();
        param?.onError?.();
      }
    }
  } catch (error) {
    console.error("Error decoding tokens:", error);
    removeTokensFromLocalStorage();
    param?.onError?.();
  }
};
//   onError?: () => void;
//   onSuccess?: () => void;
// }) => {
//   // Không nên đưa logic lấy access và refresh token ra khỏi cái function `checkAndRefreshToken`
//   // Vì để mỗi lần mà checkAndRefreshToken() được gọi thì chúng ta se có một access và refresh token mới
//   // Tránh hiện tượng bug nó lấy access và refresh token cũ ở lần đầu rồi gọi cho các lần tiếp theo
//   const accessToken = getAccessTokenFromLocalStorage();
//   const refreshToken = getRefreshTokenFromLocalStorage();
//   // Chưa đăng nhập thì cũng không cho chạy
//   if (!accessToken || !refreshToken) return;
//   const decodedAccessToken = jwt.decode(accessToken) as {
//     exp: number;
//     iat: number;
//   };
//   const decodedRefreshToken = jwt.decode(refreshToken) as {
//     exp: number;
//     iat: number;
//   };
//   // Thời điểm hết hạn của token là tính theo epoch time (s)
//   // Còn khi các bạn dùng cú pháp new Date().getTime() thì nó sẽ trả về epoch time (ms)
//   const now = Math.round(new Date().getTime() / 1000);
//   // trường hợp refresh token hết hạn thì không xử lý nữa
//   // trường hợp refresh token hết hạn thì cho logoutAdd commentMore actions
//   if (decodedRefreshToken.exp <= now) {
//     removeTokensFromLocalStorage();
//     return param?.onError && param.onError();
//   }
//   // Ví dụ access token của chúng ta có thời gian hết hạn là 10s
//   // thì mình sẽ kiểm tra còn 1/3 thời gian (3s) thì mình sẽ cho refresh token lại
//   // Thời gian còn lại sẽ tính dựa trên công thức: decodedAccessToken.exp - now
//   // Thời gian hết hạn của access token dựa trên công thức: decodedAccessToken.exp - decodedAccessToken.iat
//   if (
//     decodedAccessToken.exp - now <
//     (decodedAccessToken.exp - decodedAccessToken.iat) / 3
//   ) {
//     // Gọi API refresh token
//     try {
//       const res = await authApiRequest.refreshToken();
//       setAccessTokenToLocalStorage(res.payload.accessToken);
//       setRefreshTokenToLocalStorage(res.payload.refreshToken);
//       param?.onSuccess && param.onSuccess();
//     } catch (error) {
//       param?.onError && param.onError();
//     }
//   }
// };
export function formatCurrency(currency: number) {
  return new Intl.NumberFormat("de-DE").format(currency);
}

export function formatNumberToSocialStyle(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  })
    .format(value)
    .replace(".", ",")
    .toLowerCase();
}

async function convertBlobUrlsToFileArray(
  blobUrls: string[],
  fileNamePrefix: string = "file"
): Promise<File[]> {
  const filePromises = blobUrls.map(async (url, index) => {
    // Lấy Blob từ URL blob
    const response = await fetch(url);
    const blob = await response.blob();
    // Tạo tên tệp động (hoặc lấy từ metadata nếu có)
    const fileName = `${fileNamePrefix}${index}.${
      blob.type.split("/")[1] || "bin"
    }`;
    // Tạo File từ Blob
    return new File([blob], fileName, { type: blob.type });
  });
  // Chờ tất cả các promise hoàn thành
  return Promise.all(filePromises);
}
export async function addBlobUrlsToFormData(
  blobUrls: string[]
): Promise<FormData> {
  const formData = new FormData();
  const fileArray = await convertBlobUrlsToFileArray(blobUrls);
  fileArray.forEach((file) => {
    formData.append(`files`, file, file.name);
  });
  return formData;
}

async function convertBlobUrlToFileArray(
  blobUrl: string,
  fileName: string = "files"
): Promise<File[]> {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  const extension = blob.type.split("/")[1] || "bin";
  const finalFileName = `${fileName}.${extension}`;
  const file = new File([blob], finalFileName, { type: blob.type });
  return [file];
}
export async function addBlobUrlToFormData(
  blobUrls: string
): Promise<FormData> {
  const formData = new FormData();
  const fileArray = await convertBlobUrlToFileArray(blobUrls);
  fileArray.forEach((file) => {
    formData.append(`files`, file, file.name);
  });
  return formData;
}
