import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FilmDto, FilmScheduleDto } from '../films/dto/films.dto';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';

export const FILMS_REPOSITORY = 'FILMS_REPOSITORY';

export type ReserveSeatsResult = 'reserved' | 'already_taken' | 'not_found';

export interface FilmsRepository {
  findAll(): Promise<FilmDto[]>;
  findScheduleByFilmId(filmId: string): Promise<FilmScheduleDto[] | null>;
  reserveSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<ReserveSeatsResult>;
}

@Injectable()
export class TypeOrmFilmsRepository implements FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmRepository.find({
      relations: ['schedule'],
    });
    return films.map((film) => this.toFilmDto(film));
  }

  async findScheduleByFilmId(
    filmId: string,
  ): Promise<FilmScheduleDto[] | null> {
    const filmExists = await this.filmRepository.existsBy({ id: filmId });
    if (!filmExists) {
      return null;
    }

    const schedules = await this.scheduleRepository.find({
      where: { filmId },
    });

    return schedules.map((schedule) => this.toScheduleDto(schedule));
  }

  async reserveSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<ReserveSeatsResult> {
    return this.dataSource.transaction(async (manager) => {
      const schedule = await manager.findOne(Schedule, {
        where: { id: sessionId, filmId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!schedule) {
        return 'not_found';
      }

      const takenSeats = this.parseList(schedule.taken);
      const alreadyTaken = seats.some((seat) => takenSeats.includes(seat));
      if (alreadyTaken) {
        return 'already_taken';
      }

      schedule.taken = this.toStoredList([...takenSeats, ...seats]);
      await manager.save(schedule);

      return 'reserved';
    });
  }

  private toFilmDto(film: Film): FilmDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: this.parseList(film.tags),
      title: film.title,
      about: film.about,
      description: film.description,
      image: this.toPublicAssetName(film.image),
      cover: this.toPublicAssetName(film.cover),
      schedule: (film.schedule ?? []).map((item) => this.toScheduleDto(item)),
    };
  }

  private toScheduleDto(schedule: Schedule): FilmScheduleDto {
    return {
      id: schedule.id,
      daytime: schedule.daytime,
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: Number(schedule.price),
      taken: this.parseList(schedule.taken),
    };
  }

  private parseList(value: string | string[] | null | undefined): string[] {
    if (Array.isArray(value)) {
      return value;
    }
    if (!value) {
      return [];
    }
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private toStoredList(values: string[]): string[] {
    return Array.from(new Set(values));
  }

  private toPublicAssetName(path: string | null | undefined): string {
    if (!path) {
      return '';
    }
    return path.replace(/^\/+/, '');
  }
}
