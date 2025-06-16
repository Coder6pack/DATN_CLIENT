"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrderCard from "./components/order-card";

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

const mockOrders: Order[] = [
  {
    id: "ORD-2024-001",
    date: "2024-01-20",
    status: "delivered",
    total: "2,599,000",
    items: [
      {
        id: 1,
        name: "Áo Sơ Mi Premium Luxury Collection",
        image: "/placeholder.svg?height=100&width=100&text=Áo+Sơ+Mi",
        price: "1,299,000",
        quantity: 1,
        size: "L",
        color: "Trắng",
      },
      {
        id: 2,
        name: "Quần Jeans Skinny Fit",
        image: "/placeholder.svg?height=100&width=100&text=Quần+Jeans",
        price: "899,000",
        quantity: 1,
        size: "32",
        color: "Xanh đậm",
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
  {
    id: "ORD-2024-002",
    date: "2024-01-18",
    status: "shipping",
    total: "1,899,000",
    items: [
      {
        id: 3,
        name: "Giày Sneaker Trắng",
        image: "/placeholder.svg?height=100&width=100&text=Giày+Sneaker",
        price: "1,899,000",
        quantity: 1,
        size: "42",
        color: "Trắng",
      },
    ],
    shippingAddress: {
      name: "Trần Thị Bình",
      phone: "0987654321",
      address: "456 Đường Nguyễn Huệ, Phường 1",
      city: "TP. Hồ Chí Minh",
    },
    paymentMethod: "COD",
    trackingNumber: "VN987654321",
    estimatedDelivery: "2024-01-25",
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-15",
    status: "confirmed",
    total: "3,298,000",
    items: [
      {
        id: 4,
        name: "Áo Khoác Blazer",
        image: "/placeholder.svg?height=100&width=100&text=Áo+Khoác",
        price: "1,599,000",
        quantity: 1,
        size: "M",
        color: "Đen",
      },
      {
        id: 5,
        name: "Váy Maxi Hoa Nhí",
        image: "/placeholder.svg?height=100&width=100&text=Váy+Maxi",
        price: "1,299,000",
        quantity: 1,
        size: "S",
        color: "Hoa nhí",
      },
      {
        id: 6,
        name: "Túi Xách Tote",
        image: "/placeholder.svg?height=100&width=100&text=Túi+Xách",
        price: "799,000",
        quantity: 1,
        color: "Nâu",
      },
    ],
    shippingAddress: {
      name: "Lê Văn Cường",
      phone: "0369852147",
      address: "789 Đường Trần Hưng Đạo, Phường 5",
      city: "TP. Hồ Chí Minh",
    },
    paymentMethod: "Chuyển khoản",
    estimatedDelivery: "2024-01-28",
  },
  {
    id: "ORD-2024-004",
    date: "2024-01-10",
    status: "pending",
    total: "1,599,000",
    items: [
      {
        id: 7,
        name: "Áo Polo Nam Cao Cấp",
        image: "/placeholder.svg?height=100&width=100&text=Áo+Polo",
        price: "699,000",
        quantity: 1,
        size: "L",
        color: "Xanh navy",
      },
      {
        id: 8,
        name: "Quần Tây Công Sở",
        image: "/placeholder.svg?height=100&width=100&text=Quần+Tây",
        price: "899,000",
        quantity: 1,
        size: "32",
        color: "Xám",
      },
    ],
    shippingAddress: {
      name: "Phạm Thị Dung",
      phone: "0147258369",
      address: "321 Đường Võ Văn Tần, Phường 6",
      city: "TP. Hồ Chí Minh",
    },
    paymentMethod: "Ví điện tử",
    notes: "Giao hàng sau 18h",
  },
  {
    id: "ORD-2024-005",
    date: "2024-01-05",
    status: "cancelled",
    total: "2,199,000",
    items: [
      {
        id: 9,
        name: "Giày Oxford Da Thật",
        image: "/placeholder.svg?height=100&width=100&text=Giày+Oxford",
        price: "2,199,000",
        quantity: 1,
        size: "41",
        color: "Nâu",
      },
    ],
    shippingAddress: {
      name: "Hoàng Văn Em",
      phone: "0258147369",
      address: "654 Đường Pasteur, Phường 8",
      city: "TP. Hồ Chí Minh",
    },
    paymentMethod: "Thẻ tín dụng",
  },
];

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setLoading(false);
    };

    loadOrders();
  }, []);

  useEffect(() => {
    let filtered = [...orders];

    if (selectedStatus !== "all") {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.items.some((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    setFilteredOrders(filtered);
  }, [orders, selectedStatus, searchQuery]);

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

      {/* Filters & Search - Di chuyển ra ngoài container */}
      <div className="bg-card py-8 border-b transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-6">
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
                <SelectItem value="pending">Chờ xác nhận</SelectItem>
                <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                <SelectItem value="shipping">Đang giao</SelectItem>
                <SelectItem value="delivered">Đã giao</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
        ) : filteredOrders.length === 0 ? (
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
                {filteredOrders.length} đơn hàng
                {selectedStatus !== "all" &&
                  ` - ${
                    statusConfig[selectedStatus as keyof typeof statusConfig]
                      .label
                  }`}
              </h2>
            </div>

            <div className="grid gap-8">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>

            {/* Load More */}
            {filteredOrders.length >= 10 && (
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
