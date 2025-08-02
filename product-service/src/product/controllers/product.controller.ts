import { Controller, Post, Get, Patch, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Request } from 'express';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post()
    async create(@Body() dto: CreateProductDto, @Req() req: Request) {
        return this.productService.createProduct(dto, req.user!);
    }

    @Get()
    getAll() {
        return this.productService.getAllProducts();
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateProductDto, @Req() req: any) {
        const token = req.headers.authorization?.split(' ')[1];
        return this.productService.updateProduct(id, dto, token);
    }

    @Delete(':id')
    delete(@Param('id') id: string, @Req() req: any) {
        const token = req.headers.authorization?.split(' ')[1];
        return this.productService.deleteProduct(id, token);
    }
}
