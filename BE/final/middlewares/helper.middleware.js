import * as logger from '../utils/logger.js';
export const unknownEndpoint = (req, res) => {
  logger.error(
    `Unknown endpoint accessed: ${req.method} ${req.originalUrl} from IP ${req.ip}`,
  );
  res.status(404).json({
    status: 'error',
    message: 'Unknown endpoint',
    method: req.method,
    path: req.originalUrl,
  });
};
