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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useGetOrder, useUpdateOrderMutation } from "@/app/queries/useOrder";
import { toast } from "@/hooks/use-toast";
import { handleHttpErrorApi } from "@/lib/utils";
import { Package, ArrowRight, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  OrderStatus,
  OrderStatusColors,
  OrderStatusLabels,
  OrderStatusType,
} from "@/constants/order.constant";
import { FormProvider, useForm } from "react-hook-form";
import {
  UpdateOrderBodySchema,
  UpdateOrderBodyType,
} from "@/schemaValidations/order.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/ui/form";

interface UpdateOrderStatusProps {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
}

export default function UpdateOrderStatus({
  id,
  setId,
}: UpdateOrderStatusProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: getOrder,
    isLoading,
    isError,
  } = useGetOrder({
    id: id || 0,
    enabled: Boolean(id),
  });

  const form = useForm<UpdateOrderBodyType>({
    resolver: zodResolver(UpdateOrderBodySchema),
    defaultValues: {
      status: undefined,
    },
  });
  const status = form.watch("status");
  const updateStatusMutation = useUpdateOrderMutation();

  const orderDetail = getOrder?.payload;
  useEffect(() => {
    if (id) {
      setOpen(true);
      form.reset({
        status: undefined,
      });
    } else {
      setOpen(false);
      form.reset({
        status: undefined,
      });
    }
  }, [id]);

  useEffect(() => {
    if (orderDetail && !status) {
      form.reset({
        status: orderDetail.status,
      });
    }
  }, [orderDetail, form]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setId(undefined);
      form.reset({
        status: undefined,
      });
    }
    setOpen(newOpen);
  };

  const handleSubmit = async () => {
    if (!id || !status || !orderDetail) return;

    try {
      setIsSubmitting(true);
      await updateStatusMutation.mutateAsync({
        id,
        status: status as OrderStatusType,
      });

      toast({
        title: "Status updated",
        description: `Order #${id} status updated to ${
          OrderStatusLabels[status as OrderStatusType]
        }`,
      });

      handleOpenChange(false);
    } catch (error) {
      handleHttpErrorApi({ error });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get available status transitions based on current status
  const getAvailableStatuses = (
    currentStatus: OrderStatusType
  ): OrderStatusType[] => {
    switch (currentStatus) {
      case OrderStatus.PENDING_PAYMENT:
        return [
          OrderStatus.PENDING_PAYMENT,
          OrderStatus.PENDING_PICKUP,
          OrderStatus.CANCELLED,
        ];
      case OrderStatus.PENDING_PICKUP:
        return [
          OrderStatus.PENDING_PICKUP,
          OrderStatus.PENDING_DELIVERY,
          OrderStatus.CANCELLED,
        ];
      case OrderStatus.PENDING_DELIVERY:
        return [
          OrderStatus.PENDING_DELIVERY,
          OrderStatus.DELIVERED,
          OrderStatus.RETURNED,
        ];
      case OrderStatus.DELIVERED:
        return [OrderStatus.DELIVERED, OrderStatus.RETURNED];
      case OrderStatus.RETURNED:
        return [OrderStatus.RETURNED];
      case OrderStatus.CANCELLED:
        return [OrderStatus.CANCELLED];
      default:
        return Object.values(OrderStatus) as OrderStatusType[];
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] p-0">
          <DialogTitle className="px-6 pt-4">Update Order Status</DialogTitle>
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
        <DialogContent className="max-w-2xl max-h-[90vh] p-0">
          <DialogTitle className="px-6 pt-4">Update Order Status</DialogTitle>
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

  const order = orderDetail;
  const availableStatuses = getAvailableStatuses(order.status);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogTitle className="px-6 pt-4">
          Update Order Status - #{order.id}
        </DialogTitle>
        <DialogDescription className="px-6">
          Change the status of this order
        </DialogDescription>

        <ScrollArea className="max-h-[calc(90vh-80px)]">
          <div className="px-6 py-4 space-y-6">
            {/* Current Order Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Order ID
                    </div>
                    <div className="font-medium">#{order.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Customer ID
                    </div>
                    <div className="font-medium">#{order.userId}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Receiver</div>
                  <div className="font-medium">{order.receiver.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {order.receiver.phone}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Update */}
            <FormProvider {...form}>
              <form
                id="form-update-order"
                noValidate
                onSubmit={form.handleSubmit(handleSubmit)}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Status Update</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Label className="text-sm text-muted-foreground">
                          Current Status
                        </Label>
                        <div className="mt-1">
                          <Badge className={OrderStatusColors[order.status]}>
                            {OrderStatusLabels[order.status]}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Select New Status</Label>
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <Select
                            value={field.value || ""}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableStatuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`w-2 h-2 rounded-full ${
                                        OrderStatusColors[status].split(" ")[0]
                                      }`}
                                    />
                                    {OrderStatusLabels[status]}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </form>
              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  form="form-update-order"
                >
                  {isSubmitting ? "Updating..." : "Update Status"}
                </Button>
              </div>
            </FormProvider>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
