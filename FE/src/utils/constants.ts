export const ROLE = {
  client: "client",
  trainer: "trainer",
  admin: "admin",
} as const;

export const SALARY = {
  base: Number(import.meta.env.VITE_API_MIN_RATE) || 0,
  additional: Number(import.meta.env.VITE_API_OVERMIN_RATE) || 0,
} as const;
