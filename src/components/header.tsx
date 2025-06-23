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
import CartDropDown from "./cart-dropdown";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const { isAuth } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
            {isAuth && <CartDropDown />}

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
