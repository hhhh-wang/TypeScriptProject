// src/routes/index.tsx
import { lazy, Suspense, FC } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import type { XRoutes } from "./types";

// import { Translation } from "react-i18next";

import {
    Layout,
    EmptyLayout,
    // CompLayout
} from "../layouts";
import Loading from "@comps/Loading";

const Login = lazy(() => import("@pages/login"));
const Dashboard = lazy(() => import("@pages/dashboard"));
const NotFound = lazy(() => import("@pages/404"));


// 引入医院管理组件
const HospitalSet = lazy(() => import("@/pages/hopspitalSet/HospitalSet"));
const HospitalSetAddOrUpdate = lazy(()=>import("@pages/hopspitalSet/components/AddOrUpdate"));
const HospitalList = lazy(()=>import("@pages/hospitalList/HospitalList"));
const HospitalDetail = lazy(()=>import("@pages/hospitalList/components/HospitalDetail"));
const HospitalSchedule = lazy(()=>import("@pages/hospitalList/components/HospitalSchedule"));
const load = (Comp: FC) => {
    return (
        // 因为路由懒加载，组件需要一段网络请求时间才能加载并渲染
        // 在组件还未渲染时，fallback就生效，来渲染一个加载进度条效果
        // 当组件渲染完成时，fallback就失效了
        <Suspense fallback={<Loading />}>
            {/* 所有lazy的组件必须包裹Suspense组件，才能实现功能 */}
            <Comp />
        </Suspense>
    );
};

// 路由配置
const routes: XRoutes = [
    {
        path: "/",
        element: <EmptyLayout />,
        children: [
            {
                path: "login",
                element: load(Login),
            },
        ],
    },
    {
        path: "/syt",
        element: <Layout />,
        children: [
            {
                // 路由路径
                path: "/syt/dashboard",
                meta: {
                    icon: <HomeOutlined />,
                    title: '首页'
                },
                element: load(Dashboard),
            },
            {
                path:'/syt/hospital',
                meta:{
                    title:'医院管理',
                    //icon:<ShopOutlined />
                },
                children:[
                    {
                        path:'/syt/hospital/hospitalSet',
                        meta:{
                            title:'医院设置'
                        },
                        element:load(HospitalSet)
                    },
                    {
                        path:'/syt/hospital/hospitalSet/components/add',
                        hidden:true,
                        meta:{
                           title:'添加医院'
                        },
                        element:load(HospitalSetAddOrUpdate)
                    },
                    {
                        path:'/syt/hospital/hospitalSet/components/edit/:id',
                        hidden:true,
                        meta:{
                           title:'编辑医院'
                        },
                        element:load(HospitalSetAddOrUpdate)
                    },

                    {
                        path:'/syt/hospital/hospitalList',
                        meta:{
                            title:'医院列表'
                        },
                        element:load(HospitalList)
                    },
                    {
                        path:'/syt/hospital/hospitalList/show/:id',
                        hidden:true,
                        meta:{
                            title:'医院详情'
                        },
                        element:load(HospitalDetail)
                    },
                    {
                        path:'/syt/hospital/hospitalList/schedule/:hoscode',
                        //hidden:true,
                        meta:{
                            title:'医院详情'
                        },
                        element:load(HospitalSchedule)
                    }
                ]
            }
        ],
    },

    {
        path: "/404",
        element: load(NotFound),
    },

    {
        path: "*", // 任意路径：除了上面路径以外其他路径
        element: <Navigate to="/404" />,
    },
];

/* 
自定义hook: 注册应用的所有路由
*/
export const useAppRoutes = () => {
    return useRoutes(routes);
};

// 找到要渲染成左侧菜单的路由
export const findSideBarRoutes = () => {
    const currentIndex = routes.findIndex((route) => route.path === "/syt");
    return routes[currentIndex].children as XRoutes;
};

export default routes;
