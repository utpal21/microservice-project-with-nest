import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PublisherService implements OnModuleInit {
  private client!: ClientProxy;
  private readonly logger = new Logger(PublisherService.name);

  onModuleInit() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@127.0.0.1:5672'],
        queue: 'auth_queue',
        queueOptions: { durable: false },
      },
    });
  }

  async validateToken(token: string) {
    // this.logger.log('📨 Sending token validation RPC request');
    // const response = await this.client.send('auth.validate', { token }).toPromise();
    // this.logger.log(`✅ RPC Response: ${JSON.stringify(response)}`);
    // return response;

        try {

            this.logger.log(`Validating token via RabbitMQ`);
            this.logger.log('Sending token validation RPC request');
            const response = await firstValueFrom(
                this.client.send({ cmd: 'validate_token' }, { token }),
            );
            this.logger.log(`RPC Response: ${JSON.stringify(response)}`);
            return response;
        } catch (err) {
            this.logger.error('Token validation failed', err);
            throw err;
        }
  }
}



// import { Injectable, Inject, Logger } from '@nestjs/common';
// import { ClientProxy } from '@nestjs/microservices';
// import { firstValueFrom } from 'rxjs';

// @Injectable()
// export class PublisherService {
//     private readonly logger = new Logger(PublisherService.name);

//     constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

//     async validateToken(token: string) {
//         try {
//             this.logger.log(`Validating token via RabbitMQ`);
//             return await firstValueFrom(
//             this.client.send({ cmd: 'validate_token' }, { token }),
//             );
//         } catch (err) {
//             this.logger.error('Token validation failed', err);
//             throw err;
//         }
//     }
// }
