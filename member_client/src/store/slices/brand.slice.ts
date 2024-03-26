import { createSlice } from "@reduxjs/toolkit";
export type AvailableStatus = "active" | "inactive"

export type Brands = {
    id: number;
    title: string;
    codeName: string;
    status: AvailableStatus
    createAt: string
    updateAt: string
}

interface InitState {
    data: Brands[] | null;
}
const initialState: InitState = {
    data: null,
}
const brandSlice = createSlice({
    name: "brand",
    initialState,
    reducers: {
        setData: (state, action) => {
            state.data = action.payload
        },
        add: (state, action) => {
            state.data?.push(action.payload)
        },
        update: (state, action) => {
            if(state.data)
            return {
                ...state,
                data: state.data?.map(item => {
                    if(item.id == action.payload.id) {
                        return action.payload
                    }
                    return item
                })
            }
        }
    }
})
export const brandAction = brandSlice.actions
export const brandReducer = brandSlice.reducer

