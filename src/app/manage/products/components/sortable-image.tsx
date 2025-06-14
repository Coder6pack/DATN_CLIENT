"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Checkbox } from "@/components/ui/checkbox";
import { GripVertical } from "lucide-react";

interface SortableImageProps {
  id: string;
  url: string;
  isFirst: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

export function SortableImage({
  id,
  url,
  isFirst,
  isSelected,
  onSelect,
}: SortableImageProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group border rounded-lg overflow-hidden ${
        isFirst ? "col-span-2 row-span-2" : ""
      }`}
    >
      <div className="absolute top-2 left-2 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect()}
          className="bg-white/80 border-gray-300"
        />
      </div>

      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 z-10 p-1 rounded-md bg-white/80 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="w-4 h-4 text-gray-600" />
      </div>

      <img
        src={url || "/placeholder.svg"}
        alt="Product"
        className="w-full h-full object-cover aspect-square"
      />
    </div>
  );
}
