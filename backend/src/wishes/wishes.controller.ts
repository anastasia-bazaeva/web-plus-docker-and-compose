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
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { LocalGuard } from 'src/auth/local.guard';
import { CustomReq } from 'src/utils/request-with-user';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  create(@Req() req: CustomReq, @Body() createWishDto: CreateWishDto) {
    //console.log(req.user);
    return this.wishesService.create(req.user.id, createWishDto);
  }

  @Get()
  findAll() {
    return this.wishesService.findAll();
  }

  @Get('last')
  findLast() {
    return this.wishesService.findLast();
  }

  @Get('top')
  findTop() {
    return this.wishesService.findTop();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Req() req: CustomReq,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.update(id, req.user.id, updateWishDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Req() req) {
    return this.wishesService.remove(id, req.user.id);
  }

  @Post(':id/copy')
  copyWish(@Param('id') id: number, @Req() req) {
    return this.wishesService.copyWish(id, req.user);
  }
}
