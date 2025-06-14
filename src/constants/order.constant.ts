export const OrderStatus = {
  PENDING_PAYMENT: "PENDING_PAYMENT",
  PENDING_PICKUP: "PENDING_PICKUP",
  PENDING_DELIVERY: "PENDING_DELIVERY",
  DELIVERED: "DELIVERED",
  RETURNED: "RETURNED",
  CANCELLED: "CANCELLED",
} as const;

export const OrderStatusLabels = {
  [OrderStatus.PENDING_PAYMENT]: "Pending Payment",
  [OrderStatus.PENDING_PICKUP]: "Pending Pickup",
  [OrderStatus.PENDING_DELIVERY]: "Pending Delivery",
  [OrderStatus.DELIVERED]: "Delivered",
  [OrderStatus.RETURNED]: "Returned",
  [OrderStatus.CANCELLED]: "Cancelled",
} as const;

export const OrderStatusColors = {
  [OrderStatus.PENDING_PAYMENT]: "bg-yellow-100 text-yellow-800",
  [OrderStatus.PENDING_PICKUP]: "bg-blue-100 text-blue-800",
  [OrderStatus.PENDING_DELIVERY]: "bg-purple-100 text-purple-800",
  [OrderStatus.DELIVERED]: "bg-green-100 text-green-800",
  [OrderStatus.RETURNED]: "bg-orange-100 text-orange-800",
  [OrderStatus.CANCELLED]: "bg-red-100 text-red-800",
} as const;

export type OrderStatusType = (typeof OrderStatus)[keyof typeof OrderStatus];
