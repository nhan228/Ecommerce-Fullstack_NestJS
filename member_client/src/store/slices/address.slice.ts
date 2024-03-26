import { createSlice } from "@reduxjs/toolkit"

export type Address = {
    id: number;
    title: string;
}

interface InitState {
    data: Address[] | null
    addModal: boolean
}
const initialState: InitState = {
    data: null,
    addModal: false
}
const addressSlice = createSlice({
    name: "Address",
    initialState,
    reducers: {
        setData: (state, action) => {
            state.data = action.payload
        },
        loadModal: (state) => {
            state.addModal = !state.addModal
        },
        addData: (state: any, action) => {
            state.data.push(action.payload)
        },
        update: (state: any, action) => {
            state.data = state.data.map((item: any) => {
                if (item.id == action.payload.id) {
                    return action.payload
                } else {
                    return item
                }
            })
        },
    }
})
export const addressAction = addressSlice.actions
export const addressReducer = addressSlice.reducer

