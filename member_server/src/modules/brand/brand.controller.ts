import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req, Res } from '@nestjs/common'
import { Response } from 'express'
import { CreateBrandDTO } from './dto/create-brand.dto'
import { UpdateBrandDTO } from './dto/update-brand.dto'
import { BrandService } from './brand.service'
import { RequestToken } from 'src/common/interface'

@Controller('brand')
export class BrandController {
    constructor(private readonly brandService: BrandService) {}

    // Create brand 
    @Post('/')
    async Createbrand(@Req() req: RequestToken, @Body() body: any, @Res() res: Response) {
        try {            
            let perList = JSON.parse(req.tokenData.permission);
            
            if (!perList.find((per: any) => per == "c:brand")) {
              throw "Permission Denied!"
            }
            
            let { err, data } = await this.brandService.createBrand(body);
            if (err) {
                if(err.meta.target == 'brands_title_key') {
                    throw {
                        message: 'Brand name already exists in the system. Please choose another or update this brand!'
                      }
                    }
                    if(err.meta.target == 'brands_codeName_key') {
                        throw {
                            message: 'Brand code name already exists in the system. Please choose another or update this brand!'
                          }
                        }
                    throw {
                        message:"Database err"
                    }
            }

            res.status(200).json({
              message: "Create brand successfully!",
              data
            })
          } catch (err) {
            res.status(500).json({
                err: err.message || "Server error, please try again in a few minutes"
              })
          }
    }

    // Get brands
    @Get('/')
    async findBrand(@Req() req: RequestToken, @Res() res: Response) {
        try {
            let perList = JSON.parse(req.tokenData.permission)

            if (!perList.find((per: any) => per == "r:brand")) {
                throw "Permission Denied!"
            }
            let { err, data } = await this.brandService.findAll()
            if (err) {
                throw "Error database"
            }
            res.status(200).json({
                message: "Get brand list successfully!",
                data
            })
        } catch (err) {
            res.status(500).json({
                message: err ? [err] : ["Server error!"]
            })
        }
    }

    // Get banner by id
    @Get('/:brandId')
    async findById(@Req() req: RequestToken, @Param('brandId', ParseIntPipe) brandId: number, @Res() res: Response) {
        try {
            let perList = JSON.parse(req.tokenData.permission)

            // check per
            if (!perList.find((per: any) => per == "c:brand")) {
                throw "Permission Denied!"
            }
            if (!perList.find((per: any) => per == "r:brand")) {
                throw "Permission Denied!"
            }

            if (!perList.find((per: any) => per == "u:brand")) {
                throw "Permission Denied!"
            }
            if (!perList.find((per: any) => per == "d:brand")) {
                throw "Permission Denied!"
            }

            let { err, data } = await this.brandService.findById(brandId)

            if (err) {
                throw "Error database"
            }
            res.status(200).json({
                message: "Get brand successfully!",
                data
            })
        } catch (err) {
            res.status(500).json({
                message: err ? [err] : ["Server error!"]
            })
        }
    }

    // update brand data
    @Patch('/:brandId')
    async updatebrand(@Param('brandId', ParseIntPipe) brandId: number, @Req() req: RequestToken, @Body() body: UpdateBrandDTO, @Res() res: Response) {
        try {
            let perList = JSON.parse(req.tokenData.permission)
            if (!perList.find((per: any) => per == "u:brand")) {
                throw "Permission Denied!"
            }

            let { err, data } = await this.brandService.updateData(brandId, body)

            if (err) {
                throw "Error database"
            }
            res.status(200).json({
                message: "Update brand successfullly!",
                data
            })
        } catch (err) {
            res.status(500).json({
                message: err ? [err] : ["Server error!"]
            })
        }
    }
}
