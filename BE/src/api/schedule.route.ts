import { Router } from 'express';
import scheduleController from '../controllers/schedule.controller';
import { catchError } from '../utils/catchError';

const router = Router();

router.post('/', catchError(scheduleController.createOne));
router.get('/', catchError(scheduleController.getAll)); // Get all schedules
router.get('/:id', catchError(scheduleController.getOneById)); // Get schedule by ID
router.put('/:id', catchError(scheduleController.updateOne)); // Update schedule by ID
router.delete('/:id', catchError(scheduleController.deleteOne)); // Delete schedule by ID

export default router;
