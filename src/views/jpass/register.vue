<template>
  <div style="width:100%;" id="main">
    <div style="margin:30px auto;width:150px;">
      <a href="#">
        <img src="../../img/logo.png" alt="" style="width:150px;" />
      </a>
    </div>
    <div
      style="width:40%;border:1px solid white;margin:2% auto;border-radius:10px;box-shadow: 0 0 7px 1px #c5c5c5;"
    >
      <div
        style="width:100%;border-radius:10px 10px 0 0; font-size:20px;margin-top:50px;"
      >
        {{ $t("register.title") }}
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="8vw"
        class="demo-ruleForm"
        style="width:75%; margin:10% 20% 10% 10%;"
      >
        <el-form-item :label="$t('register.name')" prop="name">
          <el-input
            v-model="ruleForm.name"
            style="width:95%;float: left"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('register.password')" prop="password">
          <el-input
            v-model="ruleForm.password"
            type="password"
            style="width:95%;float: left"
            oncopy="return false"
            onpaste="return false"
            show-password
          ></el-input>
          <img
            @click="passwordGenerator()"
            style="width:5%;"
            src="./img/钥匙.svg"
            alt=""
          />
        </el-form-item>
        <!--<el-form-item>-->
        <!--<el-progress id="process" :stroke-width="5" :percentage="percentage" :show-text="false" :status="status" style="width:70%;"></el-progress>-->
        <!--</el-form-item>-->
        <el-form-item
          :label="$t('register.duplicatePassword')"
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
        <el-form-item label="" prop="password">
          <el-button
            type="primary"
            size="small"
            style="width:35%;"
            @click="submitForm('ruleForm')"
            >{{ $t("register.register") }}
          </el-button>
          <el-button
            type="primary"
            size="small"
            style="width:35%;"
            @click="toLoginPage"
            >{{ $t("register.cancel") }}</el-button
          >
        </el-form-item>
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
        var validateRepassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('register.repassword')));
            } else if (value !== this.ruleForm.password) {
                callback(new Error(this.$t('register.samepwd')));
            } else {
                callback();
            }
        };
        var validateName = (rule, value, callback) => {
            var nameString = localStorage.getItem("name_string");
            if (nameString != null) {
                var nameArray = nameString.split(",");
                if (nameArray.indexOf(value) >= 0) {
                    callback(new Error(this.$t('register.uservalidaion')));
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
            ruleForm: {
                name: '',
                password: '',
                address: '',
                secret: '',
                mnemonic: '',
                keystore: '',
                repassword: '',
            },
            rules: {
                name: [
                    {required: true, message: this.$t('register.ruleuser'), trigger: 'blur'},
                    {min: 3, max: 20, message: this.$t('register.ruleuserLength'), trigger: 'blur'},
                    {validator: validateName, trigger: 'blur'}
                ],
                password: [
                    {required: true, message: this.$t('register.pleaseEnterUserPassword'), trigger: 'blur'},
                    {min: 4,  message: this.$t('register.lengthCharacters'), trigger: 'blur'}
                ],
                repassword: [
                    {required: true, message: this.$t('register.pleaseEnterUserPasswordAgain'), trigger: 'blur'},
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
                    this.register();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.percentage = 0;
            document.getElementById("strong").style.color = "#EBEEF5"
            document.getElementById("strong").innerText = this.$t('register.no');
        },
        async register() {
            //助记词生成钱包
            try {
                var mnemonic = this.$JPassUtil.Mnemonic.createMnemonic(12, this.$i18n.locale)
                var seed = this.$JPassUtil.Mnemonic.wordsToEntropy(mnemonic, this.$i18n.locale);
                var jtWallet = this.$JPassUtil.Wallet.generateWallet(seed);
            } catch (e) {
                this.$message.error( this.$t('register.walletGenerationFailed'));
                return false;
            }
            try {
                var keystore = "";
                //生成井昌钱包
                var jingchuangWallet = this.$JCCWallet.JingchangWallet.generate(this.ruleForm.password, jtWallet.secret);
                await jingchuangWallet.then(function (value) {
                    keystore = value;
                });
            } catch (e) {
                this.$message.error( this.$t('register.keystoreGenerationFailed'));
                return false;
            }
            try {
                this.addToLocalStorage(this.ruleForm.name, keystore);
                this.addToSessionStorage();
                this.$router.push({
                    name: "registersuccess",
                    params: {
                        name: this.ruleForm.name,
                        secret: jtWallet.secret,
                        mnemonic: mnemonic,
                        address: jtWallet.address,
                        password:this.ruleForm.password
                    }
                });
            } catch (e) {
                this.$message.error( this.$t('register.localStorageFailed'));
                return false;
            }
        },
        addToLocalStorage(name, keystore) {
            var nameString = localStorage.getItem("name_string");
            if (nameString != null) {
                localStorage.setItem(name, this.$JSON5.stringify(keystore));
                nameString = nameString + name + ",";
                localStorage.removeItem("name_string");
                localStorage.setItem("name_string", nameString)
            } else {
                nameString = "";
                nameString = name + ",";
                localStorage.setItem("name_string", nameString);
                localStorage.setItem(name, this.$JSON5.stringify(keystore));
            }
        },
        addToSessionStorage() {
            let userObj = {
                name: this.ruleForm.name,
            }
            sessionStorage.setItem("userObj", this.$JSON5.stringify(userObj));
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

<style></style>
