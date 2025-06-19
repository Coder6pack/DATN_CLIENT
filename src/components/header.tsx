"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Menu, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import DarkModeToggle from "./dark-mode-toggle";
import { useAppContext } from "./app-provider";
import MobileMenu from "./mobile-menu";
import DropdownUserAvatar from "./dropdown-use-avatar";
import { useDeleteCartMutation, useListCart } from "@/app/queries/useCart";
import { toast } from "@/hooks/use-toast";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const { isAuth } = useAppContext();
  const { mutateAsync } = useDeleteCartMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartHovered, setIsCartHovered] = useState(false);
  const { data } = useListCart({ page: 1, limit: 10 });
  if (!data) {
    return null;
  }
  const listCart =
    data.payload.data.length === 0 ? [] : data.payload.data[0].cartItems;
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleDeleteCart = async (cartItem: number) => {
    // console.log("cartItem", cartItem);
    const result = await mutateAsync({ cartItemIds: [cartItem] });
    if (!result) {
      toast({
        description: "Xoá giỏ hàng thất bại",
      });
    }
  };
  // Hàm định dạng giá tiền
  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
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
              {listCart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
                  {listCart.reduce((sum, item) => sum + item.quantity, 0)}
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
                        {listCart.length} sản phẩm
                      </span>
                    </div>

                    {listCart.length === 0 || listCart === undefined ? (
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
                          {listCart.map((item) => {
                            const colorVariant =
                              item.sku.product.variants?.find(
                                (v) => v.value === "color"
                              )?.options[0];
                            const sizeVariant = item.sku.product.variants?.find(
                              (v) => v.value === "size"
                            )?.options[0];

                            return (
                              <div
                                key={item.skuId}
                                className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              >
                                <Image
                                  src={item.sku.image || "/placeholder.svg"}
                                  alt={item.sku.product.name}
                                  width={50}
                                  height={50}
                                  className="rounded-lg object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm truncate dark:text-white">
                                    {item.sku.product.name}
                                  </h4>
                                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                    {sizeVariant && (
                                      <span>Size: {sizeVariant}</span>
                                    )}
                                    {sizeVariant && colorVariant && (
                                      <span>•</span>
                                    )}
                                    {colorVariant && (
                                      <span>{colorVariant}</span>
                                    )}
                                  </div>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                      {formatPrice(
                                        item.sku.product.virtualPrice
                                      )}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      x{item.quantity}
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteCart(item.id)}
                                  className="hover:bg-red-100 dark:hover:bg-red-900"
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                        <div className="border-t dark:border-gray-700 pt-4 mt-4">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-semibold dark:text-white">
                              Tổng cộng:
                            </span>
                            <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                              {formatPrice(
                                listCart.reduce(
                                  (total, item) =>
                                    total + item.sku.price * item.quantity,
                                  0
                                )
                              )}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <Button
                              className="w-full bg-blue-600 hover:bg-blue-700"
                              size="sm"
                              asChild
                            >
                              <Link href="/cart">Xem giỏ hàng</Link>
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full"
                              size="sm"
                              asChild
                            >
                              <Link href="/checkout">Thanh toán</Link>
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
