import { Router } from 'express';
import {
  createAssignment,
  getAssignmentStatus,
  getAssignmentPaper,
  getAllAssignments,
  regenerateAssignment,
  deleteAssignment,
} from '../controllers/assignments.controller';

const router = Router();

router.post('/create', createAssignment);
router.get('/', getAllAssignments);
router.get('/:id/status', getAssignmentStatus);
router.get('/:id/paper', getAssignmentPaper);
router.post('/:id/regenerate', regenerateAssignment);
router.delete('/:id', deleteAssignment);

export default router;
