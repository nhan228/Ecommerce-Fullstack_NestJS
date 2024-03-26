import { createSlice } from "@reduxjs/toolkit";
import { member } from "./member.slice";


export type Log = {
    id: number;
    memberId: number;
    member: member;
    note: String;
    createTime: String;
}

interface InitState {
    data: Log[] | null,
}
let initialState: InitState = {
    data: null,
}

const logSlice = createSlice({
    name: "log",
    initialState,
    reducers: {
        setData: (state, action) => {
            state.data = action.payload;
        }
    }
})

export const logReducer = logSlice.reducer;
export const logAction = logSlice.actions;