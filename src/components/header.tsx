"use client";
import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import DarkModeToggle from "./dark-mode-toggle";
import { useAppContext } from "./app-provider";
import MobileMenu from "./mobile-menu";
import DropdownUserAvatar from "./dropdown-use-avatar";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Áo Sơ Mi Premium",
      image: "/placeholder.svg?height=60&width=60&text=Áo",
      price: "1,299,000",
      quantity: 2,
      size: "L",
      color: "Trắng",
    },
    {
      id: 2,
      name: "Quần Jeans Skinny",
      image: "/placeholder.svg?height=60&width=60&text=Quần",
      price: "899,000",
      quantity: 1,
      size: "32",
      color: "Xanh",
    },
  ]);
  const [isCartHovered, setIsCartHovered] = useState(false);
  const { isAuth } = useAppContext();

  // Calculate total items in cart
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
          >
            FashionStore
          </Link>

          {/* Desktop Navigation & Search */}
          <div className="hidden lg:flex items-center flex-1 max-w-2xl mx-8">
            {/* Products Link */}
            <Link
              href="/products"
              className="relative text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium group mr-8"
            >
              Sản Phẩm
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-lg">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-6 py-2.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-full focus:outline-none focus:bg-white dark:focus:bg-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:shadow-lg transition-all duration-300 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-300"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {/* Shopping Cart */}
            <div
              className="relative group"
              onMouseEnter={() => setIsCartHovered(true)}
              onMouseLeave={() => setIsCartHovered(false)}
            >
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-300 group-hover:scale-110"
              >
                <ShoppingBag className="h-5 w-5" />
              </Button>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
                  {totalItems}
                </span>
              )}

              {/* Cart Dropdown */}
              {isAuth && (
                <div
                  className={`absolute right-0 mt-3 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transform transition-all duration-300 z-50 ${
                    isCartHovered
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible translate-y-2"
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg dark:text-white">
                        Giỏ hàng
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        {cartItems.length} sản phẩm
                      </span>
                    </div>

                    {cartItems.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground mb-2">
                          Giỏ hàng trống
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Thêm sản phẩm để bắt đầu mua sắm
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {cartItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                width={50}
                                height={50}
                                className="rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate dark:text-white">
                                  {item.name}
                                </h4>
                                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                  <span>Size: {item.size}</span>
                                  <span>•</span>
                                  <span>{item.color}</span>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                    {item.price}₫
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    x{item.quantity}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="border-t dark:border-gray-700 pt-4 mt-4">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-semibold dark:text-white">
                              Tổng cộng:
                            </span>
                            <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                              {cartItems
                                .reduce(
                                  (total, item) =>
                                    total +
                                    Number.parseInt(
                                      item.price.replace(/,/g, "")
                                    ) *
                                      item.quantity,
                                  0
                                )
                                .toLocaleString()}
                              ₫
                            </span>
                          </div>
                          <div className="space-y-2">
                            <Button
                              className="w-full bg-blue-600 hover:bg-blue-700"
                              size="sm"
                            >
                              Xem giỏ hàng
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full"
                              size="sm"
                            >
                              Thanh toán
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Login Button or User Avatar */}
            {isAuth ? (
              <DropdownUserAvatar />
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-4 py-2 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <span>Đăng nhập</span>
              </Link>
            )}
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <MobileMenu isMobileMenuOpen={isMobileMenuOpen} isAuth={isAuth} />
        )}
      </div>
    </header>
  );
}
