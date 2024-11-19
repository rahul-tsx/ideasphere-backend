import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { tagController } from '../controllers/tag.controller';
import { verifyLogin, restrictTo } from '../middlewares/auth.middleware';

const router = Router();
router.use(verifyLogin);
router.route('/').post(tagController.addTag).get(tagController.getAllTags);
router.route('/:id').delete(restrictTo('superuser'), tagController.deleteTag);
export { router };
