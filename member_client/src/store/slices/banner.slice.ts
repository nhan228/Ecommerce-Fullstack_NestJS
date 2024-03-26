import { createSlice } from "@reduxjs/toolkit"

enum Status {
    "active" = "active",
    "inactive" = "inactive"
}

export type Banners = {
    id: number
    title: string
    img: string
    status: Status
    createAt: string
    updateAt: string
}

interface InitState {
    data: Banners[] | null
}
let initialState: InitState = {
    data: [],
}

const bannerSlice = createSlice({
    name: "banner",
    initialState,
    reducers: {
        setData: (state, action) => {
            action.payload.sort((a:any, b:any) => {
                if (a.status == 'active' && b.status != 'active') {
                    return -1;
                }
                if (a.status != 'active' && b.status == 'active') {
                    return 1;
                }
                if (a.status == 'active' && b.status == 'active') {
                    if (a.updateAt > b.updateAt) {
                        return -1;
                    }
                    if (a.updateAt < b.updateAt) {
                        return 1;
                    }
                    return 0
                }
                return 0;
            });
            return {
                ...state,
                data: action.payload,
            };
        
        },

        addBanner: (state, action) => {
            state.data?.push(action.payload)
        },

        updateData: (state, action) => {
            if (state.data) {
                const updated = state.data.map((item) => {
                    if (item.id == action.payload.id) {
                        return action.payload;
                    }
                    return item
                });

                updated.sort((a, b) => {
                    if (a.status == 'active' && b.status != 'active') {
                        return -1;
                    }
                    if (a.status != 'active' && b.status == 'active') {
                        return 1;
                    }
                    if (a.status == 'active' && b.status == 'active') {
                        return -1;
                    }
                    return 0;
                });
                return {
                    ...state,
                    data: updated,
                };
            }
        }
    }
})

export const bannerReducer = bannerSlice.reducer
export const bannerAction = bannerSlice.actions