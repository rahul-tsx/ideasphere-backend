import express from 'express';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/error.middleware';
import { router as authRouter } from './routes/auth.routes';
import { router as contentRouter } from './routes/content.routes';
import { router as tagsRouter } from './routes/tags.routes';
import { router as sharedRouter } from './routes/share.routes';

const app = express();
dotenv.config({ path: '.env' });

const allowedOrigins = process.env
	.ALLOWED_ORIGINS!.split(',')
	.map((origin) => origin);

const corsOptions: CorsOptions = {
	origin: (origin, callback) => {
		allowedOrigins.includes(origin!)
			? callback(null, true)
			: callback(new Error('Not allowed by CORS'));
	},
	allowedHeaders: ['Access-Control-Allow-Origin','Content-Type', 'Authorization', 'X-Requested-With'],
	methods: ['POST', 'GET', 'PUT', 'DELETE', 'PATCH'],
	credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

app.use((req, res, next) => {
	res.setHeader(
		'Access-Control-Allow-Origin',
		'https://ideasphere-fawn.vercel.app'
	);

	next();
});
//routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/content', contentRouter);
app.use('/api/v1/tags', tagsRouter);
app.use('/api/v1/shared', sharedRouter);

app.use(errorHandler);

export { app };
