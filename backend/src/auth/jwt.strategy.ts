import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { Unauthorized } from 'src/utils/unauthorized';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwt_secret'),
      ignoreExpiration: false,
    });
  }
  async validate(payload: { sub: number }) {
    const user = await this.usersService.findOne({
      where: { id: payload.sub },
    });
    if (!user) throw new Unauthorized();
    return user;
  }
}
