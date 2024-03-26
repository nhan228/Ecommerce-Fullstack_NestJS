import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TokenUserMiddleWare } from 'src/middlewares/authen.user.middleware';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService]
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer){
    consumer
    .apply(TokenUserMiddleWare)
    .forRoutes(
      {path:"user/confirm_ip/:token", method:RequestMethod.GET,version:"1"},
      {path:"user/confirm_email/:token", method:RequestMethod.GET,version:"1"},
      {path:"user/decodeToken/:token", method:RequestMethod.GET,version:"1"}
    )
  }
}
