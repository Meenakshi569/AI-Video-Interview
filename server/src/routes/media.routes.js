import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import * as mediaController from '../controllers/media.controller.js';

const router = Router();

router.get(
  '/:interviewId/:questionIndex',
  authenticate,
  mediaController.serveMedia
);

export default router;
