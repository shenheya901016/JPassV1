<template>
    <div id="main" style="width:100%;">
        <div style="margin-left:5px;width:150px;">
            <a href="#">
                <img src="../../img/logo.png" alt="" style="width:150px;">
            </a>
        </div>
        <div style="width:30%;margin:0 auto;border-radius:10px; box-shadow: 0 0 7px 1px #c5c5c5;border:1px solid white;margin-top:5%">
            <div style="width:100%;height:20%;border-radius:10px 10px 0 0;font-size:20px;margin-top:50px">
                登录jpass
            </div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
                     style="width:75%; margin:10% 20% 5% 10%;">
                <el-form-item label="用户名称" prop="name">
                    <el-select placeholder="请选择登录用户" v-model="ruleForm.name" title="请选择登录用户，如果下拉框无数据，请先注册用户或导入已有钱包！"
                               style="width:100%;">
                        <el-option v-for="item in names" :key="item.value" :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户密码" prop="password" style="margin-top:10%">
                    <el-input type="password" v-model="ruleForm.password" style="width:100%;"></el-input>
                </el-form-item>
                <el-form-item label="" prop="">
                    <el-button type="primary" style="width:90%;" @click="submitForm('ruleForm')">登录</el-button>
                </el-form-item>
            </el-form>
            <div style="margin-bottom:4%;">
                <button class="bottom" @click="register">注册</button>
                <button class="bottom" @click="dialogVisible = true">导入钱包</button>
            </div>
            <el-dialog title="导入方式选择" :visible.sync="dialogVisible" width="30%">
                <el-button type="primary" style="width:30%;" @click="importwallet(0)">密钥导入</el-button>
                <el-button type="primary" style="width:30%;" @click="importwallet(1)">keystore</el-button>
                <el-button type="primary" style="width:30%;" @click="importwallet(2)">助记词导入</el-button>
            </el-dialog>
            <vue-canvas-nest :config="{color:'255,0,0', count:100}" :el="'#main'"></vue-canvas-nest>
        </div>
    </div>
</template>

<script type="es6">
    import vueCanvasNest from 'vue-canvas-nest';
    export default {
        components: {
            vueCanvasNest
        },
        data() {
            return {
                dialogVisible: false,
                names: [],
                operatorJID: "jHDbFiFZ6rfDjhfRnhD1ReCwY2erhpiYBS",//运营商钱包地址
                operatorSecret: "ssxWidEVcs6bCtsVbfd7gMXUoRfMW",//运营商密钥
                ruleForm: {
                    name: '',
                    password: '',
                },
                rules: {
                    name: [
                        {required: true, message: '请选择登录用户，如果下拉框无数据，请先注册用户或导入已有钱包！', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入用户密码', trigger: 'blur'},
                        {min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur'}
                    ]
                }
            };
        },
        async mounted(){
            //select 数据生成
            var names = localStorage.getItem("name_string");
            if (names != null) {
                var nameArray = names.split(",");
                nameArray.pop();//删除最后一项（最后一个项为空）
                this.names = nameArray.map(item => {
                    return {value: item, label: item};
                });
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.login();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            register(){
                this.$router.push('/jpass/register');
            },
            importwallet(type){
                if (type == 0) {
                    this.$router.push('/jpass/keyimport');
                }
                if (type == 1) {
                    this.$router.push('/jpass/keystoreimport');
                }
                if (type == 2) {
                    this.$router.push('/jpass/mnemonicimport');
                }
            },
            login() {
                this.$router.push('/index');
            },
            async  login(){
                let secret = "";
                let wallet = new this.$JINGCHUANGWallet();
                let keyStoreString = localStorage.getItem(this.ruleForm.name);
                let objKeyStore = this.$JSON5.parse(keyStoreString);
                let keystring = "";
                let bal=""
                if (keyStoreString != null) {
                    try {
                        //钱包生成密钥
                        wallet.setJingchangWallet(objKeyStore);
                        var address = objKeyStore.wallets[0].address;
                        keystring = wallet.getSecretWithAddress(this.ruleForm.password, address);
                        await keystring.then(function (value) {
                            secret = value;
                        });
                    } catch (e) {
                        this.$message.error("密码有误，请重新输入！");
                        return false;
                    }
                    // if(await this.$myIpfs.bal("j4M4AoSi522XxNpywfyBahmjzQihc4EegL") === "success"){
                   // if(await this.$myIpfs.bal(objKeyStore.wallets[0].address) === "success"){
                   //      await this.$myIpfs.initll( objKeyStore.wallets[0].address, secret,this.operatorJID,this.operatorSecret);
                   //      bal=true;
                   //  }else{
                   //      bal=false;
                   //  }
                    bal=true;
                    let userkeyObj = {
                        name:this.ruleForm.name,
                        secret: secret,
                        address: objKeyStore.wallets[0].address,
                        lock:false,//是否锁定
                        bal:bal,
                    }
                    sessionStorage.setItem("userkeyObj", this.$JSON5.stringify(userkeyObj));
                    //this.$message.success("用户登录成功！");
                    this.$router.push('/jpass/main');
                } else {
                    this.$message.error("用户不存在，请重新输入");
                }
            },
        }
    }
</script>

<style>
    .bottom {
        display: inline-block;
        width: 20%;
        height: 20px;
        line-height: 20px;
        color: #1989FA;
        border: 0px;
        background: none;
    }

    .bottomalert {
        border: 0px;
        background: #1989FA;
        border-radius: 4px;
        color: #fff;
        width: 90px;
        height: 35px;
        display: inline-block;
        margin-right: 30px;
        margin-top: 34px;
    }
</style>
