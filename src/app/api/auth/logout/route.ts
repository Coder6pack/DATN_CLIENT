import { authApiRequest } from "@/app/apiRequests/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  if (!accessToken || !refreshToken) {
    return Response.json(
      { message: "Lỗi không nhận được accessToken và refreshToken" },
      {
        status: 200,
      }
    );
  }
  try {
    const result = await authApiRequest.sLogout({
      refreshToken,
      accessToken,
    });
    return Response.json(result.payload);
  } catch (error) {
    return Response.json("Lỗi khi gọi API đến hệ thống", {
      status: 200,
    });
  }
}
