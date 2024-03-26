import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TokenMemberMiddleware } from 'src/middlewares/authen.middleware';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer){
    consumer
    .apply(TokenMemberMiddleware)
    .forRoutes(
      {path:"userData", method:RequestMethod.GET,version:"1"},
      {path:"userData/:userId", method:RequestMethod.GET,version:"1"},
      {path:"userData/:userId", method:RequestMethod.PATCH,version:"1"}
    )
  }
}
