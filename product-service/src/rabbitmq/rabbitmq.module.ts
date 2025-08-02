import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PublisherService } from './publisher.service';

// @Module({
//   imports: [
//     ClientsModule.registerAsync([
//       {
//         name: 'AUTH_SERVICE',
//         imports: [ConfigModule],
//         inject: [ConfigService],
//         useFactory: (config: ConfigService) => {
//           const rabbitUrl = config.get<string>('RABBITMQ_URL') || 'amqp://guest:guest@27.0.0.1:5672';

//           return {
//             transport: Transport.RMQ,
//             options: {
//               urls: [rabbitUrl],
//               queue: 'auth_queue',
//               queueOptions: { durable: false },
//             },
//           };
//         },
//       },
//     ]),
//   ],
//   providers: [PublisherService],
//   exports: [PublisherService],
// })
// export class RabbitMQModule {}

// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { ClientsModule, Transport } from '@nestjs/microservices';

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

