import mongoose, { Types } from 'mongoose';

export interface SharedIdeasInterface {
	_id: String | Types.ObjectId;
	hash: String;
	ownerId: mongoose.Types.ObjectId;
}

const sharedIdeaSchema = new mongoose.Schema<SharedIdeasInterface>(
	{
		hash: { type: String, required: true, trim: true },
		ownerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		
	
	},
	{ timestamps: true }
);

export const SharedIdea = mongoose.model<SharedIdeasInterface>(
	'SharedIdea',
	sharedIdeaSchema
);
