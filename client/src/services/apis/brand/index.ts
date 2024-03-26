import axios from "axios"

const prefix = "brand"
const version = "v1"

export const brandApi = {
    findMany: async () => {
        return await axios.get(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}`)
    }
}