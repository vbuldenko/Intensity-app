import { info } from '../utils/logger';
export const requestLogger = (req, res, next) => {
    info('Method:', req.method);
    info('Path:  ', req.path);
    info('Body:  ', req.body);
    info('---');
    next();
};
