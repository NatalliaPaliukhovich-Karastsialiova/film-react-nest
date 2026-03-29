import { Inject, Injectable } from '@nestjs/common';
import { FilmsListResponseDto, FilmScheduleResponseDto } from './dto/films.dto';
import {
  FILMS_REPOSITORY,
  FilmsRepository,
} from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: FilmsRepository,
  ) {}

  async getFilms(): Promise<FilmsListResponseDto> {
    const items = await this.filmsRepository.findAll();
    return {
      total: items.length,
      items,
    };
  }

  async getSchedule(filmId: string): Promise<FilmScheduleResponseDto> {
    const items = await this.filmsRepository.findScheduleByFilmId(filmId);
    return {
      total: items.length,
      items,
    };
  }
}
