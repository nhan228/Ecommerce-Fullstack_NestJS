import { createSlice } from "@reduxjs/toolkit"

type AvailableStatus = "active" | "inactive"
export type log = {
    id: number;
    memberId: number;
    note: string;
    createTime: string;
    userId: number;
}

export type User = {
    role: string;
    id: number;
    userName: string;
    password: string;
    avatar: string;
    email: string;
    emailConfirm: AvailableStatus;
    status: boolean;
    createAt: string;
    updateAt: string;
    lastLogin: string;
    firstName: string;
    lastName: string;
    logs: log[];
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