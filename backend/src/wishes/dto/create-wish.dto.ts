import { IsString, Length, IsNotEmpty, IsUrl, IsInt } from 'class-validator';

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

  @IsInt()
  raised?: number;

  @Length(1, 1024)
  description?: string;
}
