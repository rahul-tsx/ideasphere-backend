import { verifyLogin } from './../middlewares/auth.middleware';
import { Router } from 'express';
import { contentController } from '../controllers/content.controller';

const router = Router();
router.use(verifyLogin);
//owner of sphere
router
	.route('/')
	.get(contentController.shareSphere)
	.patch(contentController.toggleSphereAccess);

//external user
router.route('/:username/:hash').get(contentController.fetchSphere);

router.route('/:username/:hash/copy').post(contentController.copySphere);

export { router };
