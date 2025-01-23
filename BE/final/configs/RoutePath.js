const Path = {
  googleLoginFireBase: '/api/auth/google',
  googleLogin: '/auth/google',
  googleLoginCB: '/auth/google/callback',
  signup: '/registration',
  activate: '/activation/:activationToken',
  login: '/login',
  logout: '/logout',
  refresh: '/refresh',
  restore: '/forgotPassword',
  reset: '/resetPassword/:resetToken',
  users: '/',
  user: '/:id',
  profile: '/profile',
  update: '/profile/update',
  remove: '/profile/delete',
  abonements: '/',
  userAbonements: '/user',
  abonement: '/:id',
  trainings: '/',
  trainingCancel: '/cancel/:id',
  trainingsCancel: '/cancel-unheld',
  trainingsSchedule: '/initialization',
  training: '/:id',
};
export { Path };
