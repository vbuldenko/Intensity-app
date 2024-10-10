export interface Abonement {
  id: string;
  status: 'active' | 'ended' | 'inactive';
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
