import { createSlice } from "@reduxjs/toolkit"

type AvailableStatus = "active" | "inactive"

export type User = {
    id: number;
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    avatar: string;
    email: string;
    emailConfirm: AvailableStatus;
    phoneNumber: string;
    phoneConfirm: AvailableStatus;
    wallet: number;
    status: boolean;
    createAt: string;
    updateAt: string;
    lastLogin: string;
    ipList: string;
    user_ip_list: user_ip_list[];
    address: address[];
    birthday: string
}

// address
export type address = {
    id: number;
    title: string;
    postcode: string;
    userId: number
}

// ip list
export type user_ip_list = {
    id: number;
    ip: string;
    status: boolean;
    userId: number;
    createAt: string;
    deviceName: string
}

interface InitState {
    data: User | null
    list: User[],
    addModal: boolean
}
let initialState: InitState = {
    data: null,
    list: [],
    addModal: false
}
const userSlice = createSlice({
    name: "User",
    initialState,
    reducers: {
        setData: (state, action) => {
            state.data = action.payload;
        },
        setList: (state, action) => {
            state.list = action.payload
        },
        loadModal: (state) => {
            state.addModal = !state.addModal
        },
        addData: (state, action) => {
            state.list.unshift(action.payload)
        },
        update: (state, action) => {
            state.list = state.list.map(item => {
                if (item.id == action.payload.id) {
                    return action.payload
                } else {
                    return item
                }
            })
        }
    }
})
export const userReducer = userSlice.reducer
export const userAction = userSlice.actions