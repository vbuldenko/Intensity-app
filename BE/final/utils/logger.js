export const info = (...params) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(...params);
    }
};
export const error = (...params) => {
    if (process.env.NODE_ENV !== 'production') {
        console.error(...params);
    }
};
export const logger = {
    info,
    error,
};
