import mongoose, { Types } from 'mongoose';
import { CONTENT_TYPES } from '../constants';
import { contentTypes } from '../types/misc.types';
import bcrypt from 'bcrypt';

export interface ContentInterface {
	_id: String | Types.ObjectId;
	title: String;
	link: String;
	type: contentTypes;
	tags: mongoose.Types.ObjectId[];
	note: String;
	authorId: mongoose.Types.ObjectId;
	hash: String;
}

const contentSchema = new mongoose.Schema<ContentInterface>(
	{
		title: { type: String, required: true, trim: true },
		authorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		hash: { type: String, required: false, trim: true },
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

contentSchema.pre('save', async function (next) {
	if (this.isNew) {
		// Generate hash only for new documents
		const dataToHash = `${this._id.toString()}`;
		this.hash = await bcrypt.hash(dataToHash, 10);
	}
	if (this.isModified('hash')) {
		next();
	}
	next();
});
export const Content = mongoose.model<ContentInterface>(
	'Content',
	contentSchema
);
