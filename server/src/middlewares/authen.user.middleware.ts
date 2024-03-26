import { Injectable, NestMiddleware, Next, Req, Res } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { NextFunction, Response } from 'express'
import { util } from "src/utils";
import { UserService } from "src/modules/user/user.service";
import { RequestToken } from "src/common/interface";

@Injectable()
export class TokenUserMiddleWare implements NestMiddleware {

    constructor(private readonly prisma: PrismaService, private readonly userService: UserService) { }

    async use(@Req() req: RequestToken, @Res() res: Response, @Next() next: NextFunction) {
        try {
            let tokenCode = req.params?.token ? String(req.params?.token) : String(req.headers?.token)
            // check and get token in query
            if (!tokenCode) {
                tokenCode = String(req.query?.token)
            }

            // check not found token
            if (!tokenCode) {
                throw {
                    message: "Tokens not found!"
                }
            }

            // decode token
            let tokenData: any = util.token.decodeToken(String(tokenCode))
            if (!tokenData) {
                throw {
                    message: "Decode token failed!"
                }
            }

            // find user
            let { data, err } = await this.userService.findUser(tokenData.userName)
            if(err){
                throw {
                    message: "User does not exist"
                }
            }

            // check valid token
            if(data.updateAt != tokenData.updateAt){
                throw{
                    message: "Invalid token!"
                }
            }
            req.tokenData = tokenData
            next()
        } catch (err) {
            return res.status(413).json({
                message: err.message ? [err.message] : ["Authentication failed, system error!"]
            })
        }
    }
}