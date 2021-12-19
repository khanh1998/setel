import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { Order, BaseOrder, OrderStatus } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @Inject('PAYMENT') private readonly client: ClientProxy,
  ) {}
  async onApplicationBootstrap() {
    await this.client.connect();
  }
  async createOrder(input: BaseOrder): Promise<Order> {
    const order: Order = {
      ...input,
      status: OrderStatus.CREATED,
      id: undefined,
    };
    const res = await this.orderRepository.save(order);
    if (res) {
      const obser = this.client.send({ cmd: 'new_order' }, res);
      firstValueFrom(obser).then(async ({ id, success }) => {
        console.log(`order ${id} is success: ${success}`);
        if (success) {
          // payment request is success, proceed order to the next stage
          this.orderRepository.update(
            { id },
            { status: OrderStatus.CONFIRMED },
          );
          console.log(process.env.DELIVERY_DURATION);
          // auto change status of confirmed order to delivered after X seconds
          const promise = new Promise((resolve, reject) => {
            setTimeout(
              () => resolve('change status'),
              process.env.DELIVERY_DURATION,
            );
          });
          promise.then(async () => {
            const order = await this.orderRepository.findOne(id);
            if (order.status === OrderStatus.CONFIRMED) {
              this.orderRepository.update(
                { id },
                { status: OrderStatus.DELIVERED },
              );
            }
          });
        } else {
          // payment request is failed, cancel order
          this.orderRepository.update(
            { id },
            { status: OrderStatus.CANCELLED },
          );
        }
      });
    }
    return res;
  }

  async cancelOrder(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    const canCancel =
      order.status === OrderStatus.CREATED ||
      order.status === OrderStatus.CONFIRMED;
    if (order && canCancel) {
      return this.orderRepository.save({
        ...order,
        status: OrderStatus.CANCELLED,
      });
    }
    return null;
  }

  async getOrder(id: number): Promise<Order> {
    return this.orderRepository.findOne({ where: { id } });
  }
}
