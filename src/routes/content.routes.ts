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
	.route('/:contentid')
	.patch(contentController.updateContent)
	.delete(contentController.deleteContent);

router.route('/:contentid/share').get(contentController.shareContent);

router.route('/:hash').get(contentController.fetchContent);

router.route('/:hash/copy').post(contentController.copyContent);

export { router };
