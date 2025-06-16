"use client";

import { User, Phone, Mail, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ShippingFormProps {
  formData: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    notes: string;
    saveInfo: boolean;
  };
  onInputChange: (field: string, value: string | boolean) => void;
}

export default function ShippingForm({
  formData,
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
              htmlFor="fullName"
              className="text-sm font-semibold text-gray-700"
            >
              Họ và tên *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="fullName"
                placeholder="Nhập họ và tên"
                value={formData.fullName}
                onChange={(e) => onInputChange("fullName", e.target.value)}
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
                value={formData.phone}
                onChange={(e) => onInputChange("phone", e.target.value)}
                className="pl-10 h-12 rounded-xl border-2 focus:border-primary"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-sm font-semibold text-gray-700"
          >
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="Nhập địa chỉ email"
              value={formData.email}
              onChange={(e) => onInputChange("email", e.target.value)}
              className="pl-10 h-12 rounded-xl border-2 focus:border-primary"
            />
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
            value={formData.address}
            onChange={(e) => onInputChange("address", e.target.value)}
            className="h-12 rounded-xl border-2 focus:border-primary"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="city"
              className="text-sm font-semibold text-gray-700"
            >
              Tỉnh/Thành phố *
            </Label>
            <Input
              id="city"
              placeholder="Chọn tỉnh/thành"
              value={formData.city}
              onChange={(e) => onInputChange("city", e.target.value)}
              className="h-12 rounded-xl border-2 focus:border-primary"
              required
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="district"
              className="text-sm font-semibold text-gray-700"
            >
              Quận/Huyện *
            </Label>
            <Input
              id="district"
              placeholder="Chọn quận/huyện"
              value={formData.district}
              onChange={(e) => onInputChange("district", e.target.value)}
              className="h-12 rounded-xl border-2 focus:border-primary"
              required
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="ward"
              className="text-sm font-semibold text-gray-700"
            >
              Phường/Xã *
            </Label>
            <Input
              id="ward"
              placeholder="Chọn phường/xã"
              value={formData.ward}
              onChange={(e) => onInputChange("ward", e.target.value)}
              className="h-12 rounded-xl border-2 focus:border-primary"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="notes"
            className="text-sm font-semibold text-gray-700"
          >
            Ghi chú (tùy chọn)
          </Label>
          <Textarea
            id="notes"
            placeholder="Ghi chú cho đơn hàng (ví dụ: giao hàng sau 18h)"
            value={formData.notes}
            onChange={(e) => onInputChange("notes", e.target.value)}
            className="rounded-xl border-2 focus:border-primary resize-none"
            rows={3}
          />
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            id="saveInfo"
            checked={formData.saveInfo}
            onCheckedChange={(checked) =>
              onInputChange("saveInfo", checked as boolean)
            }
          />
          <Label
            htmlFor="saveInfo"
            className="text-sm text-muted-foreground cursor-pointer"
          >
            Lưu thông tin này cho lần mua hàng tiếp theo
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
