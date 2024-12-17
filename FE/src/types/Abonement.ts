export interface Abonement {
  id: number;
  user: number;
  status: "active" | "ended" | "expired" | "inactive";
  type: "group" | "personal" | "split" | "kids";
  amount: number;
  price: number;
  left: number;
  paused: boolean;
  createdAt: string;
  updatedAt: string;
  activatedAt: string;
  expiratedAt: string;
  // createdAt: Date;
  // updatedAt: Date;
  // activatedAt: Date;
  // expiratedAt: Date;
  visitedTrainings: any[];
  reservations: any[];
}
