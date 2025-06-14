"use client";

import type React from "react";

// Component mới để quản lý danh sách SKUs (Stock Keeping Units)
// Nhận variants từ VariantSettingsField và tạo ra danh sách SKUs với giá, tồn kho, hình ảnh

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
// Type definition cho SKU theo yêu cầu
interface SkuItem {
  value?: string | undefined;
  price?: number | undefined;
  stock?: number | undefined;
  image?: string | undefined;
}
// Props cho component SkuListField
interface SkuListFieldProps {
  value?: SkuItem[]; // Mảng SKUs từ form
  onChange: (value: SkuItem[]) => void; // Callback để cập nhật form
  variants?: {
    value?: string | undefined;
    options?: (string | undefined)[] | undefined;
  }[]; // Variants từ VariantSettingsField để tạo combinations
  className?: string;
}
export default function SkuListField({
  value = [],
  onChange,
  variants = [],
  className,
}: SkuListFieldProps) {
  // State để quản lý việc mở rộng/thu gọn danh sách
  const [expandAll, setExpandAll] = useState(false);
  // Refs cho file inputs của từng SKU
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  // Ref để track previous variants để tránh unnecessary updates
  const prevVariantsRef = useRef<string>("");
  // Memoize function để tạo ra tất cả combinations từ variants
  const combinations = useMemo((): string[] => {
    if (!variants || variants.length === 0) return [];
    const combos: string[][] = [[]];
    // Tạo combinations từ tất cả variants
    for (const variant of variants) {
      if (!variant.options || variant.options.length === 0) continue;
      const newCombinations: string[][] = [];
      for (const combination of combos) {
        for (const option of variant.options) {
          if (option) {
            newCombinations.push([...combination, option]);
          }
        }
      }
      combos.splice(0, combos.length, ...newCombinations);
    }
    // Chuyển combinations thành strings
    return combos.map((combo) => combo.join("-"));
  }, [variants]);
  // Memoize SKUs dựa trên combinations và existing value
  const skus = useMemo((): SkuItem[] => {
    if (combinations.length === 0) return [];
    // Tạo SKUs mới từ combinations
    return combinations.map((combo) => {
      // Tìm SKU hiện tại nếu đã tồn tại trong value
      const existingSku = value.find((sku) => sku.value === combo);
      // Giữ lại data cũ nếu có, hoặc tạo mới
      return {
        value: combo,
        price: existingSku?.price,
        stock: existingSku?.stock,
        image: existingSku?.image,
      };
    });
  }, [combinations, value]);
  // Chỉ sync với parent khi combinations thay đổi (không phụ thuộc vào value để tránh vòng lặp)
  useEffect(() => {
    const variantsString = JSON.stringify(variants);
    // Chỉ update khi variants thực sự thay đổi
    if (variantsString !== prevVariantsRef.current) {
      prevVariantsRef.current = variantsString;
      if (combinations.length === 0) {
        onChange([]);
      } else {
        // Tạo SKUs mới từ combinations
        const newSkus: SkuItem[] = combinations.map((combo) => {
          // Tìm SKU hiện tại nếu đã tồn tại trong value
          const existingSku = value.find((sku) => sku.value === combo);
          // Giữ lại data cũ nếu có, hoặc tạo mới
          return {
            value: combo,
            price: existingSku?.price,
            stock: existingSku?.stock,
            image: existingSku?.image,
          };
        });
        onChange(newSkus);
      }
    }
  }, [combinations, onChange, variants]); // Không phụ thuộc vào value
  // Function để cập nhật giá của SKU
  const updateSkuPrice = useCallback(
    (index: number, price: string) => {
      const numericPrice = price
        ? Number.parseFloat(price.replace(/[^\d.]/g, ""))
        : undefined;
      const updatedSkus = skus.map((sku, i) =>
        i === index ? { ...sku, price: numericPrice } : sku
      );
      onChange(updatedSkus);
    },
    [skus, onChange]
  );
  // Function để cập nhật tồn kho của SKU
  const updateSkuStock = useCallback(
    (index: number, stock: string) => {
      const numericStock = stock ? Number.parseInt(stock, 10) : undefined;
      const updatedSkus = skus.map((sku, i) =>
        i === index ? { ...sku, stock: numericStock } : sku
      );
      onChange(updatedSkus);
    },
    [skus, onChange]
  );
  // Function để xử lý upload hình ảnh cho SKU
  const handleSkuImageUpload = useCallback(
    (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        const updatedSkus = skus.map((sku, i) =>
          i === index ? { ...sku, image: imageUrl } : sku
        );
        onChange(updatedSkus);
      }
    },
    [skus, onChange]
  );
  // Function để xóa hình ảnh của SKU
  const removeSkuImage = useCallback(
    (index: number) => {
      const updatedSkus = skus.map((sku, i) =>
        i === index ? { ...sku, image: undefined } : sku
      );
      onChange(updatedSkus);
    },
    [skus, onChange]
  );
  // Nếu không có variants, hiển thị thông báo
  if (!variants || variants.length === 0 || skus.length === 0) {
    return (
      <div
        className={`text-center py-8 border-2 border-dashed rounded-lg ${className}`}
      >
        <div className="text-muted-foreground">
          There are no variations. Please add a variation above to create a SKU.
        </div>
      </div>
    );
  }
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header với thông tin tổng quan và nút mở rộng */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">
          SKUs list ({skus.length > 1 ? " products" : " product"})
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setExpandAll(!expandAll)}
        >
          {expandAll ? "Collapse all" : "Expand all"}
        </Button>
      </div>
      {/* Header của bảng */}
      <div className="grid grid-cols-4 gap-4 font-medium text-sm text-muted-foreground pb-2 border-b">
        <div>Variant</div>
        <div>Price</div>
        <div>Stock</div>
        <div>Image</div>
      </div>
      {/* Danh sách SKUs */}
      <div className="space-y-3">
        {(expandAll ? skus : skus.slice(0, 5)).map((sku, index) => (
          <div
            key={sku.value || index}
            className="grid grid-cols-4 gap-4 items-center py-3 border rounded-lg p-3"
          >
            {/* Cột 1: Hiển thị tên biến thể */}
            <div className="flex flex-wrap gap-1">
              {sku.value?.split("-").map((part, partIndex) => (
                <Badge key={partIndex} variant="secondary" className="text-xs">
                  {part}
                </Badge>
              ))}
            </div>
            {/* Cột 2: Input giá */}
            <div>
              <Input
                type="text"
                placeholder="0"
                className="w-full"
                value={sku.price?.toString() ?? "0"} // Đảm bảo luôn là chuỗi
                onChange={(e) => updateSkuPrice(index, e.target.value)}
                onBlur={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, "");
                  updateSkuPrice(index, value || "0");
                }}
              />
            </div>
            {/* Cột 3: Input tồn kho */}
            <div>
              <Input
                type="number"
                placeholder="0"
                className="w-full"
                min="0"
                value={sku.stock || ""}
                onChange={(e) => updateSkuStock(index, e.target.value)}
              />
            </div>
            {/* Cột 4: Upload hình ảnh */}
            <div>
              <div className="relative">
                {sku.image ? (
                  // Hiển thị hình ảnh đã upload
                  <div className="relative w-16 h-16 border rounded-lg overflow-hidden group">
                    <img
                      src={sku.image || "/placeholder.svg"}
                      alt="SKU"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeSkuImage(index)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  // Placeholder để upload hình ảnh
                  <div
                    className="w-16 h-16 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                    onClick={() =>
                      fileInputRefs.current[`sku-${index}`]?.click()
                    }
                  >
                    <ImagePlus className="w-6 h-6 text-muted-foreground/50" />
                  </div>
                )}
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={(el) => {
                    fileInputRefs.current[`sku-${index}`] = el;
                  }}
                  onChange={(e) => handleSkuImageUpload(index, e)}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Hiển thị thông báo nếu có nhiều SKUs hơn */}
      {!expandAll && skus.length > 5 && (
        <div className="text-sm text-muted-foreground text-center py-2">
          + {skus.length - 5} SKUs other
        </div>
      )}
    </div>
  );
}
