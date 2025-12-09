import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { UserRole } from '../../../../generated/prisma';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(6)
  confirmPassword: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsEnum(UserRole)
  role?: UserRole = UserRole.GUEST;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  password: string;
}

export class AuthResponseDto {
  access_token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}
