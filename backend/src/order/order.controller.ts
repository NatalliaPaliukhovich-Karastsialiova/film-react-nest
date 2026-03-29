import {
  Body,
  BadRequestException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
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
    const tickets = this.extractTickets(body);
    return this.orderService.createOrder(tickets);
  }

  private extractTickets(
    body: TicketDto[] | CreateOrderPayloadDto,
  ): TicketDto[] {
    if (Array.isArray(body)) {
      return body;
    }

    if (body?.tickets && Array.isArray(body.tickets)) {
      return body.tickets;
    }

    throw new BadRequestException({
      error: 'tickets array is required',
    });
  }
}
