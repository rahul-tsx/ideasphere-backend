import { verifyLogin } from './../middlewares/auth.middleware';
import { Router } from 'express';
import { contentController } from '../controllers/content.controller';

const router = Router();
router.use(verifyLogin);
router.route('/').get(contentController.shareSphere);
router.route('/:username/:hash').get(contentController.fetchSphere);

router.route('/:username/:hash/copy').post(contentController.copySphere);
 
export { router };
