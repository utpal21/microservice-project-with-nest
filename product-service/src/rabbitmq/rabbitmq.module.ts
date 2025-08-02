import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PublisherService } from './publisher.service';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
            name: 'AUTH_SERVICE',
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                transport: Transport.RMQ,
                options: {
                urls: [config.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672'],
                queue: 'auth_queue',
                queueOptions: { durable: false },
                },
            }),
            },
        ]),
    ],

    providers: [PublisherService],
    exports: [PublisherService, ClientsModule],
})
export class RabbitMQModule {}

