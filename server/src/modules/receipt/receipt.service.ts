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
                    id: Number(id),
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
                    id: item.id,
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

    async addToCart(item: any, userId: any) {
        try {
            let cartExisted = await this.prisma.receipts.findMany({
                where: {
                    status: ReceiptStatus.shopping,
                    userId
                },
                include: {
                    detail: {
                        include: {
                            product: true
                        }
                    }
                }
            } as any)
            console.log('cartExisted', cartExisted);
            if (cartExisted.length == 0) {
                let receipt = await this.prisma.receipts.create({
                    data: {
                        createAt: String(Date.now()),
                        updateAt: String(Date.now()),
                        userId: userId,
                        detail: {
                            create: [
                                {
                                    productId: item.productId,
                                    quantity: item.quantity
                                }
                            ]
                        }
                    },
                    include: {
                        detail: {
                            include: {
                                product: true
                            }
                        }
                    }
                } as any)
                return {
                    status: true,
                    message: "Add to cart successfully",
                    data: receipt
                }
            }

            else {
                let cart = cartExisted[0];
                let existedItem = (cart as any).detail?.find(findItem => findItem.productId == item.id)

                if (existedItem) {
                    await this.prisma.receipt_details.update({
                        where: {
                            id: existedItem.id
                        },
                        data: {
                            ...existedItem,
                            quantity: existedItem.quantity + item.quantity
                        }
                    })
                } else {
                    await this.prisma.receipt_details.create({
                        data: {
                            productId: Number(item.productId),
                            quantity: Number(item.quantity),
                            receiptId: Number(cart.id),
                        }
                    })
                }
                let realCart = await this.prisma.receipts.findUnique({
                    where: {
                        id: cart.id
                    },
                    include: {
                        detail: {
                            include: {
                                product: true
                            }
                        }
                    }
                })
                return {
                    status: true,
                    message: "Add to cart successfully ( old cart updated)",
                    data: realCart
                }
            }
        } catch (err) {
            console.log('err', err);
            return {
                status: false,
                message: "Add to cart failed",
                data: null
            }
        }
    }

    async pay(newReceipt: any, receiptId: number) {
        try {
            let receipt = await this.prisma.receipts.update({
                where: {
                    id: Number(receiptId)
                },
                data: {
                    ...newReceipt,
                    updateAt: String(Date.now()),
                    pending: String(Date.now()),
                    status: "pending"
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
                message: "Pay successfully",
                status: true
            }
        } catch (err) {
            console.log('err', err);

            return {
                data: null,
                message: "Pay fail",
                status: true
            }
        }
    }

    async updateReceipt(newReceipt: any, receiptId: number) {
        try {
            let receipt = await this.prisma.receipts.update({
                where: {
                    id: receiptId
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
