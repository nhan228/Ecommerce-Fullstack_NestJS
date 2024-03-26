import { lazy } from "@/util"
import { BrowserRouter, Route, Routes } from "react-router-dom"

export const RouteSetup = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* ALL */}
                <Route path="*" element={lazy(() => import("@pages/home"), localStorage.getItem("tokenAdmin") != null)()}>
                    {/* Home */}
                    <Route path="" element={lazy(() => import("@pages/adminPage"))()}></Route>
                    {/* Logs */}
                    <Route path="log/all" element={lazy(() => import("@pages/log/Log"))()}></Route>
                    {/* Member list */}
                    <Route path="member/list" element={lazy(() => import("@pages/member/MemberList"))()}></Route>
                    {/* member online list */}
                    <Route path="member/online-list" element={lazy(() => import("@/pages/member/components/online-list/MemberOnlineList"))()}></Route>
                    {/* User list */}
                    <Route path="user/list" element={lazy(() => import("@pages/user"))()}></Route>
                    {/* user recycle */}
                    <Route path="user/banlist" element={lazy(() => import("@/pages/user/components/recycle"))()}></Route>
                    {/* Product list */}
                    <Route path="product/list" element={lazy(() => import("@pages/product"))()}></Route>
                    {/* Product recycle */}
                    <Route path="product/recycle" element={lazy(() => import("@pages/product/component/recycle"))()}></Route>
                    {/* Banner list */}
                    <Route path="banner/list" element={lazy(() => import("@pages/banner"))()}></Route>
                    {/* Brand list */}
                    <Route path="brand/list" element={lazy(() => import("@pages/brand"))()}></Route>
                    {/* Category list */}
                    <Route path="category/list" element={lazy(() => import("@pages/category"))()}></Route>
                    {/* Vocher list */}
                    <Route path="vocher/list" element={lazy(() => import("@pages/vocher"))()}></Route>
                    {/* setting */}
                    <Route path="setting" element={lazy(() => import("@pages/setting"))()}></Route>

                </Route>

                {/* AUTHEN */}
                <Route path="/authen" element={lazy(() => import("@pages/authen"), localStorage.getItem("tokenAdmin") == null, "/")()}></Route>
            </Routes>
        </BrowserRouter>
    )
}