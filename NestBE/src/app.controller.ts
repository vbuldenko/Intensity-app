import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

type HealthResponse = {
  status: string;
  timestamp: string;
  version: string;
};

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
  })
  getHealth(): HealthResponse {
    return this.appService.getHealth();
  }

  @Get('hello')
  @ApiOperation({ summary: 'Hello world endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Returns hello message',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
