import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthRpcController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.validateToken')
  async validateToken(@Payload() data: { token: string }) {
    return this.authService.validateToken(data.token);
  }
}
