import { PaymentStatus } from "@/constants/payment.constant";
import { OrderStatusSchema } from "@/shared/models/shared-order.model";
import z from "zod";

export const DashboardIndicatorQueryParamsSchema = z.object({
  fromDate: z.coerce.date(),
  toDate: z.coerce.date(),
});

export type DashboardIndicatorQueryParamsType = z.TypeOf<
  typeof DashboardIndicatorQueryParamsSchema
>;

export const DashboardIndicatorResSchema = z.object({
  data: z.object({
    revenue: z.number(),
    totalProfit: z.number(),
    orderCount: z.number(),
    servingOrderCount: z.number(),
    revenueByDate: z.array(
      z.object({
        date: z.string(),
        revenue: z.number(),
      })
    ),
    orderIndicator: z.array(
      z.object({
        id: z.number(),
        status: z.string(),
        createdAt: z.date(),
        totalPrice: z.number(),
        quantity: z.number(),
        profit: z.number(),
        successOrders: z.number(),
      })
    ),
  }),
  message: z.string(),
});

export const GetListOtherDashboardResSchema = z.array(
  z.object({
    id: z.number(),
    status: OrderStatusSchema,
    createdAt: z.date(),
    items: z.array(
      z.object({
        id: z.number(),
        productName: z.string(),
        skuPrice: z.number(),
        quantity: z.number(),
        productId: z.number(),
        createdAt: z.date(),
      })
    ),
    products: z.array(
      z.object({
        id: z.number(),
        basePrice: z.number(),
        virtualPrice: z.number(),
      })
    ),
    payment: z.object({
      status: z.enum([
        PaymentStatus.PENDING,
        PaymentStatus.SUCCESS,
        PaymentStatus.FAILED,
      ]),
    }),
  })
);

export type GetListOtherDashboardResType = z.infer<
  typeof GetListOtherDashboardResSchema
>;
export type DashboardIndicatorResType = z.infer<
  typeof DashboardIndicatorResSchema
>;
