import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RoomService } from './room.service';
import { CreateRoomDto, UpdateRoomDto, RoomResponseDto } from './dto/room.dto';
import { CurrentUser } from '@/decorators/user.decorator';
import { Public } from '@/decorators/public.decorator';
import { Roles } from '@/decorators/roles.decorator';
import { UserRole } from '../../../generated/prisma';
import { ZodValidationPipe } from '@pipes/zod-validation.pipe';
import {
  CreateRoomSchema,
  UpdateRoomSchema,
} from './util/room.validation.schema';
import type { UserAuth } from '../../types/user-auth.type';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({
    status: 201,
    description: 'Room created',
    type: RoomResponseDto,
  })
  async createRoom(
    @Body(new ZodValidationPipe(CreateRoomSchema)) dto: CreateRoomDto,
    @CurrentUser() user: UserAuth
  ) {
    return this.roomService.createRoom(dto, user.id);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all available rooms' })
  @ApiResponse({ status: 200, description: 'List of rooms' })
  async getAvailableRooms(
    @Query('checkInDate') checkInDate?: string,
    @Query('checkOutDate') checkOutDate?: string
  ) {
    if (checkInDate && checkOutDate) {
      return this.roomService.getAvailableRooms(
        new Date(checkInDate),
        new Date(checkOutDate)
      );
    }

    return this.roomService.getAllRooms();
  }

  @Get('owner/my-rooms')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: "Get owner's rooms" })
  @ApiResponse({ status: 200, description: "List of owner's rooms" })
  async getOwnerRooms(@CurrentUser() user: UserAuth) {
    return this.roomService.getOwnerRooms(user.id);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get room by ID' })
  @ApiResponse({ status: 200, description: 'Room details' })
  async getRoomById(@Param('id') id: string) {
    return this.roomService.getRoomById(id);
  }

  @Put(':id')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update room' })
  @ApiResponse({ status: 200, description: 'Room updated' })
  async updateRoom(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateRoomSchema)) dto: UpdateRoomDto,
    @CurrentUser() user: UserAuth
  ) {
    return this.roomService.updateRoom(id, user.id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete room' })
  @ApiResponse({ status: 204, description: 'Room deleted' })
  async deleteRoom(@Param('id') id: string, @CurrentUser() user: UserAuth) {
    return this.roomService.deleteRoom(id, user.id);
  }

  @Get(':id/bookings')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get room bookings' })
  @ApiResponse({ status: 200, description: 'List of room bookings' })
  async getRoomBookings(
    @Param('id') id: string,
    @CurrentUser() user: UserAuth
  ) {
    return this.roomService.getRoomBookings(id, user.id);
  }
}
