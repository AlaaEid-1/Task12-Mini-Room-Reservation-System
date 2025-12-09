import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/database/database.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalUsers, totalRooms, totalBookings, pendingBookings] =
      await Promise.all([
        this.prisma.user.count({ where: { isDeleted: false } }),
        this.prisma.room.count({ where: { isDeleted: false } }),
        this.prisma.booking.count(),
        this.prisma.booking.count({
          where: { status: 'PENDING' },
        }),
      ]);

    return {
      totalUsers,
      totalRooms,
      totalBookings,
      pendingBookings,
    };
  }

  async getAllUsers(skip = 0, take = 10) {
    return this.prisma.user.findMany({
      where: { isDeleted: false },
      skip,
      take,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllRooms(skip = 0, take = 10) {
    return this.prisma.room.findMany({
      where: { isDeleted: false },
      skip,
      take,
      include: {
        owner: { select: { name: true, email: true } },
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllBookings(skip = 0, take = 10) {
    return this.prisma.booking.findMany({
      skip,
      take,
      include: {
        room: { select: { name: true } },
        guest: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRevenueStats() {
    const confirmedBookings = await this.prisma.booking.findMany({
      where: { status: 'CONFIRMED' },
      select: { totalPrice: true },
    });

    const totalRevenue = confirmedBookings.reduce(
      (sum, booking) => sum + booking.totalPrice.toNumber(),
      0
    );

    return {
      totalRevenue,
      confirmedBookingsCount: confirmedBookings.length,
    };
  }

  async getOccupancyStats() {
    const rooms = await this.prisma.room.findMany({
      where: { isDeleted: false },
      include: {
        _count: { select: { bookings: true } },
      },
    });

    const totalCapacity = rooms.reduce(
      (sum, room) => sum + (room.maxGuests || 0),
      0
    );
    const totalBookings = rooms.reduce(
      (sum, room) => sum + room._count.bookings,
      0
    );

    return {
      totalCapacity,
      totalBookings,
      averageOccupancy:
        totalCapacity > 0
          ? ((totalBookings / totalCapacity) * 100).toFixed(2)
          : '0',
    };
  }
}
