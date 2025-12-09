import {
  IsString,
  IsNumber,
  IsPositive,
  IsInt,
  IsOptional,
} from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @IsPositive()
  pricePerNight: number;

  @IsInt()
  @IsPositive()
  maxGuests: number;

  @IsOptional()
  @IsString()
  location?: string;
}

export class UpdateRoomDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  pricePerNight?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  maxGuests?: number;

  @IsOptional()
  @IsString()
  location?: string;
}

export class RoomResponseDto {
  id: string;
  name: string;
  description?: string;
  pricePerNight: number;
  maxGuests: number;
  location?: string;
  ownerId: string;
  createdAt: Date;
}

export class GetAvailableRoomsDto {
  checkInDate: string;
  checkOutDate: string;
  minPrice?: number;
  maxPrice?: number;
  minGuests?: number;
}
