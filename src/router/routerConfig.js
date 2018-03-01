import HomeVue from "../components/home/Home.vue";
import LoginVue from "../components/login/Login.vue";
import UserVue from "../components/user/User.vue";
import Vue from 'vue'
export default {
    mode: 'history',
    routes: [
        {
            path: '*',
            name: '主页',
            left: true,
            component: HomeVue,
            children:[]
        },
        {
            path: '/login',
            name: '登录',
            component: LoginVue,
        },
    ]
}
