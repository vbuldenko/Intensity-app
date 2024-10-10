export interface AuthCredentials {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: "client" | "trainer";
}

export interface ResetPasswordData {
  newPassword: string;
  newPasswordConfirmation: string;
  resetToken: string;
}

export interface ResetData {
  email: string;
}
