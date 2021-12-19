export enum OrderStatus {
  CREATED = 'CREATED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  DELIVERED = 'DELIVERED',
}

export class OrderInfo {
  id: number;
  productName: string;
  quanity: number;
  price: number;
  total: number;
  status: OrderStatus;
}
