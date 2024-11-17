import { NextFunction, Request, Response } from 'express';
import { User } from '../models/user.model';
import ApiError from '../utils/apiError';
import { asyncHandler } from '../utils/asyncHandler';
import { fetchToken } from '../utils/fetchTokens';

export const verifyLogin = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const tokenData = fetchToken(req);
		const user = await User.findById(tokenData?._id).select('-password');
		if (!user) {
			throw new ApiError(404, 'User not found');
		}
		req.user = user;

		next();
	}
);
