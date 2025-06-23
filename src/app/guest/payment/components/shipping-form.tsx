"use client";

import { User, Phone, Mail, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ShippingFormProps {
  receiver: {
    name: string;
    phone: string;
    address: string;
  };
  onInputChange: (field: string, value: string | boolean) => void;
}

export default function ShippingForm({
  receiver,
  onInputChange,
}: ShippingFormProps) {
  return (
    <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-6">
        <CardTitle className="flex items-center space-x-3 text-2xl">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <span>Thông tin giao hàng</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-semibold text-gray-700"
            >
              Họ và tên *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Nhập họ và tên"
                value={receiver.name}
                onChange={(e) => onInputChange("name", e.target.value)}
                className="pl-10 h-12 rounded-xl border-2 focus:border-primary"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-sm font-semibold text-gray-700"
            >
              Số điện thoại *
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                placeholder="Nhập số điện thoại"
                value={receiver.phone}
                onChange={(e) => onInputChange("phone", e.target.value)}
                className="pl-10 h-12 rounded-xl border-2 focus:border-primary"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="address"
            className="text-sm font-semibold text-gray-700"
          >
            Địa chỉ cụ thể *
          </Label>
          <Input
            id="address"
            placeholder="Số nhà, tên đường"
            value={receiver.address}
            onChange={(e) => onInputChange("address", e.target.value)}
            className="h-12 rounded-xl border-2 focus:border-primary"
            required
          />
        </div>
      </CardContent>
    </Card>
  );
}
