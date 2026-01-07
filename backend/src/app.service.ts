import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Yerel Hikaye Paylaşım Platformu API is running!';
  }
}

