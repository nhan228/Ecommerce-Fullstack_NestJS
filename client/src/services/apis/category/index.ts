import axios from "axios"

const prefix = "category"
const version = "v1"

export const categoryApi = {
    findMany: async () => {
        return await axios.get(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}`)
    }
}