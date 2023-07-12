import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/auth/guard';
import { LocalGuard } from 'src/auth/local.guard';
import { CustomReq } from 'src/utils/request-with-user';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(LocalGuard)
  @Post()
  create(@Req() req: CustomReq, @Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistsService.create(req.user, createWishlistDto);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishlistsService.findOne(id);
  }

  @UseGuards(LocalGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Req() req: CustomReq,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.update(id, req.user, updateWishlistDto);
  }

  @UseGuards(LocalGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @Req() req: CustomReq) {
    return this.wishlistsService.remove(id, req.user);
  }
}
