import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { RequestToken } from 'src/common/interface';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Member } from '@prisma/client'
import { tokenAdmin } from 'src/utils/token';

@Injectable()
export class TokenMemberMiddleware implements NestMiddleware {

  constructor(private prisma: PrismaService) { }

  async use(req: RequestToken, res: Response, next: NextFunction) {
    try {
      let tokenCode = (req.headers?.token ? String(req.headers?.token) : req.params.token) || null;
      tokenCode = tokenCode ? tokenCode : String(req.query.token);
      
      // check token code
      if (!tokenCode) return res.status(413).json({
        message: "Error token!"
      })
      
      let tokenData = tokenAdmin.decodeToken(tokenCode)
      req.tokenData = tokenData;
      
      // find member
      let member = await this.prisma.member.findUnique({
        where: {
          id: (tokenData as Member).id
        }
      })
      
      // Check isMember
      if (!member) throw false

      // Check token valid
      if (member.updateTime != (tokenData as Member).updateTime) {
        throw {
          message: "Invalid token!"
        }
      }
      
      next();
    } catch (err) {      
      return res.status(413).json({
        message: "Authentication failed!"
      })
    }
  }
}
