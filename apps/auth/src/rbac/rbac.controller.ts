import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Query, ValidationPipe, ParseUUIDPipe } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { CreateRbacDto } from './dto/create-rbac.dto';
import { UpdateRbacDto } from './dto/update-rbac.dto';
import { RbacQueryDto } from './dto/rbac-query.dto';
// import { checkAbilites } from 'src/auth/abilities.decorator';
// import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOAuth2 } from '@nestjs/swagger';
import { RbacDto } from './dto/rbac-dto';

@Controller('rbac')
export class RbacController {
  constructor(private readonly rbacService: RbacService) { }


  // @checkAbilites({ action: 'read', subject: 'permission' })
  // @UseGuards(AuthGuard)
  @ApiOAuth2(['read'])
  @Get('/permissions')
  findAll(@Query(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
  query: RbacQueryDto) {
    return this.rbacService.findAll(query);
  }

  // @checkAbilites({ action: 'read', subject: 'permission', conditions: { created_by: 'id' } })
  // @UseGuards(AuthGuard)
  @ApiOAuth2(['read'])
  @Get('/permissions/:id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.rbacService.findOne(id);
  }

  // @checkAbilites({ action: 'update', subject: 'permission', conditions: { created_by: 'id' } })
  // @UseGuards(AuthGuard)
  @ApiOAuth2(['write'])
  @HttpCode(HttpStatus.OK)
  @Patch('/permissions/:id')
  update(@Param('id') id: string, @Body() updateRbacDto: UpdateRbacDto) {
    return this.rbacService.update(id, updateRbacDto);
  }
  // @checkAbilites({ action: 'create', subject: 'permission' })
  // @UseGuards(AuthGuard)
  @ApiOAuth2(['write'])
  @HttpCode(HttpStatus.CREATED)
  @Post('/permissions')
  create(@Body() createRbacDto: CreateRbacDto) {
    return this.rbacService.create(createRbacDto);
  }

  // @checkAbilites({ action: 'delete', subject: 'permission', conditions: { created_by: 'id' } })
  // @UseGuards(AuthGuard)
  @ApiOAuth2(['write'])
  @HttpCode(HttpStatus.OK)
  @Delete('/permissions/:id')
  remove(@Param('id') id: string) {
    return this.rbacService.remove(id);
  }

}