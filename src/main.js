import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import router from "./router";
import store from "./store.js";
import VueI18n from "vue-i18n";
import ElementLocale from "element-ui/lib/locale";
import JPassUtil from "jpass-util";
import myIpfs from "@/jcc_ipfs.js";
import Lowdb from "lowdb";
import IndexDB from "./indexDB";
import createPassword from "../src/createPassword";
import vueCanvasNest from "vue-canvas-nest";
import passwordGenerator from "@/components/PasswordGenerator";
import passwordGeneratorMain from "@/components/PasswordGeneratorMain";
import pay from "@/components/Pay";
import VueClipboard from "vue-clipboard2";
import Jcc_ipfs from "./jcc_ipfs";
import Lock from "@/components/Lock";
import Synchronization from "@/components/Synchronization";
import MyInfo from "@/components/MyInfo";
import Setting from "@/components/Setting";
import Detail from "@/components/Detail";
import Remove from "@/components/Remove";
import Directory from "@/components/Directory";
import Menu_1 from "@/components/Menu_1";

let test = require("./assets/test");

window.myIpfs = myIpfs;
Vue.config.productionTip = false;
Vue.use(VueI18n);
//https://element.eleme.cn/#/zh-CN/component/quickstart
Vue.use(ElementUI);
Vue.use(VueClipboard);

//components
Vue.component("vueCanvasNest", vueCanvasNest);
Vue.component("passwordGenerator", passwordGenerator);
Vue.component("passwordGeneratorMain", passwordGeneratorMain);
Vue.component("pay", pay);
Vue.component("lockSystem", Lock);
Vue.component("synchronization", Synchronization);
Vue.component("myInfo", MyInfo);
Vue.component("setting", Setting);
Vue.component("detail", Detail);
Vue.component("remove", Remove);
Vue.component("directory", Directory);
Vue.component("menu_1", Menu_1);


let lockFlag = localStorage.getItem("lockFlag"); //锁定状态
if (lockFlag === null) {
    localStorage.setItem("lockFlag", "false");
}
let autoStartFlag = localStorage.getItem("autoStartFlag"); //锁定状态
if (autoStartFlag === null) {
    localStorage.setItem("autoStartFlag", "false");
}

//实例化vue-i18n
const i18n = new VueI18n({
    // 从本地存储中取，如果没有默认为中文，
    // 这样可以解决切换语言后，没记住选择的语言，刷新页面后还是默认的语言
    locale: localStorage.getItem("lang") || "zh-CN",
    messages: {
        "zh-CN": require("./common/lang/zh-CN").default, // 中文语言包
        "en-US": require("./common/lang/en-US").default // 英文语言包
    }
});

ElementLocale.i18n((key, value) => i18n.t(key, value));
Vue.prototype.$createPassword = createPassword;
Vue.prototype.$JPassUtil = JPassUtil;
Vue.prototype.$JCCWallet = require("jcc_wallet");
Vue.prototype.$JINGCHUANGWallet = require("jcc_wallet").JingchangWallet;
Vue.prototype.$JTWallet = require("jcc_wallet").jtWallet;
Vue.prototype.$JSON5 = require("json5");
Vue.prototype.$Uuidv1 = require("uuid/v1");
Vue.prototype.$myIpfs = myIpfs;
Vue.prototype.$test = test;
Vue.prototype.$Lowdb = source => Lowdb(new IndexDB(source));
Vue.prototype.$Ipfs = Jcc_ipfs;


if (typeof window.require === "function") {
    window.IpcRenderer = window.require("electron").ipcRenderer;
    Vue.prototype.$IpcRenderer = window.IpcRenderer;
}

window.vue = new Vue({
    i18n,
    router,
    store,
    render: h => h(App) //入口页面
}).$mount("#app");
