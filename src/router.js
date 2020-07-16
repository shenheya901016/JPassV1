import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import From from "./views/From.vue";
import Register1 from "./views/jpass/register.vue";
import Login from "./views/jpass/login.vue";
import Keystoreimport from "./views/jpass/keystoreimport.vue";
import Mnemonicimport from "./views/jpass/mnemonicimport.vue";
import Keyimport from "./views/jpass/keyimport.vue";
import Index from "./views/Index";
import Registersuccess from "./views/jpass/registersuccess.vue";
import LockJpass from "./views/jpass/lock.vue";
import Main from "./views/jpass/main.vue";
import Pay from "./views/jpass/pay.vue";


Vue.use(Router);

export default new Router({
    routes: [
        { path: '/', redirect: '/jpass/login' }, // 默认就跳转此页面
        {
            path: "/index",
            name: "index",
            component: Index
        },
        {
            path: "/",
            name: "home",
            component: Home
        },
        {
            path: "/from",
            name: "from",
            component: From
        },
        {
            path: "/jpass/register",
            name: "register",
            component: Register1
        },

        {
            path: "/jpass/keystoreimport",
            name: "keystoreimport",
            component: Keystoreimport
        },
        {
            path: "/jpass/login",
            name: "login",
            component: Login
        },
        {
            path: "/jpass/mnemonicimport",
            name: "mnemonicimport",
            component: Mnemonicimport
        },
        {
            path: "/jpass/keyimport",
            name: "keyimport",
            component: Keyimport
        },

        {
            path: "/jpass/registersuccess",
            name: "registersuccess",
            component: Registersuccess
        },
        {
            path: "/jpass/lock",
            name: "lock",
            component: LockJpass
        },
        {
            path: "/jpass/main",
            name: "main",
            component: Main
        },
        {
            path: "/jpass/pay",
            name: "pay",
            component: Pay
        },

    ]
});
