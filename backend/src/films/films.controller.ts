import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsListResponseDto, FilmScheduleResponseDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  getFilms(): Promise<FilmsListResponseDto> {
    return this.filmsService.getFilms();
  }

  @Get(':id/schedule')
  getSchedule(@Param('id') id: string): Promise<FilmScheduleResponseDto> {
    return this.filmsService.getSchedule(id);
  }
}
