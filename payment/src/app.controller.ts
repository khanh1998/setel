import { Controller, Get } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { from, Observable } from 'rxjs';
import { AppService } from './app.service';
import { OrderInfo } from './order.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'new_order' })
  respondQueue(
    @Payload() payload: OrderInfo,
    @Ctx() context: RmqContext,
  ): Observable<any> {
    console.log('received message', payload);
    console.log(context.getArgs()[0].properties);
    const { price, quanity, total, id } = payload;
    const correct = price * quanity === total;
    return from([{ id: id, success: correct }]);
  }
}
