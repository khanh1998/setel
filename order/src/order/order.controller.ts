import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../authentication/AuthGuard';
import { BaseOrder } from './order.entity';
import { OrderService } from './order.service';

@Controller({ path: '/order' })
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('/:id')
  async getOrder(@Param('id') id: number) {
    const res = await this.orderService.getOrder(id);
    if (!res) {
      throw new HttpException('Order does not exist', 404);
    }
    return res;
  }

  @Patch('/:id')
  async cancelOrder(@Param('id') id: number) {
    const res = await this.orderService.cancelOrder(id);
    if (!res) {
      throw new HttpException(
        'Order does not exist or You can not cancel',
        404,
      );
    }
    return res;
  }

  @Post()
  async createOrder(@Body() order: BaseOrder) {
    return this.orderService.createOrder(order);
  }
}
