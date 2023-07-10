import { IsString, Length, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateWishlistDto {
  @Length(1, 250)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Length(1, 1500)
  description?: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  itemsId: Array<number>;
}
