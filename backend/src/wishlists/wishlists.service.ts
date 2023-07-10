import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { NotFoundEception } from 'src/utils/not-found';
import { Unauthorized } from 'src/utils/unauthorized';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishListRepo: Repository<Wishlist>,
    @InjectRepository(Wish)
    private wishRepo: Repository<Wish>,
  ) {}

  async create(user: User, createWishlistDto: CreateWishlistDto) {
    const wishes = await this.wishRepo.find({
      where: {
        id: In(createWishlistDto.itemsId),
      },
    });
    const CreatedWishlist = this.wishListRepo.create({
      ...CreateWishlistDto,
      owner: user,
      items: wishes,
    });
    return this.wishListRepo.save(CreatedWishlist);
  }

  findAll() {
    return this.wishListRepo.find({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async findOne(id: number) {
    const wishlist = await this.wishListRepo.findOne({
      where: {
        id: id,
      },
      relations: {
        owner: true,
        items: true,
      },
    });
    if (!wishlist) {
      throw new NotFoundEception();
    }
    return wishlist;
  }

  async update(id: number, user: User, updateWishlistDto: UpdateWishlistDto) {
    const wishlist = await this.findOne(id);
    if (!wishlist) {
      throw new NotFoundEception();
    } else if (wishlist.owner.id !== user.id) {
      throw new Unauthorized();
    }
    const wishes = await this.wishRepo.find({
      where: {
        id: In(updateWishlistDto.itemsId),
      },
    });

    return this.wishListRepo.save({
      ...wishlist,
      name: updateWishlistDto.name,
      image: updateWishlistDto.image,
      description: updateWishlistDto.description
        ? updateWishlistDto.description
        : wishlist.description,
      items: wishes.length === 0 ? wishlist.items : wishes,
    });
  }

  async remove(id: number, user: User) {
    const wishlist = await this.findOne(id);
    if (!wishlist) {
      throw new NotFoundEception();
    } else if (wishlist.owner.id !== user.id) {
      throw new Unauthorized();
    }
    await this.wishListRepo.delete(id);
    return 'Список желаний удален';
  }
}
