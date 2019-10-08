import Vue from "vue";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueI18n from 'vue-i18n';
import ipfs from './ipfs';
import ElementLocale from 'element-ui/lib/locale';
//const JPassUtil = require("./JPassUtil");
import JPassUtil from "jpass-util";
Vue.config.productionTip = false;
Vue.use(VueI18n);
//https://element.eleme.cn/#/zh-CN/component/quickstart
Vue.use(ElementUI);


//实例化vue-i18n
const i18n = new VueI18n({
    // 从本地存储中取，如果没有默认为中文，
    // 这样可以解决切换语言后，没记住选择的语言，刷新页面后还是默认的语言
    locale: localStorage.getItem('lang') || 'zh-CN',
    messages: {
        'zh-CN': require('./common/lang/zh-CN').default, // 中文语言包
        'en-US': require('./common/lang/en-US').default// 英文语言包
    }
});

ElementLocale.i18n((key, value) => i18n.t(key, value));
Vue.prototype.$JPassUtil = JPassUtil;
Vue.prototype.$JCCWallet = require('jcc_wallet');
Vue.prototype.$JINGCHUANGWallet = require('jcc_wallet').JingchangWallet;
Vue.prototype.$JTWallet = require('jcc_wallet').jtWallet;
Vue.prototype.$JSON5 = require('json5');
Vue.prototype.$ipfs = ipfs;
new Vue({
    i18n,
    router,
    store,
    render: h => h(App)//入口页面
}).$mount("#app");
