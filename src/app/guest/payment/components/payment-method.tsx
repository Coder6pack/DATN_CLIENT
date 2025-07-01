"use client";

import {
  CreditCard,
  Banknote,
  Smartphone,
  Building,
  Shield,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PaymentMethodProps {
  paymentMethod: string;
  onlineMethod: string;
  onPaymentMethodChange: (method: string) => void;
  onOnlineMethodChange: (method: string) => void;
}

export default function PaymentMethod({
  paymentMethod,
  onPaymentMethodChange,
}: PaymentMethodProps) {
  return (
    <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 pb-6">
        <CardTitle className="flex items-center space-x-3 text-2xl">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-white" />
          </div>
          <span>Phương thức thanh toán</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <RadioGroup
          value={paymentMethod}
          onValueChange={onPaymentMethodChange}
          className="space-y-6"
        >
          {/* Online Payment */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-6 border-2 rounded-2xl hover:bg-blue-50 transition-colors cursor-pointer">
              <RadioGroupItem value="online" id="online" className="w-5 h-5" />
              <Label htmlFor="online" className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Thanh toán trực tuyến</p>
                      <p className="text-sm text-muted-foreground">
                        Thẻ tín dụng, ví điện tử, chuyển khoản
                      </p>
                    </div>
                  </div>
                </div>
              </Label>
            </div>
          </div>

          {/* Cash Payment */}
          {/* <div className="flex items-center space-x-4 p-6 border-2 rounded-2xl hover:bg-orange-50 transition-colors cursor-pointer">
            <RadioGroupItem value="cash" id="cash" className="w-5 h-5" />
            <Label htmlFor="cash" className="flex-1 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <Banknote className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">
                      Thanh toán khi nhận hàng (COD)
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Thanh toán bằng tiền mặt khi nhận hàng
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-orange-200 text-orange-700"
                >
                  Phổ biến
                </Badge>
              </div>
            </Label>
          </div> */}
        </RadioGroup>

        {/* Security Notice */}
        <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-green-800">
                Thanh toán an toàn 100%
              </p>
              <p className="text-sm text-green-600">
                Thông tin của bạn được bảo vệ bởi mã hóa SSL 256-bit
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
