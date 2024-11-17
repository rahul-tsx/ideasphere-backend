import { Types } from 'mongoose';
import ApiError from './apiError';
import jwt from 'jsonwebtoken';
const generateAccessToken = (userID: string | Types.ObjectId) => {
	if (!process.env.ACCESS_TOKEN_SECRET) {
		throw new ApiError(404, 'JWT ACCESS TOKEN NOT FOUND');
	}
	return jwt.sign(
		{
			_id: userID,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
		}
	);
};

export { generateAccessToken };
