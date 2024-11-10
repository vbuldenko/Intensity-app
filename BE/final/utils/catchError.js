export const catchError = (handlerFunction) => {
    return async (req, res, next) => {
        try {
            await handlerFunction(req, res, next);
        }
        catch (err) {
            next(err);
        }
    };
};
