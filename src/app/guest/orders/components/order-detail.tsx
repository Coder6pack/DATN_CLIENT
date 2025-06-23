"use client";

import Image from "next/image";
import {
  MapPin,
  Phone,
  CreditCard,
  Download,
  MessageCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetOrder } from "@/app/queries/useOrder";
import { statusConfig } from "@/constants/order.constant";
import { getStatusProgress } from "@/lib/utils";

export default function OrderDetail({ orderId }: { orderId: number }) {
  const { data } = useGetOrder({ id: orderId, enabled: Boolean(orderId) });
  if (!data) {
    return <div>Loading order detail...</div>;
  }
  const order = data.payload;
  return (
    <div className="space-y-8">
      {/* Status Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Trạng thái đơn hàng</h3>
        <div className="relative">
          <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-muted"></div>
          <div className="space-y-6">
            {[
              {
                status: "PENDING_PAYMENT",
                label: "Đặt hàng thành công",
                time: order.createdAt,
              },
              {
                status: "PENDING_PICKUP",
                label: "Xác nhận đơn hàng",
                time:
                  order.status !== "PENDING_PAYMENT" ? order.createdAt : null,
              },
              {
                status: "PENDING_DELIVERY",
                label: "Đang giao hàng",
                time: ["PENDING_PAYMENT", "PENDING_PICKUP"].includes(
                  order.status
                )
                  ? order.createdAt
                  : null,
              },
              {
                status: "DELIVERED",
                label: "Giao hàng thành công",
                time: order.status === "DELIVERED" ? order.createdAt : null,
              },
            ].map((step, index) => {
              const isActive = order.status === step.status;
              const isCompleted =
                getStatusProgress(order.status) >
                getStatusProgress(step.status);
              const StatusIcon =
                statusConfig[step.status as keyof typeof statusConfig].icon;

              return (
                <div
                  key={step.status}
                  className="relative flex items-center space-x-4"
                >
                  <div
                    className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      isCompleted || isActive
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-background border-muted"
                    }`}
                  >
                    <StatusIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        isCompleted || isActive
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </p>
                    {step.time && (
                      <p className="text-sm text-muted-foreground">
                        {new Date(step.time).toLocaleString("vi-VN")}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sản phẩm đã đặt</h3>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-4 p-4 border rounded-2xl"
            >
              <Image
                src={item.image}
                alt={item.productName}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold">{item.productName}</h4>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                  {item.skuValue.split("-").length > 1
                    ? item.skuValue.split("-").map((val) => `${val} • `)
                    : item.skuValue.split("-").map((val) => `${val}`)}{" "}
                  <span>Số lượng: {item.quantity}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">
                  {(item.skuPrice * item.quantity).toLocaleString()}₫
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping & Payment Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Địa chỉ giao hàng</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-semibold">{order.receiver.name}</p>
            <p className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>{order.receiver.phone}</span>
            </p>
            <p className="text-muted-foreground">{order.receiver.address}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Thanh toán</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-semibold">Online</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>
                  {" "}
                  {order.items
                    .reduce((acc, item) => acc + item.skuPrice, 0)
                    .toLocaleString()}
                  ₫
                </span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className="text-green-600">Miễn phí</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Tổng cộng:</span>
                <span className="text-primary">
                  {order.items
                    .reduce((acc, item) => acc + item.skuPrice, 0)
                    .toLocaleString()}
                  ₫
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex space-x-4 pt-4 border-t">
        <Button className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Tải hóa đơn
        </Button>
        <Button variant="outline" className="flex-1">
          <MessageCircle className="h-4 w-4 mr-2" />
          Liên hệ hỗ trợ
        </Button>
        {order.status === "DELIVERED" && (
          <Button variant="outline" className="flex-1">
            <RefreshCw className="h-4 w-4 mr-2" />
            Mua lại
          </Button>
        )}
      </div>
    </div>
  );
}
