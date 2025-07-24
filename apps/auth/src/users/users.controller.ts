import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOAuth2 } from '@nestjs/swagger';
import { CreateUserDTO } from './dto/create.user.dto';
import { checkAbilites } from '../abilities.decorator';
import { Serialize } from '@app/common';
import { UserDto } from './dto/user.dto';
// import { AuthGuard } from '../auth.guard';

@Controller('user')
export class UsersController {
  constructor(private UsersService: UsersService) { }

  // @checkAbilites({ action: 'read', subject: 'user' })
  // @UseGuards(AuthGuard)
  @ApiOAuth2(['read'])
  @HttpCode(HttpStatus.OK)
  @Get()
  @Serialize(UserDto)
  getAll() {
    return this.UsersService.getAll();
  }

  // @checkAbilites({ action: 'read', subject: 'user', conditions: { id: 'id' } })
  // @UseGuards(AuthGuard)
  @Post()
  async createUser(@Body() createUserDto: CreateUserDTO) {
    return this.UsersService.create(createUserDto);
  }

  @ApiOAuth2(['read'])
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.UsersService.findById(id);
  }
}
