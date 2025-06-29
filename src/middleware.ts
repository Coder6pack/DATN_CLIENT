import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeToken } from "./lib/utils";
import { Role } from "./constants/type";

const managePath: (string | RegExp)[] = ["/manage"];
const guestPath: (string | RegExp)[] = ["/guest"];
const privatePaths: (string | RegExp)[] = [...managePath, ...guestPath];
const restrictedUnAuthPaths: (string | RegExp)[] = [
  "/login",
  "/register",
  "/logout",
  "/forgot-password",
];
const publicPaths: (string | RegExp)[] = [
  "/",
  "/products",
  /^\/product\/[^/]+$/,
];

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isUnAuthPath = (
    pathname: string,
    paths: (string | RegExp)[]
  ): boolean => {
    return paths.some((path) => {
      if (typeof path === "string") {
        return pathname === path; // Chỉ khớp chính xác, không dùng startsWith
      } else {
        return (path as RegExp).test(pathname);
      }
    });
  };

  const { pathname } = request.nextUrl;

  console.log(
    `Middleware: Path=${pathname}, RefreshToken=${!!refreshToken}, AccessToken=${!!accessToken}`
  );

  // 0. Cho phép truy cập các đường dẫn công khai chính xác
  if (isUnAuthPath(pathname, publicPaths)) {
    console.log(`Middleware: Allowing public path ${pathname}`);
    return NextResponse.next();
  }

  // 1. Chưa đăng nhập thì không cho vào private path
  if (
    privatePaths.some((path) =>
      typeof path === "string"
        ? pathname.startsWith(path)
        : (path as RegExp).test(pathname)
    ) &&
    !refreshToken
  ) {
    console.log(
      `Middleware: Redirecting to /login for private path ${pathname}`
    );
    const url = new URL("/login", request.url);
    url.searchParams.set("clearTokens", "true");
    return NextResponse.redirect(url);
  }

  // 2. Trường hợp đã đăng nhập
  if (refreshToken) {
    // 2.1 Nếu cố tình vào trang chỉ dành cho người chưa đăng nhập
    if (isUnAuthPath(pathname, restrictedUnAuthPaths)) {
      console.log(
        `Middleware: Redirecting to / from restricted path ${pathname}`
      );
      return NextResponse.redirect(new URL("/", request.url));
    }
    // 2.2 Nếu accessToken hết hạn (chỉ cho private path)
    if (
      privatePaths.some((path) =>
        typeof path === "string"
          ? pathname.startsWith(path)
          : (path as RegExp).test(pathname)
      ) &&
      !accessToken
    ) {
      console.log(`Middleware: Redirecting to /refresh-token for ${pathname}`);
      const url = new URL("/refresh-token", request.url);
      url.searchParams.set("refreshToken", refreshToken);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    // 2.3 Kiểm tra vai trò (role)
    let role: string;
    try {
      role = decodeToken(refreshToken).roleName;
    } catch (error) {
      console.error("Middleware: Invalid refresh token:", error);
      const url = new URL("/login", request.url);
      url.searchParams.set("clearTokens", "true");
      const response = NextResponse.redirect(url);
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }

    const isGuestGoToManagePath =
      role === Role.Client &&
      managePath.some((path) =>
        typeof path === "string"
          ? pathname.startsWith(path)
          : (path as RegExp).test(pathname)
      );
    const isNotGuestGoToGuestPath =
      role !== Role.Client &&
      guestPath.some((path) =>
        typeof path === "string"
          ? pathname.startsWith(path)
          : (path as RegExp).test(pathname)
      );

    if (isGuestGoToManagePath || isNotGuestGoToGuestPath) {
      console.log(
        `Middleware: Redirecting to / due to role mismatch for ${pathname}`
      );
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/manage/:path*",
    "/guest/:path*",
    "/forgot-password",
    "/logout",
    "/login",
    "/register",
    "/",
    "/products",
    "/product/:path",
    "/refresh-token",
  ],
};
