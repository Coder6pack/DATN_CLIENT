"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetOrder } from "@/app/queries/useOrder";
import { formatCurrency } from "@/lib/utils";
import {
  Package,
  User,
  MapPin,
  Phone,
  Calendar,
  Printer,
  Download,
} from "lucide-react";
import {
  OrderStatusColors,
  OrderStatusLabels,
} from "@/constants/order.constant";
interface OrderDetailProps {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
}

export default function OrderDetail({ id, setId }: OrderDetailProps) {
  const [open, setOpen] = useState(false);

  const {
    data: orderDetail,
    isLoading,
    isError,
  } = useGetOrder({
    id: id || 0,
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (id) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [id]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setId(undefined);
    }
    setOpen(newOpen);
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogTitle className="px-6 pt-4">Order Details</DialogTitle>
          <DialogDescription className="px-6">
            Loading order information...
          </DialogDescription>

          <div className="flex items-center justify-center h-96">
            <div className="flex items-center space-x-2">
              <div className="animate-spin h-5 w-5 border-t-2 border-primary rounded-full" />
              <div className="text-muted-foreground">
                Loading order details...
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isError || !orderDetail) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogTitle className="px-6 pt-4">Order Details</DialogTitle>
          <DialogDescription className="px-6">
            Error loading order information
          </DialogDescription>

          <div className="flex items-center justify-center h-96">
            <div className="text-red-500">Error loading order details</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const order = orderDetail.payload;
  const totalAmount = order.items.reduce(
    (sum, item) => sum + item.skuPrice * item.quantity,
    0
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogTitle className="px-6 pt-4">
          Order Details - #{order.id}
        </DialogTitle>
        <DialogDescription className="px-6">
          Complete order information and items
        </DialogDescription>

        <ScrollArea className="max-h-[calc(90vh-80px)]">
          <div className="px-6 py-4 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Summary
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Printer className="h-4 w-4" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Order ID
                    </div>
                    <div className="font-medium">#{order.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <Badge className={OrderStatusColors[order.status]}>
                      {OrderStatusLabels[order.status]}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Customer ID
                    </div>
                    <div className="font-medium">#{order.userId}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Payment ID
                    </div>
                    <div className="font-medium">#{order.paymentId}</div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Created
                      </div>
                      <div className="font-medium">
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Last Updated
                      </div>
                      <div className="font-medium">
                        {new Date(order.updatedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Receiver Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Receiver Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Name</div>
                      <div className="font-medium">{order.receiver.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                      <div className="font-medium">{order.receiver.phone}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <div className="text-sm text-muted-foreground">Address</div>
                    <div className="font-medium">{order.receiver.address}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Items ({order.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <Avatar className="w-16 h-16 rounded-md">
                        <AvatarImage
                          src={item.image || "/placeholder.svg"}
                          alt={item.productName}
                        />
                        <AvatarFallback className="rounded-md">
                          {item.productName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-1">
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-sm text-muted-foreground">
                          SKU: {item.skuValue}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(item.skuPrice)} VND × {item.quantity}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-medium">
                          {formatCurrency(item.skuPrice * item.quantity)} VND
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span>{formatCurrency(totalAmount)} VND</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
