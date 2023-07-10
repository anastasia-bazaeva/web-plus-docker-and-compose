import { HttpException, HttpStatus } from '@nestjs/common';

export class Unauthorized extends HttpException {
  constructor() {
    super('Пользователь не авторизован', HttpStatus.UNAUTHORIZED);
  }
}
