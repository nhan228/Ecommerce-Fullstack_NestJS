import { Body, Controller, Ip, Post, Req, Res, Get, Param, ParseIntPipe, Patch, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from "express"
import { RequestToken } from 'src/common/interface';

@Controller('userData')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  // Find all user
  @Get('/')
  async findMany(@Req() req: RequestToken, @Res() res: Response) {
    try {
      let perList = JSON.parse(req.tokenData.permission)

      if (!perList.find((per: any) => per == "r:user")) {
        throw "Permission Denied!"
      }
      let { err, data } = await this.userService.findAll()
      if (err) {
        throw "Error database"
      }
      res.status(200).json({
        message: "Get user list successfully!",
        data
      })
    } catch (err) {
      res.status(500).json({
        message: err ? [err] : ["Server error!"]
      })
    }
  }

  // Update User
  @Patch('/:userId')
  async updateUser(@Req() req: RequestToken, @Res() res: Response, @Param('userId', ParseIntPipe) userId: number, @Body() body: any) {
    try {
      let perList = JSON.parse(req.tokenData.permission)
      if (!perList.find((per: any) => per == "u:user")) {
        throw "Permission Denied!"
      }
      if (!perList.find((per: any) => per == "d:user")) {
        throw "Permission Denied!"
      }
      let { status, data, message } = await this.userService.update(Number(userId), body)
      if (!status) {
        throw {
            message
        }
    }
    return res.status(200).json({
        data,
        message
    })
    } catch (err) {
      res.status(500).json({
        message: err ? [err] : ["Server error!"]
      })
    }
  }
}
