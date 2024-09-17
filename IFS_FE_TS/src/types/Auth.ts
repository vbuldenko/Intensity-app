export interface AuthCredentials {
  name: string;
  email: string;
  password: string;
}

export interface ResetPasswordData {
  newPassword: string;
  newPasswordConfirmation: string;
  resetToken: string;
}

export interface ResetData {
  email: string;
}
