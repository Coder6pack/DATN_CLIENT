import { UserStatus } from "@/constants/auth.constant";
import { RoleSchema } from "@/shared/models/shared-role.model";
import { UserSchema } from "@/shared/models/shared-user.model";
import { z } from "zod";

export const AccountSchema = UserSchema.pick({
  id: true,
  name: true,
  email: true,
  phoneNumber: true,
  avatar: true,
  status: true,
  roleId: true,
});
export type AccountType = z.infer<typeof AccountSchema>;
export const GetUsersResSchema = z.object({
  data: z.array(
    UserSchema.omit({ password: true, totpSecret: true }).extend({
      role: RoleSchema.pick({
        id: true,
        name: true,
      }),
    })
  ),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const GetUsersQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
  })
  .strict();

export const GetUserParamsSchema = z
  .object({
    userId: z.coerce.number().int().positive(),
  })
  .strict();

export const CreateUserBodySchema = UserSchema.pick({
  email: true,
  name: true,
  phoneNumber: true,
  avatar: true,
  status: true,
  password: true,
  roleId: true,
}).strict();

export const UpdateUserBodySchema = z
  .object({
    name: z.string().min(1).max(255),
    email: z.string().email(),
    phoneNumber: z.string().min(9).max(15),
    avatar: z.string().nullable(),
    status: z.enum([
      UserStatus.ACTIVE,
      UserStatus.INACTIVE,
      UserStatus.BLOCKED,
    ]),
    roleId: z.number().positive(),
  })
  .strict();

export type GetUsersResType = z.infer<typeof GetUsersResSchema>;
export type GetUsersQueryType = z.infer<typeof GetUsersQuerySchema>;
export type GetUserParamsType = z.infer<typeof GetUserParamsSchema>;
export type CreateUserBodyType = z.infer<typeof CreateUserBodySchema>;
export type UpdateUserBodyType = z.infer<typeof UpdateUserBodySchema>;
