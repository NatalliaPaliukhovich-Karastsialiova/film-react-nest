import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  FILMS_REPOSITORY,
  FilmsRepository,
} from '../repository/films.repository';
import {
  CreateOrderPayloadDto,
  OrderResponseDto,
  OrderResultTicketDto,
  TicketDto,
} from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: FilmsRepository,
  ) {}

  async createOrder(
    payload: TicketDto[] | CreateOrderPayloadDto,
  ): Promise<OrderResponseDto> {
    const tickets = this.extractTickets(payload);

    if (tickets.length === 0) {
      throw new BadRequestException({ error: 'tickets should not be empty' });
    }

    const grouped = this.groupTicketsBySession(tickets);

    for (const [groupKey, groupTickets] of grouped) {
      const [filmId, sessionId] = groupKey.split('|');
      const seatKeys = groupTickets.map((ticket) =>
        this.toSeatKey(ticket.row, ticket.seat),
      );

      if (new Set(seatKeys).size !== seatKeys.length) {
        throw new BadRequestException({
          error: 'duplicate seats in the order payload',
        });
      }

      const reserveResult = await this.filmsRepository.reserveSeats(
        filmId,
        sessionId,
        seatKeys,
      );

      if (reserveResult === 'not_found') {
        throw new NotFoundException({ error: 'film or session not found' });
      }

      if (reserveResult === 'already_taken') {
        throw new BadRequestException({ error: 'one or more seats are taken' });
      }
    }

    const items: OrderResultTicketDto[] = tickets.map((ticket) => ({
      ...ticket,
      id: randomUUID(),
    }));

    return {
      total: items.length,
      items,
    };
  }

  private extractTickets(
    payload: TicketDto[] | CreateOrderPayloadDto,
  ): TicketDto[] {
    if (Array.isArray(payload)) {
      return payload;
    }

    if (payload?.tickets && Array.isArray(payload.tickets)) {
      return payload.tickets;
    }

    throw new BadRequestException({
      error: 'tickets array is required',
    });
  }

  private toSeatKey(row: number, seat: number): string {
    return `${row}:${seat}`;
  }

  private groupTicketsBySession(
    tickets: TicketDto[],
  ): Map<string, TicketDto[]> {
    return tickets.reduce((groups, ticket) => {
      const key = `${ticket.film}|${ticket.session}`;
      const sessionTickets = groups.get(key) ?? [];
      sessionTickets.push(ticket);
      groups.set(key, sessionTickets);
      return groups;
    }, new Map<string, TicketDto[]>());
  }
}
