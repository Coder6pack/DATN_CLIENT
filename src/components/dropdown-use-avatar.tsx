"use client";
import { Heart, LogOut, Package, Settings, User } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useLogoutMutation } from "@/app/queries/useAuth";
import { useAppContext } from "./app-provider";
import { useAccountMe } from "@/app/queries/useAccount";
import { handleHttpErrorApi } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function DropdownUserAvatar() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const logoutMutation = useLogoutMutation();
  const { setIsAuth } = useAppContext();
  const { data } = useAccountMe();

  const account = data?.payload;
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
    <div className="relative">
      <Button
        variant="ghost"
        className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2 transition-all duration-300"
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={account?.avatar || "/placeholder.svg"}
            alt={account?.name}
          />
          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm">
            {account?.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="hidden sm:block text-sm font-medium dark:text-white">
          {account?.name}
        </span>
      </Button>

      {/* User Dropdown Menu */}
      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={account?.avatar || "/placeholder.svg"}
                  alt={account?.name}
                />
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  {account?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm dark:text-white">
                  {account?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {account?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/profile"
              className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <User className="h-4 w-4 mr-3" />
              Hồ sơ cá nhân
            </Link>
            <Link
              href="/orders"
              className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <Package className="h-4 w-4 mr-3" />
              Đơn hàng của tôi
            </Link>
            <Link
              href="#"
              className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <Heart className="h-4 w-4 mr-3" />
              Sản phẩm yêu thích
            </Link>
            <Link
              href="#"
              className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <Settings className="h-4 w-4 mr-3" />
              Cài đặt
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 dark:border-gray-700 pt-2">
            <button
              className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
