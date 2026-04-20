import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderPayloadDto, OrderResponseDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: jest.Mocked<OrderService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            createOrder: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(OrderController);
    orderService = module.get(OrderService);
  });

  it('creates order via service and returns response', async () => {
    const payload: CreateOrderPayloadDto = {
      email: 'ivan@test.ru',
      phone: '+7 (000) 000-00-00',
      tickets: [
        {
          film: '550e8400-e29b-41d4-a716-446655440000',
          session: '95ab4a20-9555-4a06-bfac-184b8c53fe70',
          daytime: '2023-05-29T10:30:00.001Z',
          day: 'понедельник',
          time: '10:30',
          row: 1,
          seat: 2,
          price: 350,
        },
      ],
    };
    const response: OrderResponseDto = {
      total: 1,
      items: [
        {
          ...payload.tickets[0],
          id: '3c2ac3ef-c315-438b-824f-9f8f12a7a598',
        },
      ],
    };
    orderService.createOrder.mockResolvedValue(response);

    await expect(controller.createOrder(payload)).resolves.toEqual(response);
    expect(orderService.createOrder).toHaveBeenCalledWith(payload);
  });
});
