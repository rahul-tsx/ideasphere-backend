import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { addContentSchema } from '../validators/content.validator';
import ApiError from '../utils/apiError';
import { Content } from '../models/content.model';
import { ApiResponse } from '../utils/apiResponse';

const addContent = asyncHandler(async (req: Request, res: Response) => {
	const validatedData = addContentSchema.safeParse(req.body);

	if (!validatedData.success) {
		throw new ApiError(411, validatedData.error.errors[0].message);
	}

	const { link, tags, title, type, note } = validatedData.data;

	const content = await Content.create({
		title,
		link,
		note,
		type,
		tags,
		authorId: req.user,
	});

	return res
		.status(201)
		.json(new ApiResponse(201, content, 'Content Added Successfully'));
});

export const contentController = {
	addContent,
};
