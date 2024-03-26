import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBannerDTO } from './dto/create-banner.dto';
import { UpdateBannerDTO } from './dto/update-banner.dto';

@Injectable()
export class BannerService {
    constructor(private prisma: PrismaService) { }

    // Create banner
    async create(data: CreateBannerDTO, img: string) {
        try {
            let newBanner = await this.prisma.banners.create({
                data: {
                    ...data,
                    img,
                    createAt: new Date().toISOString()
                }
            })
            return {
                data: {
                    ...newBanner
                }
            }
        } catch (err) {
            return { 
                err,
                data:null 
            }
        }
    }

    // find banners
    async findAll() {
        try {
            let bannerList = await this.prisma.banners.findMany()
            return {
                data: bannerList
            }
        } catch (err) {
            return { 
                err,
                data:null 
            }
        }
    }

    // find banner by Id
    async findById(bannerId: number) {
        try {
            let banner = await this.prisma.banners.findUnique({
                where: {
                    id: bannerId
                }
            })
            if (banner) {
                return {
                    data: banner
                }
            } else {
                return {
                    message: 'No corresponding banner id found'
                }
            }
        } catch (err) {
            return { 
                err,
                data:null 
            }
        }
    }

    // Update banner
    async update(bannerId: number, updatedData: UpdateBannerDTO) {
        try {
            let updatedBanner = await this.prisma.banners.update({
                where: {
                    id: bannerId
                },
                data: {
                    ...updatedData,
                    updateAt: new Date().toISOString()
                }
            })
            return {
                data: updatedBanner,
                status: 'Updated banner successfully'
            }
        } catch (err) {
            return { 
                err,
                data:null 
            }
        }
    }

}
