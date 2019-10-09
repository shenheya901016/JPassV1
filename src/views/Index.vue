<template>
    <div class="body1">
        <div class="sy">
            <div class="list01">
                <h1>
                    <a href="#">
                        <img src="../img/logo01.png" width="60%">
                    </a>
                </h1>
                <ul id="models">
                    <li class="select">
                        <div></div>
                        <span>所有项目</span>
                        <i>5</i>
                    </li>
                    <!--<li>
                        <div></div>
                        <span>收藏夹</span>
                        <i>5</i>
                    </li>
                    <li>
                        <div></div>
                        <span>密码</span>
                        <i>5</i>
                    </li>
                    <li>
                        <div></div>
                        <span>未标记</span>
                        <i>5</i>
                    </li>
                    <li>
                        <div></div>
                        <span>模板</span>
                        <i>5</i>
                    </li>
                    <li>
                        <div></div>
                        <span>垃圾桶</span>
                        <i>5</i>
                    </li>-->
                    <!--<li v-for="data in all.models">
                        <div></div>
                        <span>{{data.name}}</span>
                        <i>{{data.id}}</i>
                    </li>-->
                </ul>
            </div>
            <div class="list02">
                <div class="nav">
                    <ul class="left_nav">
                        <li>
                            <a href="#">
                                所有卡片
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                添加笔记
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                删除
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                同步
                            </a>
                        </li>
                    </ul>
                    <ul class="right_nav">
                        <li>
                            <a href="#">
                                <span>帮助</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <div class="icon">
                                    <img src="../img/icon.png" width="30" height="30" alt="">
                                </div>
                                <span id="name">
								{{all.profile[0].name}}
							    </span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="connent">
                    <div class="dh">
                        <div class="dh_top">
                            <input class="aotuText" type="text">
                            <div class="icon01">
                                <img src="../img/sousuo.svg" width="32" height="32" alt="">
                            </div>
                            <div class="icon02">
                                <img src="../img/gengduo.svg" width="32" height="32" alt="">
                            </div>
                        </div>
                        <ul id="project">
                            <li>收藏夹记录1</li>
                            <li>密码记录1</li>
                            <li>未标记记录1</li>
                            <li>模板记录1</li>
                            <li>未标记记录2</li>
                            <li v-for="data in all.project">{{data.name}}</li>
                        </ul>
                    </div>
                    <div class="nr" style="height: 500px;">
                         <table id="heroListTable" style="border-collapse:collapse;">
                             <thead>
                             <tr>
                                 <th>模板ID</th>
                                 <th>模板名称</th>
                             </tr>
                             <tr v-for="data in all.models">
                                 <th>{{data.id}}</th>
                                 <th>{{data.name}}</th>
                             </tr>
                             </thead>
                             <tbody>
                             <!--<tr>
                                 <td>
                                     模板ID:
                                 </td>
                                 <td colspan="2">
                                     <input type="text" v-model="model.id"/>
                                 </td>
                             </tr>
                             <tr>
                                 <td>
                                     模板名称：
                                 </td>
                                 <td colspan="2">
                                     <input type="text" v-model="model.name"/>
                                 </td>
                             </tr>
                             <tr>
                                 <td colspan="3">
                                     <button type="button" @click="add('models')">增加</button>
                                 </td>
                             </tr>-->
                             </tbody>
                         </table>
                    </div>
                    <ul class="icon02_box">
                        <li>登录信息模板</li>
                        <li>密码</li>
                        <li>身份标识</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    var model = {
        id: '',
        name: ''
    };
    export default {
        name: "Index.vue",
        data: function () {
            var all = this.$ipfs.Ipfs.selAll("j4M4AoSi522XxNpywfyBahmjzQihc4EegL");
            console.log(all);
            return {all, model};
        },
        methods: {
            add(type) {
                console.log(type);
                console.log(JSON.stringify(model));
                this.$ipfs.Ipfs.add(JSON.stringify(model), type);
            }
        }
    };
    var $ = require("jquery");

        $(".icon02").mouseover(function () {
            $(".icon02_box")[0].style.display = "block";
        })
        $(".icon02_box").mouseover(function () {
            $(".icon02_box")[0].style.display = "block";
        })
        $(".icon02").mouseout(function () {
            $(".icon02_box")[0].style.display = "none";
        })
        $(".icon02_box").mouseout(function () {
            $(".icon02_box")[0].style.display = "none";
        })



