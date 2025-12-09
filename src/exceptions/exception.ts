import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    error?: string
  ) {
    super(
      {
        statusCode,
        message,
        error: error || 'Error',
        timestamp: new Date().toISOString(),
      },
      statusCode
    );
  }
}

export class UnauthorizedException extends ApiException {
  constructor(message = 'Unauthorized') {
    super(message, HttpStatus.UNAUTHORIZED, 'Unauthorized');
  }
}

export class ForbiddenException extends ApiException {
  constructor(message = 'Forbidden') {
    super(message, HttpStatus.FORBIDDEN, 'Forbidden');
  }
}

export class NotFoundException extends ApiException {
  constructor(message = 'Resource not found') {
    super(message, HttpStatus.NOT_FOUND, 'Not Found');
  }
}

export class ConflictException extends ApiException {
  constructor(message = 'Conflict') {
    super(message, HttpStatus.CONFLICT, 'Conflict');
  }
}

export class BadRequestException extends ApiException {
  constructor(message = 'Bad Request') {
    super(message, HttpStatus.BAD_REQUEST, 'Bad Request');
  }
}
