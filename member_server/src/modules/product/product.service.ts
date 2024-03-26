import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }
    // Create product
    async create(newProduct: any, pictures: any) {
        try {
            let newItem = await this.prisma.products.create({
                data: {
                    ...newProduct,
                    detail: "{}",
                    pictures: {
                        create: [
                            ...pictures
                        ]
                    }
                },
                include: {
                    category: true,
                    brand: true,
                    pictures: true
                }
            })
            return {
                err: null,
                data: newItem
            }
        } catch (err) {
            return {
                err,
                data: null
            }
        }
    }

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

    // Update product
    async update(productId: number, updatedData: any) {
        try {
            let updatedProduct = await this.prisma.products.update({
                where: {
                    id: productId
                },
                data: {
                    ...updatedData,
                    price: Number(updatedData.price),
                    pictures: {
                        create: [...updatedData.pictures]
                    }
                },
                include: {
                    category: true,
                    brand: true,
                    pictures: true
                }
            })
            return {
                data: updatedProduct,
                message: 'Updated product successfully',
                status: true
            }
        } catch (err) {
            console.log(err);
            
            return {
                err,
                data: null,
                status: true
            }
        }
    }

    // Update des
    async updateDes(productId: number, updatedData: any) {
        try {
            let updatedProduct = await this.prisma.products.update({
                where: {
                    id: productId
                },
                data: {
                    ...updatedData
                },
                include: {
                    category: true,
                    brand: true,
                    pictures: true
                }
            })
            return {
                data: updatedProduct,
                message: 'Updated product description successfully',
                status: true
            }
        } catch (err) {
            return {
                err,
                data: null,
                status: true
            }
        }
    }

    // delete
    async delete(id: number) {
        try {
            let result = 3
            return {
                err: null,
                data: result
            }
        } catch (err) {
            return {
                err,
                data: null
            }
        }
    }

    // delete pic
    async deletePic(productId: number) {
        try {
            let result = await this.prisma.pictures.deleteMany({
                where: {
                    productId: productId
                }
            })
            return {
                data: result,
                message: "Delete success",
                status: true
            }
        } catch (err) {
            console.log('err', err);

            return {
                data: null,
                message: "Delete failed",
                status: true
            }
        }
    }
}
