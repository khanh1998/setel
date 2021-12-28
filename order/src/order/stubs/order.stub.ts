import { BaseOrder, Order, OrderStatus } from '../order.entity';

export const orderStub = (status: OrderStatus): Order => {
  return {
    created_at: new Date('1/1/2021'),
    id: 1,
    price: 10,
    productName: 'candy',
    quanity: 5,
    total: 50,
    status: status,
    updated_at: new Date('1/1/2021'),
  };
};

export const baseOrderStub = (): BaseOrder => {
  return {
    price: 10,
    productName: 'candy',
    quanity: 5,
    total: 50,
  };
};
