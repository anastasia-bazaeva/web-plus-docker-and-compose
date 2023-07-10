import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Wish } from 'src/wishes/entities/wish.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wish])],
  controllers: [UsersController],
  providers: [UsersService, ConfigService, WishesService],
  exports: [UsersService],
})
export class UsersModule {}
