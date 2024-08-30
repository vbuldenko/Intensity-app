import 'dotenv/config';
import { transporter } from '../configs/Mailer';

interface SendMailOptions {
  email: string;
  subject: string;
  html: string;
}

export const send = ({
  email,
  subject,
  html,
}: SendMailOptions): Promise<void> => {
  return transporter.sendMail({
    to: email,
    subject,
    html,
  });
};

export const sendActivationLink = (
  name: string,
  email: string,
  token: string,
): Promise<void> => {
  const link = `${process.env.CLIENT_HOST}:${process.env.PORT}/activation/${token}`;

  return send({
    email,
    subject: 'Account Activation',
    html: `
      <h1>Welcome to [Your Company Name]!</h1>
      <p>Dear ${name[0].toUpperCase() + name.slice(1)}, to activate your account, please click the link below:</p>
      <a href="${link}">${link}</a>
      <p>If you did not sign up for this account, please ignore this email.</p>
      <p>Best regards,<br/>The [Your Company Name] Team</p>
    `,
  });
};

export const sendResetLink = (
  name: string,
  email: string,
  token: string,
): Promise<void> => {
  const link = `${process.env.CLIENT_URL}/reset/${token}`;

  return send({
    email,
    subject: 'Password Reset Request',
    html: `
      <h1>Password reset</h1>
      <p>Dear ${name[0].toUpperCase() + name.slice(1)}, We received a request to reset your password for your account.
      Click the link below to reset your password:</p>
      <a href="${link}">${link}</a>
      <p>If you did not request this change, please ignore this email. The link will expire in an hour.
      If you need any assistance, please contact our support team.
      Best regards,
      [Company Name]</p>
    `,
  });
};

export const notifyOldEmail = (
  name: string,
  newEmail: string,
  oldEmail: string,
): Promise<void> => {
  return send({
    email: oldEmail,
    subject: 'Email Change Notification',
    html: `
    <h1>Email Change</h1>
    <p>Dear ${name[0].toUpperCase() + name.slice(1)},</p>
    <p>Your email has been changed to <strong>${newEmail}</strong>.</p>
    <p>If you didn't request this change, contact support.</p>
  `,
  });
};
