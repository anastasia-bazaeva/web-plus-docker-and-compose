import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { BadRequestException } from 'src/utils/bad-request';
import { FindUserDto } from './dto/find-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private wishesService: WishesService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const userExistance = await this.findByEmailOrName(createUserDto);
    if (userExistance)
      throw new ForbiddenException(
        'Пользователь с таким логином или почтой уже зарегистрирован',
      );
    const { password, ...result } = createUserDto;
    const hash = await bcrypt.hash(password, 10);
    const newUser = this.userRepo.create({ password: hash, ...result });
    return await this.userRepo.save(newUser);
  }

  findAll() {
    return this.userRepo.find();
  }

  findOne(id: number) {
    return this.userRepo.findOneBy({ id });
  }

  findOneByUsername(username: string) {
    return this.userRepo.findOneBy({ username });
  }

  async findWishesByUsername(username: string) {
    const user = await this.findOneByUsername(username);

    if (!user) throw new NotFoundException('Пользователь не найден');
    return this.wishesService.findWishesById(user.id);
  }

  async findMysWishes(id: number) {
    const me = await this.findOne(id);
    if (!me) throw new NotFoundException('Пользователь не найден');
    return this.wishesService.findWishesById(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    let ifMatched = false;
    let hashedPassword = null;
    if (updateUserDto.password) {
      hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      await bcrypt.compare(hashedPassword, user.password).then((matched) => {
        if (!matched) return null;
        ifMatched = true;
      });
    }
    //если все это уже есть и совпадает, должны остаться только аватар и about
    ifMatched
      ? (updateUserDto.password = hashedPassword)
      : delete updateUserDto.password;
    if (user.email === updateUserDto.email) delete updateUserDto.email;
    if (user.username === updateUserDto.username) delete updateUserDto.username;

    if (updateUserDto) {
      try {
        await this.userRepo.update(id, updateUserDto);
        return this.findOne(id);
      } catch (err) {
        throw new BadRequestException();
      }
    }
    return 'Нечего обновлять';
  }

  findByEmailOrName(findUserDto: FindUserDto) {
    const { email, username } = findUserDto;
    if (!findUserDto) {
      throw new BadRequestException();
    } else if (email && username) {
      return this.userRepo.findOne({
        where: { email: email, username: username },
      });
    } else if (!email) {
      return this.findOneByUsername(username);
    }
    return this.userRepo.findOneBy({ email });
  }

  remove(id: number) {
    return this.userRepo.delete(id);
  }
}
