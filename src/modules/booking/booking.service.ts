import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/database/database.service';
import { BookingStatus } from '../../../generated/prisma';
import {
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@/exceptions/exception';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async createBooking(
    guestId: string,
    roomId: string,
    checkInDate: Date,
    checkOutDate: Date
  ) {
    if (checkInDate >= checkOutDate) {
      throw new BadRequestException('Check-in must be before check-out');
    }

    const room = await this.prisma.room.findUnique({
      where: { id: BigInt(roomId) },
    });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const overlappingBooking = await this.prisma.booking.findFirst({
      where: {
        roomId: BigInt(roomId),
        status: { in: ['CONFIRMED', 'PENDING'] },
        AND: [
          { checkInDate: { lt: checkOutDate } },
          { checkOutDate: { gt: checkInDate } },
        ],
      },
    });

    if (overlappingBooking) {
      throw new ConflictException('Room is already booked for these dates');
    }

    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = nights * Number(room.pricePerNight);

    return this.prisma.booking.create({
      data: {
        guest: { connect: { id: BigInt(guestId) } },
        room: { connect: { id: BigInt(roomId) } },
        checkInDate,
        checkOutDate,
        totalPrice,
        status: 'PENDING',
      },
      include: {
        room: true,
        guest: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async cancelBooking(bookingId: string, guestId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: BigInt(bookingId) },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.guestId !== BigInt(guestId)) {
      throw new ForbiddenException('You can only cancel your own bookings');
    }

    if (booking.status === 'CANCELLED') {
      throw new ConflictException('Booking is already cancelled');
    }

    return this.prisma.booking.update({
      where: { id: BigInt(bookingId) },
      data: { status: 'CANCELLED' },
      include: {
        room: true,
        guest: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async updateBookingStatus(
    bookingId: string,
    ownerId: string,
    newStatus: BookingStatus
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: BigInt(bookingId) },
      include: { room: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.room.ownerId !== BigInt(ownerId)) {
      throw new ForbiddenException(
        'You can only update bookings for your own rooms'
      );
    }

    return this.prisma.booking.update({
      where: { id: BigInt(bookingId) },
      data: { status: newStatus },
      include: {
        room: true,
        guest: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async getGuestBookings(guestId: string) {
    return this.prisma.booking.findMany({
      where: { guestId: BigInt(guestId) },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            pricePerNight: true,
            maxGuests: true,
            owner: { select: { name: true } },
          },
        },
      },
      orderBy: { checkInDate: 'desc' },
    });
  }

  async getBookingById(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: BigInt(bookingId) },
      include: {
        room: true,
        guest: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }
}
