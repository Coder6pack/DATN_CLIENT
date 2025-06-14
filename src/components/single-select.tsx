import { useListCategories } from "@/app/queries/useCategory";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GetCategoryDetailResType } from "@/schemaValidations/category.model";
import { X } from "lucide-react";
import { useState } from "react";

export default function MultiSelectCategory({
  value = [],
  onChange,
  categories,
}: {
  value?: number[] | undefined;
  onChange: (value: number[]) => void;
  categories: GetCategoryDetailResType[];
}) {
  const [currentCategory, setCurrentCategory] = useState<string>("");
  if (!categories) {
    return null;
  }
  const handleAddCategory = (categoryId: string) => {
    const numericId = Number.parseInt(categoryId, 10);
    if (categoryId && !value?.includes(numericId)) {
      onChange([...(value || []), numericId]);
      setCurrentCategory("");
    }
  };

  const removeCategory = (categoryId: number) => {
    onChange((value || []).filter((id) => id !== categoryId));
  };

  const getSelectedCategoryNames = () => {
    if (!value || !Array.isArray(value)) return [];
    return categories.filter((cat) => value.includes(cat.id));
  };

  const getAvailableCategories = () => {
    if (!value || !Array.isArray(value)) return categories;
    return categories.filter((cat) => !value.includes(cat.id));
  };

  return (
    <div className="space-y-2">
      <Select value={currentCategory} onValueChange={handleAddCategory}>
        <SelectTrigger>
          <SelectValue placeholder="Chose categories..." />
        </SelectTrigger>
        <ScrollArea>
          <SelectContent>
            {getAvailableCategories().map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </ScrollArea>
      </Select>

      {/* Selected Categories Display */}
      {value && value.length > 0 && (
        <div className="border rounded-md p-3 bg-muted/30">
          <div className="text-sm font-medium text-muted-foreground mb-2">
            Categories chose:
          </div>
          <div className="flex flex-wrap gap-2">
            {getSelectedCategoryNames().map((category) => (
              <Badge key={category.id} variant="secondary" className="text-sm">
                {category.name}
                <button
                  type="button"
                  onClick={() => removeCategory(category.id)}
                  className="ml-2 hover:bg-muted rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
