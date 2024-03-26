import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDTO } from './dto/create-brand.dto';
import { UpdateBrandDTO } from './dto/update-brand.dto';

@Injectable()
export class BrandService {
    constructor(private prisma: PrismaService) { }

    // Create banner
    async createBrand(data: CreateBrandDTO) {
        try {
            let result = await this.prisma.brands.create({
                data: {
                    ...data,
                }
            })
            return {                
                data: {
                    ...result
                },
                message: "Create brand successfully",
            }
        } catch (err) {
            return { 
                err,
                data: null,
                message: "Create brand failed",
             }
        }
    }

    // find brands
    async findAll () {
        try {
            let brands = await this.prisma.brands.findMany()
            return {
                err: null,
                data: brands
            }
        } catch (err) {
            return { 
                err,
                data: null
             }
        }
    }

    // find brand by ID
    async findById(brandId: number) {
        try {
            let brand = await this.prisma.brands.findUnique({
                where: {
                    id: brandId
                }
            })
            if (brand) {
                return {
                    data: brand
                }
            } else {
                return {
                    message: 'No corresponding brand id found'
                }
            }
        } catch (err) {
            return { 
                err,
                data: null
             }
        }
    }

    // Update brand
    async updateData(brandId: number, updatedData: UpdateBrandDTO) {
        try {
            let updatedBrand = await this.prisma.brands.update({
                where: {
                    id: brandId
                },
                data: {
                    ...updatedData
                }
            })
            return {
                data: updatedBrand,
                status: 'Updated brand successfully'
            }
        } catch (err) {
            return { err }
        }
    }

}
