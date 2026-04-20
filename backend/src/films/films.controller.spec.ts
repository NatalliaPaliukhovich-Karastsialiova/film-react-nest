import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmScheduleResponseDto, FilmsListResponseDto } from './dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let filmsService: jest.Mocked<FilmsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: {
            getFilms: jest.fn(),
            getSchedule: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(FilmsController);
    filmsService = module.get(FilmsService);
  });

  it('returns films list from service', async () => {
    const response: FilmsListResponseDto = {
      total: 1,
      items: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          rating: 8.5,
          director: 'Итан Райт',
          tags: ['документальный'],
          image: '/image.jpg',
          cover: '/cover.jpg',
          title: 'Архитекторы общества',
          about: 'Документальный фильм о влиянии технологий.',
          description: 'История о том, как ИИ меняет жизнь людей.',
          schedule: [],
        },
      ],
    };
    filmsService.getFilms.mockResolvedValue(response);

    await expect(controller.getFilms()).resolves.toEqual(response);
    expect(filmsService.getFilms).toHaveBeenCalledTimes(1);
  });

  it('returns film schedule from service by id', async () => {
    const filmId = '550e8400-e29b-41d4-a716-446655440001';
    const response: FilmScheduleResponseDto = {
      total: 1,
      items: [
        {
          id: '95ab4a20-9555-4a06-bfac-184b8c53fe70',
          daytime: '2023-05-29T10:30:00.001Z',
          hall: 2,
          rows: 5,
          seats: 10,
          price: 350,
          taken: ['1:2'],
        },
      ],
    };
    filmsService.getSchedule.mockResolvedValue(response);

    await expect(controller.getSchedule(filmId)).resolves.toEqual(response);
    expect(filmsService.getSchedule).toHaveBeenCalledWith(filmId);
  });
});
