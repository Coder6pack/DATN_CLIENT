"use client";
import { Star, X, Check, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  selectedColors: string[];
  setSelectedColors: (colors: string[]) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  showOnSale: boolean;
  setShowOnSale: (show: boolean) => void;
  onClearFilters: () => void;
}

const categories = [
  "Tất cả",
  "Áo Sơ Mi",
  "Quần Jeans",
  "Váy Đầm",
  "Áo Khoác",
  "Giày Dép",
  "Phụ Kiện",
  "Quần Tây",
  "Áo Polo",
];

const brands = [
  "Tất cả",
  "FashionStore",
  "Zara",
  "H&M",
  "Uniqlo",
  "Nike",
  "Adidas",
];

const colors = [
  { name: "Đen", value: "#000000" },
  { name: "Trắng", value: "#FFFFFF" },
  { name: "Xanh Navy", value: "#1e3a8a" },
  { name: "Xám", value: "#6b7280" },
  { name: "Nâu", value: "#92400e" },
  { name: "Hồng", value: "#ec4899" },
  { name: "Xanh Lá", value: "#059669" },
  { name: "Đỏ", value: "#dc2626" },
];

export default function ProductFilters({
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  priceRange,
  setPriceRange,
  selectedColors,
  setSelectedColors,
  minRating,
  setMinRating,
  showOnSale,
  setShowOnSale,
  onClearFilters,
}: ProductFiltersProps) {
  return (
    <Card className="sticky top-8 border-2 rounded-3xl">
      <CardContent className="p-6 max-h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Bộ lọc</h2>
          <SlidersHorizontal className="h-6 w-6 text-primary" />
        </div>

        <div className="space-y-8">
          {/* Categories */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Danh mục</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Khoảng giá</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Từ
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([Number(e.target.value) || 0, priceRange[1]])
                  }
                  className="w-full px-3 py-2 border border-muted rounded-lg focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Đến
                </label>
                <input
                  type="number"
                  placeholder="3000000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([
                      priceRange[0],
                      Number(e.target.value) || 3000000,
                    ])
                  }
                  className="w-full px-3 py-2 border border-muted rounded-lg focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {priceRange[0].toLocaleString()}₫ -{" "}
              {priceRange[1].toLocaleString()}₫
            </div>
          </div>

          {/* Brands */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Thương hiệu</h3>
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn thương hiệu" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Colors */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Màu sắc</h3>
            <div className="grid grid-cols-4 gap-3">
              {colors.map((color) => (
                <button
                  key={color.name}
                  className={`relative w-12 h-12 rounded-full border-4 transition-all duration-300 ${
                    selectedColors.includes(color.name)
                      ? "border-primary scale-110 shadow-lg"
                      : "border-muted hover:border-muted-foreground hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => {
                    setSelectedColors(
                      selectedColors.includes(color.name)
                        ? selectedColors.filter((c) => c !== color.name)
                        : [...selectedColors, color.name]
                    );
                  }}
                  title={color.name}
                >
                  {selectedColors.includes(color.name) && (
                    <Check className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow-lg" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Đánh giá tối thiểu</h3>
            <div className="space-y-2">
              {[4, 3, 2, 1, 0].map((rating) => (
                <button
                  key={rating}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    minRating === rating
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setMinRating(rating)}
                >
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span>{rating > 0 ? `${rating}+ sao` : "Tất cả"}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Special Filters */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Bộ lọc đặc biệt</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <Checkbox
                  checked={showOnSale}
                  onCheckedChange={setShowOnSale}
                />
                <span className="text-sm font-medium">
                  Chỉ sản phẩm giảm giá
                </span>
              </label>
            </div>
          </div>

          {/* Clear Filters */}
          <Button variant="outline" className="w-full" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-2" />
            Xóa bộ lọc
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
