import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { logReducer } from './slices/log.slice';
import { memberReducer } from "./slices/member.slice";
import { userReducer } from "./slices/user.slice";
import { productReducer } from "./slices/product.slice";
import { brandReducer } from "./slices/brand.slice";
import { categoryReducer } from "./slices/category.slice";
// import { vocherReducer } from "./slices/vocher.slice";
import { bannerReducer } from "./slices/banner.slice";
import { chatReducer } from "./slices/chat.slice"
import { receiptReducer } from "./slices/receipt.slice"

const RootReducer = combineReducers({
    logStore: logReducer,
    memberStore: memberReducer,
    userStore: userReducer,
    productStore: productReducer,
    bannerStore: bannerReducer,
    brandStore: brandReducer,
    categoryStore: categoryReducer,
    receiptStore: receiptReducer,
    // vocherStore: vocherReducer,
    chatStore: chatReducer
})

export type Store = ReturnType<typeof RootReducer>

export const store = configureStore({
    reducer: RootReducer
})

export default store