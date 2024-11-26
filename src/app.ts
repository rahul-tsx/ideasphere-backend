import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/error.middleware';
import { router as authRouter } from './routes/auth.routes';
import { router as contentRouter } from './routes/content.routes';
import { router as tagsRouter } from './routes/tags.routes';
import { router as sharedRouter } from './routes/share.routes';

const app = express();
const corsOptions = {
	origin: ['http://localhost:5173'],
	methods: ['POST', 'GET', 'PUT', 'DELETE', 'PATCH'],
	credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

//routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/content', contentRouter);
app.use('/api/v1/tags', tagsRouter);
app.use('/api/v1/shared', sharedRouter);

app.use(errorHandler);

export { app };
