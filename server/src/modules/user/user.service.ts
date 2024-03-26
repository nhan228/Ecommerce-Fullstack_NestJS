import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }
    // register user
    async register(newUser: any, ip: string, device: string) {
        try {
            let result = await this.prisma.user.create({
                data: {
                    ...newUser,
                    avatar: newUser.avatar ? newUser.avatar :"https://scontent.fsgn2-10.fna.fbcdn.net/v/t39.30808-6/326230557_2952161428425536_2096037101814447013_n.png?_nc_cat=109&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=FgGTgEQI7qQAX8MEn61&_nc_ht=scontent.fsgn2-10.fna&oh=00_AfD1CZVcvE2um3M2fiYJgbNwi8KbR5zH8tAvgfbkRxXklg&oe=65EB6253",
                    createAt: String(Date.now()),
                    user_ip_list: {
                        create: [
                            {
                                ip,
                                createAt: String(Date.now()),
                                deviceName: device
                            }
                        ]
                    }
                }
            });

            return {
                data: result,
            };
        } catch (err) {
            console.log(err);
            return { err };
        }
    }

    // update user
    async update(userId: number, updateData: any) {
        try {
            let user = await this.prisma.user.update({
                where: {
                    id: userId
                },
                include: {
                    user_ip_list: true
                },
                data: {
                    ...updateData,
                    updateAt: String(Date.now())
                }
            })
            return {
                data: user
            }
        } catch (err) {
            console.log(err);

            return {
                err
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

    // find user
    async findUser(loginInfo: string) {
        try {
            let user = await this.prisma.user.findUnique({
                where: {
                    userName: loginInfo
                },
                include: {
                    user_ip_list: true
                }
            })
            if (!user) {
                user = await this.prisma.user.findUnique({
                    where: {
                        email: loginInfo
                    },
                    include: {
                        user_ip_list: true
                    }
                })
            }
            if (!user) {
                throw "Account does not exist!"
            }
            return {
                data: user
            }
        } catch (err) {
            return {
                err,
                data: null
            }
        }
    }
}
