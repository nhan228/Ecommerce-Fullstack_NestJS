import { BrowserRouter, Route, Routes } from "react-router-dom"
import { lazyFn } from "@utils/lazies/Lazy"

export default function RouteSetup() {
    return (
        <BrowserRouter>
            <Routes>
                {/* HOMEPAGE */}
                <Route path='/' element={lazyFn(() => import("@pages/homes/Layout"))} >
                    <Route index element={lazyFn(() => import('@pages/homes/components/Home'))} />
                    <Route path="category/:categoryName/:brandName" element={lazyFn(() => import("@pages/homes/components/categories"))}></Route>
                    <Route path="cart" element={lazyFn(() => import("@pages/homes/components/cart"), localStorage.getItem("token") != null, "/")}></Route>
                    <Route path="receipts" element={lazyFn(() => import("@pages/homes/components/receipts"), localStorage.getItem("token") != null, "/")}></Route>
                    <Route path="product-info/:id" element={lazyFn(() => import("@pages/homes/components/product-info"))}></Route>
                </Route>

                {/* AUTHEN */}
                <Route path="/authen" element={lazyFn(() => import('@/pages/authen/Authen'), localStorage.getItem("token") == null, "/")} />
            </Routes>
        </BrowserRouter>
    )
}
