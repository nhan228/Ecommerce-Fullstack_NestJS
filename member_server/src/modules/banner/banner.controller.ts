import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Patch, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common'
import { Response } from 'express'
import { RequestToken } from 'src/common/interface'
import { UpdateBannerDTO } from './dto/update-banner.dto'
import { BannerService } from './banner.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { writeFileSync } from 'fs'

@Controller('banner')
export class BannerController {
    constructor(private readonly bannerService: BannerService) {}

    // Create banner img
    @Post('/')
    @UseInterceptors(FileInterceptor('img'))
    async createBanner(@UploadedFile(new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 5*1024*1024 }),
        new FileTypeValidator({ fileType: /^image\// }),
      ]
    })) img: Express.Multer.File, @Req() req: RequestToken, @Body() body: any, @Res() res: Response) {
  
      try {        
        let perList = JSON.parse(req.tokenData.permission)
        if (!perList.find((per: any) => per == "c:banner")) {
          throw "Permission Denied!"
        }
  
        let fileName = `banner_${Math.ceil(Date.now() * Math.random())}.${img.mimetype.split("/")[1]}`
        writeFileSync(`public/img/banner/${fileName}`, img.buffer)
        let { err, data } = await this.bannerService.create(JSON.parse(body.data), `img/banner/${fileName}`)
  
        if (err) {
          throw "Error database"
        }
  
        res.status(200).json({
          message: "Create banner successfully!",
          data:{
            ...data,
            createAt: data.createAt.toString()
          }
        })
      } catch (err) {   
        res.status(500).json({
          message: err ? [err] : ["Server error!"]
        })
      }
    }

    // Get banners
    @Get('/')
    async findBanner(@Req() req: RequestToken, @Res() res: Response) {
        try {
            let perList = JSON.parse(req.tokenData.permission)

            if (!perList.find((per: any) => per == "r:banner")) {
                throw "Permission Denied!"
            }
            let { err, data } = await this.bannerService.findAll()
            if (err) {
                throw "Error database"
            }
            res.status(200).json({
                message: "Get banner list successfully!",
                data
            })
        } catch (err) {
            res.status(500).json({
                message: err ? [err] : ["Server error!"]
            })
        }
    }

    // Get banner by id
    @Get('/:bannerId')
    async findBannerById(@Req() req: RequestToken, @Param('bannerId', ParseIntPipe) bannerId: number, @Res() res: Response) {
        try {
            let perList = JSON.parse(req.tokenData.permission)

            // check per
            if (!perList.find((per: any) => per == "c:banner")) {
                throw "Permission Denied!"
            }
            if (!perList.find((per: any) => per == "r:banner")) {
                throw "Permission Denied!"
            }

            if (!perList.find((per: any) => per == "u:banner")) {
                throw "Permission Denied!"
            }
            if (!perList.find((per: any) => per == "d:banner")) {
                throw "Permission Denied!"
            }

            let { err, data } = await this.bannerService.findById(bannerId)

            if (err) {
                throw "Error database"
            }
            res.status(200).json({
                message: "Get banner successfully!",
                data
            })
        } catch (err) {
            res.status(500).json({
                message: err ? [err] : ["Server error!"]
            })
        }
    }

    // update banner data
    @Patch('/:bannerId')
    async updateBanner(@Param('bannerId', ParseIntPipe) bannerId: number, @Req() req: RequestToken, @Body() body: UpdateBannerDTO, @Res() res: Response) {
        try {
            let perList = JSON.parse(req.tokenData.permission)
            if (!perList.find((per: any) => per == "u:banner")) {
                throw "Permission Denied!"
            }

            let { err, data } = await this.bannerService.update(bannerId, body)

            if (err) {
                throw "Error database"
            }
            res.status(200).json({
                message: "Update banner successfullly!",
                data
            })
        } catch (err) {
            res.status(500).json({
                message: err ? [err] : ["Server error!"]
            })
        }
    }

    // update banner img
    @Patch('/img/:bannerId')
    @UseInterceptors(FileInterceptor('img'))
    async updateBannerImg(@Param('bannerId', ParseIntPipe) bannerId: number, @Req() req: RequestToken,  @Body() body: any, @Res() res: Response, @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
            new FileTypeValidator({ fileType: /^image\// }),
        ]
    })) img: Express.Multer.File) {
        try {           
            let perList = JSON.parse(req.tokenData.permission)
            if (!perList.find((per: any) => per == "u:banner")) {
                throw "Permission Denied!"
            }
            
            let fileName = `banner_${Math.ceil(Date.now() * Math.random())}.${img.mimetype.split("/")[1]}`            
            writeFileSync(`public/img/banner/${fileName}`, img.buffer)
            let { err, data } = await this.bannerService.update(bannerId, {... JSON.parse(body.data), img: `img/banner/${fileName}`})
            
            if (err) {
                throw "Error database"
            }
            res.status(200).json({
                message: "Update banner successfully!",
                data
            })
        } catch (err) {
            res.status(500).json({
                message: err ? [err] : ["Server error!"]
            })
        }
    }
}
