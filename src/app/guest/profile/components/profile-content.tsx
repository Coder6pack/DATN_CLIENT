"use client";

import { useState } from "react";
import Image from "next/image";
import { Settings, Package, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import AvatarUpload from "./avatar-upload";
import OrderDetail from "./order-detail-model";
import UploadProfileGuestForm from "./upload-profile-guest-form";
import { useAccountMe } from "@/app/queries/useAccount";
import ChangeGuestPassword from "./change-guest-password";
import { useListOrder } from "@/app/queries/useOrder";
import { statusConfig } from "@/constants/order.constant";

export default function ProfileContent() {
  const [selectedOrderId, setSelectedOrderId] = useState<number>(0);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const { data } = useAccountMe();
  const { data: listOrder } = useListOrder({ page: 1, limit: 100 });
  if (!data || !listOrder) {
    return <div className="text-center">Loading...</div>;
  }
  const profile = data?.payload;
  const orders = listOrder.payload.data;
  const handleViewOrderDetail = (order: number) => {
    setSelectedOrderId(order);
    setIsOrderModalOpen(true);
  };
  const orderItems = orders.map((order) => order.items).flat();
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
                <span className="font-bold text-blue-800">
                  {orders.length ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <span className="text-sm font-medium text-green-700">
                  Tổng chi tiêu
                </span>
                <span className="font-bold text-green-800">
                  {orderItems
                    .reduce(
                      (acc, item) => acc + item.quantity * item.skuPrice,
                      0
                    )
                    .toLocaleString()}
                  ₫
                </span>
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
                  {orders.map((order) => {
                    const StatusIcon = statusConfig[order.status].icon;
                    return (
                      <div
                        key={order.id}
                        className="flex items-center space-x-4 p-6 bg-muted/50 rounded-2xl hover:bg-muted transition-colors cursor-pointer"
                      >
                        <Image
                          src={order.items.map((item) => item.image)[0]}
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
                              {new Date(order.createdAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                            <span>•</span>
                            <span>
                              {order.items.reduce(
                                (acc, item) => acc + item.quantity,
                                0
                              )}{" "}
                              sản phẩm
                            </span>
                            <span>•</span>
                            <span className="font-semibold text-primary">
                              {order.items.reduce(
                                (sum, item) =>
                                  sum + item.quantity * item.skuPrice,
                                0
                              )}
                              ₫
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                          onClick={() => handleViewOrderDetail(order.id)}
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
      <OrderDetail
        orderId={selectedOrderId}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </div>
  );
}
