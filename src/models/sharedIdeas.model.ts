import bcrypt from 'bcrypt';
import mongoose, { Types } from 'mongoose';

export interface SharedIdeasInterface {
	_id: String | Types.ObjectId;
	hash: String;
	ownerId: mongoose.Types.ObjectId;
	active: boolean;
}

const sharedIdeaSchema = new mongoose.Schema<SharedIdeasInterface>(
	{
		hash: { type: String, required: false, trim: true },
		ownerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		active: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);


sharedIdeaSchema.pre('save', async function (next) {
	if (this.isNew) {
		// Generate hash only for new documents
		const dataToHash = `${this._id.toString()}_${this.ownerId.toString()}`;
		let hashed = await bcrypt.hash(dataToHash, 10);

		// Convert bcrypt hash to URL-safe base64 by replacing '+' and '/'
		hashed = hashed.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

		this.hash = hashed;
	}
	
	next();
});

export const SharedIdea = mongoose.model<SharedIdeasInterface>(
	'SharedIdea',
	sharedIdeaSchema
);
