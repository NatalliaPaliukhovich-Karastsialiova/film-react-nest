import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  FilmScheduleSchema,
  FilmScheduleSchemaModel,
} from '../schemas/film-schedule.schema';

@Schema({ collection: 'films' })
export class FilmEntity {
  @Prop({ required: true, unique: true, index: true })
  id: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  director: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  about: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  cover: string;

  @Prop({ type: [FilmScheduleSchema], default: [] })
  schedule: FilmScheduleSchemaModel[];
}

export const FilmSchema = SchemaFactory.createForClass(FilmEntity);
