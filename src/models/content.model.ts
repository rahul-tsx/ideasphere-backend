import mongoose, { Types } from 'mongoose';
import { CONTENT_TYPES } from '../constants';
import { contentTypes } from '../types/misc.types';

export interface ContentInterface {
	_id: String | Types.ObjectId;
	title: String;
	link: String;
	type: contentTypes;
	tags: mongoose.Types.ObjectId[];
	note: String;
	authorId: mongoose.Types.ObjectId;
}

const contentSchema = new mongoose.Schema<ContentInterface>(
	{
		title: { type: String, required: true, trim: true },
		authorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		link: {
			type: String,
			required: true,
		},
		tags: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Tag',
			},
		],
		type: {
			type: String,
			enum: CONTENT_TYPES,
		},
		note: { type: String, trim: true },
        
	},
	{ timestamps: true }
);


export const Content = mongoose.model<ContentInterface>(
	'Content',
	contentSchema
);
