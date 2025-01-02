import { User } from "./User";

export interface Training {
  id: number;
  type: string;
  capacity: number;
  date: string;
  day: string;
  time: string;
  reservations: any[];
  instructor?: User | string;
}
