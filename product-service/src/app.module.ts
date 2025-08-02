import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { ProductModule } from './product/product.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import * as path from 'path';
import * as fs from "fs";

console.log("ENV PATH:", path.join(process.cwd(), ".env"));
console.log("ENV FILE EXISTS:", fs.existsSync(path.join(process.cwd(), ".env")));

@Module({
    imports: [
        ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: path.join(process.cwd(), ".env"),
    }),
    TypegooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (config: ConfigService) => {
        const uri = config.get<string>("MONGO_URI") || "mongodb://127.0.0.1:27017/product-db";
        console.log("Final Mongo URI:", uri);
        
        return {
        uri,
        serverSelectionTimeoutMS: 5000,
        };
    },
    inject: [ConfigService],
    }),
    RabbitMQModule,
    ProductModule,
    ],
})
export class AppModule {}
