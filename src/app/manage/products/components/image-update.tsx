"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { ImagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SortableImage } from "./sortable-image";

interface ProductImage {
  id: string;
  url: string;
  file: File;
}

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  className?: string;
}

export default function ImageUpload({
  value = [],
  onChange,
  maxImages = 10,
  className,
}: ImageUploadProps) {
  const [images, setImages] = useState<ProductImage[]>(() => {
    // Convert string URLs to ProductImage objects
    return value.map((url, index) => ({
      id: `existing-${index}`,
      url,
      file: new File([], `image-${index}`, { type: "image/jpeg" }), // Placeholder file
    }));
  });
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());

  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sync images with parent component when images change
  useEffect(() => {
    const urls = images.map((img) => img.url);
    // Only update if the URLs are actually different
    if (JSON.stringify(urls) !== JSON.stringify(value)) {
      onChange(urls);
    }
  }, [images, onChange, value]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const remainingSlots = maxImages - images.length;
      const filesToAdd = Array.from(e.target.files).slice(0, remainingSlots);

      const newImages: ProductImage[] = filesToAdd.map((file) => ({
        id: Math.random().toString(36).substring(2, 11),
        url: URL.createObjectURL(file),
        file: file,
      }));

      setImages((prev) => [...prev, ...newImages]);
    }

    // Reset input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const remainingSlots = maxImages - images.length;
      const filesToAdd = Array.from(e.dataTransfer.files).slice(
        0,
        remainingSlots
      );

      const newImages: ProductImage[] = filesToAdd.map((file) => ({
        id: Math.random().toString(36).substring(2, 11),
        url: URL.createObjectURL(file),
        file: file,
      }));

      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const toggleImageSelection = (id: string) => {
    const newSelected = new Set(selectedImages);

    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }

    setSelectedImages(newSelected);
  };

  const deleteSelectedImages = () => {
    setImages((prev) => prev.filter((image) => !selectedImages.has(image.id)));
    setSelectedImages(new Set());
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {images.length}/{maxImages} image
          </div>
          <div className="flex gap-2">
            {selectedImages.size > 0 && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={deleteSelectedImages}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete ({selectedImages.size})
              </Button>
            )}
            {canAddMore && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="w-4 h-4 mr-2" />
                Add image
              </Button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        <div
          className="border-2 border-dashed rounded-lg p-6 text-center transition-colors hover:border-muted-foreground/50"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32">
              <ImagePlus className="w-8 h-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                Drag and drop images here or click to select
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={!canAddMore}
              >
                Chose image
              </Button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={images.map((img) => img.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <SortableImage
                      key={image.id}
                      id={image.id}
                      url={image.url}
                      isFirst={index === 0}
                      isSelected={selectedImages.has(image.id)}
                      onSelect={() => toggleImageSelection(image.id)}
                    />
                  ))}

                  {/* Upload New Image Placeholder */}
                  {canAddMore && (
                    <div
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center p-4 cursor-pointer hover:border-muted-foreground/50 transition-colors aspect-square"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImagePlus className="w-6 h-6 text-muted-foreground/50 mb-1" />
                      <span className="text-xs text-muted-foreground text-center">
                        Add image
                      </span>
                    </div>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
}
