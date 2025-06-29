"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import DarkModeToggle from "./dark-mode-toggle";
import { useAppContext } from "./app-provider";
import MobileMenu from "./mobile-menu";
import DropdownUserAvatar from "./dropdown-use-avatar";
import CartDropDown from "./cart-dropdown";
import Image from "next/image";
import { useGetProduct, useListProducts } from "@/app/queries/useProduct";
import { useGetBrand } from "@/app/queries/useBrand";
import { useRouter } from "next/navigation";
interface SearchResult {
  name: string;
  createdAt: Date;
  id: number;
  basePrice: number;
  virtualPrice: number;
  brandId: number;
  images: string[];
  variants: {
    value: string;
    options: string[];
  }[];
  description: string;
  createdById: number | null;
  updatedById: number | null;
  deletedById: number | null;
  deletedAt: Date | null;
  updatedAt: Date;
}
function CateBrandReview({
  productId,
  brandId,
}: {
  productId: number;
  brandId: number;
}) {
  const { data: getProduct } = useGetProduct({
    id: productId,
    enabled: Boolean(productId),
  });
  const { data: getBrand } = useGetBrand({
    id: brandId,
    enabled: Boolean(brandId),
  });
  if (!getProduct || !getBrand) {
    return;
  }
  const product = getProduct.payload.categories;
  const brand = getBrand.payload.name;
  return (
    <p className="text-sm text-gray-500 dark:text-gray-400">
      {product.map((pro) => pro.name)} • {brand}
    </p>
  );
}

export default function Header() {
  const { isAuth } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data } = useListProducts({ page: 1, limit: 10 });
  // Handle search functionality
  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.trim().length === 0 || !data) {
        setIsSearching(false);
        return;
      }
      setIsSearching(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const filtered = data.payload.data.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSearchResults(filtered);
      setIsSearching(false);
    };

    const debounceTimer = setTimeout(handleSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Handle click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    console.log("query", query);
    setSearchQuery(query);
  };
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleProductClick = (product: SearchResult) => {
    setSearchQuery("");
    setIsSearchFocused(false);
    // Navigate to product page
    router.push(`/product/${product.id}`);
  };
  const showSearchDropdown =
    isSearchFocused && (searchQuery.length >= 2 || searchResults.length > 0);
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
            {/* Search Bar with Dropdown */}
            <div className="relative flex-1 max-w-lg" ref={searchRef}>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  className="w-full pl-12 pr-6 py-2.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-full focus:outline-none focus:bg-white dark:focus:bg-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:shadow-lg transition-all duration-300 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              {/* Search Dropdown */}
              {showSearchDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 max-h-96 overflow-y-auto z-50 animate-in slide-in-from-top-2 duration-200">
                  {isSearching ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-gray-600 dark:text-gray-400">
                        Đang tìm kiếm...
                      </span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Tìm thấy {searchResults.length} sản phẩm cho "
                          {searchQuery}"
                        </p>
                      </div>
                      <div className="py-2">
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleProductClick(product)}
                            className="w-full flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-left"
                          >
                            <Image
                              src={product.images[0] || "/avatar.jpg"}
                              alt={product.name}
                              width={60}
                              height={60}
                              className="rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="ml-4 flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                {product.name}
                              </h4>
                              <div className="flex items-center justify-between mt-1">
                                <CateBrandReview
                                  productId={product.id}
                                  brandId={product.brandId}
                                />
                                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                  {product.virtualPrice.toLocaleString()}₫
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
                        <Link
                          href={`/products?page=${1}&limit=${9}}&orderBy=desc&sortBy=createdAt&name=${searchQuery}`}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                          onClick={() => setIsSearchFocused(false)}
                        >
                          {searchQuery
                            ? `Xem tất cả kết quả cho "${searchQuery}" →`
                            : ""}
                        </Link>
                      </div>
                    </>
                  ) : searchQuery.length >= 2 ? (
                    <div className="px-4 py-8 text-center">
                      <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Không tìm thấy sản phẩm nào
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Thử tìm kiếm với từ khóa khác
                      </p>
                    </div>
                  ) : (
                    <div className="px-4 py-6">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Gợi ý tìm kiếm:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Áo sơ mi",
                          "Quần jeans",
                          "Váy",
                          "Áo thun",
                          "Blazer",
                        ].map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => {
                              setSearchQuery(suggestion);
                              setIsSearchFocused(true);
                            }}
                            className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
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
