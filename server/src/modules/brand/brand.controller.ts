import { Controller, Get, Res } from '@nestjs/common';
import { BrandService } from './brand.service';
import { Response } from "express"

@Controller('brand')
export class BrandController {
  constructor(
    private readonly brandService: BrandService
  ) { }
  @Get('/')
  async findBrand(@Res() res: Response) {
    try {
      let { data, err } = await this.brandService.findBrand()
      if (err) {
        throw {
          message: "Get Brand failed!"
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
