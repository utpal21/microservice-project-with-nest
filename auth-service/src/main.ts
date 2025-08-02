import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import mongoose from 'mongoose';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/authdb");
        console.log("Manual Mongoose connection OK");
    } catch (err) {
        console.error("Manual Mongoose connection failed", err);
    }

    // Create a RabbitMQ Microservice Listener
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: 'auth_queue',
        queueOptions: { durable: false },
        },
    });

    await app.startAllMicroservices(); // Start the RMQ listener
    await app.listen(process.env.PORT || 3000);
    console.log(`🚀 Auth Service is running on http://localhost:${process.env.PORT || 3000}`);
}
bootstrap();
