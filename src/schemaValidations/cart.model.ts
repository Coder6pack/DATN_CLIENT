import { ProductSchema } from "@/shared/models/shared-product.model";
import { SKUSchema } from "@/shared/models/shared-sku.model";
import { z } from "zod";

export const CartItemSchema = z.object({
  id: z.number(),
  quantity: z.number().int().positive(),
  skuId: z.number(),
  userId: z.number(),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const GetCartItemParamsSchema = z.object({
  cartItemId: z.coerce.number().int().positive(),
});

export const CartItemDetailSchema = z.object({
  cartItems: z.array(
    CartItemSchema.extend({
      sku: SKUSchema.extend({
        product: ProductSchema.omit({
          createdAt: true,
          createdById: true,
          updatedAt: true,
          updatedById: true,
          deletedAt: true,
          deletedById: true,
        }),
      }).omit({
        createdById: true,
        updatedById: true,
        deletedById: true,
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
      }),
    })
  ),
});

export const GetCartResSchema = z.object({
  data: z.array(CartItemDetailSchema),
  totalItems: z.number(),
  page: z.number(), // Số trang hiện tại
  limit: z.number(), // Số item trên 1 trang
  totalPages: z.number(), // Tổng số trang
});

export const AddToCartBodySchema = CartItemSchema.pick({
  skuId: true,
  quantity: true,
}).strict();

export const UpdateCartItemBodySchema = AddToCartBodySchema;

export const DeleteCartBodySchema = z
  .object({
    cartItemIds: z.array(z.number()),
  })
  .strict();

export type CartItemType = z.infer<typeof CartItemSchema>;
export type GetCartItemParamType = z.infer<typeof GetCartItemParamsSchema>;
export type CartItemDetailType = z.infer<typeof CartItemDetailSchema>;
export type GetCartResType = z.infer<typeof GetCartResSchema>;
export type AddToCartBodyType = z.infer<typeof AddToCartBodySchema>;
export type UpdateCartItemBodyType = z.infer<typeof UpdateCartItemBodySchema>;
export type DeleteCartBodyType = z.infer<typeof DeleteCartBodySchema>;
