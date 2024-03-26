import store  from "@/store";
import { chatAction } from "@slices/chat.slice";
import { Socket, io } from "socket.io-client";

enum ChatType {
    TEXT= "TEXT",
    IMG="IMG",
    VIDEO= "VIDEO",
    LINK= "LINK"
}

export interface Chat {
    id: number;
    userId: number;
    adminId: number;
    content: string;
    type: ChatType;
    createAt: string;
}

class SocketChat {
    socket: Socket | undefined;

    constructor() {
        this.connect()
    }

    async connect(): Promise<{
        status: boolean,
        message: string[]
    } | null> {

        return await new Promise((resolve) => {
            this.socket = io(`${import.meta.env.VITE_API_HOST}?token=${localStorage.getItem("token")}`);

            this.socket.on("login-status", (data: {
                status: boolean,
                message: string[]
            }) => {
                resolve(data)
            })

            this.socket.on("history", (data: Chat[]) => {
                store.dispatch(chatAction.setData(data))
            })

            setTimeout(() => {
                if (!this.socket.connected) {
                    this.disconnect();
                    resolve(null)
                }
            }, 1000);

        })


    }
    disconnect() {
        this.socket.disconnect();
        this.socket = null;
    }
    sendMessage(userId: number, content: string) {
        this.socket.emit('user-chat', {
            userId,
            content
        })
    }
}

export let socketChat = new SocketChat();