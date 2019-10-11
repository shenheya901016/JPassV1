<template>
    <body class="sy" @mousemove="GetXYPosition">
    <!-- 头部 -->
    <header class="header">
        <h1>
            <a href="#">
                <img src="./img/Logo-4.svg" alt="">
            </a>
        </h1>
        <ul class="link">
            <li><a href="#"><img style="top:-1px;" src="./img/ICON-ZJ.svg" alt="">增加</a></li>
            <li><a href="#"><img style="top:-2px;" src="./img/ICON-SC.svg" alt="">删除</a></li>
            <li><a href="#"><img style="top:-2px;" src="./img/ICON-TB.svg" alt="">同步</a></li>
            <li><a href="#" @click="lock()"><img style="top:-2px;" src="./img/ICON-SD.svg" alt="">锁定</a></li>
            <!--<li><a href="#"><img style="top:-1px;" src="./img/ICON-SCQ.svg" alt="">生成器</a></li>-->
        </ul>
        <div class="hr">
            <!--<a href="#" class="mr2w">-->
            <!--<img src="./img/icon_tz.svg" alt="">-->
            <!--</a>-->
            <a href="#" class="mr4w">
                <img src="./img/icon_sz.svg" alt="">
            </a>
            <div class="touxiang">
                <img src="./img/tx.svg" alt="">
                <div>
                    <a href="#">请叫我特仑苏</a>
                    <span>yuansushi@163.com</span>
                </div>
            </div>
        </div>

    </header>
    <!-- 侧边栏 -->
    <aside class="aside" style="">
        <!-- 导航栏 -->
        <nav class="nav">
            <ul class="dh">
                <li v-for="project in DProject.project">
                    <span>{{project.name}}</span>
                    <i>{{project.count}}</i>
                </li>
                <!--<li>-->
                <!--<span>收藏夹</span>-->
                <!--<i>32</i>-->
                <!--</li>-->
                <!--<li>-->
                <!--<span>密码</span>-->
                <!--<i>32</i>-->
                <!--</li>-->
                <!--<li>-->
                <!--<span>未标记</span>-->
                <!--<i>32</i>-->
                <!--</li>-->
                <!--<li>-->
                <!--<span>模板</span>-->
                <!--<i>32</i>-->
                <!--</li>-->
                <!--<li>-->
                <!--<span>垃圾桶</span>-->
                <!--<i>32</i>-->
                <!--</li>-->
            </ul>
            <h3>文件夹</h3>
            <ul class="dhwjj">
                <li  v-for="project in DDirectory.directory">
                    <span>{{project.name}}</span>
                    <i>{{project.count}}</i>
                </li>
                <!--<li>-->
                    <!--<span>追波账号</span>-->
                    <!--<i>18</i>-->
                <!--</li>-->
                <!--<li>-->
                    <!--<span>网易云</span>-->
                    <!--<i>18</i>-->
                <!--</li>-->
                <!--<li>-->
                    <!--<span>腾讯</span>-->
                    <!--<i>18</i>-->
                <!--</li>-->
            </ul>
        </nav>
        <!-- 副导航栏 -->
        <article class="article">
            <input class="ss" type="text" placeholder="请输入要搜索的内容...">
            <ul class="list">
                <li v-for="note in allProject.datas" @click="getNote(note)">
                    <img src="./img/list_logo01.png" alt="" width="30" height="30">
                    <div>
                        <h5>{{note.id}}</h5>
                        <span>{{note.name}}</span>
                    </div>
                </li>
            </ul>
        </article>
        <el-dialog title="密码解锁" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false" :close-on-press-escape="false"
                   :show-close="false">
            <el-form label-width="100px" class="demo-ruleForm">
                <el-form-item label="登录密码" prop="password" style="margin-top:10%">
                    <el-input type="password" v-model="password" style="width:100%;"></el-input>
                </el-form-item>
                <el-form-item label="" prop="" style="margin-top:10%;margin-bottom: 15%">
                    <el-button type="primary" style="width:100%;" @click="unlock()">解锁</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </aside>
    </body>
