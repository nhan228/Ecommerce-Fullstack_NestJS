import { Injectable } from '@nestjs/common';
import { ReceiptStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReceiptService {
   constructor(
        private readonly prisma: PrismaService
    ) { }

    async findMany(userId: number) {
        try {
            const result = await this.prisma.receipts.findMany({
                where: {
                    userId: userId,
                },
                include: {
                    detail: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
            return {
                data: result,
                status: true,
                message: 'success',
            };
        } catch (err) {
            return {
                data: null,
                status: false,
                message: 'fail',
            };
        }
    }

    async find(id: number) {
        try {
            const result = await this.prisma.receipts.findFirst({
                where: {
                    userId: id,
                    status: ReceiptStatus.shopping,
                },
                include: {
                    detail: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
            return {
                data: result,
                message: 'success',
                status: true,
            };
        } catch (err) {
            return {
                data: null,
                message: 'fail',
                status: false,
            };
        }
    }

    async delete(id: number) {
        try {
            let result = await this.prisma.receipt_details.delete({
                where: {
                    id: id,
                },
                include: {
                    product: true,
                },
            });
            return {
                data: result,
                message: 'success',
                status: true,
            };
        } catch (err) {
            return {
                data: null,
                message: err.message || 'fail',
                status: false,
            };
        }
    }

    async update(item: any) {
        try {
            let result = await this.prisma.receipt_details.update({
                where: {
                    id: Number(item.id),
                },
                data: {
                    quantity: item.quantity,
                },
            });
            return {
                data: result,
                message: 'success',
                status: true,
            };
        } catch (err) {
            return {
                data: null,
                message: 'fail',
                status: true,
            };
        }
    }

    async updateReceipt(newReceipt: any, receiptId: number) {
        try {
            let receipt = await this.prisma.receipts.update({
                where: {
                    id: Number(receiptId)
                },
                data: {
                    ...newReceipt,
                    updateAt: String(Date.now()),
                },
                include:{
                    detail:{
                        include:{
                            product:true
                        }
                    }
                }
            })
            return {
                data: receipt,
                message: "Update successfully",
                status: true
            }
        } catch (err) {
            console.log('err', err);

            return {
                data: null,
                message: "Update fail",
                status: true
            }
        }
    }
}
