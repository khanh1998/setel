import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { BaseOrder, Order, OrderStatus } from './order.entity';
import { OrderService } from './order.service';
import { CanActivate, HttpException } from '@nestjs/common';
import { AuthGuard } from '../authentication/AuthGuard';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('OrderController', () => {
  let orderController: OrderController;
  let orderRepository: Repository<Order>;
  let orderService: OrderService;

  beforeEach(async () => {
    const mockGuard: CanActivate = {
      canActivate: jest.fn(() => true),
    };
    const mockClientProxy = {
      send(obj: any, obj1: any) {
        return true;
      },
    };
    class MockRepository {
      public create(): void {
        return;
      }
      public async save(): Promise<void> {
        return null;
      }
      public async remove(): Promise<void> {
        return null;
      }
      public async findOne(): Promise<void> {
        return null;
      }
    }

    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        OrderService,
        { provide: getRepositoryToken(Order), useValue: MockRepository },
        { provide: 'PAYMENT', useValue: mockClientProxy },
      ],
      imports: [],
    })
      // .overrideGuard(AuthGuard)
      // .useValue(mockGuard)
      .compile();

    orderController = app.get<OrderController>(OrderController);
    orderRepository = app.get(getRepositoryToken(Order));
    orderService = app.get<OrderService>(OrderService);

    jest.spyOn(orderService, 'getOrder').mockImplementation((id: number) => {
      return new Promise((resolve, reject) => {
        resolve(orders.find((item: Order) => item.id === id));
      });
    });

    jest
      .spyOn(orderService, 'createOrder')
      .mockImplementation((input: BaseOrder) => {
        return new Promise((resolve, reject) => {
          const newOrder: Order = {
            ...input,
            id: 2,
            status: OrderStatus.CREATED,
          };
          orders.push(newOrder);
          resolve(newOrder);
        });
      });

    jest.spyOn(orderService, 'cancelOrder').mockImplementation((id: number) => {
      return new Promise((resolve, reject) => {
        const order = orders.find((item: Order) => item.id === id);
        order.status = OrderStatus.CANCELLED;
        resolve(order);
      });
    });
  });

  const order: Order = {
    id: 1,
    status: OrderStatus.CREATED,
    price: 1,
    total: 2,
    quanity: 2,
    productName: 'candy',
    created_at: new Date(),
    updated_at: new Date(),
  };
  const notFoundErr = {
    statusCode: 404,
    message: 'Order does not exist',
  };
  const orders = [order];
  it('should return a order', async () => {
    expect(await orderController.getOrder(1)).toBe(orders[0]);
  });

  it('should return an 404 error when the order is not existed', async () => {
    await expect(orderController.getOrder(0)).rejects.toThrowError(
      new HttpException('Order does not exist', 404),
    );
  });

  it('should cancel order successful', async () => {
    const expected = { ...orders[0], status: OrderStatus.CANCELLED };
    const result = await orderController.cancelOrder(1);
    expect(result).toStrictEqual(expected);
  });

  it('should create an order successful', async () => {
    const input: BaseOrder = {
      price: 1,
      total: 2,
      quanity: 2,
      productName: 'cookies',
      created_at: new Date(),
      updated_at: new Date(),
    };
    const result = await orderController.createOrder(input);
    expect(result).toBeDefined();
  });
});
