import {hashSync} from 'bcrypt'

import { MemberRole, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

import categoryList from './category'
import productList from './product'
import pictureList from './picture';
import brandList from './brands';


(
    async function main() {
        /* create default master account */
        await prisma.member.create({
            data: {
                createTime: String(Date.now()),
                email: "lthanhnhan941@gmail.com",
                emailConfirm: true,
                firstLoginState: false,
                ipList: '["::ffff:127.0.0.1","::1"]',
                loginId: "master",
                password: hashSync("123", 10),
                permission: '["c:log", "r:log", "u:log","d:log", "c:member", "r:member", "u:member","d:member","c:category", "r:category", "u:category", "d:category","c:banner", "r:banner", "u:banner","d:banner", "c:brand", "r:brand", "u:brand","d:brand", "c:product", "r:product", "u:product","d:product", "c:user", "r:user", "u:user","d:user","c:vocher", "r:vocher", "u:vocher","d:vocher"]',
                phoneNumber: "0961992801",
                updateTime: String(Date.now()),
                firstName: "BOSS",
                lastName: "NHÂN",
                role: MemberRole.master,
                avatar: "https://sarasanalytics.com/wp-content/uploads/2022/07/Amazon-API-Guide-2022.jpg"
            }
        })

        /* create default category */
        await prisma.categories.createMany({
            data: [
                ...categoryList
            ]
        })

        /* create default brand */
        await prisma.brands.createMany({
            data: [
                ...brandList
            ]
        })

        /* create default product */
        await prisma.products.createMany({
            data: [
                ...productList
            ]
        })

        /* create default pictureList */
        await prisma.pictures.createMany({
            data: [
                ...pictureList
            ]
        })
    }
)()