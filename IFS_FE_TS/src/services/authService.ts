import { authClient } from "../api/authClient";
import { AuthCredentials, ResetData, ResetPasswordData } from "../types/Auth";
import { LoginReturnData } from "../types/User";

function register(credentials: AuthCredentials) {
  return authClient.post("/registration", credentials);
}

function login(
  credentials: Partial<AuthCredentials>
): Promise<LoginReturnData> {
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
