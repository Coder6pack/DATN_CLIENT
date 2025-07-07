"use client";

import { useSetTokenToCookieMutation } from "@/app/queries/useAuth";
import { useAppContext } from "@/components/app-provider";
import { Role } from "@/constants/type";
import { toast } from "@/hooks/use-toast";
import { decodeToken } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

function OAuthCallback() {
  const { setIsAuth } = useAppContext();
  const { mutateAsync } = useSetTokenToCookieMutation();
  const router = useRouter();
  const count = useRef(0);
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const message = searchParams.get("message");
  useEffect(() => {
    if (accessToken && refreshToken) {
      if (count.current === 0) {
        mutateAsync({ accessToken, refreshToken })
          .then(() => {
            const { roleName } = decodeToken(accessToken);
            if (roleName === Role.Admin || roleName === Role.Seller) {
              setIsAuth(true);
              router.refresh();
              router.push("/manage/dashboard");
            }
            if (roleName === Role.Client) {
              setIsAuth(true);
              router.push("/");
              router.refresh();
            }
          })
          .catch((e) => {
            toast({
              description: e.message || "Có lỗi xảy ra",
            });
          });
        count.current++;
      }
    } else {
      console.log(message);
      toast({
        description: message || "Có lỗi xảy ra",
      });
    }
  }, [accessToken, refreshToken, router, message, mutateAsync]);
  return <div>login...</div>;
}
export default function OAuthPage() {
  return (
    <Suspense>
      <OAuthCallback />
    </Suspense>
  );
}
