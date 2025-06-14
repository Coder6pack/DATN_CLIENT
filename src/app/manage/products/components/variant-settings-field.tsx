"use client";

import type React from "react";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SortableOption } from "./sortable-option";
import { SortableValue } from "./sortable-value";

interface VariantOption {
  id: string;
  name: string;
  values: {
    id: string;
    value: string;
  }[];
}

interface VariantSettingsFieldProps {
  value?: {
    value?: string | undefined;
    options?: (string | undefined)[] | undefined;
  }[];
  onChange: (
    value: {
      value?: string | undefined;
      options?: (string | undefined)[] | undefined;
    }[]
  ) => void;
  className?: string;
}

export default function VariantSettingsField({
  value = [],
  onChange,
  className,
}: VariantSettingsFieldProps) {
  // Ref để track previous value để tránh unnecessary updates
  const prevValueRef = useRef<string>("");

  // Convert incoming value to internal format
  const [options, setOptions] = useState<VariantOption[]>(() => {
    if (!value || !Array.isArray(value)) return [];

    return value.map((variant, index) => ({
      id: `variant-${index}-${Date.now()}`,
      name: variant.value || "",
      values: (variant.options || []).map((opt, optIndex) => ({
        id: `variant-${index}-option-${optIndex}-${Date.now()}`,
        value: opt || "",
      })),
    }));
  });

  const [newValueInputs, setNewValueInputs] = useState<{
    [key: string]: string;
  }>({});
  const [editingValue, setEditingValue] = useState<{
    optionId: string;
    valueId: string;
  } | null>(null);
  const [editingText, setEditingText] = useState("");

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

  // Memoize formatted value để tránh re-computation không cần thiết
  const formattedValue = useMemo(() => {
    return options.map((option) => ({
      value: option.name,
      options: option.values.map((val) => val.value),
    }));
  }, [options]);

  // Sync options với parent component khi options thay đổi
  useEffect(() => {
    const valueString = JSON.stringify(formattedValue);

    // Chỉ update khi value thực sự thay đổi
    if (valueString !== prevValueRef.current) {
      prevValueRef.current = valueString;
      onChange(formattedValue);
    }
  }, [formattedValue, onChange]);

  // Các functions được memoize để tránh re-render không cần thiết
  const addOption = useCallback(() => {
    const newOption: VariantOption = {
      id: `variant-${Date.now()}`,
      name: "",
      values: [],
    };
    setOptions((prev) => [...prev, newOption]);
  }, []);

  const updateOptionName = useCallback((optionId: string, name: string) => {
    setOptions((prev) =>
      prev.map((option) =>
        option.id === optionId ? { ...option, name } : option
      )
    );
  }, []);

  const addValue = useCallback(
    (optionId: string) => {
      const newValue = newValueInputs[optionId]?.trim();
      if (!newValue) return;

      const valueId = `${optionId}-value-${Date.now()}`;
      setOptions((prev) =>
        prev.map((option) =>
          option.id === optionId
            ? {
                ...option,
                values: [...option.values, { id: valueId, value: newValue }],
              }
            : option
        )
      );
      setNewValueInputs((prev) => ({ ...prev, [optionId]: "" }));
    },
    [newValueInputs]
  );

  const removeValue = useCallback((optionId: string, valueId: string) => {
    setOptions((prev) =>
      prev.map((option) =>
        option.id === optionId
          ? {
              ...option,
              values: option.values.filter((val) => val.id !== valueId),
            }
          : option
      )
    );
  }, []);

  const removeOption = useCallback((optionId: string) => {
    setOptions((prev) => prev.filter((option) => option.id !== optionId));
  }, []);

  const updateNewValueInput = useCallback((optionId: string, value: string) => {
    setNewValueInputs((prev) => ({ ...prev, [optionId]: value }));
  }, []);

  const startEditing = useCallback(
    (optionId: string, valueId: string, currentValue: string) => {
      setEditingValue({ optionId, valueId });
      setEditingText(currentValue);
    },
    []
  );

  const saveEdit = useCallback(() => {
    if (!editingValue || !editingText.trim()) {
      setEditingValue(null);
      setEditingText("");
      return;
    }

    setOptions((prev) =>
      prev.map((option) =>
        option.id === editingValue.optionId
          ? {
              ...option,
              values: option.values.map((val) =>
                val.id === editingValue.valueId
                  ? { ...val, value: editingText.trim() }
                  : val
              ),
            }
          : option
      )
    );
    setEditingValue(null);
    setEditingText("");
  }, [editingValue, editingText]);

  const cancelEdit = useCallback(() => {
    setEditingValue(null);
    setEditingText("");
  }, []);

  const handleOptionDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setOptions((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  }, []);

  const handleValueDragEnd = useCallback(
    (event: DragEndEvent, optionId: string) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      setOptions((items) => {
        return items.map((option) => {
          if (option.id !== optionId) return option;

          const oldIndex = option.values.findIndex(
            (value) => value.id === active.id
          );
          const newIndex = option.values.findIndex(
            (value) => value.id === over.id
          );
          return {
            ...option,
            values: arrayMove(option.values, oldIndex, newIndex),
          };
        });
      });
    },
    []
  );

  // Generate variant combinations
  const variants = useMemo(() => {
    if (options.length === 0) return [];

    const combinations: string[][] = [[]];

    for (const option of options) {
      if (option.values.length === 0) continue;
      const newCombinations: string[][] = [];
      for (const combination of combinations) {
        for (const { value } of option.values) {
          newCombinations.push([...combination, value]);
        }
      }
      combinations.splice(0, combinations.length, ...newCombinations);
    }

    return combinations;
  }, [options]);

  // Handle key press for adding values
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, optionId: string) => {
      if (e.key === "Enter") {
        e.preventDefault(); // Prevent form submission
        addValue(optionId);
      }
    },
    [addValue]
  );

  // Handle key press for editing values
  const handleEditKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault(); // Prevent form submission
        saveEdit();
      } else if (e.key === "Escape") {
        e.preventDefault();
        cancelEdit();
      }
    },
    [saveEdit, cancelEdit]
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">Set up product variations</div>
          <Button type="button" onClick={addOption} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add variant
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleOptionDragEnd}
        >
          <SortableContext
            items={options.map((option) => option.id)}
            strategy={verticalListSortingStrategy}
          >
            {options.map((option) => (
              <SortableOption key={option.id} id={option.id}>
                <div className="flex-1 space-y-4">
                  <div className="flex-1">
                    <Label
                      htmlFor={`option-${option.id}`}
                      className="text-sm font-medium text-gray-600"
                    >
                      Variant name
                    </Label>
                    <Input
                      id={`option-${option.id}`}
                      value={option.name}
                      onChange={(e) =>
                        updateOptionName(option.id, e.target.value)
                      }
                      placeholder="Enter variant name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Variant value
                    </Label>
                    <div className="mt-2 space-y-2">
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={(event) =>
                          handleValueDragEnd(event, option.id)
                        }
                      >
                        <SortableContext
                          items={option.values.map((val) => val.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {option.values.map((val) => (
                            <SortableValue key={val.id} id={val.id}>
                              {editingValue?.optionId === option.id &&
                              editingValue?.valueId === val.id ? (
                                <Input
                                  value={editingText}
                                  onChange={(e) =>
                                    setEditingText(e.target.value)
                                  }
                                  onKeyDown={handleEditKeyDown}
                                  onBlur={saveEdit}
                                  className="flex-1 bg-background text-foreground"
                                  autoFocus
                                />
                              ) : (
                                <div
                                  className="flex-1 px-3 py-2 border rounded-md bg-muted hover:bg-muted/80 cursor-pointer transition-colors"
                                  onClick={() =>
                                    startEditing(option.id, val.id, val.value)
                                  }
                                >
                                  {val.value}
                                </div>
                              )}
                              <Button
                                type="button"
                                onClick={() => removeValue(option.id, val.id)}
                                variant="ghost"
                                size="sm"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </SortableValue>
                          ))}
                        </SortableContext>
                      </DndContext>

                      <div className="flex items-center gap-2">
                        <Input
                          value={newValueInputs[option.id] || ""}
                          onChange={(e) =>
                            updateNewValueInput(option.id, e.target.value)
                          }
                          placeholder="Add new variant"
                          className="flex-1 bg-background text-foreground"
                          onKeyDown={(e) => handleKeyPress(e, option.id)}
                        />
                        <Button
                          type="button"
                          onClick={() => addValue(option.id)}
                          variant="outline"
                          size="sm"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <Button
                      type="button"
                      onClick={() => removeOption(option.id)}
                      variant="destructive"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </SortableOption>
            ))}
          </SortableContext>
        </DndContext>

        {options.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <div className="text-muted-foreground">No variant</div>
            <Button
              type="button"
              onClick={addOption}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add first variant
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
