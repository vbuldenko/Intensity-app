import { User } from "./User";

export interface Training {
  id: number;
  type: string;
  instructorId: number;
  capacity: number;
  date: string;
  day: string;
  time: string;
  visitors: User[];
  reservations: any[];
  instructor?: User;
}
