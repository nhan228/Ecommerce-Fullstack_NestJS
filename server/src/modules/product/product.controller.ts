import { Controller, Get, Param, ParseIntPipe, Req, Res } from '@nestjs/common'
import { Response } from 'express'
import { RequestToken } from 'src/common/interface'
import { ProductService } from './product.service'

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }
    // Get products
    @Get('/')
    async findProduct(@Req() req: RequestToken, @Res() res: Response) {
        try {
            let { err, data } = await this.productService.findAll()
            if (err) {
                throw "Error database"
            }
            res.status(200).json({
                message: "Get product list successfully!",
                data
            })
        } catch (err) {
          console.log('err',err);
            res.status(500).json({
                message: err ? [err] : ["Server error!"]
            })
        }
    }

    // Get product by id
    @Get('/:productId')
    async findProductById(@Req() req: RequestToken, @Param('productId', ParseIntPipe) productId: number, @Res() res: Response) {
        try {
            let perList = JSON.parse(req.tokenData.permission)

            // check per
            if (!perList.find((per: any) => per == "c:product")) {
                throw "Permission Denied!"
            }
            if (!perList.find((per: any) => per == "r:product")) {
                throw "Permission Denied!"
            }

            if (!perList.find((per: any) => per == "u:product")) {
                throw "Permission Denied!"
            }
            if (!perList.find((per: any) => per == "d:product")) {
                throw "Permission Denied!"
            }

            let { err, data } = await this.productService.findById(productId)

            if (err) {
                throw "Error database"
            }
            res.status(200).json({
                message: "Get product successfully!",
                data
            })
        } catch (err) {
            res.status(500).json({
                message: err ? [err] : ["Server error!"]
            })
        }
    }

}
