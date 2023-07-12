import { IsInt } from 'class-validator';

export class CreateOfferDto {
  @IsInt()
  amount: number;
  hidden?: boolean;
  itemId: number;
}
