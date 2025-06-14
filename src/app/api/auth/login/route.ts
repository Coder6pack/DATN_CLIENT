import { authApiRequest } from "@/app/apiRequests/auth";
import { HttpError } from "@/lib/http";
import jwt from 'jsonwebtoken'
import { LoginBodyType } from "@/schemaValidations/auth.model";
import { cookies } from "next/headers";
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
//     expires: decodeExpiresToken(token) * 1000,
//   });
// };

// export async function POST(request: Request) {
//   const body = (await request.json()) as LoginBodyType;

//   try {
//     const { payload } = await authApiRequest.sLogin(body);
//     const { accessToken, refreshToken } = payload;
//     await setCookie({ name: "accessToken", token: accessToken });
//     await setCookie({ name: "refreshToken", token: refreshToken });
//     return Response.json(payload);
//   } catch (error) {
//     if (error instanceof HttpError) {
//       return new Response(error.message, {
//         status: error.status,
//       });
//     } else {
//       return new Response("Lỗi hệ thống", {
//         status: 500,
//       });
//     }
//   }
// }

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBodyType
  const cookieStore = await cookies()
  try {
    const { payload } = await authApiRequest.sLogin(body)
    const { accessToken, refreshToken } = payload
    const decodedAccessToken = jwt.decode(accessToken) as { exp: number }
    const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number }
    cookieStore.set('accessToken', accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedAccessToken.exp * 1000
    })
    cookieStore.set('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodedRefreshToken.exp * 1000
    })
    return Response.json(payload)
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status
      })
    } else {
      return Response.json(
        {
          message: 'Có lỗi xảy ra'
        },
        {
          status: 500
        }
      )
    }
  }
}