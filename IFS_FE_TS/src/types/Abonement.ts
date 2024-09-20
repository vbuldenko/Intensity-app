export interface Abonement {
  id: string;
  userId: number;
  status: "active" | "ended" | "inactive";
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
  history: any[];
}
