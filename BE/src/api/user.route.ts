import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { catchError } from '../utils/catchError';
import { Path } from '../configs/RoutePath';
import { adminCheckerMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get(Path.users, catchError(userController.getAllActive));
router.get(Path.profile, catchError(userController.getProfile));
router.get(
  Path.user,
  adminCheckerMiddleware,
  catchError(userController.getOneById),
);
router.patch(Path.update, catchError(userController.updateUser));
router.delete(Path.remove, catchError(userController.remove));

export default router;
