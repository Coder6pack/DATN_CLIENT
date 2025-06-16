import { LogIn, LogOut, Package, Search, User } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState } from "react";
import Link from "next/link";

interface MobileMenuProps {
  isAuth: boolean;
  isMobileMenuOpen: boolean;
}

export default function MobileMenu({
  isAuth,
  isMobileMenuOpen,
}: MobileMenuProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const mockUser = {
    id: "1",
    name: "Nguyễn Văn An",
    email: "nguyenvanan@email.com",
    avatar: "/placeholder.svg?height=40&width=40&text=User",
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };
  return (
    <>
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 dark:border-gray-700 py-4 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col space-y-4">
            {/* Mobile Products Link */}
            <div className="pt-2">
              <Link
                href="/products"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium py-2"
              >
                Sản Phẩm
              </Link>
            </div>

            {/* Mobile Search */}
            <div className="pt-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300 dark:text-white"
                />
              </div>
            </div>
            {/* Mobile User Menu or Login */}
            {isAuth ? (
              <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-3 px-2 py-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={mockUser.avatar || "/placeholder.svg"}
                      alt={mockUser.name}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      {mockUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm dark:text-white">
                      {mockUser.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {mockUser.email}
                    </p>
                  </div>
                </div>
                <Link
                  href="/guest/profile"
                  className="flex items-center px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  <User className="h-4 w-4 mr-3" />
                  Hồ sơ cá nhân
                </Link>
                <Link
                  href="/guest/orders"
                  className="flex items-center px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  <Package className="h-4 w-4 mr-3" />
                  Đơn hàng của tôi
                </Link>
                <button className="flex items-center w-full px-2 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200">
                  <LogOut className="h-4 w-4 mr-3" />
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Button
                variant="default"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 transition-all duration-300 shadow-lg"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Đăng nhập
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
