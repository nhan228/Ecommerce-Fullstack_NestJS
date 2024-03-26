import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }
    // find products
    async findAll() {
        try {
            let products = await this.prisma.products.findMany({
                include: {
                    category: true,
                    pictures: true,
                    brand: true
                }
            })
            return {
                err: null,
                data: products
            }
        } catch (err) {
            return {
                err,
                data: null
            }
        }
    }

    // find product by Id
    async findById(productId: number) {
        try {
            let product = await this.prisma.products.findUnique({
                where: {
                    id: productId
                },
                include: {
                    category: true,
                    pictures: true,
                    brand: true
                }
            })
            if (product) {
                return {
                    data: product
                }
            } else {
                return {
                    message: 'No corresponding product id found'
                }
            }
        } catch (err) {
            return {
                err,
                data: null
            }
        }
    }
}
