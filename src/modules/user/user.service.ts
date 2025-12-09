import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/database/database.service';
import { NotFoundException } from '@/exceptions/exception';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: BigInt(id) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, data: { name?: string }) {
    const updateData: any = {};
    if (data.name) {
      updateData.name = data.name;
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error('At least one field must be provided for update');
    }

    return this.prisma.user.update({
      where: { id: BigInt(userId) },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }
}
