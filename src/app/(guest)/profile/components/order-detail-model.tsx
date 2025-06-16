"use client";

import React from "react";

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
  X,
  Calendar,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

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

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
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

export default function OrderDetailModal({
  order,
  isOpen,
  onClose,
}: OrderDetailModalProps) {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Chi tiết đơn hàng {order.id}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Order Status */}
          <Card className="border-0 shadow-lg rounded-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-12 h-12 rounded-xl ${
                      statusConfig[order.status].color
                    } flex items-center justify-center`}
                  >
                    {React.createElement(statusConfig[order.status].icon, {
                      className: "h-6 w-6 text-white",
                    })}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {statusConfig[order.status].label}
                    </h3>
                    <p className="text-muted-foreground">
                      Đặt hàng ngày{" "}
                      {new Date(order.date).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
                <Badge
                  className={`${
                    statusConfig[order.status].color
                  } text-white px-4 py-2`}
                >
                  {statusConfig[order.status].label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Status Timeline */}
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
                        order.status === "delivered"
                          ? order.estimatedDelivery
                          : null,
                    },
                  ].map((step, index) => {
                    const isActive = order.status === step.status;
                    const isCompleted =
                      getStatusProgress(order.status) >
                      getStatusProgress(step.status);
                    const StatusIcon =
                      statusConfig[step.status as keyof typeof statusConfig]
                        .icon;

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
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="border-0 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle>Sản phẩm đã đặt</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Shipping & Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Địa chỉ giao hàng</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">
                    {order.shippingAddress.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{order.shippingAddress.phone}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-muted-foreground">
                    {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Thanh toán</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="font-semibold">{order.paymentMethod}</p>
                {order.trackingNumber && (
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Mã vận đơn:{" "}
                      <span className="font-mono">{order.trackingNumber}</span>
                    </span>
                  </div>
                )}
                {order.estimatedDelivery && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Dự kiến giao:{" "}
                      {new Date(order.estimatedDelivery).toLocaleDateString(
                        "vi-VN"
                      )}
                    </span>
                  </div>
                )}
                <Separator />
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
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle>Ghi chú</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
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
      </DialogContent>
    </Dialog>
  );
}
