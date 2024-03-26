import axios from "axios";

const prefix = "banner";
const version = "v1";

export const bannerApi= {
    findMany: async () => {
        return await axios.get(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}`)
    },
    findById: async (bannerId: number) => {
        return await axios.get(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/${bannerId}`)
    }
}