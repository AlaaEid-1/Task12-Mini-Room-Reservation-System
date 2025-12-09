import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/user.dto';
import { Public } from '@/decorators/public.decorator';
import { CurrentUser } from '@/decorators/user.decorator';
import type { UserAuth } from '@/types/user-auth.type';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get user profile' })
  async getProfile(@CurrentUser() user: UserAuth) {
    return this.userService.getUserById(user.id);
  }

  @Put('profile')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(
    @CurrentUser() user: UserAuth,
    @Body() data: UpdateProfileDto
  ) {
    return this.userService.updateProfile(user.id, data);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get user by ID' })
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }
}
