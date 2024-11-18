import mongoose, { Types } from 'mongoose';


export interface TagsInterface {
	_id: String | Types.ObjectId;
	title: String;
}

const tagSchema = new mongoose.Schema<TagsInterface>(
	{
		title: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			lowercase: true,
		},
	},
	{ timestamps: true }
);

export const Tag = mongoose.model<TagsInterface>('Tag', tagSchema);
