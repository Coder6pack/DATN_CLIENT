import { z } from 'zod'

export const SlideShowSchema = z.object({
	id: z.number(),
	image: z.string().max(1000),
	createdById: z.number().nullable(),
	updatedById: z.number().nullable(),
	deletedById: z.number().nullable(),
	deletedAt: z.date().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const GetListSlideShowSchema = z.object({
	data: z.array(SlideShowSchema),
	totalItems: z.number(),
})
export const GetSlideShowSchema = SlideShowSchema.pick({
	id: true,
	image: true,
	createdById: true,
	createdAt: true,
})

export const CreateSlideShowBodySchema = SlideShowSchema.pick({
	image: true,
}).strict()

export const UpdateSlideShowBodySchema = CreateSlideShowBodySchema

export const GetSlideShowParamsSchema = z
	.object({
		slideShowId: z.coerce.number().int().positive(),
	})
	.strict()

export type GetListSlideShowType = z.infer<typeof GetListSlideShowSchema>
export type GetSlideShowParamsType = z.infer<typeof GetSlideShowParamsSchema>
export type CreateSlideShowBodyType = z.infer<typeof CreateSlideShowBodySchema>
export type UpdateSlideShowBodyType = CreateSlideShowBodyType
export type GetSlideShowType = z.infer<typeof GetSlideShowSchema>
export type SlideShowType = z.infer<typeof SlideShowSchema>
