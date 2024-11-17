import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/error.middleware';
import { router as authRouter } from './routes/auth.routes';
import { router as contentRouter } from './routes/content.routes';

const app = express();
const corsOptions = {
	origin: ['http://localhost:5173'],
	methods: ['POST', 'GET', 'PUT', 'DELETE'],
	credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

//routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/content', contentRouter);

app.use(errorHandler);

export { app };
