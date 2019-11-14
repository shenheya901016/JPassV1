<template>
    <div style="width:100%;" id="main">
        <div style="margin:30px auto;width:150px;">
            <a href="#">
                <img src="../../img/logo.png" alt="" style="width:150px;">
            </a>
        </div>
        <div style="width:40%;box-shadow: 0 0 7px 1px #c5c5c5;border:1px solid white;margin:2% auto;border-radius:10px;">
            <div style="width:100%;height:20%;border-radius:10px 10px 0 0;font-size:20px;margin-top:50px">
                {{$t('mnemonicimport.importmnemonic')}}
            </div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
                     style="width:70%; margin:10% 20% 10% 10%">
                <el-form-item :label="$t('mnemonicimport.enterMnemonic')" prop="mnemonic">
                    <el-input v-model="ruleForm.mnemonic" style="width:90%;"></el-input>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </el-form-item>
                <el-form-item :label="$t('mnemonicimport.newUserName')" prop="name">
                    <el-input v-model="ruleForm.name" style="width:90%;"></el-input>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </el-form-item>
                <el-form-item :label="$t('mnemonicimport.newPassword')" prop="password">
                    <el-input type="password" v-model="ruleForm.password" id="password" @input="pwdLength"
                              style="width:90%;"></el-input>&nbsp;<span
                        class="strong">&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </el-form-item>
                <el-form-item>
                    <el-progress id="process" :stroke-width="5" :percentage="percentage" :show-text="false"
                                 :status="status" style="width:90%;margin-left:3%;"></el-progress>
                </el-form-item>
                <el-form-item :label="$t('mnemonicimport.duplicatePassword')" prop="repassword">
                    <el-input type="password" v-model="ruleForm.repassword" style="width:90%;"></el-input>
                    <span>&nbsp;&nbsp;&nbsp;</span>
                </el-form-item>
                <el-form-item label="" prop="">
                    <el-button type="primary" style="width:40%;" @click="submitForm('ruleForm')">
                        {{$t('mnemonicimport.importWallet')}}
                    </el-button>
                    <el-button type="primary" style="width:40%;float:left" @click="toLoginPage">放弃</el-button>
                </el-form-item>
                <el-dialog :title="$t('mnemonicimport.importSuccessfully')" :visible.sync="dialogVisible" width="30%">
                    <el-button type="primary" size="small" @click="exportkeystore">
                        {{$t('mnemonicimport.keystoreExport')}}
                    </el-button>
                </el-dialog>
            </el-form>
        </div>
        <vue-canvas-nest :config="{color:'255,0,0', count:100}" :el="'#main'"></vue-canvas-nest>
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
                dialogVisible: false,
                percentage: 0,
                status: "exception",
                ruleForm: {
                    mnemonic: '',
                    name: '',
                    password: '',
                    keystore: '',
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
            }
        }
    }
</script>
