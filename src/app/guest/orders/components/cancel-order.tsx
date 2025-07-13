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
  Delete,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import envConfig from "@/config";
import { useSocket } from "@/lib/socket";
import { useRouter } from "next/navigation";
import { useCancelOrderMutation, useGetOrder } from "@/app/queries/useOrder";
import { generateQrCode, handleHttpErrorApi } from "@/lib/utils";

interface CancelOrderDialogProps {
  open: boolean;
  orderId: number;
  onOpenChange: (open: boolean) => void;
}

export default function CancelOrder({
  open,
  orderId,
  onOpenChange,
}: CancelOrderDialogProps) {
  const { mutateAsync } = useCancelOrderMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const handleOnclick = async () => {
    setIsSubmitting(true);
    try {
      const result = await mutateAsync(orderId);
      if (result) {
        toast({
          title: "Cập nhật thành công",
          description: "Bạn đã huỷ đơn hàng thành công",
        });
        onOpenChange(false);
        router.refresh();
      }
    } catch (error) {
      handleHttpErrorApi({
        error,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Huỷ đơn hàng
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>Hãy kiểm tra kĩ đơn hàng</DialogDescription>
        <div className="p-2">
          <div>
            Đơn hàng{" "}
            <span className="bg-foreground text-primary-foreground rounded px-1">
              {orderId}
            </span>{" "}
            sẽ được huỷ ?
          </div>
          <div className="flex justify-end gap-3">
            <Button onClick={() => onOpenChange(false)}>Thoát</Button>
            <Button
              onClick={handleOnclick}
              disabled={isSubmitting}
              className="px-8 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full border-b-2 border-white mr-2" />
                  {"Đang huỷ..."}
                </>
              ) : (
                <>
                  <Delete />
                  {"Đồng ý"}
                </>
              )}
            </Button>
            {/* <Button onClick={handleOnclick}>Đồng ý</Button> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
