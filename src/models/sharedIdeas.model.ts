import bcrypt from 'bcrypt';
import mongoose, { Types } from 'mongoose';

export interface SharedIdeasInterface {
	_id: String | Types.ObjectId;
	hash: String;
	ownerId: mongoose.Types.ObjectId;
}

const sharedIdeaSchema = new mongoose.Schema<SharedIdeasInterface>(
	{
		hash: { type: String, required: false, trim: true },
		ownerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true }
);

sharedIdeaSchema.pre('save', async function (next) {
	if (!this.isModified('hash')) {
		const dataToHash = `${this._id.toString()}_${this.ownerId.toString()}`;

		this.hash = await bcrypt.hash(dataToHash, 10);
	}
	next();
});
export const SharedIdea = mongoose.model<SharedIdeasInterface>(
	'SharedIdea',
	sharedIdeaSchema
);
