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
            <!--<li><a href="#"><img style="top:-1px;" src="./img/ICON-ZJ.svg" alt="">增加</a></li>-->
            <li>
                <el-button :disabled="isDisabled" @click="remove()" id="delbtn" style="border:0"><img style="top:-2px;" src="./img/ICON-SC.svg"
                                                                                                      alt="">删除
                </el-button>
            </li>
            <li>
                <el-button style="border:0;" @click="synchronization()"><img style="top:-2px;" src="./img/ICON-TB.svg">同步</el-button>
                <el-progress :percentage="percentage" :stroke-width="4" :color="customColor" :status="synStatus" :show-text="true"
                             v-show="processShow"></el-progress>
            </li>
            <li>
                <el-button style="border:0" @click="lock()"><img style="top:-2px;" src="./img/ICON-SD.svg" alt="">锁定</el-button>
            </li>
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
        <nav class="nav" style="">
            <ul class="dh" id="projectUL">
                <li v-for="(project,index) in DProject.project" @click="projectclick(project,$event)" :data-index="index"
                    :class="index == currentProject?click:disclick">
                    <span>{{project.name}}</span>
                    <i>{{project.count}}</i>
                </li>
            </ul>
            <h3>文件夹</h3>
            <ul class="dhwjj" id="DirUL">
                <li v-for="(project,index) in DDirectory.directory" @click="directoryclick(project,$event)" :data-index="index"
                    :class="index == currentDirectory?click:disclick">
                    <span>{{project.name}}</span>
                    <i>{{project.count}}</i>
                </li>
            </ul>
            <a href="#" class="jh" @click="addDirectoryOP">+</a>
        </nav>
        <!-- 副导航栏 -->
        <article class="article">
            <input class="ss" type="text" placeholder="请输入要搜索的内容...">
            <ul class="list">
                <li v-for="(note,index) in projects" @click="noteslick(note,$event)" :data-index="index"
                    :class="index == currentNote?click:disclick">
                    <img src="./img/list_logo01.png" alt="" width="30" height="30">
                    <div>
                        <h5>{{note.id}}</h5>
                        <span>{{note.name}}</span>
                    </div>
                </li>
            </ul>
            <a href="#" class="jh1">+</a>
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
        <el-dialog title="增加目录" :visible.sync="dialogVisible2" width="28%" :close-on-click-modal="false" :show-close="false">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="width: 80%;">
                <!--<el-form-item label="类型选择" prop="modelsType">-->
                <!--<el-radio v-model="ruleForm.modelsType" label="project" style="float:left;line-height: inherit">目录</el-radio>-->
                <!--<el-radio v-model="ruleForm.modelsType" label="directory" style="float:left;line-height: inherit">文件夹</el-radio>-->
                <!--</el-form-item>-->
                <el-form-item label="名称" prop="pName" style="margin-top:10%">
                    <el-input v-model="ruleForm.pName" style="width:100%;"></el-input>
                </el-form-item>
                <el-form-item label="" prop="" style="margin-top:10%">
                    <el-button type="primary" size="small" style="width:35%;float:left;" @click="submitForm('ruleForm')">确定</el-button>
                    <el-button type="primary" size="small" style="width:35%;float:left;" @click="cancel('ruleForm')">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="dialogVisibledDirectory" width="30%">
            <span>是否删除文件夹？</span>
              <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="removeData()">确 定</el-button>
                <el-button size="small" @click="dialogVisibledDirectory = false">取 消</el-button>
              </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="dialogVisibledProject" width="30%">
            <span>是否删除项目？</span>
              <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="removeData()">确 定</el-button>
                <el-button size="small" @click="dialogVisibledProject = false">取 消</el-button>
              </span>
        </el-dialog>
    </aside>
    </body>
