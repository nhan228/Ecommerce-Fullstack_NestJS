import axios from "axios";

const prefix = "member";
const version = "v1";

export const memberApi = {
    login: async (data: {loginId: string, password: string}) => {
        return await axios.post(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/login`, data)
    },
    changePassword: async ( id:number ,data:any ) => {
        return await axios.patch(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/${id}/change-password`, data);
    },
    changePermission: async ( id:number ,data:any ) => {
        return await axios.patch(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/${id}/change-permission`, data);
    },
    changeDarkMode: async ( id:number ,data:any ) => {
        return await axios.patch(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/${id}/dark-mode`, data)
    },
    updateEmail: async ( id:number, data:any ) => {
        return await axios.get(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/${id}/update-email?type=false&email=${data}`);
    },
    create: async (data:any) => {
        return await axios.post(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}`, data)
    },
    getData: async (data: any) => {
        return await axios.post(`${import.meta.env.VITE_SERVER}/api/${version}/${prefix}/get-data`, data)
    }   
}