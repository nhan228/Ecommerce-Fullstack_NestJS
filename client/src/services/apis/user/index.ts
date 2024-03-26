import axios from "axios"

const prefix = "user"
const version = "v1";

export const userApi = {
    decodeToken: async (token: string) => {
        return await axios.get(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/decodeToken/${token}`)
    },
    register: async (user: any) => {
        return await axios.post(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/register`, user)
    },
    login: async (loginData: any) => {
        return await axios.post(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/login`, loginData)
    },
    loginWithGoogle: async (data: any) => {
        return await axios.post(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/loginWithGoogle`, data)
    },
    findUserById: async (id: number) => {
        return await axios.get(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/${id}`)
    },
    findMany: async function () {
        return await axios.get(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}`);
    },
    update: async (userId: number, data: any) => {
        return await axios.patch(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/${userId}`, data)
    },
    getData: async (data: any) => {
        return await axios.post(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/get-data`, data)
    }
}