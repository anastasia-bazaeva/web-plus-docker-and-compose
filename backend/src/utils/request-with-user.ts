import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';

export interface CustomReq extends Request {
  user: User;
}
