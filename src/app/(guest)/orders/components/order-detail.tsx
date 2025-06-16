"use client";

import Image from "next/image";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  Phone,
  CreditCard,
  Download,
  MessageCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderItem {
  id: number;
  name: string;
  image: string;
  price: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface Order {
  id: string;
  date: string;
  status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
  total: string;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  paymentMethod: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
}

interface OrderDetailProps {
  order: Order;
}

const statusConfig = {
  pending: {
    label: "Chờ xác nhận",
    color: "bg-yellow-500",
    icon: Clock,
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "bg-blue-500",
    icon: CheckCircle,
  },
  shipping: {
    label: "Đang giao",
    color: "bg-purple-500",
    icon: Truck,
  },
  delivered: {
    label: "Đã giao",
    color: "bg-green-500",
    icon: Package,
  },
  cancelled: {
    label: "Đã hủy",
    color: "bg-red-500",
    icon: AlertCircle,
  },
};

const getStatusProgress = (status: string) => {
  switch (status) {
    case "pending":
      return 25;
    case "confirmed":
      return 50;
    case "shipping":
      return 75;
    case "delivered":
      return 100;
    case "cancelled":
      return 0;
    default:
      return 0;
  }
};

export default function OrderDetail({ order }: OrderDetailProps) {
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
                status: "pending",
                label: "Đặt hàng thành công",
                time: order.date,
              },
              {
                status: "confirmed",
                label: "Xác nhận đơn hàng",
                time: order.status !== "pending" ? order.date : null,
              },
              {
                status: "shipping",
                label: "Đang giao hàng",
                time: ["shipping", "delivered"].includes(order.status)
                  ? order.date
                  : null,
              },
              {
                status: "delivered",
                label: "Giao hàng thành công",
                time:
                  order.status === "delivered" ? order.estimatedDelivery : null,
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
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold">{item.name}</h4>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                  {item.size && <span>Size: {item.size}</span>}
                  {item.color && <span>Màu: {item.color}</span>}
                  <span>Số lượng: {item.quantity}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">{item.price}₫</p>
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
            <p className="font-semibold">{order.shippingAddress.name}</p>
            <p className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>{order.shippingAddress.phone}</span>
            </p>
            <p className="text-muted-foreground">
              {order.shippingAddress.address}, {order.shippingAddress.city}
            </p>
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
            <p className="font-semibold">{order.paymentMethod}</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{order.total}₫</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className="text-green-600">Miễn phí</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Tổng cộng:</span>
                <span className="text-primary">{order.total}₫</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Ghi chú</h3>
          <Card>
            <CardContent className="p-4">
              <p className="text-muted-foreground">{order.notes}</p>
            </CardContent>
          </Card>
        </div>
      )}

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
        {order.status === "delivered" && (
          <Button variant="outline" className="flex-1">
            <RefreshCw className="h-4 w-4 mr-2" />
            Mua lại
          </Button>
        )}
      </div>
    </div>
  );
}
