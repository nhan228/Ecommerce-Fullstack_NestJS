import { UserModule } from './modules/user/user.module'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './modules/prisma/prisma.module'
import { ConfigModule } from '@nestjs/config'
import { MailModule } from './modules/mail/mail.module'
import { ProductModule } from './modules/product/product.module'
import { CategoryModule } from './modules/category/category.module'
import { BrandModule } from './modules/brand/brand.module'
import { BannerModule } from './modules/banner/banner.module'
import { ReceiptModule } from './modules/receipt/receipt.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    MailModule,
    UserModule,
    ProductModule,
    BannerModule,
    CategoryModule,
    BrandModule,
    ReceiptModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

