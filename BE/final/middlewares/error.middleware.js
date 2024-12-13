import { ApiError } from '../exceptions/api.error.js';
export function errorMiddleware(error, req, res, next) {
  if (error instanceof ApiError) {
    const { status, message, errors } = error;
    res.status(status).send({ message, errors });
    return;
  }
  // eslint-disable-next-line no-console
  console.error(error);
  res.status(500).send({
    message: 'Unexpected server error',
    info: error instanceof Error ? error.message : 'Unknown error',
    name: error instanceof Error ? error.name : 'Error',
  });
}
