import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import {
	addContentSchema,
	updateContentSchema,
} from '../validators/content.validator';
import ApiError from '../utils/apiError';
import { Content } from '../models/content.model';
import { ApiResponse } from '../utils/apiResponse';
import { APIFeatures } from '../utils/apiFeatures';

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
const getAllContent = asyncHandler(async (req: Request, res: Response) => {
	const features = new APIFeatures(
		Content.find({ authorId: req.user }),
		req.query
	)
		.filter()
		.sort()
		.limitFields()
		.pagination();
	const content = await features.query;
	return res.status(200).json(new ApiResponse(200, content, 'Content Fetched'));
});

const updateContent = asyncHandler(async (req: Request, res: Response) => {
	const id = req.params.contentid;
	if (!id) {
		throw new ApiError(400, 'Id not provided');
	}
	const content = await Content.findById(id);
	if (!content) {
		throw new ApiError(404, 'Content not found');
	}

	if (req.user!._id.toString() !== content.authorId.toString()) {
		throw new ApiError(403, 'Permission Denied to update content');
	}

	const validatedData = updateContentSchema.safeParse(req.body);

	if (!validatedData.success) {
		throw new ApiError(411, validatedData.error.errors[0].message);
	}

	const { tags, note, title, type } = validatedData.data;

	const updates = { ...validatedData.data };

	// if (title) updates.title = title;
	// if (description) updates.description = description;
	// if (price !== undefined) updates.price = price;
	// if (courseDuration !== undefined) updates.courseDuration = courseDuration;
	// if (courseType) updates.courseType = courseType;
	// if (instructors !== undefined) updates.instructors = instructors;
	// if (syllabus !== undefined) updates.syllabus = syllabus;
	// if (tags !== undefined) updates.tags = tags;

	const updatedContent = await Content.findByIdAndUpdate(id, updates, {
		new: true,
		runValidators: true,
	});

	return res
		.status(200)
		.json(new ApiResponse(200, updatedContent, 'Content Updated Successfully'));
});
const deleteContent = asyncHandler(async (req: Request, res: Response) => {
	const id = req.params.contentid;
	if (!id) {
		throw new ApiError(400, 'Id not provided');
	}
	const content = await Content.findById(id);
	if (!content) {
		throw new ApiError(404, 'Content not found');
	}

	if (req.user!._id.toString() !== content.authorId.toString()) {
		throw new ApiError(403, 'Permission Denied to delete content');
	}

	const deletedContent = await Content.findByIdAndDelete(id);

	return res
		.status(204)
		.json(new ApiResponse(204, deletedContent, 'Content Deleted Successfully'));
});
const shareContent = asyncHandler(async (req: Request, res: Response) => {
	const id = req.params.contentid;
	if (!id) {
		throw new ApiError(400, 'Id not provided');
	}
	const content = await Content.findById(id);
});
export const contentController = {
	addContent,
	getAllContent,
	updateContent,
	deleteContent,
};