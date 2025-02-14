import { Abonement } from "./Abonement";
import { Training } from "./Training";
import { UserDTO } from "./UserDTO";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: "client" | "trainer" | "admin";
  settings: { fontSize: number };
  createdAt: Date;
  updatedAt: Date;
  activationToken: string | null;
  abonements: Abonement[];
  trainings: Training[];
}

export interface LoginReturnData {
  user: UserDTO;
  accessToken: string;
}
