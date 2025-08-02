import { Module } from '@nestjs/common';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Product } from './models/product.model';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { ProductRepository } from './repositories/product.repository';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';

@Module({
    imports: [TypegooseModule.forFeature([Product]), RabbitMQModule],
    controllers: [ProductController],
    providers: [ProductService, ProductRepository],
})
export class ProductModule {}
