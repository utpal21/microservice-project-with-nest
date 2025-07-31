import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class PublisherService implements OnModuleInit {

    private channel!: amqp.Channel;

  async onModuleInit() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL as string);
    this.channel = await connection.createChannel();
  }

  async publishUserCreated(user: any) {
    const message = JSON.stringify({
      id: user._id,
      email: user.email,
      name: user.name,
    });
    this.channel.sendToQueue('user.created', Buffer.from(message));
  }
}
