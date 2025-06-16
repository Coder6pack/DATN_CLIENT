"use client";

import { useState, useEffect } from "react";
import { Filter, Grid3X3, List, X, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Product } from "@/types";
import { mockAllProducts } from "@/lib/mockData";
import ProductFilters from "./product-filter";
import ProductCard from "./product-card";

const sortOptions = [
  { value: "newest", label: "Mới nhất" },
  { value: "price-low", label: "Giá thấp đến cao" },
  { value: "price-high", label: "Giá cao đến thấp" },
  { value: "rating", label: "Đánh giá cao nhất" },
  { value: "popular", label: "Phổ biến nhất" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedBrand, setSelectedBrand] = useState("Tất cả");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 3000000]);
  const [sortBy, setSortBy] = useState("newest");
  const [showOnSale, setShowOnSale] = useState(false);
  const [minRating, setMinRating] = useState(0);

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Generate more products for better filtering demo
      const extendedProducts = [
        ...mockAllProducts,
        ...Array.from({ length: 20 }, (_, i) => ({
          id: 100 + i,
          name: `Sản phẩm ${i + 1}`,
          price: `${(
            Math.floor(Math.random() * 2000) + 500
          ).toLocaleString()},000`,
          originalPrice:
            Math.random() > 0.5
              ? `${(
                  Math.floor(Math.random() * 1000) + 1000
                ).toLocaleString()},000`
              : null,
          image: `/placeholder.svg?height=400&width=300&text=Product+${i + 1}`,
          rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
          reviews: Math.floor(Math.random() * 200) + 50,
          category: [
            "Áo Sơ Mi",
            "Quần Jeans",
            "Váy Đầm",
            "Áo Khoác",
            "Giày Dép",
            "Phụ Kiện",
          ][Math.floor(Math.random() * 6)],
        })),
      ];

      setProducts(extendedProducts);
      setFilteredProducts(extendedProducts);
      setLoading(false);
    };

    loadProducts();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "Tất cả") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (selectedBrand !== "Tất cả") {
      filtered = filtered.filter((product) =>
        product.name.includes(selectedBrand)
      );
    }

    filtered = filtered.filter((product) => {
      const price = Number.parseInt(product.price.replace(/,/g, ""));
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (showOnSale) {
      filtered = filtered.filter((product) => product.originalPrice);
    }

    if (minRating > 0) {
      filtered = filtered.filter((product) => product.rating >= minRating);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (
            Number.parseInt(a.price.replace(/,/g, "")) -
            Number.parseInt(b.price.replace(/,/g, ""))
          );
        case "price-high":
          return (
            Number.parseInt(b.price.replace(/,/g, "")) -
            Number.parseInt(a.price.replace(/,/g, ""))
          );
        case "rating":
          return b.rating - a.rating;
        case "popular":
          return b.reviews - a.reviews;
        default:
          return b.id - a.id;
      }
    });

    setFilteredProducts(filtered);
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedBrand,
    selectedColors,
    priceRange,
    sortBy,
    showOnSale,
    minRating,
  ]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Tất cả");
    setSelectedBrand("Tất cả");
    setSelectedColors([]);
    setPriceRange([0, 3000000]);
    setSortBy("newest");
    setShowOnSale(false);
    setMinRating(0);
  };

  const handleProductClick = (product: Product) => {
    window.location.href = `/product/${product.id}`;
  };

  const handleAddToCart = (product: Product) => {
    console.log("Add to cart:", product);
  };

  const handleToggleFavorite = (product: Product) => {
    console.log("Toggle favorite:", product);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Bộ Sưu Tập Thời Trang</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Khám phá hàng nghìn sản phẩm thời trang cao cấp với chất lượng tuyệt
            vời
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <ProductFilters
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedColors={selectedColors}
              setSelectedColors={setSelectedColors}
              minRating={minRating}
              setMinRating={setMinRating}
              showOnSale={showOnSale}
              setShowOnSale={setShowOnSale}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center space-x-4">
                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <Filter className="h-4 w-4 mr-2" />
                      Bộ lọc
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Bộ lọc sản phẩm</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <ProductFilters
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        selectedBrand={selectedBrand}
                        setSelectedBrand={setSelectedBrand}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        selectedColors={selectedColors}
                        setSelectedColors={setSelectedColors}
                        minRating={minRating}
                        setMinRating={setMinRating}
                        showOnSale={showOnSale}
                        setShowOnSale={setShowOnSale}
                        onClearFilters={clearFilters}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {filteredProducts.length}
                  </span>{" "}
                  sản phẩm
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border border-muted rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategory !== "Tất cả" ||
              selectedBrand !== "Tất cả" ||
              showOnSale ||
              minRating > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategory !== "Tất cả" && (
                  <Badge variant="secondary" className="px-3 py-1">
                    {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory("Tất cả")}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedBrand !== "Tất cả" && (
                  <Badge variant="secondary" className="px-3 py-1">
                    {selectedBrand}
                    <button
                      onClick={() => setSelectedBrand("Tất cả")}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {showOnSale && (
                  <Badge variant="secondary" className="px-3 py-1">
                    Giảm giá
                    <button
                      onClick={() => setShowOnSale(false)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {minRating > 0 && (
                  <Badge variant="secondary" className="px-3 py-1">
                    {minRating}+ sao
                    <button
                      onClick={() => setMinRating(0)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Products Grid/List */}
            {loading ? (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="border-2 rounded-3xl overflow-hidden animate-pulse"
                  >
                    <div className="aspect-[4/5] bg-muted" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                      <div className="h-6 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-muted-foreground mb-6">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
                <Button onClick={clearFilters}>Xóa tất cả bộ lọc</Button>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    onProductClick={handleProductClick}
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}

            {/* Load More */}
            {filteredProducts.length > 0 && (
              <div className="text-center mt-12">
                <Button size="lg" variant="outline">
                  Xem thêm sản phẩm
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
