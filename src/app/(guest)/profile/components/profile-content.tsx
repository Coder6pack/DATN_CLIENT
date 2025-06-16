"use client";

import { useState } from "react";
import Image from "next/image";
import {
  User,
  Settings,
  Package,
  Lock,
  Edit3,
  Save,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import AvatarUpload from "./avatar-upload";
import OrderDetailModal from "./order-detail-model";

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
  const [profile, setProfile] = useState<UserProfile>(
    initialProfile || {
      id: "USER-001",
      fullName: "Nguyễn Văn An",
      email: "nguyenvanan@email.com",
      phone: "0123456789",
      avatar: "/placeholder.svg?height=120&width=120&text=Avatar",
      dateOfBirth: "1990-05-15",
      gender: "Nam",
      address: "123 Đường Lê Lợi",
      city: "TP. Hồ Chí Minh",
      district: "Quận 1",
      ward: "Phường Bến Nghé",
      joinDate: "2023-01-15",
      totalOrders: 24,
      totalSpent: 15680000,
    }
  );

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

  const [editing, setEditing] = useState(false);
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

  const [avatarUrl, setAvatarUrl] = useState(profile.avatar);

  const handleSaveProfile = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSaving(false);
    setEditing(false);
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSaving(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    alert("Đổi mật khẩu thành công!");
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

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
              <AvatarUpload
                currentAvatar={avatarUrl}
                userName={profile.fullName}
                onAvatarChange={(newAvatar) => {
                  setAvatarUrl(newAvatar);
                  setProfile((prev) => ({ ...prev, avatar: newAvatar }));
                }}
              />
            </div>

            <h2 className="text-2xl font-bold mb-2">{profile.fullName}</h2>
            <p className="text-muted-foreground mb-6">{profile.email}</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <span className="text-sm font-medium text-blue-700">
                  Tổng đơn hàng
                </span>
                <span className="font-bold text-blue-800">
                  {profile.totalOrders}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <span className="text-sm font-medium text-green-700">
                  Tổng chi tiêu
                </span>
                <span className="font-bold text-green-800">
                  {profile.totalSpent.toLocaleString()}₫
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                <span className="text-sm font-medium text-purple-700">
                  Thành viên từ
                </span>
                <span className="font-bold text-purple-800">
                  {new Date(profile.joinDate).toLocaleDateString("vi-VN")}
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
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden transition-colors duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-3 text-2xl">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span>Thông tin cá nhân</span>
                  </CardTitle>
                  <Button
                    variant={editing ? "destructive" : "default"}
                    onClick={() =>
                      editing ? setEditing(false) : setEditing(true)
                    }
                    className="rounded-xl"
                  >
                    {editing ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Hủy
                      </>
                    ) : (
                      <>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="text-sm font-semibold text-foreground"
                    >
                      Họ và tên
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        value={profile.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        disabled={!editing}
                        className="pl-10 h-12 rounded-xl border-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-semibold text-foreground"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        disabled={!editing}
                        className="pl-10 h-12 rounded-xl border-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-sm font-semibold text-foreground"
                    >
                      Số điện thoại
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        disabled={!editing}
                        className="pl-10 h-12 rounded-xl border-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="dateOfBirth"
                      className="text-sm font-semibold text-foreground"
                    >
                      Ngày sinh
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={profile.dateOfBirth}
                        onChange={(e) =>
                          handleInputChange("dateOfBirth", e.target.value)
                        }
                        disabled={!editing}
                        className="pl-10 h-12 rounded-xl border-2"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label
                      htmlFor="address"
                      className="text-sm font-semibold text-foreground"
                    >
                      Địa chỉ
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea
                        id="address"
                        value={`${profile.address}, ${profile.ward}, ${profile.district}, ${profile.city}`}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        disabled={!editing}
                        className="pl-10 rounded-xl border-2 resize-none"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {editing && (
                  <div className="flex justify-end mt-8">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-blue-600"
                    >
                      {saving ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Đang lưu...</span>
                        </div>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Lưu thay đổi
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

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
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden transition-colors duration-300">
              <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 pb-6">
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                    <Lock className="h-5 w-5 text-white" />
                  </div>
                  <span>Đổi mật khẩu</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="max-w-md mx-auto space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="currentPassword"
                      className="text-sm font-semibold text-foreground"
                    >
                      Mật khẩu hiện tại
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            currentPassword: e.target.value,
                          }))
                        }
                        className="pl-10 pr-12 h-12 rounded-xl border-2"
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="newPassword"
                      className="text-sm font-semibold text-foreground"
                    >
                      Mật khẩu mới
                    </Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            newPassword: e.target.value,
                          }))
                        }
                        className="pl-10 pr-12 h-12 rounded-xl border-2"
                        placeholder="Nhập mật khẩu mới"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-semibold text-foreground"
                    >
                      Xác nhận mật khẩu mới
                    </Label>
                    <div className="relative">
                      <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        className="pl-10 pr-12 h-12 rounded-xl border-2"
                        placeholder="Nhập lại mật khẩu mới"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Yêu cầu mật khẩu:
                    </h4>
                    <ul className="text-sm text-blue-600 space-y-1">
                      <li>• Ít nhất 8 ký tự</li>
                      <li>• Bao gồm chữ hoa và chữ thường</li>
                      <li>• Có ít nhất 1 số</li>
                      <li>• Có ít nhất 1 ký tự đặc biệt</li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleChangePassword}
                    disabled={
                      saving ||
                      !passwordData.currentPassword ||
                      !passwordData.newPassword ||
                      !passwordData.confirmPassword
                    }
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                  >
                    {saving ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Đang cập nhật...</span>
                      </div>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        Đổi mật khẩu
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
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
