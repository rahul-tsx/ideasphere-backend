import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import {
	addContentSchema,
	toggleSphereAccessSchema,
	updateContentSchema,
} from '../validators/content.validator';
import ApiError from '../utils/apiError';
import { Content } from '../models/content.model';
import { ApiResponse } from '../utils/apiResponse';
import { APIFeatures } from '../utils/apiFeatures';
import { SharedIdea, SharedIdeasInterface } from '../models/sharedIdeas.model';
import mongoose from 'mongoose';

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
		Content.find({ authorId: req.user }).populate('tags'),
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
	const content = await Content.findById(id).select('hash');
	if (!content) {
		throw new ApiError(404, 'Content not found');
	}
	return res
		.status(200)
		.json(new ApiResponse(200, content.hash, 'Link Generated'));
});
const fetchContent = asyncHandler(async (req: Request, res: Response) => {
	const hash = req.params.hash;
	if (!hash) {
		throw new ApiError(400, 'Hash not provided');
	}
	const content = await Content.findOne({ hash }).select('-note -hash');
	if (!content) {
		throw new ApiError(404, 'Content not found');
	}
	return res.status(200).json(new ApiResponse(200, content, 'Link Generated'));
});
const copyContent = asyncHandler(async (req: Request, res: Response) => {
	const hash = req.params.hash;
	if (!hash) {
		throw new ApiError(400, 'hash not provided');
	}
	const content = await Content.findOne({ hash }).select('-note');
	if (!content) {
		throw new ApiError(404, 'Content not found');
	}

	if (content.authorId._id.toString() === req.user!._id.toString()) {
		throw new ApiError(400, 'Cannot copy your own sphere');
	}

	const copiedContent = await Content.create({
		title: content.title,
		link: content.link,
		tags: content.tags,
		type: content.type,
		authorId: req.user!._id,
	});

	return res
		.status(201)
		.json(new ApiResponse(201, copiedContent, 'Sphere copied successfully'));
});

const isPopulatedSphere = (
	x: mongoose.Types.ObjectId | { username: string }
): x is { username: string } => {
	return (x as { username: string }).username !== undefined;
};

const shareSphere = asyncHandler(async (req: Request, res: Response) => {
	const sharedSphere = await SharedIdea.findOne({
		ownerId: req.user!._id,
	}).populate('ownerId', 'username');

	if (!sharedSphere || !sharedSphere.ownerId) {
		throw new ApiError(404, 'Sphere not found');
	}

	if (isPopulatedSphere(sharedSphere.ownerId)) {
		console.log(sharedSphere.ownerId.username);
	} else {
		throw new ApiError(500, 'OwnerId not populated as expected');
	}

	const sharedLink = `${sharedSphere.ownerId.username}/${sharedSphere.hash}`;
	return res
		.status(200)
		.json(new ApiResponse(200, sharedLink, 'Link Generated'));
});
const fetchSphere = asyncHandler(async (req: Request, res: Response) => {
	const hash = req.params.hash;
	const username = req.params.username;
	if (!hash) {
		throw new ApiError(400, 'hash not provided');
	}
	const sharedSphere = await SharedIdea.findOne({
		hash,
	}).populate('ownerId', 'username _id');

	if (!sharedSphere || !sharedSphere.ownerId) {
		throw new ApiError(404, 'Sphere not found');
	}

	if (isPopulatedSphere(sharedSphere.ownerId)) {
		console.log(sharedSphere.ownerId.username);
		if (sharedSphere.ownerId.username !== username) {
			throw new ApiError(400, 'Invalid link');
		}
		if (!sharedSphere.active) {
			throw new ApiError(400, 'Link expired');
		}
	} else {
		throw new ApiError(500, 'OwnerId not populated as expected');
	}
	const Sphere = await Content.find({
		authorId: sharedSphere.ownerId._id,
	}).select('-note');
	return res.status(200).json(new ApiResponse(200, Sphere, 'Fetched Sphere'));
});
const copySphere = asyncHandler(async (req: Request, res: Response) => {
	const hash = req.params.hash;
	const username = req.params.username;

	if (!hash) {
		throw new ApiError(400, 'Hash not provided');
	}

	const sharedSphere = await SharedIdea.findOne({ hash }).populate(
		'ownerId',
		'username _id'
	);

	if (!sharedSphere || !sharedSphere.ownerId) {
		throw new ApiError(404, 'Sphere not found');
	}
	if (isPopulatedSphere(sharedSphere.ownerId)) {
		console.log(sharedSphere.ownerId.username);
		if (sharedSphere.ownerId.username !== username) {
			throw new ApiError(400, 'Invalid link');
		}
		if (!sharedSphere.active) {
			throw new ApiError(400, 'Link expired');
		}
	} else {
		throw new ApiError(500, 'OwnerId not populated as expected');
	}

	if (sharedSphere.ownerId._id.toString() === req.user!._id.toString()) {
		throw new ApiError(400, 'Cannot copy your own sphere');
	}

	const originalContent = await Content.find({
		authorId: sharedSphere.ownerId._id,
	}).select('-note');

	const copiedContent = await Promise.all(
		originalContent.map((content) =>
			Content.create({
				title: content.title,
				link: content.link,
				tags: content.tags,
				type: content.type,
				authorId: req.user!._id,
			})
		)
	);

	return res
		.status(201)
		.json(new ApiResponse(201, copiedContent, 'Sphere copied successfully'));
});

const toggleSphereAccess = asyncHandler(async (req: Request, res: Response) => {
	const validatedData = toggleSphereAccessSchema.safeParse(req.body);

	if (!validatedData.success) {
		throw new ApiError(411, validatedData.error.errors[0].message);
	}

	const { active } = validatedData.data;
	const sharedSphere = await SharedIdea.findOneAndUpdate(
		{
			ownerId: req.user!._id,
		},
		{
			new: true,
			runValidators: true,
		}
	);
	return res
		.status(200)
		.json(
			new ApiResponse(
				201,
				sharedSphere,
				`Sharing ${active ? 'Turned on' : 'Turned Off'}`
			)
		);
});
export const contentController = {
	addContent,
	getAllContent,
	updateContent,
	deleteContent,
	shareSphere,
	copySphere,
	fetchSphere,
	toggleSphereAccess,
	shareContent,
	fetchContent,
	copyContent,
};
