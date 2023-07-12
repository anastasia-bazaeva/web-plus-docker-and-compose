import { IsString, IsEmail } from 'class-validator';
export class FindUserDto {
  @IsString()
  query: string;
}
