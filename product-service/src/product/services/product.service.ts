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

    async updateProduct(id: string, dto: UpdateProductDto, user: { id: string }) {
        const product = await this.productRepo.findById(new Types.ObjectId(id));
        if (!product) throw new NotFoundException('Product not found');
        console.log(product.userId.toString(),  user.id);
        if (product.userId.toString() !== user.id) {
            throw new ForbiddenException('Not authorized to update this product');
        }
        // dto is a partial update object, pass it directly
        const updatedProduct = await this.productRepo.update(
            new Types.ObjectId(id), 
            dto
        );

        if (!updatedProduct) throw new NotFoundException('Failed to update product');

        return updatedProduct;
    }


    async deleteProduct(id: string, user: { id: string }) {
        const product = await this.productRepo.findById(new Types.ObjectId(id));
        if (!product) throw new NotFoundException('Product not found');

        if (product.userId.toString() !== user.id) {
            throw new ForbiddenException('Not authorized to delete this product');
        }

        const deleted = await this.productRepo.delete(new Types.ObjectId(id));
        if (!deleted) throw new NotFoundException('Failed to delete product');

        return { id, message: 'Product deleted successfully' };
    }
}
