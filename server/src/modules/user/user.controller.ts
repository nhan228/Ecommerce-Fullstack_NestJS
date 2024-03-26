import { Body, Controller, Ip, Post, Req, Res, Get, Param, ParseIntPipe, Patch, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from "express"
import { userLoginDTO } from './dto/login-user.dto';
import { util } from 'src/utils';
import { RequestToken } from 'src/common/interface';
import { compareSync, hashSync } from 'bcrypt'
import { CreateUserDTO } from './dto/create-user.dto';
import { AvailableStatus } from '@prisma/client'
import { MailService } from '../mail/mail.service';
import axios from 'axios';
import { token } from 'src/utils/token';
import useragent from "useragent";
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private mailService: MailService
  ) { }

  // Decode token
  @Get('/decodeToken/:token')
  async decodeToken(@Req() req: RequestToken, @Res() res: Response) {
    try {
      return res.status(200).json({
        data: req.tokenData,
        message: "Decode token successfully!"
      })
    } catch (err) {
      return res.status(500).json({
        data: null,
        message: [err.message] ? [err.message] : "Decode token failed!"
      })
    }
  }

  // Register
  @Post("/register")
  async createUser(@Ip() ip: string, @Body(new ValidationPipe()) body: CreateUserDTO, @Req() req: Request, @Res() res: Response) {
    try {

      let realIpList = (req as any).headers['x-forwarded-for'] ? (req as any).headers['x-forwarded-for'] : ip
      const userAgent = useragent.parse(req.headers["user-agent"]);
      const deviceInfo = `${userAgent.device}-${userAgent.os}-${userAgent.family}`;

      let { data, err } = await this.userService.register({
        ...body,
        password: hashSync(body.password ? body.password : "123456", 10),
        ipList: JSON.stringify([`${realIpList}`]),
      }, ip, deviceInfo)

      if (err) {
        if (err.meta?.target == 'User_userName_key') {
          throw {
            message: 'Username already exists!'
          };
        }
        if (err.meta?.target == 'User_email_key') {
          throw {
            message: 'Email is already in use!'
          };
        }
      }
      this.mailService.sendMail(data.email, '[Amazon by Nhan design]_Verify email address!',
        `
        <h3 style="font-size: 22px; color: #4abb64; margin: 0;">Verify the email address for the account ${data.userName}</h3>
        <p>Hi <span style="font-weight: 600" ${data.firstName ? data.firstName : data.userName} ${data.lastName ? data.lastName : ""}, 
        </span>This is the email to verify the login address, please click on the link below to verify the email!</p>
        <p style="color: red; font-weight: bold;">This link is valid for 5 minutes!!!</p>
        <a style="font-style: italic; color: #4d90fe; padding: 5px 0px; display: flex; border-radius: 5px; font-size: 18px;background-color: #fcd200; font-weight: 600; justify-content: center; align-items: center" href="${process.env.SV_API}/user/confirm_email/${util.token.createToken({
          ...data,
          emailConfirm: AvailableStatus.active
        })}">Verify here!</a>
        `)

      return res.status(200).json({
        message: "VERIFY SUCCESSFULLY!",
        data
      })

    } catch (err) {
      return res.status(500).json({
        message: err.message ? [err.message] : ["Server Maintenance"]
      })
    }
  }

  // Login
  @Post('/login')
  async login(@Ip() ip: string, @Req() req: Request, @Body() body: userLoginDTO, @Res() res: Response) {
    let realIpList = (req as any).headers['x-forwarded-for'] ? (req as any).headers['x-forwarded-for'] : ip
    try {
      let { data, err } = await this.userService.findUser(body.loginInfo)
      if (err) {
        throw {
          message: err
        }
      }

      if (!compareSync(body.password, data.password)) {
        throw {
          message: "Incorrect password!"
        }
      }
      if (body.loginInfo.includes("@") && data.emailConfirm != AvailableStatus.active) {
        this.mailService.sendMail(data.email, '[Amazon by Nhan design]_Verify email address!',
          `
          <h3>Verify the email address for the account ${data.userName}</h3>
          <p>Hi ${data.firstName ? data.firstName : data.userName} ${data.lastName ? data.lastName : ""}, 
          This is the email to verify the login address, please click on the link below to verify the email!</p>
          <p style="color: red; font-weight: bold;">This link is valid for 5 minutes!!!</p>
          <a href="${process.env.SV_API}/user/confirm_email/${util.token.createToken({
            ...data,
            emailConfirm: AvailableStatus.active
          })}">Verify here!</a>
        `)
        throw {
          message: `Your email address has not been verified, cannot log in by email, we have sent a verification email to this email: ${data.email}!`
        }
      }
      if (!JSON.parse(data.ipList).find((item: string) => item == realIpList.split(',')[0])) {
        let NewIpList = JSON.stringify([...JSON.parse(data.ipList), realIpList.split(',')[0]])

        this.mailService.sendMail(data.email, '[Amazon by Nhan design]_Update new login location!',
          `
        <h3>Update new login location to account: ${data.userName}</h3>
        <p>Hi ${data.firstName ? data.firstName : data.userName} ${data.lastName ? data.lastName : ""}, 
        We detected that you are logging in at a new location, please click on the link below to verify your new login location!</p>
        <p>IP address:${realIpList.split(',')[0]}</p>
        <p style="color: red; font-weight: bold;">This link is valid for 5 minutes!!!.</p>
        <a href="${process.env.SV_API}/user/confirm_ip/${util.token.createToken({
            ...data,
            ipList: NewIpList,
          })}">Verify now!</a>
        `)
        throw {
          message: "You are logging in at a new location, please check your confirmation email!"
        }
      }
      let lastLogin = String(Date.now())
      await this.userService.update(data.id, {
        ...data,
        lastLogin,
      })

      let result = await this.userService.findById(data.id)
      return res.status(200).json({
        data: util.token.createToken(result.data, "2d"),
        message: "Logged in successfully!"
      })
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: err.message ? [err.message] : ["Login failed! Please try again later!"]
      })
    }

  }

  // Google login
  @Post('/loginWithGoogle')
  async loginWithGoogle(@Ip() ip: string, @Req() req: Request, @Body() body: any, @Res() res: Response) {
    try {
      let googleTokenData = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.FIREBASE_PRIVATE_KEY}`,
        {
          idToken: body.googleToken
        })
      if (googleTokenData.data.users[0].email != body.user.email) {
        throw {
          message: "Login failed!"
        }
      }
      let { data, err } = await this.userService.findUser(googleTokenData.data.users[0].email);

      if (err) {
        let realIpList = (req as any).headers['x-forwarded-for'] ? (req as any).headers['x-forwarded-for'] : ip
        const userAgent = useragent.parse(req.headers["user-agent"]);
        const deviceInfo = `${userAgent.device}-${userAgent.os}-${userAgent.family}`
        let { data, err } = await this.userService.register({
          ...req.body.user,
          emailConfirm: AvailableStatus.active,
          password: String(hashSync(body.user?.password, 10)),
          ipList: JSON.stringify([String(realIpList)])
        }, ip, deviceInfo)

        if (err) {
          throw {
            message: "Login failed!"
          }
        }
        let lastLogin = String(Date.now())
        await this.userService.update(data.id, {
          ...data,
          lastLogin,
        })
        let result = await this.userService.findById(data.id)
        return res.status(200).json({
          message: "Logged in successfully!",
          token: util.token.createToken(result.data, "1d")
        })
      } else {
        if (!data.status) {
          throw {
            message: "You have been blocked by admin, please contact to admin to get support!"
          }
        }
        let lastLogin = String(Date.now())
        await this.userService.update(data.id, {
          ...data,
          lastLogin,
        })
        let result = await this.userService.findById(data.id)
        return res.status(200).json({
          message: "Logged in successfully!",
          token: util.token.createToken(result.data, "1d")
        })
      }

    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: err.message ? [err.message] : ["Loi Server!"]
      })

    }
  }

  // Ip authentication
  @Get('/confirm_ip/:token')
  async confirmIp(@Req() req: RequestToken, @Res() res: Response) {

    try {
      let { data, err } = await this.userService.update(req.tokenData.id, {
        ipList: req.tokenData.ipList
      })
      if (err) {
        throw {
          message: "Adding new IP failed!"
        }
      }
      return res.status(200).send("Added new IP successfully!")
    } catch (err) {
      console.log('err', err);
      return res.status(500).send(`${err.message ? err.message : "System error, please try again later!"}`)
    }
  }

  // Email authentication
  @Get('/confirm_email/:token')
  async confirmEmail(@Req() req: RequestToken, @Res() res: Response) {
    try {
      let { data, err } = await this.userService.update(req.tokenData.id, {
        emailConfirm: AvailableStatus.active
      })
      if (err) {
        throw {
          message: "Email activation failed!"
        }
      }
      return res.status(200).send("Email activation successfully!")
    } catch (err) {
      return res.status(500).send(`${err.message ? err.message : "System error, please try again later!"}`)
    }
  }


  // Find user by id
  @Get('/:id')
  async getProductById(@Req() req: Request, @Res() res: Response) {
    try {
      let { err, data } = await this.userService.findById(Number(req.params.id))

      if (err) {
        throw "Database not found"
      }

      res.status(200).json({
        message: "Get user successfully!",
        data: {
          ...data
        }
      })
    } catch (err) {
      res.status(500).json({
        message: err ? [err] : ["System error, please try again later!"]
      })
    }
  }

  // Update user
  @Patch('/:userId')
  async update(@Req() req: Request, @Body() body: any, @Res() res: Response) {
    try {
      let userId = req.params.userId
      let { err, data } = await this.userService.update(Number(userId), { ...body })

      if (err) {
        throw "Database not found"
      }

      res.status(200).json({
        message: "Update user successfully!",
        data: {
          ...data
        },
        token: token.createToken(data)
      })
    } catch (err) {
      res.status(500).json({
        message: err ? [err] : ["System error, please try again later!"]
      })
    }
  }

  // Data chat
  @Post('get-data')
  async getData(@Body() body: any, @Res() res: Response) {
    try {
      let data = util.token.decodeToken(body.token);
      if (!data) throw {
        message: "Token invalid!"
      }
      return res.status(200).json({
        data
      })
    } catch (err) {
      return res.status(500).json({
        data: null,
        message: [
          err.message
        ]
      })
    }
  }
}
