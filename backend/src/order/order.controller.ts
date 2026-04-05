import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import {
  CreateOrderPayloadDto,
  OrderResponseDto,
  TicketDto,
} from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(200)
  createOrder(
    @Body() body: TicketDto[] | CreateOrderPayloadDto,
  ): Promise<OrderResponseDto> {
    return this.orderService.createOrder(body);
  }
}
