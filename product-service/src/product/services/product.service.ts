import { Injectable, Logger, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Types } from 'mongoose';
import { PublisherService } from '../../rabbitmq/publisher.service';

@Injectable()
export class ProductService {
    private readonly logger = new Logger(ProductService.name);

    constructor(
        private readonly productRepo: ProductRepository,
        private readonly publisher: PublisherService,
    ) {}


    async createProduct(dto: CreateProductDto, user: { id: string }) {
        return this.productRepo.create({
            ...dto,
            userId: new Types.ObjectId(user.id),
        });
    }

    async getAllProducts() {
        return this.productRepo.findAll();
    }

    async updateProduct(id: string, dto: UpdateProductDto, token: string) {
        const authData = await this.publisher.validateToken(token);
        if (!authData?.userId) throw new ForbiddenException('Invalid token');

        const product = await this.productRepo.findById(new Types.ObjectId(id));
        if (!product) throw new NotFoundException('Product not found');

        if (product.userId.toString() !== authData.userId)
            throw new ForbiddenException('Not authorized');

        return this.productRepo.update(new Types.ObjectId(id), dto);
    }

    async deleteProduct(id: string, token: string) {
        const authData = await this.publisher.validateToken(token);
        if (!authData?.userId) throw new ForbiddenException('Invalid token');

        const product = await this.productRepo.findById(new Types.ObjectId(id));
        if (!product) throw new NotFoundException('Product not found');

        if (product.userId.toString() !== authData.userId)
            throw new ForbiddenException('Not authorized');

        return this.productRepo.delete(new Types.ObjectId(id));
    }
}
