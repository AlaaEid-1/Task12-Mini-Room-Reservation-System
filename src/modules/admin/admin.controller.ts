import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Roles } from '@/decorators/roles.decorator';
import { UserRole } from '../../../generated/prisma';

@ApiTags('Admin')
@Controller('admin')
@Roles(UserRole.ADMIN)
@ApiBearerAuth('access-token')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  async getAllUsers(@Query('skip') skip = '0', @Query('take') take = '10') {
    return this.adminService.getAllUsers(
      parseInt(skip, 10),
      parseInt(take, 10)
    );
  }

  @Get('rooms')
  @ApiOperation({ summary: 'Get all rooms' })
  async getAllRooms(@Query('skip') skip = '0', @Query('take') take = '10') {
    return this.adminService.getAllRooms(
      parseInt(skip, 10),
      parseInt(take, 10)
    );
  }

  @Get('bookings')
  @ApiOperation({ summary: 'Get all bookings' })
  async getAllBookings(@Query('skip') skip = '0', @Query('take') take = '10') {
    return this.adminService.getAllBookings(
      parseInt(skip, 10),
      parseInt(take, 10)
    );
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue statistics' })
  async getRevenue() {
    return this.adminService.getRevenueStats();
  }

  @Get('occupancy')
  @ApiOperation({ summary: 'Get occupancy statistics' })
  async getOccupancy() {
    return this.adminService.getOccupancyStats();
  }
}
