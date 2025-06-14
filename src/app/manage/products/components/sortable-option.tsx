"use client";

import type React from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface SortableOptionProps {
  id: string;
  children: React.ReactNode;
}

export function SortableOption({ id, children }: SortableOptionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`space-y-4 p-4 border rounded-lg ${
        isDragging ? "opacity-50 border-dashed" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab hover:bg-gray-100 p-1 rounded-md transition-colors"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        {children}
      </div>
    </div>
  );
}
