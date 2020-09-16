import Vue from "vue";
import Vuex from "vuex";
import utils from "@/store/utils";
import mainPage from "@/store/mainpage";


Vue.use(Vuex);

export default new Vuex.Store({
    modules: { utils, mainPage }
});

