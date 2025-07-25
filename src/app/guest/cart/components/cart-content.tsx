"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Minus,
  Plus,
  X,
  ArrowRight,
  Truck,
  Shield,
  RotateCcw,
  CreditCard,
  Gift,
  Trash2,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductType } from "@/shared/models/shared-product.model";
import {
  useDeleteCartMutation,
  useListCart,
  useUpdateCartMutation,
} from "@/app/queries/useCart";
import { toast } from "@/hooks/use-toast";
import { parseVariants } from "@/lib/utils";
import { useListProducts } from "@/app/queries/useProduct";
interface CartContentProps {
  initialCartItems: { product: ProductType; quantity: number }[];
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  loading: boolean;
}

export default function CartContent({ removeFromCart }: CartContentProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel settings
  const itemsPerSlide = {
    mobile: 1,
    tablet: 2,
    desktop: 4,
  };

  const getItemsPerSlide = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return itemsPerSlide.mobile;
      if (window.innerWidth < 1024) return itemsPerSlide.tablet;
      return itemsPerSlide.desktop;
    }
    return itemsPerSlide.desktop;
  };

  const [itemsToShow, setItemsToShow] = useState(getItemsPerSlide());

  const { mutateAsync } = useUpdateCartMutation();
  const { mutateAsync: deleteCartMutation } = useDeleteCartMutation();
  const { data, isLoading } = useListCart({ page: 1, limit: 10 });
  const { data: listProduct } = useListProducts({ page: 1, limit: 10 });
  if (!data) {
    return null;
  }
  const listCart =
    data.payload.data.length === 0 ? [] : data.payload.data[0].cartItems;
  if (!listProduct) {
    return;
  }
  const products = listProduct.payload.data;
  const handleUpdateCart = async ({
    id,
    skuId,
    quantity,
  }: {
    id: number;
    skuId: number;
    quantity: number;
  }) => {
    const result = await mutateAsync({ id, skuId, quantity });
  };
  const maxSlides = Math.ceil(products.length / itemsToShow);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % maxSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + maxSlides) % maxSlides);
  };
  const getAllCart = listCart.map((cart) => cart.id);

  const handleDeleteToggleCart = async (cartItem: number[]) => {
    const result = await deleteCartMutation({ cartItemIds: cartItem });
    if (!result) {
      toast({
        description: "Xoá giỏ hàng thất bại",
      });
    }
  };

  const handleDeleteCart = async (cartItem: number) => {
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
    const result = await handleDeleteToggleCart(selectedItems);
    selectedItems.forEach((id) => removeFromCart(id));
    setSelectedItems([]);
  };

  // const applyCoupon = () => {
  //   if (couponCode.toLowerCase() === "save20") {
  //     setAppliedCoupon({ code: couponCode, discount: 20 });
  //     setCouponCode("");
  //   } else if (couponCode.toLowerCase() === "welcome10") {
  //     setAppliedCoupon({ code: couponCode, discount: 10 });
  //     setCouponCode("");
  //   } else {
  //     alert("Mã giảm giá không hợp lệ");
  //   }
  // };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };
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
  // const total = subtotal - couponDiscount + shipping;
  const total = subtotal;

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
                      src={item.sku.image}
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
        {/* Features */}
        <div className="grid grid-cols-3 gap-4">
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
      </div>

      {/* Order Summary */}
      <div className="space-y-8">
        {/* Coupon */}
        {/* <Card className="border-0 shadow-lg rounded-3xl overflow-hidden bg-card transition-colors duration-300">
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
        </Card> */}

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
                  className={"font-semibold text-green-600 dark:text-green-400"}
                >
                  Miễn phí
                  {/* {shipping === 0
                    ? "Miễn phí"
                    : `${shipping.toLocaleString()}₫`} */}
                </span>
              </div>

              {shipping > 0 && (
                <div className="text-sm text-blue-600 dark:text-blue-400 p-4 bg-blue-50 dark:bg-blue-950 rounded-2xl border border-blue-200 dark:border-blue-800">
                  <Gift className="h-4 w-4 inline mr-2" />
                  Chúc mừng bạn đã được shop miễn phí vận chuyển
                  {/* <span className="font-bold">
                    {(500000 - subtotal).toLocaleString()}₫
                  </span>{" "} */}
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
              <Link href="/guest/payment">
                <CreditCard className="h-5 w-5 mr-2" />
                Thanh toán ngay
              </Link>
            </Button>

            <div className="text-center"></div>
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
      {/* <div className="lg:col-span-3 mt-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Có thể bạn cũng thích
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Khám phá thêm những sản phẩm tuyệt vời khác
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group cursor-pointer hover:shadow-2xl transition-all duration-500 border-0 shadow-lg rounded-3xl overflow-hidden hover:-translate-y-2 bg-card"
              onClick={() => (window.location.href = `/product/${product.id}`)}
            >
              <div className="relative overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={300}
                  height={400}
                  className="object-cover w-full h-80 group-hover:scale-110 transition-transform duration-700"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors text-foreground">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-primary text-xl">
                        {product.virtualPrice.toLocaleString()}₫
                      </span>
                      {product.basePrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {(product.virtualPrice + 30000).toLocaleString()}₫
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
      </div> */}
      {/* Related Products Carousel */}
      <div className="lg:col-span-3 mt-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Có thể bạn cũng thích
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Khám phá thêm những sản phẩm tuyệt vời khác
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative px-16">
          {/* Left Navigation Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full border-2 bg-white/95 backdrop-blur-sm hover:bg-white shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed group"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />
          </Button>

          {/* Right Navigation Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            disabled={currentSlide === maxSlides - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full border-2 bg-white/95 backdrop-blur-sm hover:bg-white shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed group"
          >
            <ChevronRight className="h-6 w-6 text-gray-600 group-hover:text-primary transition-colors" />
          </Button>

          {/* Carousel Track */}
          <div className="overflow-hidden rounded-3xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
                width: `${maxSlides * 100}%`,
              }}
            >
              {Array.from({ length: maxSlides }).map((_, slideIndex) => (
                <div
                  key={slideIndex}
                  className="flex space-x-6 px-3"
                  style={{ width: `${100 / maxSlides}%` }}
                >
                  {products
                    .slice(
                      slideIndex * itemsToShow,
                      (slideIndex + 1) * itemsToShow
                    )
                    .map((product) => (
                      <div key={product.id} className="flex-1 min-w-0 p-2">
                        <Card
                          className="group cursor-pointer hover:shadow-xl transition-all duration-500 border-0 shadow-md rounded-3xl overflow-hidden hover:-translate-y-2 bg-card h-full"
                          onClick={() =>
                            (window.location.href = `/product/${product.id}`)
                          }
                        >
                          <div className="relative overflow-hidden">
                            <Image
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.name}
                              width={300}
                              height={300}
                              className="object-cover w-full h-64 group-hover:scale-110 transition-transform duration-700"
                            />
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
                          <div className="p-6 space-y-4 flex-1 flex flex-col">
                            <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors text-foreground flex-1">
                              {product.name}
                            </h3>
                            <div className="flex items-center justify-between mt-auto">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <span className="font-bold text-primary text-xl">
                                    {product.virtualPrice.toLocaleString()}₫
                                  </span>
                                  {product.basePrice && (
                                    <span className="text-sm text-muted-foreground line-through">
                                      {(
                                        product.virtualPrice + 30000
                                      ).toLocaleString()}
                                      ₫
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                className="rounded-2xl shadow-md"
                              >
                                <ShoppingBag className="h-4 w-4 mr-1" />
                                Thêm
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {Array.from({ length: maxSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-primary scale-125 shadow-lg"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50 hover:scale-110"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
