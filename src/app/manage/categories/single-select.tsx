"use client";

import { useListCategories } from "@/app/queries/useCategory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function SingleSelectCategory({
  value,
  onChange,
  placeholder = "Choose category...",
  allowClear = true,
}: {
  value: number | null;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  allowClear?: boolean;
}) {
  const { data } = useListCategories();

  if (!data) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Loading categories..." />
        </SelectTrigger>
      </Select>
    );
  }

  const categories = data.payload.data
    .filter((cate) => cate.parentCategoryId === null)
    .sort((a, b) =>
      a.name.localeCompare(b.name, "vi", { sensitivity: "base" })
    );

  const handleValueChange = (categoryId: string) => {
    if (categoryId === "clear") {
      onChange(undefined);
    } else if (categoryId) {
      const numericId = Number.parseInt(categoryId, 10);
      onChange(numericId);
    }
  };

  const selectedCategory = categories.find((cat) => cat.id === value);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Select
          value={value ? value.toString() : ""}
          onValueChange={handleValueChange}
          required={false}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {allowClear && value && (
              <>
                <SelectItem value="clear" className="text-muted-foreground">
                  Clear selection
                </SelectItem>
                <div className="border-t my-1" />
              </>
            )}
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {allowClear && value && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange(undefined)}
            className="px-2"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Display selected category */}
      {selectedCategory && (
        <div className="border rounded-md p-3 bg-muted/30">
          <div className="text-sm font-medium text-muted-foreground mb-1">
            Selected category:
          </div>
          <div className="text-sm font-medium">{selectedCategory.name}</div>
        </div>
      )}
    </div>
  );
}
