import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Request, Response } from 'express'
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  async topUp(@Req() req: Request,@Body() body: any, @Res() res: Response) {
      if(process.env.CASSO_KEY != req.headers['secure-token']) {
        return res.status(500).json({
          message: "Call failed, system error!"
        })
      }
      return res.status(200).json({
        message: "Call Successfully"
      })
  }
}
