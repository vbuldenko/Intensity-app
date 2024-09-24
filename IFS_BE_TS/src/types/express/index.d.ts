import { UserDTO } from '../UserDTO';

declare global {
  namespace Express {
    interface Request {
      user?: UserDTO;
    }
  }
}
