import { Router } from 'express';
import * as trainingController from '../controllers/training.controller';
import { catchError } from '../utils/catchError';
import { Path } from '../configs/RoutePath';

const router = Router();

router.get(Path.trainings, catchError(trainingController.getAll));
router.get(Path.training, catchError(trainingController.getById));
router.post(Path.trainings, catchError(trainingController.create));
router.patch(Path.trainings, catchError(trainingController.update));
router.delete(Path.training, catchError(trainingController.remove));
router.delete(Path.trainings, catchError(trainingController.removeMany));

export default router;
