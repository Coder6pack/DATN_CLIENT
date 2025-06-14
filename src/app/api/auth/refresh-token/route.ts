// import { authApiRequest } from "@/app/apiRequests/auth";
// import { HttpError } from "@/lib/http";
// import { decodeExpiresToken } from "@/lib/utils";
// import { RefreshTokenPayload } from "@/types/token.type";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";
// export const setCookie = async ({
//   name,
//   token,
// }: {
//   name: string;
//   token: string;
// }) => {
//   const cookieStore = await cookies();
//   cookieStore.set({
//     name: name,
//     value: token,
//     httpOnly: true,
//     sameSite: "lax",
//     secure: true,
//     expires: decodeExpiresToken(token),
//   });
// };

// export async function POST(request: Request) {
//   const cookieStore = await cookies();
//   const refreshToken = cookieStore.get("refreshToken")?.value;
//   if (!refreshToken) {
//     return Response.json(
//       {
//         message: "Không tìm thấy refresh token",
//       },
//       {
//         status: 401,
//       }
//     );
//   }

//   try {
//     const { payload } = await authApiRequest.sRefreshToken({
//       refreshToken,
//     });
//     const { accessToken, refreshToken: newRefreshToken } = payload;
//     const decodedAccessToken = jwt.decode(accessToken) as RefreshTokenPayload;
//     const decodedRefreshToken = jwt.decode(
//       newRefreshToken
//     ) as RefreshTokenPayload;
//     cookieStore.set("accessToken", accessToken, {
//       path: "/",
//       httpOnly: true,
//       sameSite: "lax",
//       secure: true,
//       expires: decodedAccessToken.exp * 1000,
//     });
//     cookieStore.set("refreshToken", refreshToken, {
//       path: "/",
//       httpOnly: true,
//       sameSite: "lax",
//       secure: true,
//       expires: decodedRefreshToken.exp * 1000,
//     });
//     return Response.json(payload);
//   } catch (error) {
//     if (error instanceof HttpError) {
//       return new Response(error.message, {
//         status: error.status,
//       });
//     } else {
//       return new Response("Lỗi hệ thống", {
//         status: 401,
//       });
//     }
//   }
// }

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { authApiRequest } from "@/app/apiRequests/auth";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (!refreshToken) {
    return Response.json(
      {
        message: "Không tìm thấy refreshToken",
      },
      {
        status: 401,
      }
    );
  }
  try {
    const { payload } = await authApiRequest.sRefreshToken({
      refreshToken,
    });

    const decodedAccessToken = jwt.decode(payload.accessToken) as {
      exp: number;
    };
    const decodedRefreshToken = jwt.decode(payload.refreshToken) as {
      exp: number;
    };
    cookieStore.set("accessToken", payload.accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    });
    cookieStore.set("refreshToken", payload.refreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    });
    return Response.json(payload);
  } catch (error: any) {
    return Response.json(
      {
        message: error.message ?? "Có lỗi xảy ra",
      },
      {
        status: 401,
      }
    );
  }
}
