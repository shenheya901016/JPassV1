import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import From from "./views/From.vue";
import Register from "./views/register.vue";
import Register1 from "./views/jpass/register.vue";
import Mnemonicfind from "./views/jpass/mnemonicfind.vue";
import Keystorefind from "./views/jpass/keystorefind.vue";
import Login from "./views/jpass/login.vue";
import Keystoreimport from "./views/jpass/keystoreimport.vue";
import Mnemonicimport from "./views/jpass/mnemonicimport.vue";
import Keyimport from "./views/jpass/keyimport.vue";
import Index from "./views/Index";

Vue.use(Router);

export default new Router({
    routes: [
        {path: '/', redirect: '/jpass/login'}, // 默认就跳转此页面
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
            path: "/register",
            name: "register",
            component: Register
        },
        {
            path: "/jpass/register",
            name: "register",
            component: Register1
        },
        {
            path: "/jpass/mnemonicfind",
            name: "mnemonicfind",
            component: Mnemonicfind
        },
        {
            path: "/jpass/keystorefind",
            name: "keystorefind",
            component: Keystorefind
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
            path: "/about",
            name: "about",
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                import(/* webpackChunkName: "about" */ "./views/About.vue")
        }
    ]
});
