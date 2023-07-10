import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundEception extends HttpException {
  constructor() {
    super('Такой записи не существует', HttpStatus.NOT_FOUND);
  }
}
