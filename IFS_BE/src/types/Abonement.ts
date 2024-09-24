export interface Abonement {
  id: string;
  status: string;
  type: string;
  amount: number;
  price: number;
  purchase_date: Date;
  activation_date: Date;
  expiration_date: Date;
  paused: Boolean;
  left: number;
  history: [];
  user: string;
}
