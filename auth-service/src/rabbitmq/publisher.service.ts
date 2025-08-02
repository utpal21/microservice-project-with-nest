import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class PublisherService implements OnModuleInit {
    private readonly logger = new Logger(PublisherService.name);

    private channel!: amqp.Channel;

    async onModuleInit() {
        try {
            const connection = await amqp.connect(process.env.RABBITMQ_URL as string);
            this.channel = await connection.createChannel();
            console.log('RabbitMQ connected');
        } catch (err: any) {
            if (err instanceof Error) {
                console.warn('RabbitMQ connection failed:', err.message);
            } else {
                console.warn('RabbitMQ connection failed:', err);
            }
        }
    }


    async publishUserCreated(eventName: any, user: any) {
        const message = JSON.stringify({
        id: user._id,
        email: user.email,
        name: user.name,
        });

        await this.channel.sendToQueue(eventName, Buffer.from(message));
    }
}

