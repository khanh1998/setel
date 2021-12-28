import { OrderStatus } from '../order.entity';
import { orderStub } from '../stubs/order.stub';

export const OrderService = jest.fn().mockReturnValue({
  createOrder: jest
    .fn()
    .mockResolvedValue(orderStub(OrderStatus.CREATED))
    .mockName('createOrder'),
  cancelOrder: jest
    .fn()
    .mockImplementation((id: number) => {
      const order = orderStub(OrderStatus.CANCELLED);
      if (id === order.id) {
        return order;
      }
      return null;
    })
    .mockName('cancelOrder'),
  getOrder: jest
    .fn()
    .mockImplementation((id: number) => {
      const order = orderStub(OrderStatus.CREATED);
      if (id === order.id) {
        return order;
      }
      return null;
    })
    .mockName('getOrder'),
});
