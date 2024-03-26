import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MemberService {
    constructor(private prisma: PrismaService){}

    // find by id
    async findById(id: number) {
        try {
            let member = await this.prisma.member.findUnique({
                where: {
                    id
                }
            })

            if(!member) throw {message: "Member does not exist!"}

            return {
                data: member,
                err: null
            }
        }catch(err) {
            return {
                err
            }
        }
    }

    // find by login id
    async findByLoginId(loginId: string) {
        try {
            let member = await this.prisma.member.findUnique({
                where: {
                    loginId
                }
            })

            if(!member) throw {message: "Member does not exist!"}

            return {
                data: member,
                err: null
            }
        }catch(err) {
            return {
                err
            }
        }
    }
  
    // create member
    async create(data: any) {
        try {
            let member = await this.prisma.member.create({
                data: {
                    ...data,
                    permission: "[]"
                }
            })
            
            return {
                data: member
            }
        }catch(err) {
            return {
                err
            }
        }
    }

    // update member
    async update(memberId: number, data: any) {
        try {
            let member = await this.prisma.member.update({
                where: {
                    id: memberId
                },
                data: {
                    ...data,
                    updateTime: String(Date.now())
                }
            })
            
            return {
                data: member,
            }
        }catch(err) {
            return {
                err
            }
        }
    }
}