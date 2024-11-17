import { verifyLogin } from './../middlewares/auth.middleware';
import { Router } from 'express';
import { contentController } from '../controllers/content.controller';

const router = Router();


router.post('/add', verifyLogin, contentController.addContent);

export { router };
