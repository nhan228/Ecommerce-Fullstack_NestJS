import { Controller, Get, Res } from '@nestjs/common';
import { BannerService } from './banner.service';
import { Response } from "express"

@Controller('banner')
export class BannerController {
  constructor(
    private readonly bannerService: BannerService
  ) { }
  @Get('/')
  async findBanner(@Res() res: Response) {
    try {
      let { data, err } = await this.bannerService.findBanner()
      if (err) {
        throw {
          message: "Get Banner failed!"
        }
      }
      return res.status(200).json({
        data
      })
    } catch (err) {
      return res.status(500).json({
        message: err.message ? [err.message] : ["Sever err"]
      })
    }
  }
}
