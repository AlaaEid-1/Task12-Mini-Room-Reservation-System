import { IsString, IsEnum } from 'class-validator';
import { BookingStatus } from '../../../../generated/prisma';

export class CreateBookingDto {
  @IsString()
  roomId: string;

  @IsString()
  checkInDate: string;

  @IsString()
  checkOutDate: string;
}

export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus)
  status: BookingStatus;
}

export class BookingResponseDto {
  id: string;
  roomId: string;
  guestId: string;
  checkInDate: Date;
  checkOutDate: Date;
  status: BookingStatus;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
