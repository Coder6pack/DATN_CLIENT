"use client";

import React from "react";

import Image from "next/image";
import {
  Package,
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
import { statusConfig } from "@/constants/order.constant";
import { datePlus, getStatusProgress } from "@/lib/utils";
import { useGetOrder } from "@/app/queries/useOrder";

interface OrderDetailModalProps {
  orderId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetail({
  orderId,
  isOpen,
  onClose,
}: OrderDetailModalProps) {
  const { data } = useGetOrder({ id: orderId, enabled: Boolean(orderId) });
  if (!data) {
    return;
  }
  const order = data.payload;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Chi tiết đơn hàng {`DH${order.paymentId}`}</span>
            </div>
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
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
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
                      status: "PENDING_PAYMENT",
                      label: "Đặt hàng thành công",
                      time: order.createdAt,
                    },
                    {
                      status: "PENDING_PICKUP",
                      label: "Xác nhận đơn hàng",
                      time:
                        order.status !== "PENDING_PAYMENT"
                          ? order.createdAt
                          : null,
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
                      time:
                        order.status === "DELIVERED" ? order.createdAt : null,
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
                          : item.skuValue
                              .split("-")
                              .map((val) => `${val}`)}{" "}
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
                  <span className="font-semibold">{order.receiver.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{order.receiver.phone}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-muted-foreground">
                    {order.receiver.address}
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
                <p className="font-semibold">Online</p>
                {order.createdAt && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Dự kiến giao:{" "}
                      {datePlus({
                        date: order.createdAt,
                        plusTo: 3,
                      }).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                )}
                <Separator />
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
      </DialogContent>
    </Dialog>
  );
}
