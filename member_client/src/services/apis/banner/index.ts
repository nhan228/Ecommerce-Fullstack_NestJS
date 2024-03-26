import axios from "axios";

const prefix = "banner";
const version = "v1";

export const bannerApi= {
    create: async (data: any) => {
        return await axios.post(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}`, data, {
            headers: {
                "Content-Type": "multipart/form-data"   
            }
        })
    },
    find: async () => {
        return await axios.get(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}`)
    },
    findById: async (bannerId: number) => {
        return await axios.get(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/${bannerId}`)
    },
    updateData: async (bannerId: number, data: any) => {
        return await axios.patch(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/${bannerId}`, data)
    },
    updateImg: async (bannerId: number, data: any) => {
        return await axios.patch(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/img/${bannerId}`, data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
    }
}