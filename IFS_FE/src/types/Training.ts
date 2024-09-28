import { User } from "./User";

export interface Training {
  id: number;
  type: string;
  instructorId: string;
  capacity: string;
  date: Date;
  day: string;
  time: string;
  visitors: User[];
}
