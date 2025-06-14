import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeToken } from "./lib/utils";
import { Role } from "./constants/type";

const managePath = ["/manage"];
const guestPath = ["/guest"];
const privatePaths = [...managePath, ...guestPath];
const unAuthPaths = ["/login", "/register", "/forgot-password"];

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const { pathname } = request.nextUrl;

  // 1.Chưa đăng nhập thì không cho vào private path
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("clearTokens", "true");
    return NextResponse.redirect(url);
  }

  // 2.Trường hợp đã đăng nhập
  if (refreshToken) {
    // 2.1 Nếu cố tình vào trang login thì sẽ redirect về trang chủ
    if (unAuthPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // 2.2 Nhưng accessToken lại hết hạn
    if (
      privatePaths.some((path) => pathname.startsWith(path)) &&
      !accessToken
    ) {
      const url = new URL("/refresh-token", request.url);
      // url.searchParams.set("refreshToken", refreshToken);
      url.searchParams.set("refreshToken", refreshToken);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    // 2.3 Vào không đúng role sẽ về trang chủ
    const role = decodeToken(refreshToken).roleName;
    // Guest nhưng cố vào route manage
    const isGuestGoToManagePath =
      role === Role.Client &&
      managePath.some((path) => pathname.startsWith(path));
    // Không phải guest nhưng cố vào route guest
    const isNotGuestGoToGuestPath =
      role !== Role.Client &&
      guestPath.some((path) => pathname.startsWith(path));

    if (isGuestGoToManagePath || isNotGuestGoToGuestPath) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/manage/:path*",
    "/guest/:path",
    "/forgot-password",
    "/login",
    "/register",
  ],
};
