"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Minus,
  Plus,
  X,
  Heart,
  ArrowRight,
  Truck,
  Shield,
  RotateCcw,
  Tag,
  CreditCard,
  MapPin,
  Gift,
  Percent,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductType } from "@/shared/models/shared-product.model";
import {
  useAddCartMutation,
  useDeleteCartMutation,
  useListCart,
  useUpdateCartMutation,
} from "@/app/queries/useCart";
import { UpdateCartItemBodyType } from "@/schemaValidations/cart.model";
import { toast } from "@/hooks/use-toast";

interface RelatedProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  category: string;
}

interface Variant {
  value: string; // Tên biến thể (ví dụ: "Màu", "Size")
  options: string[]; // Giá trị của biến thể (ví dụ: ["Trắng"], ["XL"])
}

interface Sku {
  value: string; // Ví dụ: "Trắng-XL"
  product: {
    variants: Variant[];
  };
}
interface CartContentProps {
  initialCartItems: { product: ProductType; quantity: number }[];
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  loading: boolean;
}

const defaultRelatedProducts: RelatedProduct[] = [
  {
    id: 6,
    name: "Váy Maxi Hoa Nhí",
    image: "/placeholder.svg?height=200&width=200&text=Váy+Maxi",
    price: 1299000,
    rating: 4.9,
    reviews: 156,
    category: "Váy Đầm",
  },
  {
    id: 7,
    name: "Áo Polo Nam Cao Cấp",
    image: "/placeholder.svg?height=200&width=200&text=Áo+Polo",
    price: 699000,
    rating: 4.7,
    reviews: 145,
    category: "Áo Polo",
  },
  {
    id: 8,
    name: "Quần Tây Công Sở",
    image: "/placeholder.svg?height=200&width=200&text=Quần+Tây",
    price: 1199000,
    originalPrice: 1499000,
    rating: 4.6,
    reviews: 78,
    category: "Quần Tây",
  },
  {
    id: 9,
    name: "Giày Oxford Da Thật",
    image: "/placeholder.svg?height=200&width=200&text=Giày+Oxford",
    price: 2299000,
    originalPrice: 2799000,
    rating: 4.8,
    reviews: 234,
    category: "Giày Dép",
  },
];

