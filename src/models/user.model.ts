import mongoose, { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import ApiError from '../utils/apiError';

export interface UserInterface {
	_id: string | Types.ObjectId;
	username: string;
	email: string;
	password: string | undefined;
	role: 'user' | 'superuser';
	isPasswordCorrect(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserInterface>(
	{
		username: {
			type: String,
			trim: true,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			unique: true,
			lowercase: true,
			trim: true,
			required: true,
		},
		role: {
			type: String,
			enum: ['user', 'superuser'],
			default: 'user',
		},
		// photo: {
		// 	type: String,
		// },
		password: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	if (!this.password) return new ApiError(404, 'Password Missing');

	this.password = await bcrypt.hash(this.password, 10);
	next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
	return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model<UserInterface>('User', userSchema);
