<template>
    <div style="width:100%;" id="main">
        <div style="margin:30px auto;width:150px;">
          <a href="#">
              <img src="../../img/logo.png" alt="" style="width:150px;">
          </a>
      </div>
   <div style="width:50%;box-shadow: 0 0 7px 1px #c5c5c5;border:1px solid white;margin:2% auto;border-radius:10px;">
    <div style="width:100%;height:20%;border-radius:10px 10px 0 0;font-size:20px;margin-top:50px">
        {{$t('keyImport.walletKeyImport')}}
            </div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="8vw" class="demo-ruleForm" style="width:70%; margin:10% 20% 10% 10%">
                <el-form-item :label="$t('keyImport.walletKey')" prop="secret">
                    <el-input v-model="ruleForm.secret" style="width:95%;float: left"></el-input>
                </el-form-item>
                <el-form-item :label="$t('keyImport.newUserName')" prop="name">
                    <el-input v-model="ruleForm.name" style="width:95%;float: left"></el-input>
                </el-form-item>
                <el-form-item :label="$t('keyImport.newPassword')" prop="password">
                    <el-input type="password" v-model="ruleForm.password" style="width:95%;float: left"
                              oncopy="return false" onpaste="return false" show-password></el-input>
                    <img @click="passwordGenerator()" style="width: 5%;" src="./img/钥匙.svg" alt="">
                </el-form-item>
                <!--<el-form-item>-->
                    <!--<el-progress id="process" :stroke-width="5" :percentage="percentage" :show-text="false" :status="status" style="width:95%;float: left"></el-progress>-->
                <!--</el-form-item>-->
                <el-form-item :label="$t('keyImport.passwordRepetition')" prop="repassword">
                    <el-input type="password" v-model="ruleForm.repassword" style="width:95%;float: left"
                              oncopy="return false" onpaste="return false" show-password></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" size="small" style="width:40%;" @click="submitForm('ruleForm')">{{$t('keyImport.importWallet')}}</el-button>
                    <el-button type="primary" size="small" style="width:40%;" @click="toLoginPage">{{$t('keyImport.cancel')}}</el-button>
                </el-form-item>
                <el-dialog :title="$t('keyImport.walletImportedSuccessfully')" :visible.sync="dialogVisible" width="30%">
                    <el-button type="primary" size="small" @click="exportkeystore">{{$t('keyImport.keystoreExport')}}</el-button>
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
            var validateRepassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(this.$t('keyImport.pleaseEnterYourPasswordAgain')));
                } else if (value !== this.ruleForm.password) {
                    callback(new Error(this.$t('keyImport.TwoPasswordsAreInconsistent')));
                } else {
                    callback();
                }
            };
            var validateName = (rule, value, callback) => {
                var nameString = localStorage.getItem("name_string");

                if (nameString != null) {
                    var nameArray = nameString.split(",");
                    if (nameArray.indexOf(value) >= 0) {
                        callback(new Error(this.$t('keyImport.userNameIsDuplicatePleaseEnter')));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            return {
				dialogPasswordGenerator: false,// 密码生成器弹出框
				dialogclose:false,//关闭密码器指示
				
				dialogVisible: false,
                ruleForm: {
                    secret: '',
                    name: '',
                    password: '',
                    keystore: '',
                    repassword: '',
                },
                rules: {
                    secret: [
                        {required: true, message: this.$t('keyImport.pleaseEnterTheWalletKey'), trigger: 'blur'},
                    ],
                    name: [
                        {required: true, message: this.$t('keyImport.pleaseEnterAUserName'), trigger: 'blur'},
                        {min: 3, max: 20, message: this.$t('keyImport.theLengthIsBetween3And20Characters'), trigger: 'blur'},
                        {validator: validateName, trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: this.$t('keyImport.pleaseEnterAUserPassword'), trigger: 'blur'},
                        {min: 4, message: this.$t('keyImport.lengthIsBetween4And20Characters'), trigger: 'blur'}
                    ],
                    repassword: [
                        {required: true, message:  this.$t('keyImport.pleaseEnterTheUserPasswordAgain'), trigger: 'blur'},
                        {validator: validateRepassword, trigger: 'blur'}
                    ],
                }
            };
        },
       
        methods: {
            toLoginPage(){
                this.$router.push('/jpass/login');
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.keyImport();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            async keyImport() {
                var keystore = "";
                try {
                    //生成井昌钱包
                    this.ruleForm.secret = this.ruleForm.secret.replace(/\s+/g, "");//去掉所有空格
                    var jingchuangWallet = this.$JCCWallet.JingchangWallet.generate(this.ruleForm.password, this.ruleForm.secret);
                    await jingchuangWallet.then(function (value) {
                        keystore = value;
                    });
                    this.ruleForm.keystore = keystore;
                    // console.log("新keystore:"+this.$JSON5.stringify(this.ruleForm.keystore));
                    // console.log("用户名称:"+this.ruleForm.name );
                } catch (e) {
                    this.$message.error(this.$t('keyImport.keyIsWrongPleaseEnter'));
                    return false;
                }
                try {
                    this.addToLocalStorage(this.ruleForm.name, keystore);
                    this.dialogVisible = true;
                } catch (e) {
                    this.$message.error(this.$t('keyImport.localStorageFailed'));
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
            // async toMainPage() {
            //     let secret = "";
            //     let wallet = new this.$JINGCHUANGWallet();
            //     let keyStoreString = localStorage.getItem(this.ruleForm.name);
            //     let objKeyStore = this.$JSON5.parse(keyStoreString);
            //     let keystring = "";
            //     let bal=""
            //     if (keyStoreString != null) {
            //         try {
            //             //钱包生成密钥
            //             wallet.setJingchangWallet(objKeyStore);
            //             var address = objKeyStore.wallets[0].address;
            //             keystring = wallet.getSecretWithAddress(this.ruleForm.password, address);
            //             await keystring.then(function (value) {
            //                 secret = value;
            //             });
            //         } catch (e) {
            //             this.$message.error(this.$t('login.pwderror'));
            //             return false;
            //         }
            //         // if(await this.$myIpfs.bal("j4M4AoSi522XxNpywfyBahmjzQihc4EegL") === "success"){
            //         // if(await this.$myIpfs.bal(objKeyStore.wallets[0].address) === "success"){
            //         //      await this.$myIpfs.initll( objKeyStore.wallets[0].address, secret,this.operatorJID,this.operatorSecret);
            //         //      bal=true;
            //         //  }else{
            //         //      bal=false;
            //         //  }
            //         bal=true;
            //         let userkeyObj = {
            //             name:this.ruleForm.name,
            //             secret: secret,
            //             address: objKeyStore.wallets[0].address,
            //             lock:false,//是否锁定
            //             bal:bal,
            //         }
            //         sessionStorage.setItem("userkeyObj", this.$JSON5.stringify(userkeyObj));
            //         //this.$message.success("用户登录成功！");
            //         this.$router.push('/jpass/main');
            //     } else {
            //         this.$message.error(this.$t('login.loginerror'));
            //     }
            // },
			
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
