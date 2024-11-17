import { z } from 'zod';

export const emailSchema = z
	.string({
		required_error: 'Email is required',
	})
	.email('Please provide a valid email')
	.trim();

export const signUpSchema = z.object({
	username: z
		.string({
			required_error: 'username is required',
		})
		.min(3, 'Username should be atleast 3 charcters long')
		.max(10, 'username should be maximum 10 characters long')
        .regex(/^[a-zA-Z0-9*@#_-]+$/,'Username Should only contain a-z / A-Z / 0-9 / * / @ / # / _ / - ')
		.trim(),
	email: emailSchema,
	
	password: z
		.string({
			required_error: 'Password is required',
		})
		.min(8, 'Password must be at least 8 characters long')
		.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.regex(/[0-9]/, 'Password must contain at least one digit')
		.regex(/[\W_]/, 'Password must contain at least one special character'),
});
export const loginSchema = z.object({
	email: emailSchema,
	password: z.string({
		required_error: 'Password cannot be empty',
	}),
});
