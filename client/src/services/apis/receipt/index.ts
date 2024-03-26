import axios from "axios"

const prefix = "receipt"
const version = "v1"

export const receiptApi =  {
    findMany: async () => {
        return await axios.get(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}`)
    },
    addToCart: async (item: any) => {
        return await axios.post(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/addToCart`, item)
    },
    delete: async (itemId: number) => {
        return await axios.delete(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/${itemId}`)
    },
    update: async (data: any) => {
        return await axios.patch(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}`, data)
    },
    pay: async (receiptId: number, data: any) => {
        return await axios.patch(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/pay/${receiptId}`, data)
    },
    zaloReceipt: async (data: any) => {
        return await axios.post(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/pay/zalo/`, data)
    },
    zaloCheck: async (zaloPayReceiptId: number) => {
        return await axios.post(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/pay/zalo-check/${zaloPayReceiptId}`)
    }
}