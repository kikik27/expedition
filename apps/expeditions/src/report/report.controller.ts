import { Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiBasicAuth } from '@nestjs/swagger';
import { Response } from 'express';
import * as fs from 'fs';
import { JwtAuthGuard } from '@app/common';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
  // @checkAbilites({ action: 'read', subject: 'report' })
  @UseGuards(JwtAuthGuard)
  @ApiBasicAuth('token')
  @Post('resi/:id')
  generateResi(@Param('id') id: string, @Res() res: Response) {
    let filePath: any;
    try {
      filePath = this.reportService.generateResi(id);

      res.setHeader('Content-disposition', 'attachment; filename=output.pdf');
      res.setHeader('Content-type', 'application/pdf');

      res.sendFile(filePath, { root: process.cwd() }, (err) => {
        if (err) {
          console.error(err);
        }
        fs.unlinkSync(filePath);
      });
    } catch (error) {
      console.log(error);
    }
  }
}
