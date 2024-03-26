import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BannerService {
    constructor(
        private readonly prisma: PrismaService
    ) { }
    async findBanner() {
        try {
            let banners = await this.prisma.banners.findMany()
            return {
                err: null,
                data: banners
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