</script>

<style scoped>
    /*css 初始化 */
    html, body, ul, li, ol, dl, dd, dt, p, h1, h2, h3, h4, h5, h6, form, fieldset, legend, img {
        margin: 0;
        padding: 0;
    }

    /*fieldset, img, input, button {*/
    /*    border: none;*/
    /*    padding: 0;*/
    /*    margin: 0;*/
    /*    outline-style: none;*/
    /*}*/

    /*去掉input等聚焦时的蓝色边框*/
    ul, ol {
        list-style: none;
    }

    input {
        padding-top: 0;
        padding-bottom: 0;
        font-family: "SimSun", "宋体";
    }

    select, input {
        vertical-align: middle;
    }

    select, input, textarea {
        font-size: 12px;
        margin: 0;
    }

    textarea {
        resize: none;
    }

    /*防止拖动*/
    img {
        border: 0;
        vertical-align: middle;
    }

    /*  去掉图片低测默认的3像素空白缝隙，或者用display：block也可以*/
    table {
        border-collapse: collapse;
    }

    body {
        font: 12px/150% Arial, Verdana, "\5b8b\4f53";
        color: #666;
        background: #fff;
    }

    .clearfix:before, .clearfix:after { /*清楚浮动*/
        content: "";
        display: table;
    }

    .clearfix:after {
        clear: both;
    }

    .clearfix {
        *zoom: 1; /*IE/7/6*/
    }

    a {
        color: #666;
        text-decoration: none;
    }

    a:hover {
        color: #C81623;
    }

    h1, h2, h3, h4, h5, h6 {
        text-decoration: none;
        font-weight: normal;
        font-size: 100%;
    }

    /*设置h标签的大小，设置跟父亲一样大的字体font-size:100%;*/
    s, i, em {
        font-style: normal;
        text-decoration: none;
    }

    .col-red {
        color: #C81623 !important;
    }

    /*公共类*/
    .w { /*版心 提取 */
        width: 1210px;
        margin: 0 auto;
    }

    .fl {
        float: left
    }

    .fr {
        float: right
    }

    .al {
        text-align: left
    }

    .ac {
        text-align: center
    }

    .ar {
        text-align: right
    }

    .hide {
        display: none
    }

    .font12 {
        font-size: 12px;
    }

    .font14 {
        font-size: 14px;
    }

    .font16 {
        font-size: 16px;
    }

    /*公共部分*/
    /*头部导航开始*/


    /*尾部部导航开始*/
    .mb20 {
        margin-bottom: 20px !important;
    }

    .sy {

    }

    .sy .list01 {
        width: 10%;
        min-width: 240px;
        height: 100%;
        float: left;
        background-image: linear-gradient(143deg, #53E0FF 0%, #076DD4 100%);
        overflow: hidden;
    }

    .sy .list01 h1 img {
        display: block;
        margin: 8% auto 14%;
    }

    .sy .list01 li {
        width: 100%;
        height: 64px;
        font-size: 20px;
        color: #fff;
        line-height: 64px;
        padding-left: 40px;
        padding-right: 18px;
        box-sizing: border-box;
        cursor: pointer;
    }

    .sy .list01 li i {
        width: 38px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        padding: 0 4px;
        float: right;
        margin-top: 20px;
        background: rgba(255, 255, 255, 0.25);
        border-radius: 12px;
        border-radius: 12px;
    }

    .sy .list01 li span {
        float: left;
    }

    .sy .list01 li div {
        margin-top: 16px;
        margin-right: 10px;
        float: left;
        background: yellow;
        width: 32px;
        height: 32px;
        background: url(../img/li01.svg) no-repeat center center;
    }

    .sy .list01 li:nth-child(1) div {
        background: url(../img/li01.svg) no-repeat center center;
    }

    .sy .list01 li:nth-child(2) div {
        background: url(../img/li02.svg) no-repeat center center;
    }

    .sy .list01 li:nth-child(3) div {
        background: url(../img/li03.svg) no-repeat center center;
    }

    .sy .list01 li:nth-child(4) div {
        background: url(../img/li04.svg) no-repeat center center;
    }

    .sy .list01 li:nth-child(5) div {
        background: url(../img/li05.svg) no-repeat center center;
    }

    .sy .list01 li:nth-child(6) div {
        background: url(../img/li06.svg) no-repeat center center;
    }

    .sy .list01 li.select:nth-child(1) div {
        background: url(../img/li01_select.svg) no-repeat center center;
    }

    .sy .list01 li.select:nth-child(2) div {
        background: url(../img/li02_select.svg) no-repeat center center;
    }

    .sy .list01 li.select:nth-child(3) div {
        background: url(../img/li03_select.svg) no-repeat center center;
    }

    .sy .list01 li.select:nth-child(4) div {
        background: url(../img/li04_select.svg) no-repeat center center;
    }

    .sy .list01 li.select:nth-child(5) div {
        background: url(../img/li05_select.svg) no-repeat center center;
    }

    .sy .list01 li.select:nth-child(6) div {
        background: url(../img/li06_select.svg) no-repeat center center;
    }

    .sy .list01 li.select {
        background: rgba(255, 255, 255, 0.8);
    }

    .sy .list01 li.select span {
        color: #1989FA;
    }

    .sy .list01 li.select i {
        color: rgba(25, 137, 250, .8);
        background: rgba(25, 137, 250, .15);
    }

    .sy .list02 {
        width: 85%;
        height: 100%;
        float: left;
    }

    .sy .list02 .nav {
        height: 10%;
        width: 100%;
        background: #FFFFFF;
        box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.06);
    }

    .sy .list02 .nav .left_nav {
        height: 100%;
        float: left;
    }

    .sy .list02 .nav .left_nav li {
        width: 114px;
        height: 100%;
        float: left;
        font-size: 18px;
        color: #666;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .sy .list02 .nav .left_nav li a {
        display: block;
        height: 24px;
        padding: 0 10px;
        line-height: 24px;
    }

    .sy .list02 .nav .left_nav li a:hover {
        color: rgba(25, 137, 250, 1);
    }

    .sy .list02 .nav .right_nav {
        height: 100%;
        float: right;
    }

    .sy .list02 .nav .right_nav li {
        float: right;
        height: 100%;
        font-size: 22px;
        display: block;
        color: #666;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .sy .list02 .nav .right_nav li a {
        display: block;
        height: 30px;
        padding: 0 20px;
        line-height: 30px;
    }

    .sy .list02 .nav .right_nav li a .icon {
        float: left;
        margin-right: 4px;
    }

    .sy .list02 .connent {
        height: 90%;
        width: 100%;
        overflow: hidden;
        position: relative;
    }

    .sy .list02 .connent .dh {
        height: 100%;
        width: 30%;
        float: left;
        background: #f1f1f1;
    }

    .sy .list02 .connent .dh .dh_top {
        height: 92px;
        width: 100%;
        box-sizing: border-box;
        padding: 0 4%;
    }

    .sy .list02 .connent .dh .dh_top > * {
        float: left;
        margin-top: 30px;
    }

    .sy .list02 .connent .dh .dh_top > input {
        width: 60%;
        height: 32px;
        padding-left: 20px;
        background: #FFFFFF;
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: 16px;
        border-radius: 16px;
    }

    .sy .list02 .connent .dh ul {
        width: 100%;
    }

    .sy .list02 .connent .dh ul li {
        width: 100%;
        height: 56px;
        line-height: 56px;
        padding-left: 4%;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        font-size: 20px;
        color: #666666;
        cursor: pointer;
    }

    .sy .list02 .connent .dh ul li:hover {
        color: rgba(25, 137, 250, 1);
        background: #FFFFFF;
    }

    .sy .list02 .connent .dh .dh_top > div {
        width: 12%;
        height: 32px;
        text-align: center;
    }

    .sy .list02 .connent .dh .dh_top > input {
        width: 76%;
        height: 32px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    .sy .list02 .connent .dh .dh_top > div:hover {
        opacity: .8;
    }

    .sy .list02 .connent .nr {
        overflow: hidden;
        height: 100%;
        width: 70%;
        background: purple;
        float: left;
        background: url(../img/mimabaohu.png) no-repeat center center;
    }

    .sy .list02 .icon02_box {
        width: 146px;
        height: 130px;
        background: pink;
        position: absolute;
        top: 56px;
        left: 23%;
        background: url(../img/duihuakuang.png) no-repeat center center;
        background-size: 100% 100%;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        display: none;
        padding: 20px 30px;
    }

    .sy .list02 .icon02_box li {
        height: 30px;
        line-height: 30px;
        cursor: pointer;
    }

    .sy .list02 .icon02_box li:hover {
        color: rgba(25, 137, 250, 1);
    }

</style>
