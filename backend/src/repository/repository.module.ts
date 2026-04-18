import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';
import { FILMS_REPOSITORY, TypeOrmFilmsRepository } from './films.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Film, Schedule])],
  providers: [
    TypeOrmFilmsRepository,
    {
      provide: FILMS_REPOSITORY,
      useExisting: TypeOrmFilmsRepository,
    },
  ],
  exports: [FILMS_REPOSITORY],
})
export class RepositoryModule {}
