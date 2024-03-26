import { Injectable } from "@nestjs/common";
import { createTransport } from 'nodemailer'

@Injectable()
export class MailService {
    private readonly transporter = createTransport({
        service: 'gmail',
        auth: {
            user: process.env.VITE_MAIL_USERNAME,
            pass: process.env.VITE_MAIL_PASSWORD
        }
    });

    async sendMail(to: string, subject: string, html: string, from: string = process.env.MAIL_ID) {
        let mailOptions = {
            from,
            to,
            subject,
            html
        };
        return await this.transporter.sendMail(mailOptions)
    }
}