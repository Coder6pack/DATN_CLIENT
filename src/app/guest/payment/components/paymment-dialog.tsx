"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  QrCode,
  Copy,
  CheckCircle,
  Clock,
  CreditCard,
  Smartphone,
  Building2,
  User,
  Hash,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import envConfig from "@/config";
import { useListCart } from "@/app/queries/useCart";
import { useSocket } from "@/lib/socket";

interface PaymentData {
  status: string;
  // Thêm các thuộc tính khác nếu cần
}
interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalAmount: number;
  onPaymentSuccess: () => void;
  paymentId: number;
  qrCode: string;
}

export default function PaymentDialog({
  open,
  onOpenChange,
  totalAmount,
  onPaymentSuccess,
  paymentId,
  qrCode,
}: PaymentDialogProps) {
  const { socket, isConnected } = useSocket();
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "checking" | "success"
  >("pending");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!open || paymentStatus !== "pending") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, paymentStatus]);

  useEffect(() => {
    if (!socket) return; // Thoát sớm nếu socket chưa sẵn sàng

    const handlePayment = (paymentData: PaymentData) => {
      if (paymentData.status === "success") {
        // Tạo timer và lưu vào timersRef
        const timer = setTimeout(() => {
          setPaymentStatus("success");
          setShowConfetti(true);

          // Tạo timer thứ hai
          const closeTimer = setTimeout(() => {
            onPaymentSuccess();
            onOpenChange(false);
          }, 3000);

          timersRef.current.push(closeTimer);
        }, 3000);

        timersRef.current.push(timer);
      }
    };

    socket.on("payment", handlePayment);

    return () => {
      socket.off("payment", handlePayment);
      // Dọn dẹp tất cả timer
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current = [];
    };
  }, [
    socket,
    onPaymentSuccess,
    onOpenChange,
    setPaymentStatus,
    setShowConfetti,
  ]);
  // useEffect(() => {
  //   let checkTimer: NodeJS.Timeout | null = null;
  //   if (socket) {
  //     // Lắng nghe sự kiện 'payment'
  //     socket.on("payment", (paymentData: { status: string }) => {
  //       if (paymentData.status === "success") {
  //         checkTimer = setTimeout(() => {
  //           setPaymentStatus("success");
  //           setShowConfetti(true);
  //           setTimeout(() => {
  //             onPaymentSuccess();
  //             onOpenChange(false);
  //           }, 3000);
  //         }, 3000);
  //       }
  //     });

  //     return () => {
  //       socket.off("payment");
  //       if (checkTimer) clearTimeout(checkTimer);
  //     };
  //   }
  // }, [socket, onPaymentSuccess, onOpenChange]);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setPaymentStatus("pending");
      setTimeLeft(600);
      setShowConfetti(false);
    }
  }, [open]);

  const { data } = useListCart({ page: 1, limit: 10 });
  if (!data) {
    return null;
  }
  const listCart =
    data.payload.data.length === 0 ? [] : data.payload.data[0].cartItems;
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Đã sao chép!",
        description: `${label} đã được sao chép vào clipboard`,
      });
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Không thể sao chép. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentCheck = () => {
    setPaymentStatus("checking");
  };

  if (paymentStatus === "success") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md mx-auto">
          <div className="text-center py-8">
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-bounce"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random()}s`,
                    }}
                  >
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                  </div>
                ))}
              </div>
            )}

            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <h3 className="text-2xl font-bold text-green-600 mb-2">
              Thanh toán thành công!
            </h3>

            <p className="text-muted-foreground mb-6">
              Đơn hàng của bạn đã được xác nhận và sẽ được xử lý trong thời gian
              sớm nhất.
            </p>

            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-2xl">
              <p className="text-sm text-green-700 dark:text-green-300">
                Mã đơn hàng:{" "}
                <span className="font-bold">
                  #{`${envConfig.NEXT_PUBLIC_CONTENT}${paymentId}`}
                </span>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Thanh toán đơn hàng
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>Hãy kiểm tra kĩ đơn hàng</DialogDescription>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code Section */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                    <QrCode className="h-6 w-6 text-primary" />
                  </div>

                  <h3 className="text-xl font-bold">
                    Quét mã QR để thanh toán
                  </h3>

                  {/* QR Code */}
                  <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-gray-300 mx-auto w-fit">
                    <Image
                      src={qrCode}
                      alt="QR Code"
                      width={200}
                      height={200}
                      className="mx-auto"
                    />
                  </div>

                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Smartphone className="h-4 w-4" />
                    <span>Sử dụng app ngân hàng để quét mã</span>
                  </div>

                  {/* Timer */}
                  <div className="bg-orange-50 dark:bg-orange-950 p-3 rounded-xl">
                    <div className="flex items-center justify-center space-x-2 text-orange-600">
                      <Clock className="h-4 w-4" />
                      <span className="font-mono text-lg font-bold">
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                    <p className="text-xs text-orange-600 mt-1">
                      Thời gian còn lại
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Status */}
            <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  {paymentStatus === "pending" && (
                    <>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <Clock className="h-6 w-6 text-blue-600" />
                      </div>
                      <h4 className="font-semibold">Đang chờ thanh toán</h4>
                      <p className="text-sm text-muted-foreground">
                        Vui lòng thực hiện thanh toán theo thông tin bên cạnh
                      </p>
                      <Button
                        onClick={handlePaymentCheck}
                        className="w-full"
                        variant="outline"
                      >
                        Tôi đã thanh toán
                      </Button>
                    </>
                  )}

                  {paymentStatus === "checking" && (
                    <>
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                        <div className="w-6 h-6 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />
                      </div>
                      <h4 className="font-semibold">
                        Đang kiểm tra thanh toán
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Vui lòng đợi trong giây lát...
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bank Transfer Info */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold">
                      Thông tin chuyển khoản
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Bank Name */}
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Ngân hàng
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">
                          {envConfig.NEXT_PUBLIC_BANK_NAME}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            copyToClipboard(
                              envConfig.NEXT_PUBLIC_BANK_NAME,
                              "Tên ngân hàng"
                            )
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Account Number */}
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Số tài khoản
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-semibold">
                          {envConfig.NEXT_PUBLIC_ACC}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            copyToClipboard(
                              envConfig.NEXT_PUBLIC_ACC,
                              "Số tài khoản"
                            )
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Account Name */}
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Chủ tài khoản
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">
                          {envConfig.NEXT_PUBLIC_OWNER_NAME}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            copyToClipboard(
                              envConfig.NEXT_PUBLIC_OWNER_NAME,
                              "Tên chủ tài khoản"
                            )
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="flex items-center justify-between p-3 bg-primary/10 rounded-xl border border-primary/20">
                      <div className="flex items-center space-x-3">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <span className="text-sm text-primary font-medium">
                          Số tiền
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-primary text-lg">
                          {totalAmount.toLocaleString()}₫
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            copyToClipboard(totalAmount.toString(), "Số tiền")
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Transfer Content */}
                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950 rounded-xl border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                          Nội dung CK
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-yellow-700 dark:text-yellow-300">
                          {`${envConfig.NEXT_PUBLIC_CONTENT}${paymentId}`}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            copyToClipboard(
                              `${envConfig.NEXT_PUBLIC_CONTENT}${paymentId}`,
                              "Nội dung chuyển khoản"
                            )
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-xl mt-6">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                      Lưu ý quan trọng:
                    </h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Vui lòng chuyển khoản đúng số tiền</li>
                      <li>• Nhập đúng nội dung chuyển khoản</li>
                      <li>• Đơn hàng sẽ được xử lý sau khi nhận được tiền</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">Tóm tắt đơn hàng</h4>
                <div className="space-y-3">
                  {listCart.slice(0, 2).map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <Image
                        src={item.sku.image}
                        alt={item.sku.product.name}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.sku.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.sku.value.split("-").length > 1
                            ? item.sku.value
                                .split("-")
                                .map((val) => `${val} • `)
                            : item.sku.value
                                .split("-")
                                .map((val) => `${val}`)}{" "}
                          x{item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-semibold">
                        {(item.sku.price * item.quantity).toLocaleString()}₫
                      </span>
                    </div>
                  ))}

                  {listCart.length > 2 && (
                    <p className="text-sm text-muted-foreground text-center">
                      +{listCart.length - 2} sản phẩm khác
                    </p>
                  )}

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng:</span>
                    <span className="text-primary">
                      {totalAmount.toLocaleString()}₫
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
