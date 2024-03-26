import axios from "axios";

export default {
    readFile: async (filePath: string) => {
        return await axios.get(`${import.meta.env.VITE_SERVER_HOST}/${filePath}`)
    }
}