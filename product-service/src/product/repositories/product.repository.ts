import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@m8a/nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Product } from '../models/product.model';
import { IProduct } from '../interfaces/product.interface';
import { Types } from 'mongoose';

@Injectable()
export class ProductRepository {
    private readonly logger = new Logger(ProductRepository.name);

    constructor(
    @InjectModel(Product) private readonly productModel: ReturnModelType<typeof Product>,
    ) {}

    async create(data: IProduct) {
        this.logger.log(`Creating product: ${data.name}`);
        return this.productModel.create(data);
    }

    async findAll() {
        return this.productModel.find().exec();
    }

    async findById(id: Types.ObjectId) {
        return this.productModel.findById(id).exec();
    }

    async update(id: Types.ObjectId, data: Partial<IProduct>) {
        return this.productModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: Types.ObjectId) {
        return this.productModel.findByIdAndDelete(id).exec();
    }
}
