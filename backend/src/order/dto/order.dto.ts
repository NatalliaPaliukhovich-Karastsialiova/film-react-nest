import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class TicketDto {
  @IsString()
  @IsNotEmpty()
  film: string;

  @IsString()
  @IsNotEmpty()
  session: string;

  @IsString()
  @IsNotEmpty()
  daytime: string;

  @IsString()
  @IsOptional()
  day: string;

  @IsString()
  @IsOptional()
  time: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  row: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  seat: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderPayloadDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}

export class OrderResultTicketDto extends TicketDto {
  @IsString()
  id: string;
}

export class OrderResponseDto {
  @IsInt()
  @Min(0)
  total: number;

  @IsArray()
  items: OrderResultTicketDto[];
}
