import { verifyLogin } from './../middlewares/auth.middleware';
import { Router } from 'express';
import { contentController } from '../controllers/content.controller';

const router = Router();
router.use(verifyLogin);
router
	.route('/')
	.get(contentController.getAllContent)
	.post(contentController.addContent);
router
	.route('/:id')
	.patch(contentController.updateContent)
	.delete(contentController.deleteContent);

router.route('/:id/share').get(contentController.updateContent);
router.route('/:id/copy').post(contentController.updateContent);

export { router };
