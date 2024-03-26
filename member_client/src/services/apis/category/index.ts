import axios from "axios"

const prefix = "category"
const version = "v1"

export const categoryApi = {
    create: async (data: any) => {
        return await axios.post(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}`, data)
    },
    findMany: async () => {
        return await axios.get(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}`)
    },
    update: async (id: number, data: any) => {
        return await axios.patch(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/${id}`, data)
    }
}