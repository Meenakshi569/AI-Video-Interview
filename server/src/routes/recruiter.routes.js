import { Router } from 'express';
import * as recruiterController from '../controllers/recruiter.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticate);
router.use(requireRole('recruiter', 'admin'));

router.get('/interviews', recruiterController.listInterviews);
router.get('/interviews/:id', recruiterController.getInterviewDetail);
router.get('/interviews/:id/transcript', recruiterController.getTranscript);
router.post('/interviews/:id/transcribe', recruiterController.transcribeInterview);
export default router;

