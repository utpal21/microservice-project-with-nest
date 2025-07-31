import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return { message: 'Auth Service is running 🚀' };
  }
}
