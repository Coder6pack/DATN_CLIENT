import { useDeleteCartMutation, useListCart } from "@/app/queries/useCart";
import { useState } from "react";
import { Button } from "./ui/button";
import { ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

export default function CartDropDown() {
  const [isCartHovered, setIsCartHovered] = useState(false);
  const { mutateAsync } = useDeleteCartMutation();
  const { data } = useListCart({ page: 1, limit: 10 });
  if (!data) {
    return null;
  }
  const listCart =
    data.payload.data.length === 0 ? [] : data.payload.data[0].cartItems;
  const handleDeleteCart = async (cartItem: number) => {
    // console.log("cartItem", cartItem);
    const result = await mutateAsync({ cartItemIds: [cartItem] });
    if (!result) {
      toast({
        description: "Xoá giỏ hàng thất bại",
      });
    }
  };
  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsCartHovered(true)}
      onMouseLeave={() => setIsCartHovered(false)}
    >
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-300 group-hover:scale-110"
      >
        <ShoppingBag className="h-5 w-5" />
      </Button>
      {listCart.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
          {listCart.reduce((sum, item) => sum + item.quantity, 0)}
        </span>
      )}

      <div
        className={`absolute right-0 mt-3 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transform transition-all duration-300 z-50 ${
          isCartHovered
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible translate-y-2"
        }`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg dark:text-white">Giỏ hàng</h3>
            <span className="text-sm text-muted-foreground">
              {listCart.length} sản phẩm
            </span>
          </div>

          {listCart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-2">Giỏ hàng trống</p>
              <p className="text-sm text-muted-foreground">
                Thêm sản phẩm để bắt đầu mua sắm
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {listCart.map((item) => {
                  const colorVariant = item.sku.product.variants?.find(
                    (v) => v.value === "color"
                  )?.options[0];
                  const sizeVariant = item.sku.product.variants?.find(
                    (v) => v.value === "size"
                  )?.options[0];

                  return (
                    <div
                      key={item.skuId}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Image
                        src={item.sku.image || "/placeholder.svg"}
                        alt={item.sku.product.name}
                        width={50}
                        height={50}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate dark:text-white">
                          {item.sku.product.name}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          {sizeVariant && <span>{sizeVariant}</span>}
                          {sizeVariant && colorVariant && <span>•</span>}
                          {colorVariant && <span>{colorVariant}</span>}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            {item.sku.product.virtualPrice.toLocaleString()}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            x{item.quantity}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCart(item.id)}
                        className="hover:bg-red-100 dark:hover:bg-red-900"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  );
                })}
              </div>
              <div className="border-t dark:border-gray-700 pt-4 mt-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold dark:text-white">
                    Tổng cộng:
                  </span>
                  <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                    {listCart
                      .reduce(
                        (total, item) => total + item.sku.price * item.quantity,
                        0
                      )
                      .toLocaleString()}
                  </span>
                </div>
                <div className="space-y-2">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="sm"
                    asChild
                  >
                    <Link href="/guest/cart">Xem giỏ hàng</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    size="sm"
                    asChild
                  >
                    <Link href="/checkout">Thanh toán</Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
