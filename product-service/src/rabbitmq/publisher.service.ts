import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PublisherService {
    private readonly logger = new Logger(PublisherService.name);

    constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

    async validateToken(token: string) {
    try {
        this.logger.log(`Validating token via RabbitMQ`);
        return await firstValueFrom(
        this.client.send({ cmd: 'validate_token' }, { token }),
        );
    } catch (err) {
        this.logger.error('Token validation failed', err);
        throw err;
    }
    }
}
