import { authClient } from "../api/authClient";

interface AuthCredentials {
  name: string;
  email: string;
  password: string;
}

interface ResetPasswordData {
  newPassword: string;
  newPasswordConfirmation: string;
  resetToken: string;
}

interface ResetData {
  email: string;
}

function register(credentials: AuthCredentials) {
  return authClient.post("/registration", credentials);
}

function login(credentials: Partial<AuthCredentials>) {
  return authClient.post("/login", credentials);
}

/**
 * Initiates Google login by redirecting the user to the Google authentication page.
 */
function loginGoogle(): void {
  window.open(`${import.meta.env.VITE_API_BASE_URL}/auth/google`, "_self");
}

function loginGoogleFireBase(idToken: string) {
  return authClient.post("/api/auth/google", { idToken });
}

function logout() {
  return authClient.post("/logout");
}

function activate(activationToken: string) {
  return authClient.get(`/activation/${activationToken}`);
}

function refresh(): Promise<{ accessToken: string; userData: any }> {
  return authClient.get("/refresh");
}

function reset(data: ResetData) {
  return authClient.post("/forgotPassword", data);
}

function resetPassword(data: ResetPasswordData) {
  return authClient.post(`/resetPassword/${data.resetToken}`, {
    password: data.newPassword,
    passwordConfirm: data.newPasswordConfirmation,
  });
}

export const authService = {
  register,
  login,
  loginGoogle,
  loginGoogleFireBase,
  logout,
  activate,
  refresh,
  reset,
  resetPassword,
};
