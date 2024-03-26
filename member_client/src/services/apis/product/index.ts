import axios from "axios"

const prefix = "product"
const version = "v1"

export const productApi = {
    create: async (data: any) => {
        return await axios.post(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}`, data)
    },
    findMany: async () => {
        return await axios.get(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}`)
    },
    updateDes: async (id: number, data: any) => {
        return await axios.patch(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/des/${id}`, data)
    },
    updateData: async (id: number, data: any) => {
        return await axios.patch(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/${id}`, data)
    },
    delete: async (id: number) => {
        return await axios.delete(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/${id}`)
    },
    deletePics: async (id: number) => {
        return await axios.delete(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/delete-pictures/${id}`)
    }
}