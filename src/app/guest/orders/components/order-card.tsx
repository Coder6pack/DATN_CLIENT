"use client";

import Image from "next/image";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Eye,
  Star,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import OrderDetail from "./order-detail";
import ReviewDialog from "./review-dialog";
import { GetOrderPropsType } from "@/schemaValidations/order.model";
import { statusConfig } from "@/constants/order.constant";

const getStatusProgress = (status: string) => {
  switch (status) {
    case "PENDING_PAYMENT":
      return 25;
    case "PENDING_PICKUP":
      return 50;
    case "PENDING_DELIVERY":
      return 75;
    case "DELIVERED":
      return 100;
    case "CANCELLED":
      return 0;
    default:
      return 0;
  }
};

export default function OrderCard({ order }: GetOrderPropsType) {
  const StatusIcon = statusConfig[order.status].icon;
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  return (
    <Card className="border-2 rounded-3xl hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold">
              {`Đơn hàng ${order.id}`}
            </CardTitle>
            <p className="text-sm text-muted-foreground flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(order.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>
          <Badge
            className={`${
              statusConfig[order.status].color
            } text-white px-3 py-1 flex items-center space-x-1`}
          >
            <StatusIcon className="h-4 w-4" />
            <span>{statusConfig[order.status].label}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tiến độ đơn hàng</span>
            <span className="font-medium">
              {getStatusProgress(order.status)}%
            </span>
          </div>
          <Progress value={getStatusProgress(order.status)} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {statusConfig[order.status].description}
          </p>
        </div>

        {/* Items Preview */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">
            Sản phẩm ({order.items.length})
          </h4>
          <div className="space-y-2">
            {order.items.slice(0, 2).map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <Image
                  src={item.image}
                  alt={item.productName}
                  width={50}
                  height={50}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {item.productName}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    {item.skuValue.split("-").length > 1
                      ? item.skuValue.split("-").map((val) => `${val} • `)
                      : item.skuValue.split("-").map((val) => `${val}`)}{" "}
                    x{item.quantity}
                  </div>
                </div>
                <span className="text-sm font-semibold">
                  {item.skuPrice.toLocaleString()}₫
                </span>
              </div>
            ))}
            {order.items.length > 2 && (
              <p className="text-xs text-muted-foreground text-center py-2">
                +{order.items.length - 2} sản phẩm khác
              </p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t pt-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Tổng tiền:</span>
            <span className="text-lg font-bold text-primary">
              {order.items
                .reduce((acc, item) => acc + item.skuPrice, 0)
                .toLocaleString()}
              ₫
            </span>
          </div>

          {order.paymentId && (
            <div className="flex items-center space-x-2 text-sm">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Mã vận đơn:</span>
              <span className="font-mono font-medium">{`DH${order.paymentId}`}</span>
            </div>
          )}

          {order.createdAt && (
            <div className="flex items-center space-x-2 text-sm">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Dự kiến giao:</span>
              <span className="font-medium">
                {new Date(order.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                Chi tiết
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Chi tiết đơn hàng {order.id}</span>
                </DialogTitle>
              </DialogHeader>
              <OrderDetail orderId={order.id} />
            </DialogContent>
          </Dialog>

          {order.status === "DELIVERED" && (
            <>
              <Button
                size="sm"
                className="flex-1"
                onClick={() => setShowReviewDialog(true)}
              >
                <Star className="h-4 w-4 mr-2" />
                Đánh giá
              </Button>
              {/* <ReviewDialog
                isOpen={showReviewDialog}
                onClose={() => setShowReviewDialog(false)}
                orderItems={order.items}
                orderId={order.id}
              /> */}
            </>
          )}

          {order.status === "PENDING_PICKUP" && (
            <Button size="sm" variant="secondary" className="flex-1">
              <MapPin className="h-4 w-4 mr-2" />
              Theo dõi
            </Button>
          )}

          {order.status === "CANCELLED" && (
            <Button size="sm" variant="destructive" className="flex-1">
              <AlertCircle className="h-4 w-4 mr-2" />
              Hủy đơn
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
