import { Router } from 'express';
import * as trainingController from '../controllers/training.controller';
import * as reservationController from '../controllers/reservation.controller';
import { catchError } from '../utils/catchError';
import { Path } from '../configs/RoutePath';
import {
  adminCheckerMiddleware,
  authMiddleware,
} from '../middlewares/auth.middleware';

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
router.patch(
  Path.trainings,
  authMiddleware,
  catchError(reservationController.reserve),
);
router.patch(
  Path.trainingCancel,
  authMiddleware,
  adminCheckerMiddleware,
  catchError(reservationController.cancelTraining),
);
router.patch(
  Path.trainingsCancel,
  authMiddleware,
  catchError(reservationController.cancelCheck),
);
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
