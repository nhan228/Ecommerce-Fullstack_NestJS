import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req, Res } from '@nestjs/common'
import { Response } from 'express'
import { UpdateCategoryDTO } from './dto/update-category.dto'
import { CategoryService } from './category.service'
import { RequestToken } from 'src/common/interface'

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    // Create category 
    @Post('/')
    async CreateCategory(@Req() req: RequestToken, @Body() body: any, @Res() res: Response) {
        try {            
            let perList = JSON.parse(req.tokenData.permission);
            console.log('a', req);
            
            if (!perList.find((per: any) => per == "c:category")) {
              throw "Permission Denied!"
            }
            
            let { err, data } = await this.categoryService.createCategory(body);
            if (err) {
                if(err.meta.target == 'categories_title_key') {
                    throw {
                        message: 'Category name already exists in the system. Please choose another or update this category!'
                      }
                    }
                    if(err.meta.target == 'categories_codeName_key') {
                        throw {
                            message: 'Category code name already exists in the system. Please choose another or update this category!'
                          }
                        }
                    throw {
                        message:"Database err"
                    }
            }

            res.status(200).json({
              message: "Create category successfully!",
              data
            })
          } catch (err) {
            res.status(500).json({
                err: err.message || "Server error, please try again in a few minutes"
              })
          }
    }

    // Get categories
    @Get('/')
    async findCategory(@Req() req: RequestToken, @Res() res: Response) {
        try {
            let perList = JSON.parse(req.tokenData.permission)

            if (!perList.find((per: any) => per == "r:category")) {
                throw "Permission Denied!"
            }
            let { err, data } = await this.categoryService.findAll()
            if (err) {
                throw "Error database"
            }
            res.status(200).json({
                message: "Get category list successfully!",
                data
            })
        } catch (err) {
            res.status(500).json({
                message: err ? [err] : ["Server error!"]
            })
        }
    }

    // Get banner by id
    @Get('/:categoryId')
    async findById(@Req() req: RequestToken, @Param('categoryId', ParseIntPipe) categoryId: number, @Res() res: Response) {
        try {
            let perList = JSON.parse(req.tokenData.permission)

            // check per
            if (!perList.find((per: any) => per == "c:category")) {
                throw "Permission Denied!"
            }
            if (!perList.find((per: any) => per == "r:category")) {
                throw "Permission Denied!"
            }

            if (!perList.find((per: any) => per == "u:category")) {
                throw "Permission Denied!"
            }
            if (!perList.find((per: any) => per == "d:category")) {
                throw "Permission Denied!"
            }

            let { err, data } = await this.categoryService.findById(categoryId)

            if (err) {
                throw "Error database"
            }
            res.status(200).json({
                message: "Get category successfully!",
                data
            })
        } catch (err) {
            res.status(500).json({
                message: err ? [err] : ["Server error!"]
            })
        }
    }

    // update category data
    @Patch('/:categoryId')
    async updateCategory(@Param('categoryId', ParseIntPipe) categoryId: number, @Req() req: RequestToken, @Body() body: UpdateCategoryDTO, @Res() res: Response) {
        try {
            let perList = JSON.parse(req.tokenData.permission)
            if (!perList.find((per: any) => per == "u:category")) {
                throw "Permission Denied!"
            }

            let { err, data } = await this.categoryService.updateData(categoryId, body)

            if (err) {
                throw "Error database"
            }
            res.status(200).json({
                message: "Update category successfullly!",
                data
            })
        } catch (err) {
            res.status(500).json({
                message: err ? [err] : ["Server error!"]
            })
        }
    }
}
