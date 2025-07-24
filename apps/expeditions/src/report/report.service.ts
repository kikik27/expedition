import { Injectable } from '@nestjs/common';
const path = require('path');

@Injectable()
export class ReportService {

  generateResi(id: string) {
    const mustache = require('mustache');
    const fs = require('fs');

    const template = fs.readFileSync(path.join(__dirname, 'templates/resi.mustache')).toString();
    const outputHtml = mustache.render(template);

    fs.writeFileSync('output.html', outputHtml);
    return path.join('output.html');
  }
}
