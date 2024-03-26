import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { TokenMemberMiddleware } from 'src/middlewares/authen.middleware';

@Module({
  controllers: [BannerController],
  providers: [BannerService],
})
export class BannerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenMemberMiddleware)
      .forRoutes(
        { path: "banner", method: RequestMethod.POST, version: "1" },
        { path: "banner", method: RequestMethod.GET, version: "1" },
        { path: "banner/:bannerId", method: RequestMethod.GET, version: "1" },
        { path: "banner/:bannerId", method: RequestMethod.PATCH, version: "1" },
        { path: "banner/img/:bannerId", method: RequestMethod.PATCH, version: "1" },
      )
  }
}


