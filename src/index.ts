import { app } from './app';
import connectDB from './db';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });
app.get('/', (req, res) => {
	res.send('<h1>Ideasphere backend running</h1>');
});


connectDB()
	.then(() => {
		app.listen(process.env.PORT || 5001, () => {
			console.log(`Server is running at port :${process.env.PORT || 5001}`);
		});
		app.on('error', (error) => {
			console.log('Unexpected Error Occured', error);
		});
	})
	.catch((err) => {
		console.log('MongoDB connection failed!!!');
	});

console.log('Hello world');
if (process.env.NODE_ENV === "development") {
    console.log("The application is running in development mode.");
} else {
    console.log("The application is NOT running in development mode.");
}
