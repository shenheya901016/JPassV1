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
                    <el-input type="password" v-model="ruleForm.password" id="password" style="width:95%;float: left"
                              oncopy="return false" onpaste="return false" show-password></el-input>
                    <img @click="passwordGenerator()" style="width: 5%;" src="./img/钥匙.svg" alt="">
                </el-form-item>
               <!-- <el-form-item>
                    <el-progress id="process" :stroke-width="5" :percentage="percentage" :show-text="false" :status="status" style="width:90%;"></el-progress>
                </el-form-item> -->
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
                <el-dialog :title="$t('mnemonicimport.importSuccessfully')" :visible.sync="dialogVisible" width="40%">
                    <el-button type="primary" size="small" @click="exportkeystore">
                        {{$t('mnemonicimport.keystoreExport')}}
                    </el-button>
                    <el-button type="primary" size="small" @click="toMainPage">{{$t('keystoreImport.login')}}</el-button>
                </el-dialog>
            </el-form>
        </div>
        <vue-canvas-nest :config="{color:'255,0,0', count:100}" :el="'#main'"></vue-canvas-nest>

        <!--密码生成器-->
       <passwordGenerator :dialogopen="dialogPasswordGenerator" @dialogPasswordGeneratorclose="closedialog"
       @transpassword="getPassword" :dialogclose="dialogclose"  @recoverdialogtag="recovertag"></passwordGenerator>
    </div>
</template>

<script type="es6">
    export default {
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
                dialogPasswordGenerator: false,// 密码生成器弹出框
			    dialogclose:false,//关闭密码器指示
                dialogVisible: false,
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
                            min: 6,
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
                    this.ruleForm.keystore=keystore;
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

             
             toMainPage(){
                  this.$router.push('/jpass/login');
             },
            //打开密码生成器
            passwordGenerator() {
               this.dialogPasswordGenerator = true;
               this.percentage = 0;
            },
            //子组件关闭后还原dialogPasswordGenerator为false
            closedialog(data){
            	this.dialogPasswordGenerator=data;
            },
            //密码器赋值
            getPassword(data){
            	this.ruleForm.password = data;
            	this.ruleForm.repassword= data;
            	this.dialogclose=true;
            },
            //子组件关闭后还原dialogclose值为false
            recovertag(data){
            	this.dialogclose=data;
            }
        }
    }
</script>

   
<style>
/* .el-dialog__title {
    line-height: 24px;
    font-size: 15px;
    color: #303133;   
} */

.el-dialog__header {
    padding: 40px 40px 0px;
}  

</style> 
