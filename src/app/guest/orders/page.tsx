"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import OrderCard from "./components/order-card";
import { useListOrder } from "@/app/queries/useOrder";
import { GetOrdersType } from "@/schemaValidations/order.model";
import { statusConfig } from "@/constants/order.constant";
import { useSocket } from "@/lib/socket";

export default function OrdersPage() {
  const { socket, isConnected } = useSocket();
  const [filteredOrders, setFilteredOrders] = useState<GetOrdersType>({
    data: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { data, refetch } = useListOrder({ page: 1, limit: 100 });

  // Cập nhật filteredOrders khi data thay đổi
  useEffect(() => {
    if (!data) {
      setLoading(true);
      return;
    }
    const orders = data?.payload || { data: [] };
    setFilteredOrders(orders);
    setLoading(false);
  }, [data]);

  // Áp dụng bộ lọc khi selectedStatus hoặc searchQuery thay đổi
  useEffect(() => {
    if (!data) return;
    let filtered = [...data.payload.data];

    // Lọc theo trạng thái
    if (selectedStatus !== "all") {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id
            .toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.items.some((item) =>
            item.productName.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    setFilteredOrders({ ...data.payload, data: filtered });
  }, [data, selectedStatus, searchQuery]);

  // Xử lý socket để cập nhật đơn hàng
  useEffect(() => {
    if (!socket) return;

    const handlePayment = (paymentData: { status: string }) => {
      if (paymentData.status === "success") {
        refetch();
      }
    };
    const handleUpdateOrder = (paymentData: { status: string }) => {
      if (paymentData.status === "success") {
        refetch();
      }
    };
    socket.on("payment", handlePayment);
    socket.on("orders", handleUpdateOrder);
    return () => {
      socket.off("payment", handlePayment);
      socket.off("orders", handleUpdateOrder);
    };
  }, [socket, refetch]);

  // Hàm xóa bộ lọc
  const clearFilters = () => {
    setSelectedStatus("all");
    setSearchQuery("");
    setFilteredOrders(data?.payload || { data: [] });
  };

  if (!data) {
    return (
      <div className="flex justify-center">
        <div className={"relative w-16 h-16"}>
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  const orders = data?.payload.data || [];

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-blue-50 to-purple-50 dark:from-primary/20 dark:via-blue-950 dark:to-purple-950 py-20 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
              <Package className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Đơn Hàng Của Tôi
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Theo dõi và quản lý tất cả đơn hàng của bạn một cách dễ dàng
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-card py-8 border-b transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-muted rounded-2xl focus:outline-none focus:border-primary transition-colors text-lg"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-64 h-14 rounded-2xl border-2">
                <Filter className="h-5 w-5 mr-2" />
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <SelectItem key={status} value={status}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(selectedStatus !== "all" || searchQuery) && (
              <Button
                variant="outline"
                className="h-14 rounded-2xl border-2"
                onClick={clearFilters}
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
          {/* Active Filters */}
          {(selectedStatus !== "all" || searchQuery) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedStatus !== "all" && (
                <Badge variant="secondary" className="px-3 py-1">
                  {
                    statusConfig[selectedStatus as keyof typeof statusConfig]
                      ?.label
                  }
                  <button
                    onClick={() => setSelectedStatus("all")}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="secondary" className="px-3 py-1">
                  Tìm kiếm: {searchQuery}
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Order Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = orders.filter(
              (order) => order.status === status
            ).length;
            const StatusIcon = config.icon;
            return (
              <Card
                key={status}
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-0 shadow-lg rounded-3xl hover:-translate-y-1 ${
                  selectedStatus === status
                    ? "ring-4 ring-primary/30 shadow-2xl"
                    : ""
                }`}
                onClick={() =>
                  setSelectedStatus(selectedStatus === status ? "all" : status)
                }
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 rounded-2xl ${config.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  >
                    <StatusIcon className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-3xl font-bold mb-2">{count}</p>
                  <p className="text-sm text-muted-foreground font-medium">
                    {config.label}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="grid gap-8">
            {[...Array(3)].map((_, i) => (
              <Card
                key={i}
                className="border-0 shadow-lg rounded-3xl animate-pulse"
              >
                <div className="p-8 space-y-6">
                  <div className="flex justify-between">
                    <div className="space-y-3">
                      <div className="h-6 bg-muted rounded w-32" />
                      <div className="h-4 bg-muted rounded w-24" />
                    </div>
                    <div className="h-8 bg-muted rounded w-20" />
                  </div>
                  <div className="h-4 bg-muted rounded" />
                  <div className="space-y-3">
                    {[...Array(2)].map((_, j) => (
                      <div key={j} className="flex space-x-4">
                        <div className="w-12 h-12 bg-muted rounded-xl" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded" />
                          <div className="h-3 bg-muted rounded w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredOrders.data.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-muted/30 rounded-full mb-8">
              <Package className="h-16 w-16 text-muted-foreground" />
            </div>
            <h3 className="text-3xl font-bold mb-4">Không có đơn hàng nào</h3>
            <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
              {searchQuery || selectedStatus !== "all"
                ? "Không tìm thấy đơn hàng phù hợp với bộ lọc"
                : "Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!"}
            </p>
            <Button size="lg" className="px-8 py-6 text-lg rounded-2xl" asChild>
              <Link href="/products">Khám phá sản phẩm</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">
                {filteredOrders.data.length} đơn hàng
                {selectedStatus !== "all" &&
                  ` - ${
                    statusConfig[selectedStatus as keyof typeof statusConfig]
                      ?.label
                  }`}
              </h2>
            </div>

            <div className="grid gap-8">
              {filteredOrders.data.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>

            {/* Load More */}
            {Number(filteredOrders.data.length) >= 10 && (
              <div className="text-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 rounded-2xl border-2"
                >
                  Xem thêm đơn hàng
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
