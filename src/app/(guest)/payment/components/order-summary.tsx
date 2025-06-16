"use client";

import Image from "next/image";
import {
  Gift,
  CreditCard,
  Truck,
  Calendar,
  Clock,
  CheckCircle,
  Star,
  Shield,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

interface OrderSummaryProps {
  cartItems: CartItem[];
  paymentMethod: string;
  processing: boolean;
  onSubmit: () => void;
  isFormValid: boolean;
}

export default function OrderSummary({
  cartItems,
  paymentMethod,
  processing,
  onSubmit,
  isFormValid,
}: OrderSummaryProps) {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 0; // Free shipping
  //   const discount = paymentMethod === "online" ? Math.round(subtotal * 0.02) : 0;
  const total = subtotal + shipping; //- discount;

  return (
    <div className="space-y-8">
      {/* Order Items */}
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 pb-4">
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
              <Gift className="h-5 w-5 text-white" />
            </div>
            <span>Đơn hàng của bạn</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl"
              >
                <div className="relative">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded-xl object-cover"
                  />
                  <Badge className="absolute -top-2 -right-2 bg-primary text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                    {item.quantity}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">
                    {item.name}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                    <span>Size: {item.size}</span>
                    <span>•</span>
                    <span>{item.color}</span>
                  </div>
                </div>
                <span className="font-bold text-primary">
                  {item.price.toLocaleString()}₫
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price Summary */}
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-50 pb-4">
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <span>Tổng thanh toán</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between text-lg">
              <span>Tạm tính</span>
              <span className="font-semibold">
                {subtotal.toLocaleString()}₫
              </span>
            </div>

            <div className="flex justify-between text-lg">
              <span>Phí vận chuyển</span>
              <span className="font-semibold text-green-600">Miễn phí</span>
            </div>

            {/* {paymentMethod === "online" && (
              <div className="flex justify-between text-green-600 bg-green-50 p-3 rounded-xl">
                <span className="font-medium">Giảm giá thanh toán online</span>
                <span className="font-bold">-{discount.toLocaleString()}₫</span>
              </div>
            )} */}
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between text-2xl font-bold bg-gradient-to-r from-primary/10 to-blue-50 p-4 rounded-2xl">
            <span>Tổng cộng</span>
            <span className="text-primary">{total.toLocaleString()}₫</span>
          </div>

          {/* Estimated Delivery */}
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
            <div className="flex items-center space-x-3 mb-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-800">
                Thời gian giao hàng
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <Calendar className="h-4 w-4" />
              <span>Dự kiến: 2-3 ngày làm việc</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-blue-600 mt-1">
              <Clock className="h-4 w-4" />
              <span>Giao hàng: 8:00 - 18:00</span>
            </div>
          </div>

          {/* Place Order Button */}
          <Button
            size="lg"
            className="w-full text-lg font-bold py-6 rounded-2xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg"
            onClick={onSubmit}
            disabled={processing || !isFormValid}
          >
            {processing ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang xử lý...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Đặt hàng ngay</span>
              </div>
            )}
          </Button>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Đổi trả miễn phí</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>Chất lượng đảm bảo</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Shield className="h-4 w-4 text-blue-500" />
              <span>Thanh toán an toàn</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Truck className="h-4 w-4 text-purple-500" />
              <span>Giao hàng nhanh</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
