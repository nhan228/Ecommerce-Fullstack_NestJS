import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { UpdateCategoryDTO } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) { }

    // Create banner
    async createCategory(data: CreateCategoryDTO) {
        try {
            let result = await this.prisma.categories.create({
                data: {
                    ...data,
                }
            })
            return {                
                data: {
                    ...result
                },
                message: "Create category successfully",
            }
        } catch (err) {
            return { 
                err,
                data: null,
                message: "Create category failed",
             }
        }
    }

    // find categories
    async findAll () {
        try {
            let categories = await this.prisma.categories.findMany()
            return {
                err: null,
                data: categories
            }
        } catch (err) {
            return { 
                err,
                data: null
             }
        }
    }

    // find category by ID
    async findById(categoryId: number) {
        try {
            let category = await this.prisma.categories.findUnique({
                where: {
                    id: categoryId
                }
            })
            if (category) {
                return {
                    data: category
                }
            } else {
                return {
                    message: 'No corresponding category id found'
                }
            }
        } catch (err) {
            return { 
                err,
                data: null
             }
        }
    }

    // Update category
    async updateData(categoryId: number, updatedData: UpdateCategoryDTO) {
        try {
            let updatedCategory = await this.prisma.categories.update({
                where: {
                    id: categoryId
                },
                data: {
                    ...updatedData
                }
            })
            return {
                data: updatedCategory,
                status: 'Updated category successfully'
            }
        } catch (err) {
            return { err }
        }
    }

}
