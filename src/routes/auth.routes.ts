import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { verifyLogin } from '../middlewares/auth.middleware';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', verifyLogin, authController.logout);
router.get('/me', verifyLogin, authController.me);

export { router };
