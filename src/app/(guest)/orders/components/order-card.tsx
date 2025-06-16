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

interface OrderCardProps {
  order: Order;
}

const statusConfig = {
  pending: {
    label: "Chờ xác nhận",
    color: "bg-yellow-500",
    icon: Clock,
    description: "Đơn hàng đang chờ được xác nhận",
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "bg-blue-500",
    icon: CheckCircle,
    description: "Đơn hàng đã được xác nhận và đang chuẩn bị",
  },
  shipping: {
    label: "Đang giao",
    color: "bg-purple-500",
    icon: Truck,
    description: "Đơn hàng đang trên đường giao đến bạn",
  },
  delivered: {
    label: "Đã giao",
    color: "bg-green-500",
    icon: Package,
    description: "Đơn hàng đã được giao thành công",
  },
  cancelled: {
    label: "Đã hủy",
    color: "bg-red-500",
    icon: AlertCircle,
    description: "Đơn hàng đã bị hủy",
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

export default function OrderCard({ order }: OrderCardProps) {
  const StatusIcon = statusConfig[order.status].icon;
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  return (
    <Card className="border-2 rounded-3xl hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold">{order.id}</CardTitle>
            <p className="text-sm text-muted-foreground flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(order.date).toLocaleDateString("vi-VN")}
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
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    {item.size && <span>Size: {item.size}</span>}
                    {item.color && <span>Màu: {item.color}</span>}
                    <span>SL: {item.quantity}</span>
                  </div>
                </div>
                <span className="text-sm font-semibold">{item.price}₫</span>
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
              {order.total}₫
            </span>
          </div>

          {order.trackingNumber && (
            <div className="flex items-center space-x-2 text-sm">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Mã vận đơn:</span>
              <span className="font-mono font-medium">
                {order.trackingNumber}
              </span>
            </div>
          )}

          {order.estimatedDelivery && (
            <div className="flex items-center space-x-2 text-sm">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Dự kiến giao:</span>
              <span className="font-medium">
                {new Date(order.estimatedDelivery).toLocaleDateString("vi-VN")}
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
              <OrderDetail order={order} />
            </DialogContent>
          </Dialog>

          {order.status === "delivered" && (
            <>
              <Button
                size="sm"
                className="flex-1"
                onClick={() => setShowReviewDialog(true)}
              >
                <Star className="h-4 w-4 mr-2" />
                Đánh giá
              </Button>
              <ReviewDialog
                isOpen={showReviewDialog}
                onClose={() => setShowReviewDialog(false)}
                orderItems={order.items}
                orderId={order.id}
              />
            </>
          )}

          {order.status === "shipping" && (
            <Button size="sm" variant="secondary" className="flex-1">
              <MapPin className="h-4 w-4 mr-2" />
              Theo dõi
            </Button>
          )}

          {order.status === "pending" && (
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
