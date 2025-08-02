import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

import mongoose from 'mongoose';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/authdb");
        console.log("Manual Mongoose connection OK");
    } catch (err) {
        console.error("Manual Mongoose connection failed", err);
    }

    await app.listen(3000);
}
bootstrap();
