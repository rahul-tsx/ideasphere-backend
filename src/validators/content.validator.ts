import { z } from 'zod';
import { CONTENT_TYPES } from '../constants';
const tagsSchema = z.array(
	z
		.string()
		.optional()
		.refine((value) => !value || /^[0-9a-fA-F]{24}$/.test(value), {
			message: 'Invalid ObjectId format for tags',
		})
);
export const addContentSchema = z.object({
	title: z
		.string({
			required_error: 'title is required',
		})
		.min(3, 'Title should be atleast 3 characters long')
		.max(70, 'Title should be maximum 70 characters long')
		.trim(),
	link: z
		.string({ required_error: 'link is required' })
		.url({ message: 'invalid url' }),
	type: z.enum(CONTENT_TYPES),
	tags: tagsSchema,
	note: z.string().optional(),
});

export const updateContentSchema = z.object({
	title: z
		.string()
		.optional()
		.refine((value) => value === undefined || value.length > 0, {
			message: 'Title cannot be empty if provided',
		})
		.transform((value) => (value ? value.trim() : undefined))
		.refine((value) => value === undefined || value.length >= 3, {
			message: 'Title should be at least 3 characters long',
		})
		.refine((value) => value === undefined || value.length <= 70, {
			message: 'Title should be maximum 70 characters long',
		}),
	type: z.enum(CONTENT_TYPES).optional(),
	tags: tagsSchema,
	note: z.string().optional(),
});
export const toggleSphereAccessSchema = z.object({
	active: z.boolean({ required_error: 'Cannot be empty' }),
});
