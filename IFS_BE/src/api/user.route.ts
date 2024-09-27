import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { catchError } from '../utils/catchError';
import { Path } from '../configs/RoutePath';

const router = Router();

router.get(Path.users, catchError(userController.getAllActive));
router.get(Path.profile, catchError(userController.getProfile));
router.get(Path.user, catchError(userController.getOneById));
router.patch(Path.updateName, catchError(userController.updateName));
router.patch(Path.updateEmail, catchError(userController.updateEmail));
router.patch(Path.updatePassword, catchError(userController.updatePassword));
router.delete(Path.remove, catchError(userController.remove));

export default router;
