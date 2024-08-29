export const info = (...params: unknown[]): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...params);
  }
};

export const error = (...params: unknown[]): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(...params);
  }
};
