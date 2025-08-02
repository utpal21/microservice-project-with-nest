import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthMessageController {
    private readonly logger = new Logger(AuthMessageController.name);

    constructor(private readonly authService: AuthService) {}

    @MessagePattern({ cmd: 'validate_token' })
    async validateTokenMessage(data: { token: string }) {
        this.logger.log('Received token validation request');
        try {
            const payload = await this.authService.validateToken(data.token);
            return { valid: true, payload };
        } catch {
            return { valid: false, message: 'Invalid token' };
        }
    }
}
