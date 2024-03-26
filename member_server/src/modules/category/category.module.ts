import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TokenMemberMiddleware } from 'src/middlewares/authen.middleware';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenMemberMiddleware)
      .forRoutes(
        { path: "category", method: RequestMethod.POST, version: "1" },
        { path: "category", method: RequestMethod.GET, version: "1" },
        { path: "category/:categoryId", method: RequestMethod.GET, version: "1" },
        { path: "category/:categoryId", method: RequestMethod.PATCH, version: "1" },
      )
  }
}


