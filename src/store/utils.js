import VueI18n from "vue-i18n";
import Vue from 'vue'
Vue.use(VueI18n)
//实例化vue-i18n
const i18n = new VueI18n({
    // 从本地存储中取，如果没有默认为中文，
    // 这样可以解决切换语言后，没记住选择的语言，刷新页面后还是默认的语言
    locale: localStorage.getItem("lang") || "zh-CN",
    messages: {
        "zh-CN": require("@/common/lang/zh-CN").default, // 中文语言包
        "en-US": require("@/common/lang/en-US").default // 英文语言包
    }
});
const util = require("util");
let request = require("request");
let JSON5 = require("json5");
const utils = {
    state: {
        vipTime: "",
        isctrl: "", //是否按下ctrl
        isshift: "", //是否按下shift
        aliTime: "",
        des: "",
        str: "",
        percentage: "",
        status: "",
    },

    mutations: {
        keyevent (state) {
            document.onkeydown = function (e) {
                //按下键盘
                switch (e.keyCode) {
                    case 16:
                        state.isshift = true;
                        console.log("按下shift");
                        break;
                    case 17:
                        state.isctrl = true;
                        console.log("按下ctrl");
                        break;
                }
            };
            document.onkeyup = function (e) {
                //放弃键盘
                switch (e.keyCode) {
                    case 16:
                        state.isshift = false;
                        console.log("释放shift");
                        break;
                    case 17:
                        state.isctrl = false;
                        console.log("释放ctrl");
                        break;
                }
            };
        },

        formatDate (state, datetime) {
            var date = new Date(datetime); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var year = date.getFullYear(),
                month = ("0" + (date.getMonth() + 1)).slice(-2),
                sdate = ("0" + date.getDate()).slice(-2),
                hour = ("0" + date.getHours()).slice(-2),
                minute = ("0" + date.getMinutes()).slice(-2),
                second = ("0" + date.getSeconds()).slice(-2);
            // 拼接
            var result =
                year +
                "-" +
                month +
                "-" +
                sdate +
                " " +
                hour +
                ":" +
                minute +
                ":" +
                second;
            // 返回
            state.vipTime = result;
        },


        /**
        * 判断密码强度
        * @param p
        * @return {string}
        */
        cryptLevel (state, p) {
            let hasUpper = false;
            let hasLow = false;
            let hasNum = false;
            let hasOther = false;
            let out = "";
            for (let i = 0; i < p.length; i++) {
                let c = p.charCodeAt(i);
                if (c >= 65 && c <= 90) hasUpper = true;
                else if (c >= 97 && c <= 122) hasLow = true;
                else if (c >= 48 && c <= 57) hasNum = true;
                else hasOther = true;
            }
            let pwdNum = 0;
            if (hasUpper) pwdNum += 26;
            if (hasLow) pwdNum += 26;
            if (hasNum) pwdNum += 10;
            if (hasOther) pwdNum += 32;
            let num = Math.pow(pwdNum, p.length);
            if (num == 1) {
                num = 0;
            }
            this.commit("formatTime", num / (1024 * 1024 * 1024 * 2.4 * 2));
            out = state.str;
            if (out != "") {
                state.des = i18n.t("main.breakTime") + out;
            }
        },
        formatTime (state, s) {
            var str = "";
            if (s == 0) return (str = "");
            s = Math.floor(s);
            if (s < 1) return (str = i18n.t("main.moment"));
            s = Math.floor(s);
            if (s >= 1) str = (s % 60) + i18n.t("main.seconds") + str;
            s = Math.floor(s / 60);
            if (s >= 1) str = (s % 60) + i18n.t("main.mintues") + str;
            s = Math.floor(s / 60);
            if (s >= 1) str = (s % 24) + i18n.t("main.hours") + str;
            s = Math.floor(s / 24);
            if (s >= 1) {
                str = Math.ceil(s + i18n.t("main.day")) + str;
                if (s <= 28) {
                    str = Math.ceil(s / 7) + i18n.t("main.weeks");
                } else if (s >= 30 && s <= 360) {
                    str = Math.ceil(s / 30) + i18n.t("main.month");
                } else if (s >= 360 && s <= 36000) {
                    str = Math.ceil(s / 360) + i18n.t("main.years");
                } else {
                    str = i18n.t("main.century");
                }
            }
            state.str = str;
        },


        /**
         * 获取进度条百分比
         * @param pwd
         * @return {string}
         */
        getPercentage (state, pwd) {
            let level = state.des;
            if (level.indexOf(i18n.t("main.century")) !== -1) {
                state.percentage = 100;
                state.status = "#13CE66";
            } else if (level.indexOf(i18n.t("main.years")) !== -1) {
                state.percentage = 80;
                state.status = "#20A0FF";
            } else if (level.indexOf(i18n.t("main.month")) !== -1) {
                state.status = "#20A0FF";
                state.percentage = 60;
            } else if (level.indexOf(i18n.t("main.weeks")) !== -1) {
                state.percentage = 40;
                state.status = "#E6A23C";
            } else if (level.indexOf(i18n.t("main.day")) !== -1) {
                state.percentage = 35;
                state.status = "#FF4949";
            } else if (level.indexOf(i18n.t("main.hours")) !== -1) {
                state.percentage = 30;
                state.status = "#FF4949";
            } else if (level.indexOf(i18n.t("main.mintues")) !== -1) {
                state.percentage = 15;
                state.status = "#FF4949";
            } else if (level.indexOf(i18n.t("main.seconds")) !== -1) {
                state.percentage = 10;
                state.status = "#FF4949";
            } else if (level.indexOf(i18n.t("main.moment")) !== -1) {
                state.percentage = 5;
                state.status = "#FF4949";
            } else {
                state.percentage = 0;
                level = "";
                state.status = "#E5E9F2";
            }
        },

        //国际化
        changeLan (state, lan) {
            if (lan === "中文") {
                i18n.locale = 'zh-CN';
            } else if (lan === "English") {
                i18n.locale = 'en-US';
            }
        },


    },
    actions: {
        async getTime (context) {
            console.log("获取阿里时间");
            //判断是否为开发者模式
            let timecurl = "http://api.m.taobao.com/";
            //判断是否为开发者模式
            if (process.env.NODE_ENV === "development") {
                timecurl = "http://localhost:8080/altime/";
            }
            const getPromise = util.promisify(request.get);
            let url = timecurl + "rest/api3.do?api=mtop.common.getTimestamp";
            let result = await getPromise(url);
            let timeobj = JSON5.parse(result.body);
            context.state.aliTime = timeobj.data["t"];
        },

        async newVersion (context) {
            //阿里时间
            await context.dispatch('getTime');
            let now = context.state.aliTime;
            console.log(context.rootState);
            context.rootState.mainPage.db.set("version", now).write();
        }
    }
};
export default utils;
