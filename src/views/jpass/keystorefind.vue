<template>
   <div style="width:40%;border:1px solid  #51A7FF;margin:0 auto;border-radius:10px;">
    <div style="width:100%;border:1px solid #51A7FF;height:70px;line-height:70px;border-radius:10px 10px 0 0;border:0px;
        background-color: #ECF5FF;vertical-align:middle;margin:auto auto;color:#51A7FF;font-size:25px;">
        keystore文件找回钱包
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="width:70%; margin:10% 20% 10% 10%">
         <el-form-item label="keystore文件" prop="">
               <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                 multiple :limit="1" :on-exceed="handleExceed" accept="text/plain"  :on-change="getkeystore">
               <el-button size="small" type="primary" style="width:340px">上传keysore</el-button>
                </el-upload>
         </el-form-item>
          <el-form-item label="输入密码" prop="password">
               <el-input  type="password"  v-model="ruleForm.password" oncopy="return false" onpaste="return false"></el-input>
          </el-form-item>
         <el-form-item label="钱包地址" prop="">
               <el-input v-model="ruleForm.mnemonicAddress" oncopy="return false" onpaste="return false" readonly="readonly"></el-input>
         </el-form-item>
         <el-form-item label="钱包秘钥" prop="">
                <el-input v-model="ruleForm.mnemonicSecret" oncopy="return false" onpaste="return false" readonly="readonly"></el-input>
         </el-form-item>
       </el-form>
       <div style="margin-bottom:30px">
         <el-button type="primary" plain @click="submitForm('ruleForm')">找回</el-button>
       </div>
    </div>
</template>

<script type="es6">
 export default {
    data() {
      return {
        keystorefile:{},
        ruleForm: {
            mnemonicAddress:'',
            mnemonicSecret:'',
            password:'',
        },
        rules: {
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ],
        }
      };
    },
    methods: {
      submitForm(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                       this.keystoreAnalysis()
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
            handleExceed(files, fileList) {
                    this.$message.warning(`当前限制选择 1个文件，本次选择了 ${files.length} 个文件`);
            },
            //获取keystore文件
            getkeystore(file){
                this.keystorefile=file.raw;
            },
            //解析keystoreAnalysis 文件
            async  keystoreAnalysis(){
                         var fileReade =this.keystorefile;
                         var JSON5 = require('json5');
                         var keyStoreObj="";
                         var wallet = new this.$JINGCHUANGWallet();
                         var secret="";
                         var promiseObj = new Promise(function(resolve, reject) {
                               let reader = new FileReader()
                               reader.readAsText(fileReade)
                               reader.onload = function() {
                                   resolve(this.result)
                                  }
                               });
                          await  promiseObj .then(function(result){
                              keyStoreObj =JSON5.parse(result);
                              //console.log(keyStoreObj);
                           })
                       //生成钱包
                        var address = keyStoreObj.wallets[0].address;
                        var password = this.ruleForm.password;
                        wallet.setJingchangWallet(keyStoreObj);
                        var secret = wallet.getSecretWithAddress(password,address);
                              await secret.then(function (value){
                                   secret=value;
                                   console.log(secret);
                                 });
                                this.ruleForm.mnemonicAddress=address;
                                this.ruleForm.mnemonicSecret=secret;
            }

         }
      }
</script>

<style>


</style>
