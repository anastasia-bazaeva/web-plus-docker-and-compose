import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '7d',
      }),
    };
  }

  async validate(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);
    let ifMatched = false;
    await bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) return null;
      ifMatched = true;
    });

    if (user && ifMatched) {
      const { password, ...result } = user;
      return result;
    }
  }

  async signup(createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return user;
  }
}
