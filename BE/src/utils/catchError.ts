import { Request, Response, NextFunction, RequestHandler } from 'express';

export const catchError = (handlerFunction: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handlerFunction(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};
