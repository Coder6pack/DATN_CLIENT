import { AlertCircle, CheckCircle, Clock, Package, Truck } from "lucide-react";

export const OrderStatus = {
  PENDING_PAYMENT: "PENDING_PAYMENT",
  PENDING_PICKUP: "PENDING_PICKUP",
  PENDING_DELIVERY: "PENDING_DELIVERY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
} as const;

export const OrderStatusLabels = {
  [OrderStatus.PENDING_PAYMENT]: "Pending Payment",
  [OrderStatus.PENDING_PICKUP]: "Pending Pickup",
  [OrderStatus.PENDING_DELIVERY]: "Pending Delivery",
  [OrderStatus.DELIVERED]: "Delivered",
  [OrderStatus.CANCELLED]: "Cancelled",
} as const;

export const OrderStatusColors = {
  [OrderStatus.PENDING_PAYMENT]: "bg-yellow-100 text-yellow-800",
  [OrderStatus.PENDING_PICKUP]: "bg-blue-100 text-blue-800",
  [OrderStatus.PENDING_DELIVERY]: "bg-purple-100 text-purple-800",
  [OrderStatus.DELIVERED]: "bg-green-100 text-green-800",
  [OrderStatus.CANCELLED]: "bg-red-100 text-red-800",
} as const;

export const statusConfig = {
  PENDING_PAYMENT: {
    label: "Chờ thanh toán",
    color: "bg-yellow-500",
    icon: Clock,
    description: "Đơn hàng đang chờ được xác nhận",
  },
  PENDING_PICKUP: {
    label: "Đang chuẩn bị",
    color: "bg-blue-500",
    icon: CheckCircle,
    description: "Đơn hàng đã được xác nhận và đang chuẩn bị",
  },
  PENDING_DELIVERY: {
    label: "Đang giao",
    color: "bg-purple-500",
    icon: Truck,
    description: "Đơn hàng đang trên đường giao đến bạn",
  },
  DELIVERED: {
    label: "Đã giao",
    color: "bg-green-500",
    icon: Package,
    description: "Đơn hàng đã được giao thành công",
  },
  CANCELLED: {
    label: "Đã hủy",
    color: "bg-red-500",
    icon: AlertCircle,
    description: "Đơn hàng đã bị hủy",
  },
};
export type OrderStatusType = (typeof OrderStatus)[keyof typeof OrderStatus];
