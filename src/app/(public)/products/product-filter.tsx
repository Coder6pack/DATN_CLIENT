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
import { useListBrand } from "@/app/queries/useBrand";
import { useListCategories } from "@/app/queries/useCategory";

interface ProductFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  showOnSale: boolean;
  setShowOnSale: (show: boolean) => void;
  onClearFilters: () => void;
}

export default function ProductFilters({
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  showOnSale,
  setShowOnSale,
  onClearFilters,
}: ProductFiltersProps) {
  const { data: cateList } = useListCategories();
  const { data: brandList } = useListBrand();
  if (!brandList || !cateList) {
    return;
  }
  const brands = brandList.payload.data;
  const categories = cateList.payload.data;
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
              <button
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                  selectedCategory === "Tất cả"
                    ? "bg-primary text-primary-foreground font-medium"
                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setSelectedCategory("Tất cả")}
              >
                Tất cả
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                    selectedCategory === category.name
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
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
                    setPriceRange([priceRange[0], Number(e.target.value)])
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
                <SelectItem value={"Tất cả"}>Tất cả</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id.toString()}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rating */}
          {/* <div className="space-y-3">
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
          </div> */}

          {/* Special Filters */}
          {/* <div className="space-y-3">
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
          </div> */}

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
