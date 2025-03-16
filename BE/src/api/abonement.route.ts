import { Router } from 'express';
import * as abonementController from '../controllers/abonement.controller';
import { catchError } from '../utils/catchError';
import { Path } from '../configs/RoutePath';
import { adminCheckerMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get(Path.abonements, catchError(abonementController.getAll));
router.get(Path.abonement, catchError(abonementController.getById));
router.post(Path.abonements, catchError(abonementController.create));
router.patch(Path.abonement, catchError(abonementController.update));
router.delete(
  Path.abonement,
  adminCheckerMiddleware,
  catchError(abonementController.remove),
);

export default router;
