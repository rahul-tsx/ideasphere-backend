import {  UserInterface } from './../models/user.model';
import ApiError from './apiError';
import { generateAccessToken } from './generateAccessToken';

export const generateTokens = (user: UserInterface) => {
	try {
		const accessToken = generateAccessToken(user._id.toString());
		return { accessToken };
	} catch (error) {
		throw new ApiError(
			500,
			'Something went wrong while generating access and refresh tokens'
		);
	}
};