</template>
<script type="es6">
    export default {
        mounted: function () {
            //lock定时器启动
            // if (this.loginObj.lock) {
            //     this.dialogVisible = true;
            // } else {
            //     this.eventID = setInterval(this.CheckTime, 1000);
            // }

            var all = this.$ipfs.Ipfs.selAll("j4M4AoSi522XxNpywfyBahmjzQihc4EegL");

           // this.$ipfs.Ipfs.add('{"id":"01","name":"shy"}',"models");
             console.log(all);

            this.getdirectory();
        },
        data() {
            return {
                dialogVisible: false,
                mouse1: '',
                mouse2: '',
                eventID: '',
                currentSecond: 0,
                password: '',
                loginObj: this.$JSON5.parse(sessionStorage.getItem("userkeyObj")),
                //allProject:
                // this.$JSON5.parse("{datas:[{id:'01',name:'shy',typeId:['01','02','03']},{id:'02',name:'shy1',typeId:['01','06','04']},{id:'03',name:'shy3',typeId:['01','02','04']},{id:'05',name:'shy13',typeId:['01','02','04']},{id:'03',name:'shy5',typeId:['01','02','04']},{id:'03',name:'shy8',typeId:['01','02','06']}]}"),
                allProject: this.$JSON5.parse('{"datas":[{"id":"01","name":"shy","typeId":["01","02","03"]},{"id":"02","name":"shy1","typeId":["01","06","04"]},{"id":"03","name":"shy3","typeId":["01","02","04"]}]}'),
                models: this.$JSON5.parse("{models:[{id:'01',name:'所有项目',type:'project',imgPaht:''},{id:'02',name:'收藏夹',type:'project',imgPaht:''},{id:'03',name:'密码',type:'project',imgPaht:''},{id:'04',name:'模板',type:'project',imgPaht:''},{id:'05',name:'未标记',type:'project',imgPaht:''},{id:'06',name:'家人账号',type:'directory',imgPaht:''},{id:'07',name:'私人账号',type:'directory',imgPaht:''}]}"),
                DProject: '',
                DDirectory: ''
            };
        },
        methods: {
            GetXYPosition(){
                var x, y;
                var e = window.event;
                x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                this.mouse2 = x + ',' + y;
            },
            CheckTime(){
                let timeout = 300 * 1000;//设定超时时间，单位毫秒
                if (this.mouse1 == this.mouse2) {
                    this.currentSecond = this.currentSecond + 1000;
                    // console.log(this.currentSecond);
                    if (this.currentSecond > timeout) {
                        clearInterval(this.eventID);
                        this.dialogVisible = true;
                        this.loginObj.lock = true;
                        sessionStorage.setItem("userkeyObj", this.$JSON5.stringify(this.loginObj));
                        this.currentSecond = 0;
                    }
                } else {
                    this.currentSecond = 0;
                    this.mouse1 = this.mouse2;
                }
            },
            async  unlock(){
                let secret = "";
                let wallet = new this.$JINGCHUANGWallet();
                let keyStoreString = localStorage.getItem(this.loginObj.name);
                let objKeyStore = this.$JSON5.parse(keyStoreString);
                let keystring = "";
                try {
                    //钱包生成密钥
                    wallet.setJingchangWallet(objKeyStore);
                    var address = objKeyStore.wallets[0].address;
                    keystring = wallet.getSecretWithAddress(this.password, address);
                    await keystring.then(function (value) {
                        secret = value;
                    });
                } catch (e) {
                    this.$message.error("密码有误，请重新输入！");
                    return false;
                }
                this.loginObj.lock = false;
                sessionStorage.setItem("userkeyObj", this.$JSON5.stringify(this.loginObj));
                this.dialogVisible = false;
                this.$message.success("解锁成功！");
                this.password = "";
                //继续监听
                this.eventID = setInterval(this.CheckTime, 1000);
            },
            lock(){
                this.loginObj.lock = true;
                sessionStorage.setItem("userkeyObj", this.$JSON5.stringify(this.loginObj));
                this.dialogVisible = true;
            },
            getNote(note){
                console.log(note)
                for (var key in note) {
                    console.log(key);
                }
            },
            //获取目录
            getdirectory(){
                var alldata = this.models;
                var allProjects = this.allProject;
                var projectstring = ""
                var directoryString = ""
                var jsonProjectstring = ""
                var jsonDirectoryString = ""
                //设置每一项数量
                for(var modelkey in alldata.models){
                    var count=0
                    for(var projectkey in allProjects.datas){
                        var project = allProjects.datas[projectkey];
                        var types = project.typeId;
                        // console.log(types);
                        // console.log(alldata.models[modelkey].id);
                        if(types.indexOf(alldata.models[modelkey].id)!=-1){
                            count++;
                        }
                    }
                    alldata.models[modelkey].count=count;
                }
                //分组
                for (var key in alldata.models) {
                    var object = alldata.models[key];
                    if (object.type == "project") {
                        projectstring = projectstring + this.$JSON5.stringify(object) + ",";
                    }
                    if (object.type == "directory") {
                        directoryString = directoryString + this.$JSON5.stringify(object) + ",";
                    }
                }
                projectstring = projectstring.substring(0, projectstring.length - 1);
                jsonProjectstring = "{project:[" + projectstring + "]}";
                directoryString = directoryString.substring(0, projectstring.length - 1);
                jsonDirectoryString = "{directory:[" + directoryString + "]}";
                // console.log(this.$JSON5.parse(jsonProjectstring));
                // console.log(this.$JSON5.parse(jsonDirectoryString));
                this.DProject = this.$JSON5.parse(jsonProjectstring);
                this.DDirectory = this.$JSON5.parse(jsonDirectoryString);

            }

        }
    }


</script>
<style>
    @import './css/base.css';
    @import './css/sy.css';
</style>