import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { TokenMemberMiddleware } from 'src/middlewares/authen.middleware';

@Module({
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenMemberMiddleware)
      .forRoutes(
        { path: "brand", method: RequestMethod.POST, version: "1" },
        { path: "brand", method: RequestMethod.GET, version: "1" },
        { path: "brand/:brandId", method: RequestMethod.GET, version: "1" },
        { path: "brand/:brandId", method: RequestMethod.PATCH, version: "1" },
      )
  }
}


