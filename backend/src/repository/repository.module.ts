import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmEntity, FilmSchema } from '../films/entities/film.entity';
import { FILMS_REPOSITORY, MongoFilmsRepository } from './films.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: FilmEntity.name,
        schema: FilmSchema,
      },
    ]),
  ],
  providers: [
    MongoFilmsRepository,
    {
      provide: FILMS_REPOSITORY,
      useExisting: MongoFilmsRepository,
    },
  ],
  exports: [FILMS_REPOSITORY],
})
export class RepositoryModule {}
