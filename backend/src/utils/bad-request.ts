import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  constructor() {
    super('Неверный запрос', HttpStatus.BAD_REQUEST);
  }
}
