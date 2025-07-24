import { Body, Request, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Res } from '@nestjs/common';
import { ApiBody, ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { SignInDto } from '../dto/auth.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.interceptor';
import { UserDto } from './users/dto/user.dto';
import { LocalAuthGuard } from './guards/local.auth-guard';
import { Response } from 'express';
import { User } from '@prisma/client';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Serialize } from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({ type: SignInDto })
  async signIn(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,) {
    return await this.authService.login(user, response);
    // response.send(user)
  }

  @ApiOAuth2(['read'])
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @Serialize(UserDto)
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    console.log(`Data auth${data}`)
    return data.user;
  }
}
