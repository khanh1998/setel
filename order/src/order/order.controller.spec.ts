import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { BaseOrder, Order, OrderStatus } from './order.entity';
import { OrderService } from './order.service';
import { HttpException } from '@nestjs/common';
import { baseOrderStub, orderStub } from './stubs/order.stub';

jest.mock('./order.service');

describe('OrderController', () => {
  let orderController: OrderController;
  let orderService: OrderService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderService],
      imports: [],
    }).compile();

    orderController = app.get<OrderController>(OrderController);
    orderService = app.get<OrderService>(OrderService);

    jest.clearAllMocks();
  });

  const order: Order = orderStub(OrderStatus.CREATED);

  it('should return a order', async () => {
    const orderId = order.id;
    expect(orderService.getOrder).toHaveBeenCalledWith(orderId);
    expect(await orderController.getOrder(orderId)).toStrictEqual(order);
  });

  it('should return an 404 error when the order is not existed', async () => {
    const orderId = 0;
    expect(orderService.getOrder).toHaveBeenCalledWith(orderId);
    await expect(orderController.getOrder(orderId)).rejects.toThrowError(
      new HttpException('Order does not exist', 404),
    );
  });

  it('should cancel order successful', async () => {
    const orderId = order.id;
    const result = await orderController.cancelOrder(orderId);
    expect(orderService.cancelOrder).toHaveBeenCalledWith(orderId);
    expect(result.status).toStrictEqual(OrderStatus.CANCELLED);
  });

  it('should create an order successful', async () => {
    const dto: BaseOrder = baseOrderStub();
    const result = await orderController.createOrder(dto);
    expect(orderService.createOrder).toHaveBeenCalledWith(dto);
    expect(result).toStrictEqual(order);
  });
});
