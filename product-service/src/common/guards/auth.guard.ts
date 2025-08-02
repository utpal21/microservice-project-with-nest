import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    Inject,
    Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);

    constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
        this.logger.log(`🔄 Validating token via RabbitMQ`);
        const response = await firstValueFrom(
        this.client.send({ cmd: 'validate_token' }, { token }),
        );

        if (!response?.valid) throw new UnauthorizedException('Invalid token');

        request.user = response.payload;
        return true;
    } catch (err: any) {
        this.logger.error(`Token validation failed: ${err.message}`);
        throw new UnauthorizedException('Invalid token');
    }
    }
}
