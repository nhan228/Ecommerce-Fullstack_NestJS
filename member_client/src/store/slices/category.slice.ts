import { createSlice } from "@reduxjs/toolkit";

export type AvailableStatus = "active" | "inactive"

export type Categories = {
    id: number;
    title: string;
    images: string;
    codeName: string;
    status: AvailableStatus
}

interface InitState {
    category: Categories[] | null;
}
const initialState: InitState = {
    category: null,
}
const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        setData: (state, action) => {
            state.category = action.payload
        },
        addCategory: (state, action) => {
            state.category?.push(action.payload)
        },
        updateCategory: (state, action) => {
            if(state.category)
            return {
                ...state,
                category: state.category?.map(item => {
                    if(item.id == action.payload.id) {
                        return action.payload
                    }
                    return item
                })
            }
        }
    }
})
export const categoryAction = categorySlice.actions
export const categoryReducer = categorySlice.reducer

