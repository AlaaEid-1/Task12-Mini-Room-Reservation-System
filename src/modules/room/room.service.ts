import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/database/database.service';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async createRoom(
    data: {
      name: string;
      description?: string;
      pricePerNight: number;
      maxGuests: number;
      location?: string;
    },
    ownerId: string
  ) {
    return this.prisma.room.create({
      data: {
        name: data.name,
        description: data.description,
        pricePerNight: data.pricePerNight.toString(),
        maxGuests: data.maxGuests,
        location: data.location,
        ownerId: BigInt(ownerId),
      },
      select: {
        id: true,
        name: true,
        description: true,
        pricePerNight: true,
        maxGuests: true,
        location: true,
        ownerId: true,
        createdAt: true,
      },
    });
  }

  async updateRoom(
    roomId: string,
    ownerId: string,
    data: {
      name?: string;
      description?: string;
      pricePerNight?: number;
      maxGuests?: number;
      location?: string;
    }
  ) {
    const room = await this.prisma.room.findUnique({
      where: { id: BigInt(roomId) },
    });

    if (!room || room.ownerId !== BigInt(ownerId)) {
      throw new Error('Forbidden');
    }

    const updateData: {
      name?: string;
      description?: string;
      pricePerNight?: string;
      maxGuests?: number;
      location?: string;
    } = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.pricePerNight !== undefined)
      updateData.pricePerNight = data.pricePerNight.toString();
    if (data.maxGuests !== undefined) updateData.maxGuests = data.maxGuests;
    if (data.location !== undefined) updateData.location = data.location;

    return this.prisma.room.update({
      where: { id: BigInt(roomId) },
      data: updateData,
    });
  }

  async getRoomById(roomId: string) {
    return this.prisma.room.findUnique({
      where: { id: BigInt(roomId) },
      include: { bookings: true },
    });
  }

  async getAllRooms() {
    return this.prisma.room.findMany({
      include: { bookings: true },
    });
  }

  async getOwnerRooms(ownerId: string) {
    return this.prisma.room.findMany({
      where: { ownerId: BigInt(ownerId) },
      include: { bookings: true },
    });
  }

  async deleteRoom(roomId: string, ownerId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: BigInt(roomId) },
    });

    if (!room || room.ownerId !== BigInt(ownerId)) {
      throw new Error('Forbidden');
    }

    return this.prisma.room.update({
      where: { id: BigInt(roomId) },
      data: { isDeleted: true },
    });
  }

  async getRoomBookings(roomId: string, ownerId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: BigInt(roomId) },
    });

    if (!room || room.ownerId !== BigInt(ownerId)) {
      throw new Error('Forbidden');
    }

    return this.prisma.booking.findMany({
      where: { roomId: BigInt(roomId) },
    });
  }

  async getAvailableRooms(checkIn: Date, checkOut: Date) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        AND: [
          { checkInDate: { lt: checkOut } },
          { checkOutDate: { gt: checkIn } },
        ],
      },
      select: { roomId: true },
    });

    const bookedRoomIds = bookings.map(b => b.roomId);

    return this.prisma.room.findMany({
      where: {
        id: { notIn: bookedRoomIds },
      },
    });
  }
}
