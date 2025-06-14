"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLogoutMutation } from "../queries/useAuth";
import { useRouter } from "next/navigation";
import { handleHttpErrorApi } from "@/lib/utils";
import { useAccountMe } from "../queries/useAccount";
import { useAppContext } from "@/components/app-provider";

export default function DropdownAvatar() {
  const logoutMutation = useLogoutMutation();
  const { setIsAuth } = useAppContext();
  const { data: account } = useAccountMe();
  const route = useRouter();
  const handleLogout = async () => {
    try {
      logoutMutation.mutateAsync();
      setIsAuth(false);
      route.push("/");
    } catch (error) {
      handleHttpErrorApi({
        error,
      });
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Avatar>
            <AvatarImage
              src={account?.payload?.avatar ?? undefined}
              alt={account?.payload?.name ?? ""}
            />
            <AvatarFallback>
              {account?.payload?.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{account?.payload?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={"/manage/setting"} className="cursor-pointer">
            Cài đặt
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
