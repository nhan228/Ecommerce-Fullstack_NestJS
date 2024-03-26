import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { LoginService } from './login.service';
import { Socket } from 'socket.io'
import { OnModuleInit } from '@nestjs/common';
import { tokenAdmin } from 'src/utils/token';
import { PrismaService } from '../prisma/prisma.service';
import { MemberRole, Member } from '@prisma/client'

@WebSocketGateway({
  cors: true
})
export class LoginGateway implements OnModuleInit {

  @WebSocketServer()
  private serverSocket: Socket

  public memberLoginList: {
    socket: Socket,
    tokenCode: string,
    data: Member,
    loginAt: string
  }[] = []

  constructor(private readonly loginService: LoginService, private readonly prisma: PrismaService) { }

  // Init module
  onModuleInit() {
    this.serverSocket.on('connection', async (socket) => {
      const tokenCode = socket.handshake.auth.token || socket.handshake.query.token;
      let tokenData = await this.tokeAuthen(tokenCode);

      // check token
      if (!tokenData) {
        socket.emit("status", {
          message: "Authentication failed!",
          data: null,
          invalidToken: true
        })
        socket.disconnect();
      } else {
        /* Check valid token */
        // tokens are not duplicated
        if (!this.memberLoginList.find(client => client.tokenCode == tokenCode)) { 
          /* Check to see if the token was created with the same account */
          if (this.memberLoginList.find(client => client.data.id == (tokenData as Member).id)) {
            socket.emit("status", {
              message: "Confirmation failure! The account is logged in somewhere else!",
              data: null,
              invalidToken: false
            })
            socket.disconnect();
            return
          }
        }

        // Login member list 
        this.memberLoginList.push({
          socket,
          tokenCode,
          data: tokenData,
          loginAt: String(Date.now())
        })

        // connect
        socket.emit("status", {
          message: "Successful!",
          data: tokenData
        })

        console.log(`Member: ${(tokenData as Member).firstName} ${(tokenData as Member).lastName} just logged in!`)
        try {
          let res = await this.loginService.createLog({
            memberId: (tokenData as Member).id,
            note: `Member: ${(tokenData as Member).firstName} ${(tokenData as Member).lastName} just logged in!`,
            createTime: String(Date.now())
          })
        } catch (err) { }

        /* master send logs */
        this.sendLog()
        this.sendMemberList()
        this.sendOnlineList()
        this.masterSocketOn(socket, tokenData)
      }

      // disconnect
      socket.on('disconnect', () => {
        this.memberLoginList = this.memberLoginList.filter(client => client.socket.id != socket.id)
        socket.disconnect();
        console.log(`Member: ${(tokenData as Member).firstName} ${(tokenData as Member).lastName} just logged out!`)
        this.sendOnlineList()
      });
    })
  }

  // Kick member
  async masterSocketOn(socket: Socket, tokenData: Member) {
    if (tokenData.role != MemberRole.master) return
    socket.on("masterKick", async (data: {
      socketId: string,
      reason: string,
      targetMember: Member
    }) => {
      for (let i in this.memberLoginList) {
        if (this.memberLoginList[i].socket.id == data.socketId) {
          this.memberLoginList[i].socket.emit("kick", data.reason);
          this.sendOnlineList()
          this.memberLoginList[i].socket.disconnect();
          this.memberLoginList.splice(Number(i), 1);
          try {
            await this.loginService.createLog({
              memberId: (tokenData as Member).id,
              note: `Master has just logged out as a member: ${data.targetMember.loginId}`,
              createTime: String(Date.now())
            })
            this.sendLog()
          } catch (err) { }
          break
        }
      }
    })
  }

  // token authen
  async tokeAuthen(tokenCode: string) {
    try {
      let tokenData = tokenAdmin.decodeToken(tokenCode)

      let member = await this.prisma.member.findUnique({
        where: {
          id: (tokenData as Member).id
        }
      })

      if (!member) throw false
      if (member.updateTime != (tokenData as Member).updateTime) throw false

      return member
    } catch (err) {
      return false
    }
  }

  // send log
  async sendLog(socketClient: null | Socket = null) {
    if (socketClient != null) {
      let { data, err } = await this.loginService.findLogMany()
      if (!err) {
        socketClient.emit("logs", data)
      }
      return
    }
    for (let i in this.memberLoginList) {
      if (JSON.parse(this.memberLoginList[i].data.permission).find((per: string) => per == "r:log")) {
        let { data, err } = await this.loginService.findLogMany()
        if (!err) {
          this.memberLoginList[i].socket.emit("logs", data)
        }
      }
    }
  }

  // send member list
  async sendMemberList(socketClient: null | Socket = null) {
    if (socketClient != null) {
      let { data, err } = await this.loginService.findMemberMany()
      if (!err) {
        socketClient.emit("members", data)
      }
      return
    }
    for (let i in this.memberLoginList) {
      if (JSON.parse(this.memberLoginList[i].data.permission).find((per: string) => per == "r:member")) {
        let { data, err } = await this.loginService.findMemberMany()
        if (!err) {
          this.memberLoginList[i].socket.emit("members", data)
        }
      }
    }
  }

  // send online list to master
  async sendOnlineList() {
    for (let i in this.memberLoginList) {
      if (this.memberLoginList[i].data.role == MemberRole.master) {
        this.memberLoginList[i].socket.emit("online-list", this.memberLoginList.map(client => {
          return {
            socketId: client.socket.id,
            data: client.data,
            loginAt: client.loginAt
          }
        }))
      }
    }
  }
}
