import { IsString, Length, IsNotEmpty, IsUrl, IsInt } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateWishDto {
  @Length(1, 250)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  link: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsInt()
  @IsNotEmpty()
  price: number;

  @Length(1, 1024)
  description?: string;

  owner: User;

  offers?: Offer[];

  copied?: number;

  raised?: number;
}
