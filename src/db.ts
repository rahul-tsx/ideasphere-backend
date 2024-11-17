import mongoose from 'mongoose';
import { DB_NAME } from './constants';

const connectDB = async () => {
	const connectionString = process.env.MONGODB_URI!.replace(
		'<db_password>',
		process.env.DB_PASS!
	);

	try {
		const connectionInstance = await mongoose.connect(
			`${connectionString}/${DB_NAME}`
		);
		console.log(
			`\n MongoDB connected!! DB HOST:${connectionInstance.connection.host}`
		);
	} catch (error) {
		console.log(`MongoDB Connection error`, error);
		process.exit(1);
	}
};

export default connectDB;
