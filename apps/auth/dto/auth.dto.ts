import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: 'bennison@yopmail.com'})
  @IsString()
  username: string;

  @ApiProperty({
    example: 'bennison@yopmail.com'
  })
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  grant_type?: string;

  @IsOptional()
  @IsString()
  scope?: string;
}
