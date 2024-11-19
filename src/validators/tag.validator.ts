import { z } from 'zod';

export const addTagSchema = z.object({
	title: z
		.string({
			required_error: 'Tag Title is required',
		})
		.min(2, 'Tag Title should be atleast 2 characters long')
		.max(25, 'Title should be maximum 25 characters long')
		.toLowerCase()
		.trim(),
});
