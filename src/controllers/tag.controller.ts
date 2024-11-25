import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import ApiError from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import { APIFeatures } from '../utils/apiFeatures';
import { Tag } from '../models/tags.model';
import { addTagSchema } from '../validators/tag.validator';

const addTag = asyncHandler(async (req: Request, res: Response) => {
	const validatedData = addTagSchema.safeParse(req.body);

	if (!validatedData.success) {
		throw new ApiError(411, validatedData.error.errors[0].message);
	}

	const { title } = validatedData.data;

	const content = await Tag.create({
		title,
	});

	return res
		.status(201)
		.json(new ApiResponse(201, content, 'Tag Added Successfully'));
});
const getAllTags = asyncHandler(async (req: Request, res: Response) => {
	const features = new APIFeatures(Tag.find(), req.query)
		.filter()
		.sort()
		.limitFields()
		.pagination();
	const tags = await features.query;
	return res.status(200).json(new ApiResponse(200, tags, 'Tags Fetched'));
});
const getTag = asyncHandler(async (req: Request, res: Response) => {
	const id = req.params.tagid;
	const features = new APIFeatures(Tag.findById(id), req.query)
		.filter()
		.sort()
		.limitFields()
		.pagination();
	const tag = await features.query;
	return res.status(200).json(new ApiResponse(200, tag, 'Tag Fetched'));
});

const deleteTag = asyncHandler(async (req: Request, res: Response) => {
	const id = req.params.tagid;
	if (!id) {
		throw new ApiError(400, 'Id not provided');
	}
	const tag = await Tag.findById(id);
	if (!tag) {
		throw new ApiError(404, 'Tag not found');
	}

	if (req.role === 'user') {
		throw new ApiError(403, 'Permission Denied to delete content');
	}

	const deletedTag = await Tag.findByIdAndDelete(id);

	return res
		.status(204)
		.json(new ApiResponse(204, deletedTag, 'Tag Deleted Successfully'));
});

export const tagController = {
	addTag,
	deleteTag,
	getAllTags,
	getTag,
};
