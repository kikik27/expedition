import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { RegionService } from './region.service';
import { QueryProvinceDto } from './dto/query-province.dto';
import { QueryRegencyDto } from './dto/query-regency.dto';
import { DistrictQueryDto } from './dto/query-district.dto';
import { ApiOAuth2 } from '@nestjs/swagger';
import { JwtAuthGuard } from '@app/common';

@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) { }

  // @checkAbilites({ action: 'read', subject: 'region' })
  @UseGuards(JwtAuthGuard)
  @ApiOAuth2(['read'])
  @HttpCode(HttpStatus.OK)
  @Get('provinces')
  async getProvinces(@Query() query: QueryProvinceDto) {
    return this.regionService.getProvinces(query);
  }

  // @checkAbilites({ action: 'read', subject: 'region' })
  @UseGuards(JwtAuthGuard)
  @ApiOAuth2(['read'])
  @HttpCode(HttpStatus.OK)
  @Get('regencies')
  async getRegencies(@Query() query: QueryRegencyDto) {
    return this.regionService.getRegencies(query);
  }

  // @checkAbilites({ action: 'read', subject: 'region' })
  @UseGuards(JwtAuthGuard)
  @ApiOAuth2(['read'])
  @HttpCode(HttpStatus.OK)
  @Get('districts')
  async getDistricts(@Query() query: DistrictQueryDto) {
    return this.regionService.getDistricts(query);
  }
}
