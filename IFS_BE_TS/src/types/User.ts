export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'client' | 'trainer' | 'admin';
  settings: {};
  createdAt: Date;
  updatedAt: Date;
  activationToken: string | null;
}
