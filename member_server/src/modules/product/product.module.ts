import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TokenMemberMiddleware } from 'src/middlewares/authen.middleware';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenMemberMiddleware)
      .forRoutes(
        { path: "product/delete-pictures/:id", method: RequestMethod.DELETE, version: "1" },
        { path: "product/delete/:id", method: RequestMethod.DELETE, version: "1" },
        { path: "product", method: RequestMethod.POST, version: "1" },
        { path: "product", method: RequestMethod.GET, version: "1" },
        { path: "product/:productId", method: RequestMethod.GET, version: "1" },
        { path: "product/:productId", method: RequestMethod.PATCH, version: "1" },
        { path: "product/des/:productId", method: RequestMethod.PATCH, version: "1" },
      )
  }
}