export const logger = {
  info: (message: string) => console.log(`[info] ${message}`),
  warn: (message: string) => console.warn(`[warn] ${message}`),
  error: (message: string, error?: unknown) => {
    console.error(`[error] ${message}`);
    if (error) console.error(error);
  }
};
