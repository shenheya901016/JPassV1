<template>
  <div style="width:100%;" id="main">
    <div style="margin:30px auto;width:150px;">
      <a href="#">
        <img src="../../img/logo.png" alt="" style="width:150px;" />
      </a>
    </div>
    <div
      style="width:50%;box-shadow: 0 0 7px 1px #c5c5c5;border:1px solid white;margin:2% auto;border-radius:10px;"
    >
      <div
        style="width:100%;height:20%;border-radius:10px 10px 0 0;font-size:20px;margin-top:50px"
      >
        {{ $t("keystoreImport.importKeystoreWallet") }}
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="8vw"
        class="demo-ruleForm"
        style="width:70%; margin:10% 20% 10% 10%"
      >
        <el-form-item :label="$t('keystoreImport.keystoreFile')" prop="">
          <el-upload
            class="upload-demo"
            style="text-align: left;"
            action="https://jsonplaceholder.typicode.com/posts/"
            :limit="1"
            :on-exceed="handleExceed"
            accept="text/plain"
            :on-change="getkeystore"
          >
            <el-button type="primary" size="small" style="float: left">
              {{ $t("keystoreImport.uploadKeystore") }}
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item
          :label="$t('keystoreImport.oldLoginPassword')"
          prop="oldPassword"
        >
          <el-input
            type="password"
            v-model="ruleForm.oldPassword"
            oncopy="return false"
            onpaste="return false"
            style="width:95%;float: left"
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('keystoreImport.newUserName')" prop="name">
          <el-input
            type="text"
            v-model="ruleForm.name"
            oncopy="return false"
            onpaste="return false"
            style="width:95%;float: left"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('keystoreImport.newLoginPassword')"
          prop="password"
        >
          <el-input
            type="password"
            v-model="ruleForm.password"
            oncopy="return false"
            onpaste="return false"
            style="width:95%;float: left"
            show-password
          ></el-input>
          <img
            @click="passwordGenerator()"
            style="width: 5%;"
            src="./img/钥匙.svg"
            alt=""
          />
        </el-form-item>
        <el-form-item
          :label="$t('keystoreImport.passwordRepetition')"
          prop="repassword"
        >
          <el-input
            type="password"
            v-model="ruleForm.repassword"
            style="width:95%;float: left"
            oncopy="return false"
            onpaste="return false"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="">
          <el-button
            type="primary"
            size="small"
            style="width:40%"
            @click="submitForm('ruleForm')"
          >
            {{ $t("keystoreImport.importWallet") }}
          </el-button>
          <el-button
            type="primary"
            size="small"
            style="width:40%"
            @click="toLoginPage"
          >
            {{ $t("keystoreImport.cancel") }}
          </el-button>
        </el-form-item>
        <el-dialog
          :title="$t('keystoreImport.walletImportedSuccessfully')"
          :visible.sync="dialogVisible"
          width="40%"
        >
          <el-button type="primary" size="small" @click="exportkeystore">
            {{ $t("keystoreImport.keystoreExport") }}
          </el-button>
          <el-button type="primary" size="small" @click="toMainPage"
            >{{ $t("keystoreImport.login") }}
          </el-button>
        </el-dialog>
      </el-form>
    </div>
    <vue-canvas-nest
      :config="{ color: '255,0,0', count: 100 }"
      :el="'#main'"
    ></vue-canvas-nest>
    <passwordGenerator
      :dialogopen="dialogPasswordGenerator"
      @dialogPasswordGeneratorclose="closedialog"
      @transpassword="getPassword"
      :dialogclose="dialogclose"
      @recoverdialogtag="recovertag"
    ></passwordGenerator>
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
                    callback(new Error(this.$t('keystoreImport.userNameIsDuplicatePleaseEnter')));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        var validateRepassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('keystoreImport.pleaseEnterYourPasswordAgain')));
            } else if (value !== this.ruleForm.password) {
                callback(new Error(this.$t('keystoreImport.twoPasswordsAreInconsistent')));
            } else {
                callback();
            }
        };
        return {
            dialogPasswordGenerator: false,// 密码生成器弹出框
            dialogclose: false,//关闭密码器指示
            dialogVisible: false,
            keystorefile: {},
            ruleForm: {
                mnemonicAddress: '',
                mnemonicSecret: '',
                oldPassword: '',
                password: '',
                secret: '',
                repassword: '',
                keystore: ""
            },
            rules: {
                name: [
                    {required: true, message: this.$t('keystoreImport.pleaseEnterANewUsername'), trigger: 'blur'},
                    {
                        min: 6,
                        max: 20,
                        message: this.$t('keystoreImport.theLengthIsBetween4And20Characters'),
                        trigger: 'blur'
                    },
                    {validator: validateName, trigger: 'blur'}
                ],
                oldPassword: [
                    {required: true, message: this.$t('keystoreImport.pleaseEnterYourPassword'), trigger: 'blur'},

                ],
                password: [
                    {required: true, message: this.$t('keystoreImport.pleaseEnterAUserPassword'), trigger: 'blur'},
                    {
                        min:6,
                        max: 20,
                        message: this.$t('keystoreImport.theLengthIsBetween4And20Characters'),
                        trigger: 'blur'
                    }
                ],
                repassword: [
                    {
                        required: true,
                        message: this.$t('keystoreImport.pleaseEnterTheUserPasswordAgain'),
                        trigger: 'blur'
                    },
                    {validator: validateRepassword, trigger: 'blur'}
                ],
            }
        };
    },

    methods: {
        toLoginPage() {
            this.$router.push('/jpass/login');
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.keystoreAnalysis()
                } else {
                    return false;
                }
            });
        },
        handleExceed(files, fileList) {
            let msg = this.$t('keystoreImport.theCurrentLimitSelects1FileThisTimeSelectedFiles');
            this.$message.warning(msg);
        },
        //获取keystore文件
        getkeystore(file) {
            this.keystorefile = file.raw;
        },
        //解析keystoreAnalysis 文件
        async keystoreAnalysis() {
            var fileReade = this.keystorefile;
            var JSON5 = require('json5');
            var keyStoreObj = "";
            var wallet = new this.$JINGCHUANGWallet();
            var secret = "";
            try {
                var promiseObj = new Promise(function (resolve, reject) {
                    let reader = new FileReader()
                    reader.readAsText(fileReade)
                    reader.onload = function () {
                        resolve(this.result)
                    }
                });
                await promiseObj.then(function (result) {
                    keyStoreObj = JSON5.parse(result);
                })
            } catch (e) {
                this.$message.error(this.$t('keystoreImport.importedKeystoryFilePFailed'));
                return false;
            }

            //生成钱包
            try {
                var address = keyStoreObj.wallets[0].address;
                var password = this.ruleForm.oldPassword;
                wallet.setJingchangWallet(keyStoreObj);
                var secret = wallet.getSecretWithAddress(password, address);
                await secret.then(function (value) {
                    secret = value;
                });
                this.ruleForm.secret = secret;
                this.generateWallet();
            } catch (e) {
                this.$message.error(this.$t('keystoreImport.theKeystoryFileOrPasswordIsIncorrectPleaseEnter'));
                return false;
            }
        },
        //生成井昌钱包
        async generateWallet() {
            var keystore = "";
            try {
                var jingchuangWallet = this.$JCCWallet.JingchangWallet.generate(this.ruleForm.password, this.ruleForm.secret);
                await jingchuangWallet.then(function (value) {
                    keystore = value;
                });
                this.ruleForm.keystore = keystore;
            } catch (e) {
                this.$message.error(this.$t('keystoreImport.newKeystoreGeneratedError'));
                return false;
            }
            try {
                this.addToLocalStorage(this.ruleForm.name, keystore);
                this.dialogVisible = true;
            } catch (e) {
                this.$message.error(this.$t('keystoreImport.localStorageFailed'));
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

        toMainPage() {
            this.$router.push("/jpass/login");
        },

        //打开密码生成器
        passwordGenerator() {
            this.dialogPasswordGenerator = true;
            this.percentage = 0;
        },
        //子组件关闭后还原dialogPasswordGenerator为false
        closedialog(data) {
            this.dialogPasswordGenerator = data;
        },
        //密码器赋值
        getPassword(data) {
            this.ruleForm.password = data;
            this.ruleForm.repassword = data;
            this.dialogclose = true;
        },
        //子组件关闭后还原dialogclose值为false
        recovertag(data) {
            this.dialogclose = data;
        }
    }
}
</script>

<style>
.el-dialog__header {
  padding: 40px 40px 0px;
}
</style>
