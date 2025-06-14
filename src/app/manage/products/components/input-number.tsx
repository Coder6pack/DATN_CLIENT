import { Input } from "@/components/ui/input";
import { ControllerRenderProps } from "react-hook-form";

interface InputNumberProps {
  id: string;
  field: ControllerRenderProps<
    {
      name: string;
      basePrice: number;
      virtualPrice: number;
      brandId: number;
      images: string[];
      description: string;
      variants: {
        value: string;
        options: string[];
      }[];
      categories: number[];
      skus: {
        value: string;
        image: string;
        price: number;
        stock: number;
      }[];
    },
    "virtualPrice" | "basePrice"
  >;
}
export default function InputNumber({ id, field }: InputNumberProps) {
  return (
    <Input
      id={id}
      type="text"
      value={field.value}
      onChange={field.onChange}
      onKeyDown={(e) => {
        const allowedKeys = [
          "Backspace",
          "Delete",
          "ArrowLeft",
          "ArrowRight",
          "Tab",
        ];
        if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
          e.preventDefault(); // Ngăn chữ và ký tự đặc biệt
        }
      }}
      onPaste={(e) => {
        const pastedText = e.clipboardData.getData("text");
        if (!/^\d*$/.test(pastedText)) {
          e.preventDefault(); // Ngăn dán nếu chứa chữ hoặc ký tự đặc biệt
        }
      }}
      onBlur={() => {
        if (field.value) {
          const numericValue = Number.parseInt(
            String(field.value).replace(/[^\d]/g, ""),
            10
          );
          if (!isNaN(numericValue)) {
            field.onChange(numericValue); // Lưu giá trị thô
          }
        }
      }}
      placeholder="0"
      className="pl-7"
    />
  );
}
