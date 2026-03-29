import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FILMS_REPOSITORY, MongoFilmsRepository } from './films.repository';
import { FilmEntity, FilmSchema } from './schemas/film.schema';

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
