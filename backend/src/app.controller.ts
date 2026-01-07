import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

/**
 * Ana controller - Health check endpoint'i sağlar
 */
@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * GET / - API'nin çalışıp çalışmadığını kontrol eder
   */
  @Get()
  @ApiOperation({ summary: 'API durumunu kontrol eder' })
  getHello(): string {
    return this.appService.getHello();
  }
}

