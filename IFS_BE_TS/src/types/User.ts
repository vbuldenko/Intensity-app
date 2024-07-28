import { Abonement } from './Abonement';

export interface User {
  id: string;
  username: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: string;
  abonements: Abonement[];
}
