import jwt, { JwtPayload } from 'jsonwebtoken';
import ApiError from './apiError';
import { Request } from 'express';

export const fetchToken = (req: Request) => {
	if (!process.env.ACCESS_TOKEN_SECRET) {
		throw new ApiError(404, 'JWT ACCESS TOKEN NOT FOUND');
	}
	const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
	const token: string =
		req.cookies?.accessToken ||
		req.header('Authorization')?.replace('Bearer ', '');
	if (!token) {
		throw new ApiError(401, 'Unauthorized request');
	}

	const validToken = jwt.verify(token, tokenSecret);
	if (!validToken) throw new ApiError(498, 'Invalid Access Token');

	return validToken as JwtPayload;
};
