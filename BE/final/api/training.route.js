import { Router } from 'express';
import * as trainingController from '../controllers/training.controller.js';
import { catchError } from '../utils/catchError.js';
import { Path } from '../configs/RoutePath.js';
import { cancelCheck, reserve } from '../controllers/reservation.controller.js';
import {
  adminCheckerMiddleware,
  authMiddleware,
} from '../middlewares/auth.middleware.js';
const router = Router();
router.get(Path.trainings, catchError(trainingController.getAll));
router.get(Path.training, catchError(trainingController.getById));
router.post(
  Path.trainings,
  authMiddleware,
  adminCheckerMiddleware,
  catchError(trainingController.create),
);
router.post(
  Path.trainingsSchedule,
  authMiddleware,
  adminCheckerMiddleware,
  catchError(trainingController.initializeCurrentWeek),
);
// router.patch(Path.trainings, catchError(trainingController.update));
router.patch(Path.trainings, authMiddleware, catchError(reserve));
router.patch(Path.trainingsCancel, authMiddleware, catchError(cancelCheck));
router.delete(
  Path.training,
  authMiddleware,
  adminCheckerMiddleware,
  catchError(trainingController.remove),
);
router.delete(
  Path.trainings,
  authMiddleware,
  adminCheckerMiddleware,
  catchError(trainingController.removeMany),
);
export default router;
