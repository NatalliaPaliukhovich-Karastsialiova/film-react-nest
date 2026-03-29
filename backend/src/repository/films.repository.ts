import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilmDto, FilmScheduleDto } from '../films/dto/films.dto';
import { FilmEntity } from './schemas/film.schema';

export const FILMS_REPOSITORY = 'FILMS_REPOSITORY';

export type ReserveSeatsResult = 'reserved' | 'already_taken' | 'not_found';

type FilmScheduleDocument = Omit<FilmScheduleDto, 'hall'> & {
  hall: string | number;
};

export interface FilmsRepository {
  findAll(): Promise<FilmDto[]>;
  findScheduleByFilmId(filmId: string): Promise<FilmScheduleDto[]>;
  reserveSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<ReserveSeatsResult>;
}

@Injectable()
export class MongoFilmsRepository implements FilmsRepository {
  constructor(
    @InjectModel(FilmEntity.name)
    private readonly filmModel: Model<FilmEntity>,
  ) {}

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmModel
      .find({}, { _id: 0, __v: 0, schedule: 0 })
      .lean()
      .exec();
    return films.map((film) => this.toFilmDto(film));
  }

  async findScheduleByFilmId(filmId: string): Promise<FilmScheduleDto[]> {
    const film = await this.filmModel
      .findOne({ id: filmId }, { schedule: 1, _id: 0 })
      .lean()
      .exec();
    if (!film) {
      return [];
    }

    return (film.schedule ?? []).map((schedule) =>
      this.toScheduleDto(schedule),
    );
  }

  async reserveSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<ReserveSeatsResult> {
    const filmWithSessionExists = await this.filmModel.exists({
      id: filmId,
      'schedule.id': sessionId,
    });
    if (!filmWithSessionExists) {
      return 'not_found';
    }

    const updateResult = await this.filmModel.updateOne(
      {
        id: filmId,
        schedule: {
          $elemMatch: {
            id: sessionId,
            taken: { $nin: seats },
          },
        },
      },
      {
        $addToSet: {
          'schedule.$.taken': { $each: seats },
        },
      },
    );

    if (updateResult.modifiedCount === 0) {
      return 'already_taken';
    }

    return 'reserved';
  }

  private toFilmDto(film: Partial<FilmEntity>): FilmDto {
    return {
      id: film.id ?? '',
      rating: film.rating ?? 0,
      director: film.director ?? '',
      tags: film.tags ?? [],
      title: film.title ?? '',
      about: film.about ?? '',
      description: film.description ?? '',
      image: film.image ?? '',
      cover: film.cover ?? '',
    };
  }

  private toScheduleDto(
    schedule: Partial<FilmScheduleDocument>,
  ): FilmScheduleDto {
    return {
      id: schedule.id ?? '',
      daytime: schedule.daytime ?? '',
      hall: Number(schedule.hall ?? 0),
      rows: schedule.rows ?? 0,
      seats: schedule.seats ?? 0,
      price: schedule.price ?? 0,
      taken: schedule.taken ?? [],
    };
  }
}