export default function CartContent({
  initialCartItems,
  removeFromCart,
  updateQuantity,
  clearCart,
  loading,
}: CartContentProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [relatedProducts] = useState<RelatedProduct[]>(defaultRelatedProducts);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const { mutateAsync } = useUpdateCartMutation();
  const { mutateAsync: deleteCartMutation } = useDeleteCartMutation();
  const { data, isLoading } = useListCart({ page: 1, limit: 10 });
  if (!data) {
    return null;
  }
  const listCart =
    data.payload.data.length === 0 ? [] : data.payload.data[0].cartItems;

  const handleUpdateCart = async ({
    id,
    skuId,
    quantity,
  }: {
    id: number;
    skuId: number;
    quantity: number;
  }) => {
    // console.log(id, skuId, quantity);
    const result = await mutateAsync({ id, skuId, quantity });
  };

  const getAllCart = listCart.map((cart) => cart.id);

  const handleDeleteToggleCart = async (cartItem: number[]) => {
    // console.log("cartItem", cartItem);
    const result = await deleteCartMutation({ cartItemIds: cartItem });
    if (!result) {
      toast({
        description: "Xoá giỏ hàng thất bại",
      });
    }
  };

  const handleDeleteCart = async (cartItem: number) => {
    // console.log("cartItem", cartItem);
    const result = await deleteCartMutation({ cartItemIds: [cartItem] });
    if (!result) {
      toast({
        description: "Xoá giỏ hàng thất bại",
      });
    }
  };
  const handleDeleteAllCart = async () => {
    const result = await deleteCartMutation({ cartItemIds: getAllCart });
  };
  const toggleSelectItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === listCart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(listCart.map((item) => item.id));
    }
  };

  const removeSelectedItems = async () => {
    console.log("selectedItems", selectedItems);
    const result = await handleDeleteToggleCart(selectedItems);
    selectedItems.forEach((id) => removeFromCart(id));
    setSelectedItems([]);
  };

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "save20") {
      setAppliedCoupon({ code: couponCode, discount: 20 });
      setCouponCode("");
    } else if (couponCode.toLowerCase() === "welcome10") {
      setAppliedCoupon({ code: couponCode, discount: 10 });
      setCouponCode("");
    } else {
      alert("Mã giảm giá không hợp lệ");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };
  function parseVariants(sku: Sku) {
    const values = sku.value.split("-"); // Tách "Trắng-XL" thành ["Trắng", "XL"]
    const variants = sku.product.variants;

    return variants.map((variant, index) => ({
      name: variant.value, // Tên biến thể (Màu, Size)
      value: values[index] || variant.options[0], // Giá trị tương ứng hoặc mặc định
    }));
  }
  const subtotal = listCart.reduce(
    (sum, item) => sum + item.sku.price * item.quantity,
    0
  );
  const savings = listCart.reduce(
    (sum, item) =>
      sum +
      (item.sku.price
        ? (item.sku.product.virtualPrice - item.sku.price) * item.quantity
        : 0),
    0
  );
  const couponDiscount = appliedCoupon
    ? (subtotal * appliedCoupon.discount) / 100
    : 0;
  const shipping = subtotal >= 500000 ? 0 : 30000;
  const total = subtotal - couponDiscount + shipping;

  if (isLoading) {
    return (
      <div className="grid gap-8">
        {[...Array(3)].map((_, i) => (
          <Card
            key={i}
            className="border-0 shadow-lg rounded-3xl animate-pulse"
          >
            <CardContent className="p-8 flex space-x-6">
              <div className="w-5 h-5 bg-muted rounded" />
              <div className="w-36 h-36 bg-muted rounded-3xl" />
              <div className="flex-1 space-y-4">
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-1/4" />
                <div className="h-3 bg-muted rounded w-1/3" />
                <div className="h-6 bg-muted rounded w-1/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (listCart.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-32 h-32 bg-muted/30 rounded-full mb-8">
          <ShoppingBag className="h-16 w-16 text-muted-foreground" />
        </div>
        <h2 className="text-4xl font-bold mb-6 text-foreground">
          Giỏ hàng trống
        </h2>
        <p className="text-muted-foreground mb-10 max-w-md mx-auto text-lg">
          Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá bộ sưu tập tuyệt
          vời của chúng tôi!
        </p>
        <Button size="lg" className="px-8 py-6 text-lg rounded-2xl" asChild>
          <Link href="/products">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Khám phá sản phẩm
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-8">
        {/* Header with bulk actions */}
        <div className="flex items-center justify-between p-6 bg-card rounded-3xl shadow-lg border transition-colors duration-300">
          <div className="flex items-center space-x-4">
            <Checkbox
              checked={
                selectedItems.length === listCart.length && listCart.length > 0
              }
              onCheckedChange={toggleSelectAll}
              className="w-5 h-5"
            />
            <h2 className="text-2xl font-bold text-foreground">
              Sản phẩm trong giỏ ({listCart.length})
            </h2>
          </div>
          <div className="flex items-center space-x-3">
            {selectedItems.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={removeSelectedItems}
                className="rounded-xl"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa đã chọn ({selectedItems.length})
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteAllCart}
              className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
            >
              <X className="h-4 w-4 mr-2" />
              Xóa tất cả
            </Button>
            <Button variant="ghost" size="sm" asChild className="rounded-xl">
              <Link href="/products">
                <ArrowRight className="h-4 w-4 mr-2" />
                Tiếp tục mua sắm
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {listCart.map((item) => (
            <Card
              key={item.id}
              className="border-0 shadow-lg rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-card"
            >
              <CardContent className="p-8">
                <div className="flex space-x-6">
                  {/* Checkbox */}
                  <div className="flex items-start pt-2">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => toggleSelectItem(item.id)}
                      className="w-5 h-5"
                    />
                  </div>

                  {/* Product Image */}
                  <div className="relative">
                    <Image
                      src={item.sku.image || "/placeholder.svg"}
                      alt={item.sku.product.name}
                      width={140}
                      height={140}
                      className="rounded-3xl object-cover shadow-md"
                    />
                    {item.sku.product.virtualPrice && (
                      <Badge className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
                        -
                        {Math.round(
                          ((item.sku.product.virtualPrice - item.sku.price) /
                            item.sku.product.virtualPrice) *
                            100
                        )}
                        %
                      </Badge>
                    )}
                    {!item.sku.stock && (
                      <div className="absolute inset-0 bg-black/60 rounded-3xl flex items-center justify-center">
                        <Badge
                          variant="destructive"
                          className="text-sm font-semibold"
                        >
                          Hết hàng
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="font-bold text-xl leading-tight mb-2 text-foreground">
                        {item.sku.product.name}
                      </h3>
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        {parseVariants({
                          value: item.sku.value,
                          product: { variants: item.sku.product.variants },
                        }).map((variant) => (
                          <div
                            key={variant.name}
                            className="flex items-center space-x-2"
                          >
                            <span className="font-medium">{variant.name}:</span>
                            <Badge variant="secondary" className="rounded-lg">
                              {variant.value}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-bold text-primary">
                        {item.sku.price.toLocaleString()}₫
                      </span>
                      {item.sku.product.virtualPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          {item.sku.product.virtualPrice.toLocaleString()}₫
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center border-2 border-border rounded-2xl bg-background shadow-sm">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-12 w-12 rounded-l-2xl hover:bg-muted"
                            onClick={() =>
                              handleUpdateCart({
                                id: item.id,
                                skuId: item.skuId,
                                quantity: item.quantity - 1,
                              })
                            }
                            disabled={item.quantity <= 1 || !item.sku.stock}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-6 py-3 font-bold text-lg min-w-[60px] text-center text-foreground">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-12 w-12 rounded-r-2xl hover:bg-muted"
                            onClick={() =>
                              handleUpdateCart({
                                id: item.id,
                                skuId: item.skuId,
                                quantity: item.quantity + 1,
                              })
                            }
                            // item.maxQuantity || !
                            disabled={item.quantity >= item.sku.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {item.sku.stock && (
                          <span className="text-sm text-muted-foreground bg-green-50 dark:bg-green-950 px-3 py-1 rounded-full">
                            Còn {item.sku.stock} sản phẩm
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCart(item.id)}
                          className="text-muted-foreground hover:text-destructive rounded-xl"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="space-y-8">
        {/* Features */}
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-2xl">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg text-foreground">
                Miễn phí vận chuyển
              </p>
              <p className="text-sm text-muted-foreground">Đơn hàng từ 500k</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-2xl">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <RotateCcw className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg text-foreground">
                Đổi trả 30 ngày
              </p>
              <p className="text-sm text-muted-foreground">Miễn phí đổi trả</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-2xl">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg text-foreground">
                Bảo hành chất lượng
              </p>
              <p className="text-sm text-muted-foreground">
                Cam kết chính hãng
              </p>
            </div>
          </div>
        </div>

        {/* Coupon */}
        <Card className="border-0 shadow-lg rounded-3xl overflow-hidden bg-card transition-colors duration-300">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-900 pb-4">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <Tag className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl text-foreground">Mã giảm giá</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-900 border-2 border-green-200 dark:border-green-800 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <Percent className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-green-800 dark:text-green-200">
                      {appliedCoupon.code}
                    </span>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Giảm {appliedCoupon.discount}%
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeCoupon}
                  className="text-green-600 hover:text-green-800 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-200 dark:hover:bg-green-900 rounded-xl"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Input
                  placeholder="Nhập mã giảm giá"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 h-12 rounded-xl border-2"
                />
                <Button
                  onClick={applyCoupon}
                  disabled={!couponCode.trim()}
                  className="px-6 rounded-xl"
                >
                  Áp dụng
                </Button>
              </div>
            )}
            <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-2xl">
              <p className="font-medium mb-2">💡 Mã khuyến mãi có sẵn:</p>
              <div className="space-y-1">
                <p>
                  •{" "}
                  <code className="bg-background px-2 py-1 rounded">
                    SAVE20
                  </code>{" "}
                  - Giảm 20%
                </p>
                <p>
                  •{" "}
                  <code className="bg-background px-2 py-1 rounded">
                    WELCOME10
                  </code>{" "}
                  - Giảm 10%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-card transition-colors duration-300">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-50 dark:from-primary/20 dark:to-blue-950 pb-4">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl text-foreground">Tóm tắt đơn hàng</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between text-lg">
                <span className="text-foreground">
                  Tạm tính ({listCart.length} sản phẩm)
                </span>
                <span className="font-semibold text-foreground">
                  {subtotal.toLocaleString()}₫
                </span>
              </div>

              {savings > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 p-3 rounded-xl">
                  <span className="font-medium">🎉 Tiết kiệm</span>
                  <span className="font-bold">
                    -{savings.toLocaleString()}₫
                  </span>
                </div>
              )}

              {appliedCoupon && (
                <div className="flex justify-between text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 p-3 rounded-xl">
                  <span className="font-medium">
                    🏷️ Giảm giá ({appliedCoupon.code})
                  </span>
                  <span className="font-bold">
                    -{couponDiscount.toLocaleString()}₫
                  </span>
                </div>
              )}

              <div className="flex justify-between text-lg">
                <span className="text-foreground">Phí vận chuyển</span>
                <span
                  className={`font-semibold ${
                    shipping === 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-foreground"
                  }`}
                >
                  {shipping === 0
                    ? "Miễn phí"
                    : `${shipping.toLocaleString()}₫`}
                </span>
              </div>

              {shipping > 0 && (
                <div className="text-sm text-blue-600 dark:text-blue-400 p-4 bg-blue-50 dark:bg-blue-950 rounded-2xl border border-blue-200 dark:border-blue-800">
                  <Gift className="h-4 w-4 inline mr-2" />
                  Mua thêm{" "}
                  <span className="font-bold">
                    {(500000 - subtotal).toLocaleString()}₫
                  </span>{" "}
                  để được miễn phí vận chuyển
                </div>
              )}
            </div>

            <Separator className="my-6" />

            <div className="flex justify-between text-2xl font-bold bg-gradient-to-r from-primary/10 to-blue-50 dark:from-primary/20 dark:to-blue-950 p-4 rounded-2xl">
              <span className="text-foreground">Tổng cộng</span>
              <span className="text-primary">{total.toLocaleString()}₫</span>
            </div>

            <Button
              size="lg"
              className="w-full text-lg font-bold py-6 rounded-2xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg"
              asChild
            >
              <Link href="/payment">
                <CreditCard className="h-5 w-5 mr-2" />
                Thanh toán ngay
              </Link>
            </Button>

            <div className="text-center">
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-2xl border-2"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Kiểm tra địa chỉ giao hàng
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-0 shadow-lg rounded-3xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-900 transition-colors duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 text-green-800 dark:text-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg">Thanh toán an toàn 100%</p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Được bảo vệ bởi SSL và mã hóa 256-bit
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Related Products */}
      <div className="lg:col-span-3 mt-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Có thể bạn cũng thích
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Khám phá thêm những sản phẩm tuyệt vời khác
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map((product) => (
            <Card
              key={product.id}
              className="group cursor-pointer hover:shadow-2xl transition-all duration-500 border-0 shadow-lg rounded-3xl overflow-hidden hover:-translate-y-2 bg-card"
              onClick={() => (window.location.href = `/product/${product.id}`)}
            >
              <div className="relative overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={300}
                  height={400}
                  className="object-cover w-full h-80 group-hover:scale-110 transition-transform duration-700"
                />
                <Badge className="absolute top-4 bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
                  {product.originalPrice ? "Sale" : "New"}
                </Badge>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Add to favorites:", product);
                  }}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-6 space-y-4">
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  {product.category}
                </Badge>
                <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors text-foreground">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-primary text-xl">
                        {product.price.toLocaleString()}₫
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {product.originalPrice.toLocaleString()}₫
                        </span>
                      )}
                    </div>
                  </div>
                  <Button size="sm" className="rounded-2xl shadow-md">
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    Thêm
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
