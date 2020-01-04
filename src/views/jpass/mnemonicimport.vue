<template>
    <div style="width:100%;" id="main">
        <div style="margin:30px auto;width:150px;">
            <a href="#">
                <img src="../../img/logo.png" alt="" style="width:150px;">
            </a>
        </div>
        <div style="width:50%;box-shadow: 0 0 7px 1px #c5c5c5;border:1px solid white;margin:2% auto;border-radius:10px;">
            <div style="width:100%;height:20%;border-radius:10px 10px 0 0;font-size:20px;margin-top:50px">
                {{$t('mnemonicimport.importmnemonic')}}
            </div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="8vw" class="demo-ruleForm"
                     style="width:80%; margin:10% 20% 10% 10%">
                <el-form-item :label="$t('mnemonicimport.enterMnemonic')" prop="mnemonic">
                    <el-input v-model="ruleForm.mnemonic" style="width:95%;float: left"></el-input>
                </el-form-item>
                <el-form-item :label="$t('mnemonicimport.newUserName')" prop="name">
                    <el-input v-model="ruleForm.name" style="width:95%;float: left"></el-input>
                </el-form-item>
                <el-form-item :label="$t('mnemonicimport.newPassword')" prop="password">
                    <el-input type="password" v-model="ruleForm.password" id="password" @input="pwdLength" style="width:95%;float: left"
                              oncopy="return false" onpaste="return false" show-password></el-input>
                    <img @click="passwordGenerator()" style="width: 5%;" src="./img/钥匙.svg" alt="">
                </el-form-item>
                <el-form-item>
                    <el-progress id="process" :stroke-width="5" :percentage="percentage" :show-text="false" :status="status" style="width:90%;"></el-progress>
                </el-form-item>
                <el-form-item :label="$t('mnemonicimport.duplicatePassword')" prop="repassword">
                    <el-input type="password" v-model="ruleForm.repassword" style="width:95%;float: left"
                              oncopy="return false" onpaste="return false" show-password></el-input>
                </el-form-item>
                <el-form-item label="" prop="">
                    <el-button type="primary" style="width:40%; " size="small" @click="submitForm('ruleForm')">
                        {{$t('mnemonicimport.importWallet')}}
                    </el-button>
                    <el-button type="primary" style="width:40%;" size="small" @click="toLoginPage">{{$t('mnemonicimport.cancel')}}</el-button>
                </el-form-item>
                <el-dialog :title="$t('mnemonicimport.importSuccessfully')" :visible.sync="dialogVisible" width="30%">
                    <el-button type="primary" size="small" @click="exportkeystore">
                        {{$t('mnemonicimport.keystoreExport')}}
                    </el-button>
                    <el-button type="primary" size="small" @click="toMainPage">{{$t('keystoreImport.login')}}</el-button>
                </el-dialog>
            </el-form>
        </div>
        <vue-canvas-nest :config="{color:'255,0,0', count:100}" :el="'#main'"></vue-canvas-nest>

        <!--密码生成器-->
        <el-dialog title="密码生成器" :visible.sync="dialogVisiblePasswordGenerator" width="40%"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false" :show-close="true" @closed="clearPass">
            <el-input v-model="crypt"></el-input>
            <el-progress  :show-text="false" :stroke-width="5" :percentage="percentage" style="margin-top: 1%;" :status="status"></el-progress>
            <div style="display: block;height:3vh;">{{level}}</div>
            <el-slider  :step="1" :max="20" show-stops v-model="value2"></el-slider>
            <el-radio-group v-model="radio">
                <el-radio :label="1">便于记忆</el-radio>
                <el-radio :label="2">仅字母和数字</el-radio>
                <el-radio :label="3">完全随机</el-radio>
                <el-radio :label="4">仅允许数字</el-radio>
            </el-radio-group>
            <br>
            <el-button style="margin-top: 5%" size="small" type="primary" @click="module()">
                {{$t('main.okFormat')}}
            </el-button>
            <el-button size="small" @click="dialogVisiblePasswordGenerator = false">{{$t('main.cancelFormat')}}
            </el-button>
        </el-dialog>
    </div>
</template>

