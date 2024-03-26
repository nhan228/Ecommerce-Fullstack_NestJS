import axios from "axios"

const prefix = "userData"
const version = "v1";

export const userApi = {
    findUserById: async (id: number) => {
        return await axios.get(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/${id}`)
    },
    findMany: async function () {
        return await axios.get(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}`);
    },
    create: async function (data: any) {
        return await axios.post(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/create`, data);
    },
    update: async (userId: number, data: any) => {
        return await axios.patch(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/${userId}`, data)
    },
    getData: async (data: any) => {
        return await axios.post(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/get-data`, data)
    }
}