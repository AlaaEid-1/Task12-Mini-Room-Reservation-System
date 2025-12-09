import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';
import { CurrentUser } from '@/decorators/user.decorator';
import { Roles } from '@/decorators/roles.decorator';
import { UserRole } from '../../../generated/prisma';
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';
import { CreateBookingSchema } from './util/booking.validation.schema';
import { UserAuth } from '@/types/user-auth.type';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Post()
  @Roles(UserRole.GUEST, UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created' })
  async createBooking(
    @Body(new ZodValidationPipe(CreateBookingSchema)) dto: CreateBookingDto,
    @CurrentUser() user: UserAuth
  ) {
    return this.bookingService.createBooking(
      user.id,
      dto.roomId,
      new Date(dto.checkInDate),
      new Date(dto.checkOutDate)
    );
  }

  @Get('my-bookings')
  @Roles(UserRole.GUEST, UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: "Get guest's bookings" })
  @ApiResponse({ status: 200, description: 'List of guest bookings' })
  async getMyBookings(@CurrentUser() user: UserAuth) {
    return this.bookingService.getGuestBookings(user.id);
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get booking details' })
  @ApiResponse({ status: 200, description: 'Booking details' })
  async getBookingById(@Param('id') id: string) {
    return this.bookingService.getBookingById(id);
  }

  @Put(':id/cancel')
  @Roles(UserRole.GUEST, UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled' })
  async cancelBooking(@Param('id') id: string, @CurrentUser() user: UserAuth) {
    return this.bookingService.cancelBooking(id, user.id);
  }

  @Put(':id/status')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update booking status' })
  @ApiResponse({ status: 200, description: 'Booking status updated' })
  async updateBookingStatus(
    @Param('id') id: string,
    @Body() dto: UpdateBookingStatusDto,
    @CurrentUser() user: UserAuth
  ) {
    return this.bookingService.updateBookingStatus(id, user.id, dto.status);
  }
}
