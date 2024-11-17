import mongoose from 'mongoose';

import ApiError from '../utils/apiError';
import { asyncHandler } from '../utils/asyncHandler';
import { NextFunction, Request, Response } from 'express';

/**
 *
 * @param {Error | ApiError} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 *
 *
 * @description This middleware is responsible to catch the errors from any request handler wrapped inside the {@link asyncHandler}
 */
interface IGlobalError {
	(
		err: Error | ApiError,
		req: Request,
		res: Response,
		next: NextFunction
	): void;
}
const errorHandler: IGlobalError = (err, req, res, next) => {
	let error = err;
	let customerror;

	// Check if the error is an instance of an ApiError class which extends native Error class
	if (!(error instanceof ApiError)) {
		// if not
		// create a new ApiError instance to keep the consistency

		// assign an appropriate status code
		const statusCode = error instanceof mongoose.Error ? 400 : 500;

		// set a message from native Error instance or a custom one
		const message = error.message || 'Something went wrong';
		error = new ApiError(statusCode, message, [], err.stack);
	}

	// Now we are sure that the `error` variable will be an instance of ApiError class
	const response = {
		statusCode: (error as ApiError).statusCode, // Explicitly cast to access `statusCode`
		message: error.message,
		...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
		errors: (error as ApiError).errors || [],
	};

	// Send error response
	return res.status((error as ApiError).statusCode).json(response);
};

export { errorHandler };
