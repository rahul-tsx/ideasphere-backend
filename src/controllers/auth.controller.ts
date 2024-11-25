import { Response, Request } from 'express';
import { User, UserInterface } from '../models/user.model';
import ApiError from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { generateTokens } from '../utils/generateTokens';
import { loginSchema, signUpSchema } from '../validators/auth.validator';

interface ICookieOptions {
	expires?: Date;
	httpOnly?: boolean;
	path?: string;
	sameSite?: 'lax' | 'strict' | 'none';
	maxAge?: number;
	secure?: boolean;
}
type UserModelResponse = UserInterface & { _doc: any };
const handleCookies = (user: UserInterface, res: Response) => {
	if (!process.env.COOKIE_EXPIRY) {
		throw new ApiError(404, 'COOKIE EXPIRY NOT DEFINED');
	}

	const cookieOptions: ICookieOptions = {
		expires: new Date(
			Date.now() + parseInt(process.env.COOKIE_EXPIRY) * 24 * 60 * 60 * 1000
		),

		httpOnly: true,
		path: '/',
		// sameSite: 'None',
	};
	const token = generateTokens(user);
	if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
	res.cookie('accessToken', token, cookieOptions);
	return token.accessToken;
};

const signup = asyncHandler(async (req: Request, res: Response) => {
	const validatedData = signUpSchema.safeParse(req.body);

	if (!validatedData.success) {
		throw new ApiError(411, validatedData.error.errors[0].message);
	}

	const { email, password, username } = validatedData.data;
	if (await User.findOne({ $or: [{ email }, { username }] })) {
		throw new ApiError(403, 'User Already Exists');
	}
	const user = await User.create({
		username: username,
		email: email,
		password: password,
		// photo: defaultProfile,
	});
	const token = handleCookies(user, res);
	const createdUser = (await User.findById(user?._id).select(
		'-password'
	)) as UserModelResponse;

	const responseData = {
		...createdUser?._doc,
		token,
	};
	return res
		.status(200)
		.json(new ApiResponse(200, responseData, 'User registered successfully'));
});

const login = asyncHandler(async (req: Request, res: Response) => {
	const validatedData = loginSchema.safeParse(req.body);

	if (!validatedData.success) {
		throw new ApiError(411, validatedData.error.errors[0].message);
	}

	const { email, password } = validatedData.data;
	const user = (await User.findOne({ email })) as UserModelResponse;
	if (!user) {
		throw new ApiError(403, 'Invalid Credentials');
	}
	const isPasswordValid = await user.isPasswordCorrect(password);
	if (!isPasswordValid) {
		throw new ApiError(403, 'Invalid Credentials');
	}
	const token = handleCookies(user, res);
	user.password = undefined;
	const responseData = {
		...user._doc,

		token,
	};
	return res
		.status(200)
		.json(new ApiResponse(200, responseData, 'User logged in successfully'));
});

const logout = asyncHandler(async (req: Request, res: Response) => {
	res.clearCookie('accessToken');
	res.status(200).json(new ApiResponse(200, {}, 'Logged Out'));
});
const me = asyncHandler(async (req: Request, res: Response) => {
	return res
		.status(200)
		.json(new ApiResponse(200, req.user, 'User is logged in '));
});

export const authController = {
	signup,
	login,
	me,
	logout,
};
