import { Body, Controller, Get, Ip, Param, Post, Patch, Req, Res, ParseIntPipe, Query, ParseBoolPipe } from '@nestjs/common'
import { MemberService } from './member.service'
import { Response, Request } from 'express'
import { tokenAdmin } from 'src/utils/token'
import { MemberLoginDto } from './dto/member-login.dto'
import { compareSync } from 'bcrypt'
import { IpList } from './member.interface'
import { MailService } from '../mail/mail.service'
import { RequestToken } from 'src/common/interface'
import { hashSync } from 'bcrypt'
import { ChangePasswordDTO } from './dto/change-password.dto'
import { CreateMemberDTO } from './dto/create-member.dto'
import { MemberRole, Member } from '@prisma/client'
import { ChangePermissionDTO } from './dto/change-permission.dto'
import { LoginService } from '../login/login.service'
import { LoginGateway } from '../login/login.gateway'
import { util } from 'src/utils'

@Controller('member')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly mailService: MailService,
    private readonly loginService: LoginService,
    private readonly loginGateway: LoginGateway
  ) { }

  // login
  @Post("/login")
  async login(@Req() req: Request, @Ip() ip: string, @Body() body: MemberLoginDto, @Res() res: Response) {
    try {
      let realIpList = (req as any).headers['x-forwarded-for'] || ip

      let { data, err } = await this.memberService.findByLoginId(body.loginId)
      if (err) {
        throw err.message || "DB Connect Failed!"
      }

      if (compareSync(body.password, data.password) == false) {
        throw "Incorrect password!"
      }

      let ipList: IpList = JSON.parse(data.ipList)
      if (!(ipList.find(ipItem => ipItem == realIpList.split(',')[0]))) {
        let html = `
          <h2>New IP: ${realIpList.split(',')[0]}</h2>
          <a href="${process.env.SV_API}/member/email/${tokenAdmin.createToken({
          ...data,
          newIp: realIpList.split(',')[0]
        })}">Verify now!</a>
        `
        await this.mailService.sendMail(data.email, "Verify new login location", html)

        throw "Please access your new login location confirmation email!"
      }
      return res.status(200).json({
        tokenAdmin: tokenAdmin.createToken(data, "1d")
      })
    } catch (err) {
      return res.status(403).json({
        message: err.command ? "The email system is busy, please contact ADMIN to update the new login location!" : err
      })
    }
  }

  // create member account
  @Post()
  async create(@Req() req: RequestToken, @Body() body: CreateMemberDTO, @Res() res: Response) {
    try {
      if (req.tokenData.role == MemberRole.admin && body.role == MemberRole.admin) {
        return res.status(500).json({
          message: "Insufficient permissions to create an Admin account!"
        })
      }
      if (req.tokenData.role == MemberRole.member) {
        return res.status(500).json({
          message: "Insufficient permissions to create account!"
        })
      }

      let password: string = String(Math.floor(Date.now() * Math.random()))
      const { data, err } = await this.memberService.create({
        ...body,
        emailConfirm: true,
        password: hashSync(password, 10),
        createTime: String(Date.now()),
        updateTime: String(Date.now()),
        avatar: "https://sarasanalytics.com/wp-content/uploads/2022/07/Amazon-API-Guide-2022.jpg"
      })
      if (err) {
        if (err.meta.target == 'Member_loginId_key') {
          throw {
            message: 'Username already exists in the system. Please choose another username!'
          }
        }
        if (err.meta.target == 'Member_email_key') {
          throw {
            message: 'Email already exists in the system. Please choose another email!'
          }
        }
      }
      let html = `
            <h2>First-time password notification for AMAZON account ${data.loginId}</h2>
            <h2>This is the password provided for your account. Please do not share this information with anyone.</h2>
            <h1>Password: ${password}</h1>
            `
      this.mailService.sendMail(data.email, "Provide initial password for AMAZON admin.", html)
      return res.status(200).json({
        data
      })
    } catch (err) {
      return res.status(500).json({
        err: err.message || "Server error, please try again in a few minutes"
      })
    }
  }

  // token email
  @Get("/email/:tokenAdmin")
  async emailConfirm(@Req() req: RequestToken, @Res() res: Response) {
    try {
      let user = await this.memberService.findByLoginId(req.tokenData.loginId)

      if (user.err) {
        throw user.err.message || "DB Connect Failed!"
      }
      let ipList: IpList = JSON.parse(user.data.ipList)
      let { err } = await this.memberService.update(user.data.id, {
        ipList: JSON.stringify([...ipList, req.tokenData.newIp])
      })

      if (err) {
        throw err.message || "DB Connect Failed!"
      }
      return res.status(200).send("Added new ip successfully!")
    } catch (err) {
      return res.status(403).send("Adding new ip failed!")
    }
  }

  // change pass
  @Patch("/:id/change-password")
  async update(@Param('id', ParseIntPipe) memberId: number, @Body() body: ChangePasswordDTO, @Res() res: Response) {
    try {
      // Check newly hashed password isMatches the old password
      const member = await this.memberService.findById(memberId)
      if (member && compareSync(body.password, member.data.password)) {
        return res.status(400).json({ message: "New password must be different from the old password!" });
      }

      const { err, data } = await this.memberService.update(memberId, {
        ...body,
        password: hashSync(body.password, 10),
        firstLoginState: false
      })

      if (err) {
        throw err.message || "DB Connect Failed!"
      }
      return res.status(200).json({
        message: "Updated password successfully!",
        tokenAdmin: tokenAdmin.createToken(data)
      })
    } catch (err) {
      return res.status(500).json({
        message: err.message || "Server error, please try again in a few minutes",
      })
    }
  }

  // change permission
  @Patch("/:id/change-permission")
  async updatePermission(@Req() req: RequestToken, @Param('id', ParseIntPipe) memberId: number, @Body() body: ChangePermissionDTO, @Res() res: Response) {
    try {
      if (req.tokenData.role != MemberRole.master) {
        throw "Permission Denied"
      }
      const { err, data } = await this.memberService.update(memberId, {
        ...body
      })

      if (err) {
        throw err.message || "DB Connect Failed!"
      }

      await this.loginService.createLog({
        memberId: req.tokenData.id,
        note: `Member: ${(req.tokenData as Member).firstName} ${(req.tokenData as Member).lastName} changed the permissions of the user with ID: ${memberId}`,
        createTime: String(Date.now())
      })

      this.loginGateway.sendLog(this.loginGateway.memberLoginList.find(item => item.data.role == MemberRole.master).socket)

      return res.status(200).json({
        message: "Updated permissions successfully!",
        data: data
      })
    } catch (err) {
      return res.status(500).json({
        message: err.message || "Server error, please try again in a few minutes",
      })
    }
  }

  // update email
  @Get("/:id/update-email")
  async updateEmail(@Param('id', ParseIntPipe) memberId: number, @Query('type', ParseBoolPipe) type: Boolean, @Query('tokenAdmin') tokenCode: string, @Query('email') email: string, @Res() res: Response) {
    try {
      const { err, data } = await this.memberService.findById(memberId)

      if (err) {
        throw err.message || "DB Connect Failed!"
      }

      if (!type) {
        console.log("body.email", email)
        let html = `
          <h2>Update email for AMAZON account: ${data.loginId}</h2>
          <h2>After clicking the link below, your account will be linked to your email: ${email}</h2>
          <a href="${process.env.SV_API_URL}/member/${memberId}/update-email?type=true&tokenAdmin=${tokenAdmin.createToken({
          ...data,
          newEmail: email
        })}">Verify now!</a>
        `
        await this.mailService.sendMail(data.email, "Update AMAZON account Email", html)
        return res.status(200).json({
          message: "Your request for updating your email has been successfully sent. Please check your email to confirm.!"
        })
      }

      let tokenData = tokenAdmin.decodeToken(tokenCode)

      const updateRes = await this.memberService.update(memberId, {
        email: (tokenData as any).newEmail,
        emailConfirm: true
      })
      if (updateRes.err) throw {
        message: "Update failed!"
      }

      return res.status(200).json({
        message: "Email verification successfuly!",
        tokenAdmin: tokenAdmin.createToken(updateRes.data)
      })
    } catch (err) {
      return res.status(500).json({
        message: err.message || "Server error, please try again in a few minutes",
      })
    }
  }

  // Data chat
  @Post('get-data')
  async getData(@Body() body: any, @Res() res: Response) {
    try {
      let data = util.tokenAdmin.decodeToken(body.tokenAdmin)
      if (!data) throw {
        message: "TokenAdmin invalid!"
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