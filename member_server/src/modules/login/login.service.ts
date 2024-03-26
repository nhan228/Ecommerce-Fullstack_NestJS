import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LoginService {
  constructor(private prisma: PrismaService){}

  // Find Log
  async findLogMany() {
    try {
      let logs = await this.prisma.logs.findMany({
        include: {
          member: true
        }
      });
      return {
        data: logs
      }
    }catch(err) {
      return {
        err
      }
    }
  }

  // Create Log
  async createLog(data: any) {
    try {
      let log = await this.prisma.logs.create({
        data,
        include: {
          member: true
        }
      });
      return {
        data: log
      }
    }catch(err) {
      return {
        err
      }
    }
  }

  // Find Member
  async findMemberMany() {
    try {
      let menbers = await this.prisma.member.findMany({
      });
      return {
        data: menbers
      }
    }catch(err) {
      return {
        err
      }
    }
  }
}
