import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, Res } from '@nestjs/common'
import { Response } from 'express'
import { RequestToken } from 'src/common/interface'
import { UpdateProductDTO } from './dto/update-product.dto'
import { ProductService } from './product.service'

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }
    // Create product
    @Post('/')
    async createProduct(@Req() req: RequestToken, @Body() body: any, @Res() res: Response) {
        try {
            let perList = JSON.parse(req.tokenData.permission)
            if (!perList.find((per: any) => per == "c:product")) {
                throw "Permission Denied!"
            }
            let { err, data } = await this.productService.create(body.newProduct, body.pictures)
            if (err) {
                throw {
                    message: "Error database",
                    err
                }
            }

            res.status(200).json({
                message: "Create product successfully!",
                data
            })
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: err ? [err] : ["Server error!"]
            })
        }
    }

    // Get products
    @Get('/')
    async findProduct(@Req() req: RequestToken, @Res() res: Response) {
        try {
            let perList = JSON.parse(req.tokenData.permission)

            if (!perList.find((per: any) => per == "r:product")) {
                throw "Permission Denied!"
            }
            let { err, data } = await this.productService.findAll()
            if (err) {
                throw "Error database"
            }
            res.status(200).json({
                message: "Get product list successfully!",
                data
            })
        } catch (err) {
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

    // update product data
    @Patch('/:productId')
    async updateProduct(@Param('productId', ParseIntPipe) productId: number, @Req() req: RequestToken, @Res() res: Response, @Body() body: any) {
        try {
            let perList = JSON.parse(req.tokenData.permission)
            if (!perList.find((per: any) => per == "u:product")) {
                throw "Permission Denied!"
            }
            console.log('body', body.price);
            
            let { err, data } = await this.productService.update(productId, body)

            if (err) {
                throw "Error database"
            }
            res.status(200).json({
                message: "Update product successfullly!",
                data
            })
        } catch (err) {
            console.log('err', err);
            res.status(500).json({
                message: err ? [err] : ["Server error!"]
            })
        }
    }

    // update product des 
    @Patch('/des/:productId')
    async updateDes(@Param('productId', ParseIntPipe) productId: number, @Req() req: RequestToken, @Body() body: any, @Res() res: Response) {
        try {
            console.log('vao');
            
            let perList = JSON.parse(req.tokenData.permission)
            if (!perList.find((per: any) => per == "u:product")) {
                throw "Permission Denied!"
            }
            
            console.log('vao1', body);
            let { err, data } = await this.productService.updateDes(productId, body)

            if (err) {
                throw "Error database"
            }
            res.status(200).json({
                message: "Update product successfullly!",
                data
            })
        } catch (err) {
            res.status(500).json({
                message: err ? [err] : ["Server error!"]
            })
        }
    }

    // delete
    @Delete('/:productId')
    async delete(@Param('productId', ParseIntPipe) productId: number, @Req() req: RequestToken, @Res() res: Response) {
        try {
            let { err, data } = await this.productService.delete(productId)

            let perList = JSON.parse(req.tokenData.permission)
            if (!perList.find((per: any) => per == "d:product")) {
                throw "Permission Denied!"
            }

            if (err) {
                throw {
                    message: "bi loi roi",
                    err
                }
            }
            return res.status(200).json({
                message: 'ok',
                data
            })
        } catch (err: any) {
            return res.status(500).json({
                message: (err.message && err.err) || "Toi bi loi roi"
            })
        }
    }

    // delete product pictures
    @Delete('/delete-pictures/:productId')
    async deletePic(@Param('productId', ParseIntPipe) productId: number, @Req() req: RequestToken, @Res() res: Response) {
        try {
            let { status, data, message } = await this.productService.deletePic(productId)

            let perList = JSON.parse(req.tokenData.permission)
            if (!perList.find((per: any) => per == "d:product")) {
                throw "Permission Denied!"
            }

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
            return res.status(500).json({
                message: err.message || "LOI SERVER"
            })
        }
    }
}
