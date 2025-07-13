"use client";

import type React from "react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface SkuItem {
  value?: string | undefined;
  price?: number | undefined;
  stock?: number | undefined;
  image?: string | undefined;
}

interface SkuListFieldProps {
  value?: SkuItem[];
  onChange: (value: SkuItem[]) => void;
  variants?: {
    value?: string | undefined;
    options?: (string | undefined)[] | undefined;
  }[];
  className?: string;
  virtualPrice: number;
}

export default function SkuListField({
  value = [],
  onChange,
  variants = [],
  className,
  virtualPrice,
}: SkuListFieldProps) {
  const [expandAll, setExpandAll] = useState(false);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const prevVariantsRef = useRef<string>("");

  const combinations = useMemo((): string[] => {
    if (!variants || variants.length === 0) return [];
    const combos: string[][] = [[]];
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
    return combos.map((combo) => combo.join("-"));
  }, [variants]);

  const skus = useMemo((): SkuItem[] => {
    if (combinations.length === 0) return [];
    return combinations.map((combo) => {
      const existingSku = value.find((sku) => sku.value === combo);
      return {
        value: combo,
        price: existingSku?.price ?? virtualPrice, // Use existing price or virtualPrice
        stock: existingSku?.stock ?? 100, // Default stock to 100
        image: existingSku?.image,
      };
    });
  }, [combinations, value, virtualPrice]);

  useEffect(() => {
    const variantsString = JSON.stringify(variants);
    if (variantsString !== prevVariantsRef.current) {
      prevVariantsRef.current = variantsString;
      if (combinations.length === 0) {
        onChange([]);
      } else {
        const newSkus: SkuItem[] = combinations.map((combo) => {
          const existingSku = value.find((sku) => sku.value === combo);
          return {
            value: combo,
            price: existingSku?.price ?? virtualPrice, // Use existing price or virtualPrice
            stock: existingSku?.stock ?? 100, // Default stock to 100
            image: existingSku?.image,
          };
        });
        onChange(newSkus);
      }
    }
  }, [combinations, onChange, variants, virtualPrice]);

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

  const updateSkuStock = useCallback(
    (index: number, stock: string) => {
      const numericStock = stock ? Number.parseInt(stock, 10) : 100;
      const updatedSkus = skus.map((sku, i) =>
        i === index ? { ...sku, stock: numericStock } : sku
      );
      onChange(updatedSkus);
    },
    [skus, onChange]
  );

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

  const removeSkuImage = useCallback(
    (index: number) => {
      const updatedSkus = skus.map((sku, i) =>
        i === index ? { ...sku, image: undefined } : sku
      );
      onChange(updatedSkus);
    },
    [skus, onChange]
  );

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
      <div className="grid grid-cols-4 gap-4 font-medium text-sm text-muted-foreground pb-2 border-b">
        <div>Variant</div>
        <div>Price</div>
        <div>Stock</div>
        <div>Image</div>
      </div>
      <div className="space-y-3">
        {(expandAll ? skus : skus.slice(0, 5)).map((sku, index) => (
          <div
            key={sku.value || index}
            className="grid grid-cols-4 gap-4 items-center py-3 border rounded-lg p-3"
          >
            <div className="flex flex-wrap gap-1">
              {sku.value?.split("-").map((part, partIndex) => (
                <Badge key={partIndex} variant="secondary" className="text-xs">
                  {part}
                </Badge>
              ))}
            </div>
            <div>
              <Input
                type="text"
                placeholder="0"
                className="w-full"
                value={
                  sku.price?.toLocaleString() ?? virtualPrice.toLocaleString()
                }
                onChange={(e) => updateSkuPrice(index, e.target.value)}
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="100"
                className="w-full"
                value={sku.stock ?? 100}
                onChange={(e) => updateSkuStock(index, e.target.value)}
              />
            </div>
            <div>
              <div className="relative">
                {sku.image ? (
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
                  <div
                    className="w-16 h-16 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                    onClick={() =>
                      fileInputRefs.current[`sku-${index}`]?.click()
                    }
                  >
                    <ImagePlus className="w-6 h-6 text-muted-foreground/50" />
                  </div>
                )}
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
      {!expandAll && skus.length > 5 && (
        <div className="text-sm text-muted-foreground text-center py-2">
          + {skus.length - 5} SKUs other
        </div>
      )}
    </div>
  );
}