<script type="es6">
    import vueCanvasNest from 'vue-canvas-nest';
    import password from '../../password.js';

    export default {
        components: {
            vueCanvasNest
        },
        data() {
            var validateName = (rule, value, callback) => {
                var nameString = localStorage.getItem("name_string");
                if (nameString != null) {
                    var nameArray = nameString.split(",");
                    if (nameArray.indexOf(value) >= 0) {
                        callback(new Error(this.$t('mnemonicimport.userNameDuplicate')));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            var validateRepassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(this.$t('mnemonicimport.enterPasswordAgain')));
                } else if (value !== this.ruleForm.password) {
                    callback(new Error(this.$t('mnemonicimport.inputPasswordsError')));
                } else {
                    callback();
                }
            };
            return {
                //密码器
                crypt: "",
                level: "",
                radio: 3,
                value2: 0, //系统设置配置项
                dialogVisiblePasswordGenerator: false,// 密码生成器弹出框

                dialogVisible: false,
                percentage: 0,
                status: "exception",
                ruleForm: {
                    mnemonic: '',
                    name: '',
                    password: '',
                    keystore: '',
                    repassword: '',
                },
                rules: {
                    mnemonic: [
                        {required: true, message: this.$t('mnemonicimport.PleaseEnter12Mnemonics'), trigger: 'blur'},
                        // { min: 12, max:20, message: '长度在 12 到 24 个字符', trigger: 'blur' }
                    ],
                    name: [
                        {required: true, message: this.$t('mnemonicimport.inputUserName'), trigger: 'blur'},
                        {
                            min: 3,
                            max: 20,
                            message: this.$t('mnemonicimport.lengthBetween3and20Characters'),
                            trigger: 'blur'
                        },
                        {validator: validateName, trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: this.$t('mnemonicimport.inputPassword'), trigger: 'blur'},
                        {
                            min: 4,
                            max: 20,
                            message: this.$t('mnemonicimport.lengthBetween4and20Characters'),
                            trigger: 'blur'
                        }
                    ],
                    repassword: [
                        {
                            required: true,
                            message: this.$t('mnemonicimport.pleaseEnterUserPasswordAgain'),
                            trigger: 'blur'
                        },
                        {validator: validateRepassword, trigger: 'blur'}
                    ],
                }
            };
        },watch: {  //密码生成器自动生成
            'value2': function(){
                this.crypt = this.$createPassword.genCrypt(this.radio, this.value2);
                this.level = this.$createPassword.cryptLevel(this.crypt);
                if (this.level.indexOf("世纪") !== -1) {
                    this.percentage = 100;
                    this.status="success";
                } else if (this.level.indexOf("年") !== -1) {
                    this.percentage = 80;
                    this.status="";
                } else if (this.level.indexOf("月") !== -1) {
                    this.percentage = 60;
                    this.status="warning"
                } else if (this.level.indexOf("周") !== -1) {
                    this.percentage = 40;
                    this.status="warning"
                } else if (this.level.indexOf("天") !== -1 ||this.level.indexOf("分") !== -1 || this.level.indexOf("秒") !== -1) {
                    this.percentage = 20;
                    this.status="exception"
                } else if(this.level.indexOf("瞬间") !== -1 && this.value2!=""){
                    this.percentage =10;
                    this.status="exception";
                }else{
                    this.percentage =0;
                    this.level="";
                }
            }
        },
        methods: {
            toLoginPage(){
                this.$router.push('/jpass/login');
            },submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.mnemonicImport();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            async mnemonicImport() {
                var keystore = "";
                var mnemonic = this.ruleForm.mnemonic;
                //先去掉所有空格
                mnemonic = mnemonic.replace(/\s+/g, "");
                //加上空格
                mnemonic = mnemonic.split("").join(" ");
                try {
                    var seed = this.$JPassUtil.Mnemonic.wordsToEntropy(mnemonic, this.$i18n.locale);
                    var jtWallet = this.$JPassUtil.Wallet.generateWallet(seed);
                } catch (e) {
                    this.$message.error(this.$t('mnemonicimport.mnemonicError'));
                    return false;
                }
                try {
                    //生成井昌钱包
                    var jingchuangWallet = this.$JCCWallet.JingchangWallet.generate(this.ruleForm.password, jtWallet.secret);
                    await jingchuangWallet.then(function (value) {
                        keystore = value;
                    });
                    //this.ruleForm.keystore=keystore;
                } catch (e) {
                    this.$message.error(this.$t('mnemonicimport.keystoreGeneratedError'));
                    return false;
                }
                try {
                    this.addToLocalStorage(this.ruleForm.name, keystore);
                    this.dialogVisible = true;
                } catch (e) {
                    this.$message.error(this.$t('mnemonicimport.localStorageFailed'));
                    return false;
                }
            },
            pwdLength() {
                var pwd = this.ruleForm.password;
                password.pwStrength(pwd);
                this.percentage = password.percentage;
                this.status = password.status;
            },
            //导出keystore 文件
            exportkeystore() {
                var content = this.ruleForm.keystore;
                var keystoreString = this.$JSON5.stringify(content);
                var FileSaver = require('file-saver');
                var blob = new Blob([keystoreString], {type: "text/plain;charset=utf-8"});
                saveAs(blob, "keystore");
            },
            addToLocalStorage(name, keystore) {
                var nameString = localStorage.getItem("name_string");
                if (nameString != null) {
                    localStorage.setItem(name, this.$JSON5.stringify(keystore));
                    nameString = nameString + name + ",";
                    localStorage.removeItem("name_string");
                    localStorage.setItem("name_string", nameString)
                } else {
                    var nameString = "";
                    nameString = name + ",";
                    localStorage.setItem("name_string", nameString);
                    localStorage.setItem(name, this.$JSON5.stringify(keystore));
                }
            },
            //密码
            module() {
                this.ruleForm.password = this.crypt;
                this.ruleForm.repassword = this.crypt;
                this.crypt = "";
                this.dialogVisiblePasswordGenerator = false;
            },passwordGenerator() {
                this.percentage = 0;
                this.dialogVisiblePasswordGenerator = true;
            },
            async toMainPage() {
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
                        this.$message.error(this.$t('login.pwderror'));
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
                    this.$message.error(this.$t('login.loginerror'));
                }
            },
            clearPass(){
                this.value2=0;
                this.level="";
            }
        }
    }
</script>
