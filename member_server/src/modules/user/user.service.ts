import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }
    // find all
    async findAll () {
        try {
            let users = await this.prisma.user.findMany({
                include: {
                    user_ip_list: true,
                    address: true,
                    receipts: {
                        include: {
                            detail: {
                                include: {
                                    product: true
                                }
                            }
                        }
                    }
                }
            })
            return {
                err: null,
                data: users
            }
        } catch (err) {
            console.log('err', err);
            return {
                err,
                data: null
            }
        }
    }

    // find by id
    async findById(id: number) {
        try {
            let user = await this.prisma.user.findUnique({
                where: {
                    id: id
                }
            })
            if (!user) {
                throw "Account does not exist!"
            }
            return {
                data: user
            }
        } catch (err) {
            return {
                err
            }
        }
    }

    // update user
    async update(userId: number, updateData: any) {
        try {
            const user = await this.prisma.user.update({
                where: {
                    id: Number(userId)
                },
                data: {
                    ...updateData
                },
                include: {
                    address: true,
                    user_ip_list: true,
                    receipts: {
                        include: {
                            detail: {
                                include: {
                                    product: true
                                }
                            }
                        }
                    }
                }
            })
            return {
                status: true,
                data: user,
                message: "Update data successfully"
            }
        } catch (err: any) {
            console.log('err',err);
            return {
                status: false,
                data: null,
                message: "update falt"
            }
        }
    }
}
