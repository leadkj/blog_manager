import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginCpn from "../components/LoginCpn";
import IndexCpn from "@/components/IndexCpn";
import WelcomeCpn from "@/components/WelcomeCpn";
import CategoryCpn from "@/components/blog/CategoryCpn";
import ArticleCpn from "@/components/blog/ArticleCpn";
import TagCpn from "@/components/blog/TagCpn";
import ArticleEdit from "@/components/blog/ArticleEdit";
import ArticleAdd from "@/components/blog/ArticleAdd";
Vue.use(VueRouter)

const routes = [
    // {
    //   path: '/',
    //   name: 'Home',
    //   component: Home
    // },
    {
        path: '/login',
        name: 'login',
        component: LoginCpn
    },
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/index',
        component: IndexCpn,
        redirect: 'welcome',
        children: [
            {
                path: '/welcome',
                component: WelcomeCpn
            },
            {
                path: '/category',
                component: CategoryCpn
            },
            {
                path: '/article',
                component: ArticleCpn
            },
            {
                path: '/tag',
                component: TagCpn
            },
            {
                path: '/article/add',
                component: ArticleAdd
            },
            {
                path: '/article/:id',
                component: ArticleEdit
            }

        ]
    }


]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
router.beforeEach((to, from, next) => {
    //to:表示将要访问的路径
    //from:表示从哪里来
    //next() 放行，next('/path') 强制跳转到哪里
    if (to.path == '/login') return next(); //如果访问的是login，不需要验证，直接跳转
    //如果访问的不是验证token
    const token = window.sessionStorage.getItem('token')
    if (!token) return next('/login') //如果token不存在，条状到login
    return next() //如果有token直接跳转

})


export default router