</template>
<script type="es6">
    import low from 'lowdb';
    import LocalStorage from 'lowdb/adapters/LocalStorage';
    export default {
        mounted: function () {
            //lock定时器启动
            // if (this.loginObj.lock) {
            //     this.dialogVisible = true;
            // } else {
            //     this.eventID = setInterval(this.CheckTime, 1000);
            // }

            //var all = this.$ipfs.Ipfs.selAll("j4M4AoSi522XxNpywfyBahmjzQihc4EegL");

            // this.$ipfs.Ipfs.add('{"id":"01","name":"shy"}',"models");
            //console.log(all);
           this.initialize();

            this.getdirectory();
        },
        data() {
            return {
                dialogVisible: false,
                dialogVisible2: false,
                dialogVisibledDirectory: false,
                dialogVisibledProject: false,
                mouse1: '',
                mouse2: '',
                eventID: '',
                currentSecond: 5,
                password: '',
                loginObj: this.$JSON5.parse(sessionStorage.getItem("userkeyObj")),
                currentProject: -1,//大于li 总数量，如果初始为""，默认选择第0个元素
                currentDirectory: -1,
                currentNote: -1,
                //allProject:
                // this.$JSON5.parse("{datas:[{id:'01',name:'shy',typeId:['01','02','03']},{id:'02',name:'shy1',typeId:['01','06','04']},{id:'03',name:'shy3',typeId:['01','02','04']},{id:'05',name:'shy13',typeId:['01','02','04']},{id:'03',name:'shy5',typeId:['01','02','04']},{id:'03',name:'shy8',typeId:['01','02','06']}]}"),
                allProject: this.$JSON5.parse('{"datas":[{"id":"01","name":"shy","modelsId":["sy","scj","07","06"],"type":"project"},{"id":"02","name":"shy1","modelsId":["sy","scj","07","06"],"type":"project"},{"id":"03","name":"shy3","modelsId":["sy","scj","mm","06"],"type":"project"}]}'),
                // models: this.$JSON5.parse("{models:[{id:'sy',name:'所有项目',modelsType:'project',type:'model',imgPaht:'',},{id:'scj',name:'收藏夹',modelsType:'project',type:'model',imgPaht:''},{id:'mm',name:'密码',modelsType:'project',type:'model',imgPaht:''},{id:'mb',name:'模板',modelsType:'project',type:'model',imgPaht:''},{id:'wbj',name:'未标记',modelsType:'project',type:'model',imgPaht:''},{id:'06',name:'家人账号',modelsType:'directory',type:'model',imgPaht:''},{id:'07',name:'私人账号',modelsType:'directory',type:'model',imgPaht:''}]}"),
                alldata: this.$JSON5.parse('{"project":[{"id":"01","name":"shy","modelsId":["sy","scj","07","06","mm","mb"],"type":"project"},{"id":"02","name":"shy1", "modelsId":["sy","06","scj","06","mm","wbj"],"type":"project"},{"id":"03","name":"shy3","modelsId":["sy","06","scj","07"],"type":"project"}],"models":[{"id":"sy","name":"所有项目","modelsType":"project","type":"model","imgPaht":""}, {"id":"scj","name":"收藏夹","modelsType":"project","type":"model","imgPaht":""}, {"id":"mm","name":"密码","modelsType":"project","type":"model","imgPaht":""}, {"id":"mb","name":"模板","modelsType":"project","type":"model","imgPaht":""}, {"id":"wbj","name":"未标记","modelsType":"project","type":"model","imgPaht":""}, {"id":"06","name":"家人账号","modelsType":"directory","type":"model","imgPaht":""}, {"id":"07","name":"私人账号","modelsType":"directory","type":"model","imgPaht":""}]}'),
                DProject: '',
                DDirectory: '',
                click: 'click',
                disclick: 'disclick',
                delobj: '',
                isDisabled: true,
                customColor: "",
                percentage: 100,
                synStatus: "",
                db: '',
                projects: '',
                operatorJID: "jHDbFiFZ6rfDjhfRnhD1ReCwY2erhpiYBS",//运营商钱包地址
                operatorSecret: "ssxWidEVcs6bCtsVbfd7gMXUoRfMW",//运营商密钥
                localData: "",//本地数据
                processShow: false,//同步进度条是否显示
                ruleForm: {
                    modelsType: '',
                    pName: '',
                },
                rules: {
                    modelsType: [
                        {required: true, message: '请选择类型！', trigger: 'blur'},
                    ],
                    pName: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                        {min: 1, max: 10, message: '长度在 1 到10 个字符', trigger: 'blur'}
                    ]
                }
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

            //获取目录
            getdirectory(){
                var alldata = this.db.get("models").value();
                //console.log(alldata.length);
                var allProjects = this.db.get("project").value();
                //console.log(allProjects.length);
                var projectstring = ""
                var directoryString = ""
                var jsonProjectstring = ""
                var jsonDirectoryString = ""
                //设置每一项数量
                for (var modelkey in alldata) {
                    var count = 0
                    for (var projectkey in allProjects) {
                        var project = allProjects[projectkey];
                        var types = project.modelsId;
                        // console.log(types);
                        // console.log(alldata.models[modelkey].id);
                        if (types.indexOf(alldata[modelkey].id) != -1) {
                            count++;
                        }
                    }
                    alldata[modelkey].count = count;
                }
                //分组
                for (var key in alldata) {
                    var object = alldata[key];
                    if (object.modelsType == "project") {
                        projectstring = projectstring + this.$JSON5.stringify(object) + ",";
                    }
                    if (object.modelsType == "directory") {
                        directoryString = directoryString + this.$JSON5.stringify(object) + ",";
                    }
                }
                projectstring = projectstring.substring(0, projectstring.length - 1);
                jsonProjectstring = "{project:[" + projectstring + "]}";
                directoryString = directoryString.substring(0, directoryString.length - 1);
                jsonDirectoryString = "{directory:[" + directoryString + "]}";
                // console.log(this.$JSON5.parse(jsonProjectstring));
                // console.log(this.$JSON5.parse(jsonDirectoryString));
                this.DProject = this.$JSON5.parse(jsonProjectstring);
                this.DDirectory = this.$JSON5.parse(jsonDirectoryString);
                this.projects = this.db.get("project").value();
            },

            addDirectoryOP(){
                this.dialogVisible2 = true;
            },
            //提交添加目录
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addDirectory(formName);
                    } else {
                        console.log('输入有误，请确认无误后再提交!');
                        return false;
                    }
                });
            },
            cancel(formName) {
                this.$refs[formName].resetFields();
                this.dialogVisible2 = false;
            },
            //增加文件夹
            addDirectory(formName){
                let id = this.$Uuidv1();
                let name = this.ruleForm.pName;
                // let modelsType = this.ruleForm.modelsType;
                let newModel = '{"id":"' + id + '" ,"name" :"' + name + '","modelsType":"directory","imgPaht":"","type":"model"}';
                // this.$ipfs.Ipfs.add(newModel,"models");
                this.db.get("models").push(this.$JSON5.parse(newModel)).write();
                this.dialogVisible2 = false,
                        this.getdirectory();
                this.$refs[formName].resetFields();
                //var all = this.$ipfs.Ipfs.selAll("j4M4AoSi522XxNpywfyBahmjzQihc4EegL");
                //console.log(all);
            },

            projectclick(note, event){
                var target = event.currentTarget;
                var index = Number(target.getAttribute("data-index"));
                this.currentProject = index;
                this.currentDirectory = -1;
                this.isDisabled = true;
                this.delobj = note;
                this.notesBytargeId(note);
            },
            directoryclick(note, event){
                var target = event.currentTarget;
                var index = Number(target.getAttribute("data-index"));
                this.currentDirectory = index;
                this.currentProject = -1;
                this.delobj = note;
                // console.log(note);
                this.isDisabled = false;
                this.notesBytargeId(note);
            },
            noteslick(note, event){
                var target = event.currentTarget;
                var index = Number(target.getAttribute("data-index"));
                this.currentNote = index;
                this.delobj = note;
                console.log(note);
                this.isDisabled = false;
            },

            remove(){
                var type = this.delobj.type;
                var id = this.delobj.id;
                if (type == "model") {
                    this.dialogVisibledDirectory = true;
                } else if (type == "project") {
                    this.dialogVisibledProject = true;
                }
            },
            removeData(){
                var type = this.delobj.type;
                var id = this.delobj.id;
                if (type == "model") {
                    var projects = this.db.get("project").value();
                    this.db.get("models").remove({id: id}).write();
                    for (var project in projects) {
                        var index = projects[project].modelsId.indexOf(id);
                        if (index > -1) {
                            //删除modelsId数组中指定位置的项
                            projects[project].modelsId.splice(index, 1);
                        }
                        ;
                    }
                    this.isDisabled = true;
                    this.dialogVisibledDirectory = false;
                } else if (type == "project") {
                    this.db.get("project").remove({id: id}).write();
                    this.isDisabled = true;
                    this.dialogVisibledProject = false;
                }
                this.getdirectory();
            },
            //点击目录生成projects列表
            notesBytargeId(obj){
                var id = obj.id;
                var projectArray = new Array();
                var projects = this.db.get("project").value();
                for (var key in projects) {
                    let models = projects[key].modelsId;
                    if (models.indexOf(id) != -1) {
                        projectArray.push(projects[key]);
                    }
                }
                this.projects = projectArray;
            },
            //启动加载
            async initialize(){
                var loginObj = this.$JSON5.parse(sessionStorage.getItem("userkeyObj"));
               // var address = loginObj.address;
                var address ="j4M4AoSi522XxNpywfyBahmjzQihc4EegL";
                var db_name = "db_" + address;
                var localdata = localStorage.getItem(db_name);
                var adapter = new LocalStorage(db_name);
                this.db = low(adapter);
                if (localdata != null) {
                    this.db.defaults(localdata).write();
                    this.localData = localdata;
                    console.log(111);
                    // let transaction = await this.$myIpfs.write(localdata, userJID, userSecret, operatorJID, operatorSecret);
                    // await this.$myIpfs.tra(transaction);//判断同步是否完成
                    // this.alldata=this.$JSON5.parse(localStorage.getItem("db_name"));
                } else {
                    console.log(222);
                    //初始化新数据
                    var varsion = new Date().valueOf();
                    let profiles = {
                        name: loginObj.name,
                        address: address,
                    }
                    var newdata = this.$JSON5.parse('{"version":"' + varsion + '","profiles":"'+ this.$JSON5.stringify(profiles) + '","project":[],"models":[{"id":"sy","name":"所有项目","modelsType":"project","type":"model","imgPaht":""}, {"id":"scj","name":"收藏夹","modelsType":"project","type":"model","imgPaht":""}, {"id":"mm","name":"密码","modelsType":"project","type":"model","imgPaht":""}, {"id":"mb","name":"模板","modelsType":"project","type":"model","imgPaht":""}, {"id":"wbj","name":"未标记","modelsType":"project","type":"model","imgPaht":""}, {"id":"06","name":"家人账号","modelsType":"directory","type":"model","imgPaht":""}, {"id":"07","name":"私人账号","modelsType":"directory","type":"model","imgPaht":""}]}');
                    console.log(newdata);
                    this.db.defaults(newdata).write();
                    this.localData = newdata;
                    //console.log(this.localData);
                    // let transaction = await this.$myIpfs.write(newdata, userJID, userSecret, operatorJID, operatorSecret);
                    // await this.$myIpfs.tra(transaction);//判断同步是否完成
                }
                //先删除
                //this.db.unset("project").write();
                //this.db.unset("models").write();
                //localStorage.removeItem(db_name);
                //console.log(localStorage.getItem(db_name));
                //console.log(localStorage.getItem(db_name));
                // this.db.get("project").remove().write();
                // this.db.get("models").remove().write();
            },

            //手动同步。
            async synchronization() {
                var loginObj = sessionStorage.getItem("userkeyObj");
                let userJID = "j4M4AoSi522XxNpywfyBahmjzQihc4EegL";
                //let userSecret = loginObj.secret;
                let userSecret="sa9UcyBBD3A3JU3Ux3ZKcbNCxVw9h";
                let letoperatorJID = this.operatorJID;//运营商钱包地址
                let operatorSecret = this.operatorSecret; //运营商密钥
                // let bal = loginObj.bal;//这个值从sessionStorage中取默认为false：未被激活
                let bal=true;
                // let localData = this.localData;//本地数据
                if (!bal) {//未被激活时，判断用户钱包地址是否激活
                    this.$notify.error({
                        title: '注意',
                        message: '请先去官网激活您的钱包！'
                    });
                } else {
                    //读取IPFS中数据
                    let ipfsData = await this.$myIpfs.read(userJID, userSecret);
                    //console.log(ipfsData);
                    if (ipfsData != null) {//ipfs 有数据
                        if (ipfsData.version > this.localData.version) {//version越大 内容越新
                            localData = ipfsData;
                        } else if (ipfsData.version < this.localData.version) {
                            console.log(JSON.stringify(this.localData));
                            let transaction = await this.$myIpfs.write(JSON.stringify(this.localData), userJID, userSecret, letoperatorJID, operatorSecret);
                            this.processShow=true;
                            this.percentage = 50;
                            if (await this.$myIpfs.tra(transaction) == "success") {
                               this.percentage = 100;
                               this.synStatus="success";
                                // alert("数据同步成功！");
                            }
                        }
                    } else {
                        //ipfs 没有数据
                        let transaction = await this.$myIpfs.write(this.localData, userJID, userSecret, operatorJID, operatorSecret);
                        this.processShow=true;
                        this.percentage = 50;
                        if (await this.$myIpfs.tra(transaction) == "success") {
                            this.percentage = 100;
                        }
                    }
                }
            }
        }
    }

</script>
<style>
    @import './css/base.css';
    @import './css/sy.css';

    .el-dialog {
        border-radius: 10px;
    }
</style>