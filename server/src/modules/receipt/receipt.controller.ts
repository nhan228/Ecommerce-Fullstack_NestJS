import { Controller, Get, Post, Delete, Body, Param, Req, Res, Patch } from '@nestjs/common';
import { Request, Response } from 'express';
import { ReceiptService } from './receipt.service';
import { RequestToken } from 'src/common/interface';
import CryptoJS from 'crypto-js';
import moment from 'moment';
import axios from 'axios';
import qs from 'qs';

const config = {
    appid: '553',
    key1: '9phuAOYhan4urywHTh0ndEXiV3pKHr5Q',
    key2: 'Iyz2habzyr7AG8SgvoBCbKwKi3UzlLi3',
}

@Controller('receipt')
export class ReceiptController {
    constructor(
        private readonly receiptService: ReceiptService
    ) { }

    @Get('/')
    async findMany(@Req() req: RequestToken, @Res() res: Response) {
        try {
            let { status, data, message } = await this.receiptService.findMany(Number(req.tokenData.id));
            if (!status) {
                throw { message };
            }
            return res.status(200).json({ data, message });
        } catch (err) {
            return res.status(500).json({ message: err.message || 'Server ERR!' });
        }
    }

    @Delete('/:id')
    async delete(@Param('id') id: number, @Res() res: Response) {
        try {
            let { status, data, message } = await this.receiptService.delete(id);
            if (!status) {
                throw { message };
            }
            return res.status(200).json({ data, message });
        } catch (err) {
            console.log(err);
            
            return res.status(500).json({ message: err.message || 'Server ERR!' });
        }
    }

    @Patch('/')
    async update(@Body() body: any, @Res() res: Response) {
        try {
            let { status, data, message } = await this.receiptService.update(body);
            if (!status) {
                throw { message };
            }
            return res.status(200).json({ data, message });
        } catch (err) {
            return res.status(500).json({ message: err.message || 'Server ERR!' });
        }
    }

    @Post('/addToCart')
    async addToCart(@Body() body: any, @Req() req: RequestToken, @Res() res: Response) {
        try {
            let { status, data, message } = await this.receiptService.addToCart(body, Number(req.tokenData.id))
            if (!status) {
                throw { message };
            }
            return res.status(200).json({
                data,
                message
            });
        } catch (err) {
            return res.status(500).json({ message: err.message || 'Server ERR' })
        }
    }

    @Patch('/pay/:receiptId')
    async pay(@Body() body: any, @Param('receiptId') receiptId: number, @Res() res: Response) {
        try {
            let { status, data, message } = await this.receiptService.pay(body, receiptId);
            if (!status) {
                throw { message };
            }
            return res.status(200).json({ data, message });
        } catch (err) {
            return res.status(500).json({ message: err.message || 'Server ERR' });
        }
    }

    @Patch('/updateReceipt/:receiptId')
    async updateReceipt(@Body() body: any, @Param('receiptId') receiptId: number, @Res() res: Response) {
        try {
            let { status, data, message } = await this.receiptService.updateReceipt(body, receiptId);
            if (!status) {
                throw { message };
            }
            return res.status(200).json({ data, message });
        } catch (err) {
            return res.status(500).json({ message: err.message || 'Server ERR' });
        }
    }

    @Post('/payZalo')
    async payZalo(@Body() body: any, @Res() res: Response) {
        try {
            const embed_data = { merchantinfo: 'embeddata123' };
            const items = [{}];
            const transID = Math.floor(Math.random() * 1000000);
            const order = {
                appid: config.appid,
                apptransid: `${moment().format('YYMMDD')}_${Math.ceil(Date.now() * Math.random())}_${body.receiptId}`,
                appuser: 'NHANTECH',
                apptime: Date.now(),
                item: JSON.stringify(items),
                embeddata: JSON.stringify(embed_data),
                amount: Number(body.total),
                description: `NHANTECH.VN - Payment for the order #${transID}`,
                bankcode: 'zalopayapp',
            };
            const data = config.appid + '|' + order.apptransid + '|' + order.appuser + '|' + order.amount + '|' + order.apptime + '|' + order.embeddata + '|' + order.item;
            (order as any).mac = CryptoJS.HmacSHA256(data, config.key1).toString();
            let result = await axios.post('https://sandbox.zalopay.com.vn/v001/tpe/createorder', null, { params: order });

            if (result.data.returncode == 1) {
                return res.status(200).json({
                    qrCodeUrl: result.data.orderurl,
                    orderId: order.apptransid,
                    message: 'Create QR code Successfully',
                });
            } else {
                throw { message: 'Create QR failed' };
            }
        } catch (err) {
            console.log('zalo err', err);
            return res.status(500).json({ data: null, message: err.message || 'Server Err!' });
        }
    }

    @Get('/payZaloCheck/:zaloReceiptId')
    async payZaloCheck(@Param('zaloReceiptId') zaloReceiptId: string, @Res() res: Response) {
        try {
            let postData = {
                appid: config.appid,
                apptransid: zaloReceiptId,
            };
            let data = postData.appid + '|' + postData.apptransid + '|' + config.key1;
            (postData as any).mac = CryptoJS.HmacSHA256(data, config.key1).toString();
            let postConfig = {
                method: 'post',
                url: 'https://sandbox.zalopay.com.vn/v001/tpe/getstatusbyapptransid',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: qs.stringify(postData),
            };
            let result = await axios(postConfig);
            if (result.data.returncode != 1) {
                throw { message: 'Paid failed!' };
            }
            return res.status(200).json({ status: true });
        } catch (err) {
            console.log('err', err);
            return res.status(500).json
                ({ status: false, message: err.message || 'Server Err!' });
        }
    }
}