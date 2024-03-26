import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { ReceiptController } from './receipt.controller';
import { TokenMemberMiddleware } from 'src/middlewares/authen.middleware';

@Module({
  controllers: [ReceiptController],
  providers: [ReceiptService],
})

export class ReceiptModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenMemberMiddleware)
      .forRoutes(
        { path: 'receipt', method: RequestMethod.GET },
        { path: 'receipt/updateReceipt/:receiptId', method: RequestMethod.PATCH },
        { path: 'receipt/:receiptId', method: RequestMethod.DELETE },
        { path: 'receipt/payZaloCheck/:zaloReceiptId', method: RequestMethod.GET },
      )
  }
}
