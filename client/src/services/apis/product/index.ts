import axios from "axios"

const prefix = "product"
const version = "v1"

export const productApi = {
    findMany: async () => {
        return await axios.get(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}`)
    },
}