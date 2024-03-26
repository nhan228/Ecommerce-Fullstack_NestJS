import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
    constructor(
        private readonly prisma: PrismaService
    ) { }
    async findCategory() {
        try {
            let categories = await this.prisma.categories.findMany()
            return {
                err: null,
                data: categories
            }
        } catch (err) {
            console.log('err', err);
            return {
                err,
                data: null
            }
        }

    }
}
