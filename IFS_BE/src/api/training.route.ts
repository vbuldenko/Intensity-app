import { Router } from 'express';
import * as trainingController from '../controllers/training.controller';
import { catchError } from '../utils/catchError';
import { Path } from '../configs/RoutePath';
import { cancelCheck, reserve } from '../controllers/reservation.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get(Path.trainings, catchError(trainingController.getAll));
router.get(Path.training, catchError(trainingController.getById));
router.post(
  Path.trainings,
  authMiddleware,
  catchError(trainingController.create),
);
router.post(
  Path.trainingsSchedule,
  authMiddleware,
  catchError(trainingController.initializeCurrentWeek),
);
// router.patch(Path.trainings, catchError(trainingController.update));
router.patch(Path.trainings, authMiddleware, catchError(reserve));
router.patch(Path.trainingsCancel, authMiddleware, catchError(cancelCheck));
router.delete(
  Path.training,
  authMiddleware,
  catchError(trainingController.remove),
);
router.delete(
  Path.trainings,
  authMiddleware,
  catchError(trainingController.removeMany),
);

export default router;
