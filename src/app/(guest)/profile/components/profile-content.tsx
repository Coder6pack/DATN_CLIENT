"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Settings,
  Package,
  Lock,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Truck,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import AvatarUpload from "./avatar-upload";
import OrderDetailModal from "./order-detail-model";
import UploadProfileGuestForm from "./upload-profile-guest-form";
import { useAccountMe } from "@/app/queries/useAccount";
import ChangeGuestPassword from "./change-guest-password";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
}

interface RecentOrder {
  id: string;
  date: string;
  status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
  total: string;
  itemCount: number;
  image: string;
  items: Array<{
    id: number;
    name: string;
    image: string;
    price: string;
    quantity: number;
    size?: string;
    color?: string;
  }>;
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

interface ProfileContentProps {
  initialProfile?: UserProfile;
  initialOrders?: RecentOrder[];
}

const statusConfig = {
  pending: { label: "Chờ xác nhận", color: "bg-yellow-500", icon: Clock },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-500", icon: CheckCircle },
  shipping: { label: "Đang giao", color: "bg-purple-500", icon: Truck },
  delivered: { label: "Đã giao", color: "bg-green-500", icon: Package },
  cancelled: { label: "Đã hủy", color: "bg-red-500", icon: AlertCircle },
};

export default function ProfileContent({
  initialProfile,
  initialOrders,
}: ProfileContentProps) {
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>(
    initialOrders || [
      {
        id: "ORD-2024-001",
        date: "2024-01-20",
        status: "delivered",
        total: "2,599,000",
        itemCount: 3,
        image: "/placeholder.svg?height=60&width=60&text=Order1",
        items: [
          {
            id: 1,
            name: "Áo Sơ Mi Premium",
            image: "/placeholder.svg?height=80&width=80&text=Áo",
            price: "1,299,000",
            quantity: 1,
            size: "L",
            color: "Trắng",
          },
          {
            id: 2,
            name: "Quần Jeans",
            image: "/placeholder.svg?height=80&width=80&text=Quần",
            price: "899,000",
            quantity: 1,
            size: "32",
            color: "Xanh",
          },
        ],
        shippingAddress: {
          name: "Nguyễn Văn An",
          phone: "0123456789",
          address: "123 Đường Lê Lợi, Phường Bến Nghé",
          city: "TP. Hồ Chí Minh",
        },
        paymentMethod: "Thẻ tín dụng",
        trackingNumber: "VN123456789",
        estimatedDelivery: "2024-01-22",
      },
    ]
  );

  const [saving, setSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<RecentOrder | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { data } = useAccountMe();

  const profile = data?.payload;
  const handleViewOrderDetail = (order: RecentOrder) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Profile Sidebar */}
      <div className="lg:col-span-1">
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden sticky top-8 transition-colors duration-300">
          <CardContent className="p-8 text-center">
            <div className="relative inline-block mb-6">
              <AvatarUpload />
            </div>

            <h2 className="text-2xl font-bold mb-2">{profile?.name}</h2>
            <p className="text-muted-foreground mb-6">{profile?.email}</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <span className="text-sm font-medium text-blue-700">
                  Tổng đơn hàng
                </span>
                <span className="font-bold text-blue-800">100</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <span className="text-sm font-medium text-green-700">
                  Tổng chi tiêu
                </span>
                <span className="font-bold text-green-800">{10000000}₫</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                <span className="text-sm font-medium text-purple-700">
                  Thành viên từ
                </span>
                <span className="font-bold text-purple-800">
                  {new Date(
                    profile?.createdAt ?? new Date()
                  ).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 h-14 p-1 bg-card shadow-lg rounded-2xl">
            <TabsTrigger
              value="profile"
              className="text-lg font-semibold rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Settings className="h-5 w-5 mr-2" />
              Thông tin cá nhân
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="text-lg font-semibold rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Package className="h-5 w-5 mr-2" />
              Đơn hàng
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="text-lg font-semibold rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Lock className="h-5 w-5 mr-2" />
              Đổi mật khẩu
            </TabsTrigger>
          </TabsList>
          {/* Profile Information */}
          <TabsContent value="profile">
            <UploadProfileGuestForm />
          </TabsContent>
          showCurrentPassword
          {/* Orders */}
          <TabsContent value="orders">
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden transition-colors duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 pb-6">
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <span>Đơn hàng gần đây</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {recentOrders.map((order) => {
                    const StatusIcon = statusConfig[order.status].icon;
                    return (
                      <div
                        key={order.id}
                        className="flex items-center space-x-4 p-6 bg-muted/50 rounded-2xl hover:bg-muted transition-colors cursor-pointer"
                      >
                        <Image
                          src={order.image || "/placeholder.svg"}
                          alt={`Order ${order.id}`}
                          width={60}
                          height={60}
                          className="rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-lg">{order.id}</h4>
                            <Badge
                              className={`${
                                statusConfig[order.status].color
                              } text-white`}
                            >
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig[order.status].label}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>
                              {new Date(order.date).toLocaleDateString("vi-VN")}
                            </span>
                            <span>•</span>
                            <span>{order.itemCount} sản phẩm</span>
                            <span>•</span>
                            <span className="font-semibold text-primary">
                              {order.total}₫
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                          onClick={() => handleViewOrderDetail(order)}
                        >
                          Xem chi tiết
                        </Button>
                      </div>
                    );
                  })}
                </div>

                <Separator className="my-8" />

                <div className="text-center">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 rounded-2xl border-2"
                  >
                    Xem tất cả đơn hàng
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Change Password */}
          <TabsContent value="password">
            <ChangeGuestPassword />
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </div>
  );
}
