import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepo: Repository<Wish>,
  ) {}
  async create(user, createWishDto: CreateWishDto) {
    // console.log(user);
    // console.log(createWishDto);
    const wish = await this.wishRepo.create({
      ...createWishDto,
      owner: { id: 1 },
    });
    return this.wishRepo.save(wish);
  }

  findAll() {
    return this.wishRepo.find();
  }

  findOne(id: number) {
    return this.wishRepo.findOne({
      where: {
        id: id,
      },
      relations: {
        owner: true,
        offers: true,
      },
    });
  }

  async update(id: number, user: number, updateWishDto: UpdateWishDto) {
    const existanceCheck = await this.findOne(id);
    if (!existanceCheck) {
      throw new NotFoundException('Желание не найдено');
    } else if (existanceCheck.owner.id !== user) {
      throw new UnauthorizedException('Нельзя редактировать чужое желание');
    }
    if (updateWishDto.price && existanceCheck.raised > 0) {
      throw new ForbiddenException(
        'Вы не можете изменять стоимость подарка, если уже есть желающие скинуться',
      );
    }
    return this.wishRepo.update({ id }, updateWishDto);
  }

  async remove(id: number, user: number) {
    const existanceCheck = await this.findOne(id);
    if (!existanceCheck) {
      throw new NotFoundException('Желание не найдено');
    } else if (existanceCheck.owner.id !== user) {
      throw new UnauthorizedException('Нельзя удалить чужое желание');
    }
    return this.wishRepo.delete(id);
  }

  async copyWish(id: number, user: User) {
    const existanceCheck = await this.findOne(id);
    if (!existanceCheck) {
      throw new NotFoundException('Желание не найдено');
    } else if (existanceCheck.owner.id === user.id) {
      throw new ForbiddenException(
        'Нельзя скопировать к себе желание, которое у вас уже есть',
      );
    }
    const copyWishDto = {
      name: existanceCheck.name,
      link: existanceCheck.link,
      image: existanceCheck.image,
      price: existanceCheck.price,
      copied: existanceCheck.copied + 1,
      owner: existanceCheck.owner,
    };
    const copyWish = await this.create(user.id, copyWishDto);
    return `Желание ${copyWish.name} скопировано`;
  }

  async findLast(): Promise<Array<Wish>> {
    return await this.wishRepo.find({
      relations: ['owner'],
      take: 40,
      order: {
        createdAt: 'desc',
      },
    });
  }

  async findTop(): Promise<Array<Wish>> {
    return await this.wishRepo.find({
      relations: ['owner'],
      take: 20,
      order: {
        copied: 'desc',
      },
    });
  }

  public findWishesById(id: number) {
    this.wishRepo.find({
      where: {
        owner: {
          id: id,
        },
      },
    });
  }
}
