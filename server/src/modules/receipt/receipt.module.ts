import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { ReceiptController } from './receipt.controller';
import { TokenUserMiddleWare } from 'src/middlewares/authen.user.middleware';
import { UserService } from '../user/user.service';

@Module({
  controllers: [ReceiptController],
  providers: [ReceiptService, UserService],
})

export class ReceiptModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenUserMiddleWare)
      .forRoutes(
        { path: 'receipt', method: RequestMethod.GET, version: "1" },
        { path: 'receipt', method: RequestMethod.PATCH, version: "1" },
        { path: 'receipt/addToCart', method: RequestMethod.POST, version: "1" },
        { path: 'receipt/:receiptId', method: RequestMethod.DELETE, version: "1" },
        { path: 'receipt/pay/:receiptId', method: RequestMethod.PATCH, version: "1" },
        { path: 'receipt/updateReceipt/:receiptId', method: RequestMethod.PATCH, version: "1" },
        { path: 'receipt/payZalo', method: RequestMethod.POST, version: "1" },
        { path: 'receipt/payZaloCheck/:zaloReceiptId', method: RequestMethod.GET, version: "1" },
      )
  }
}
