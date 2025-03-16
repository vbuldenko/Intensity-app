export interface Abonement {
  id: number | string;
  user: any;
  status: "active" | "ended" | "expired" | "inactive";
  type: "group" | "personal" | "split" | "kids";
  amount: number;
  price: number;
  left: number;
  extended: boolean;
  createdAt: string;
  updatedAt: string;
  activatedAt: string;
  expiratedAt: string;
  reservations: any[];
  paymentMethod: "cash" | "card";
}
