import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BrandService {
    constructor(
        private readonly prisma: PrismaService
    ) { }
    async findBrand() {
        try {
            let brands = await this.prisma.brands.findMany()
            return {
                err: null,
                data: brands
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
