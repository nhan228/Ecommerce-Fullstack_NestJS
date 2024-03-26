import axios from "axios"

const prefix = "address"
const version = "v1"

export const addressApi = {
    findMany: async () => {
        return await axios.get(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}`)
    },
    update: async (id: number, data: any) => {
        return await axios.patch(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/${id}`, data)
    },
    create: async (data: any) => {
        return await axios.post(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}`, data)
    }
}