export const info = (...params: unknown[]): void => {
  if (process.env.NODE_ENV === 'production') {
    return console.log('PROD Mode: ', ...params);
  }
  if (process.env.NODE_ENV === 'development') {
    return console.log('DEV Mode: ', ...params);
  }
  console.log(...params);
};

export const error = (...params: unknown[]): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(...params);
  }
};

export const logger = {
  info,
  error,
};
