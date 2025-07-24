
// import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
// import { UsersService } from './users/users.service';
// // import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcryptjs';

// @Injectable()
// export class AuthService {
//   constructor(
//     private usersService: UsersService,
//     private jwtService: JwtService
//   ) { }

//   async signIn(
//     username: string,
//     pass: string,
//   ): Promise<{ access_token: string }> {
//     const user = await this.usersService.findByUsername(username);
//     if (!user) {
//       throw new BadRequestException("Username or password is incorrect");
//     }
//     if (!await bcrypt.compare(pass, user.password)) {
//       throw new BadRequestException("Username or password is incorrect");
//     }
//     const payload = { sub: user.id, username: user.username };
//     return {
//       access_token: await this.jwtService.signAsync(payload),
//     };
//   }
// }

import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Tokenpayload } from './interface/token-payload.interface';
import { User } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) { }

  async login(user: User, response: Response) {
    const tokenPayload: Tokenpayload = {
      userId: user.id,
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      expires: expires,
      httpOnly: true,
    });
  }
}
