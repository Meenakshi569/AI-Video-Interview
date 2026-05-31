import { Router } from 'express';
import * as interviewController from '../controllers/interview.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { uploadRecording } from '../middleware/upload.middleware.js';

const router = Router();

router.use(authenticate);
router.use(requireRole('candidate'));

router.post('/start', interviewController.startInterview);
router.get('/mine', interviewController.getMyInterviews);
router.get('/:id', interviewController.getInterview);
router.get('/:id/next-question', interviewController.getNextQuestion);
router.patch('/:id/session', interviewController.updateSession);
router.patch('/:id/responses', interviewController.saveResponse);
router.post('/:id/recordings', uploadRecording, interviewController.uploadRecording);
router.post('/:id/finish', interviewController.finishInterview);
router.post('/:id/proctoring', interviewController.logProctoring);
router.post('/:id/transcribe', interviewController.transcribeInterview);

export default router;
