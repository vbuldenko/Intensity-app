import { Injectable } from '@nestjs/common';

type HealthResponse = {
  status: string;
  timestamp: string;
  version: string;
};

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! Intensity Fitness API is running 🚀';
  }

  getHealth(): HealthResponse {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }
}
