<template>
 <div style="width:100%;" id="main"  @mousemove="jpasslock">
    <div style="margin-left:5px;width:150px;">
        <a href="#">
            <img src="../../img/logo.png" alt="" style="width:150px;">
        </a>
    </div>
   <div style="width:30%;border:1px solid white;margin:0 auto;border-radius:10px;margin-top:5%;box-shadow: 0 0 7px 1px #c5c5c5;">
    <div style="width:100%;border-radius:10px 10px 0 0; font-size:20px;margin-top:50px;">
         用户注册
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="width:75%; margin:10% 20% 10% 10%;">
      <el-form-item label="用户名称" prop="name">
        <el-input v-model="ruleForm.name"  style="width:90%;"></el-input><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
      </el-form-item>
       <el-form-item label="用户密码" prop="password">
            <el-input v-model="ruleForm.password"  type="password" @input="pwdLength" style="width:90%;"></el-input>&nbsp;<span id="strong">&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </el-form-item>
         <el-form-item>
            <el-progress id="process"  :stroke-width="5" :percentage="percentage" :show-text="false"  style="width:90%;margin-left:2%;"></el-progress>
         </el-form-item>
         <el-form-item label="密码重复" prop="repassword">
                   <el-input  type="password" v-model="ruleForm.repassword"  style="width:90%;"></el-input><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
         </el-form-item>
          <el-form-item label="" prop="password">
                      <el-button type="primary" style="width:90%;" @click="submitForm('ruleForm')">注册</el-button><span>&nbsp;&nbsp;&nbsp;&nbsp;
                      </span>
          </el-form-item>
       </el-form>
       <div style="margin-bottom:30px">
        <!-- <el-button type="primary"  @click="resetForm('ruleForm')">重置</el-button>-->
         </div>
         </div>
              <vue-canvas-nest :config="{color:'255,0,0', count:100}" :el="'#main'"></vue-canvas-nest>
      </div>
</template>

<script type="es6">
 import vueCanvasNest from 'vue-canvas-nest';
 import password from '../../password.js';
 import LockJpass from '../../lock.js';

 export default {
     mounted:function(){
         LockJpass.StartPoint();
     },
     components:{
         vueCanvasNest
     },
    data() {
      var validateRepassword = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.ruleForm.password) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };

        var validateName =  (rule, value, callback)=>{
            var nameString=localStorage.getItem("name_string");
            if(nameString!=null){
                var nameArray=nameString.split(",");
                if(nameArray.indexOf(value)>=0){
                    callback(new Error('用户名重复，请重新输入'));
                }else{
                    callback();
                }
            }else{
                callback();
            }
        }
      return {
        //进度条值
        percentage:0,
        ruleForm: {
            name: '',
            password:'',
            address:'',
            secret:'',
            mnemonic:'',
            keystore:'',
        },
        rules: {
          name: [
            { required: true, message: '请输入用户名称', trigger: 'blur' },
            { min: 3, max:20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
            {validator:  validateName,  trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入用户密码', trigger: 'blur' },
            { min: 4, max:20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
          ],
          repassword: [
              {required:true, message: '请再次输入用户密码',trigger: 'blur' },
              {validator: validateRepassword,  trigger: 'blur' }
          ],
        }
      };
    },
    methods: {
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
        this.percentage=0;
        document.getElementById("strong").style.color="#EBEEF5"
        document.getElementById("strong").innerText="无";
      },
       async  register(){
                       //助记词生成钱包
                       try{
                           var mnemonic =this.$JPassUtil.Mnemonic.createMnemonic(12, this.$i18n.locale)
                           var seed =  this.$JPassUtil.Mnemonic.wordsToEntropy(mnemonic,this.$i18n.locale);
                           var jtWallet = this.$JPassUtil.Wallet.generateWallet(seed);
                       }catch (e){
                           this.$message.error("钱包生成失败！");
                           return false;
                       }
                       try{
                           var keystore="";
                           //生成井昌钱包
                           var jingchuangWallet = this.$JCCWallet.JingchangWallet.generate(this.ruleForm.password,jtWallet.secret);
                           await  jingchuangWallet.then(function (value) {
                               keystore= value;
                           });
                       }catch (e){
                           this.$message.error("keystore生成失败！");
                           return false;
                       }
                        try{
                            this.addToLocalStorage(this.ruleForm.name,keystore);
                            this.addToSessionStorage();
                            this.$router.push({ name:"registersuccess",  params:{secret:jtWallet.secret,mnemonic:mnemonic,address:jtWallet.address}});
                        }catch (e){
                            this.$message.error("本地存储失败！");
                            return false;
                        }
                },
                pwdLength(){
                    var pwd= this.ruleForm.password;
                    password.pwStrength(pwd);
                    this.percentage=password.percentage;
                },
                 addToLocalStorage(name,keystore){
                     var nameString= localStorage.getItem("name_string");
                     if(nameString!=null){
                         localStorage.setItem(name,this.$JSON5.stringify(keystore));
                         nameString=nameString+name+",";
                         localStorage.removeItem("name_string");
                         localStorage.setItem("name_string",nameString)
                     }else{
                         var nameString ="";
                         nameString=name+",";
                         localStorage.setItem("name_string",nameString);
                         localStorage.setItem(name,this.$JSON5.stringify(keystore));
                     }
                 },
                   addToSessionStorage(){
                       let userObj = {
                           name: this.ruleForm.name,
                       }
                       sessionStorage.setItem("userObj", this.$JSON5.stringify(userObj));
                   },
                  jpasslock(event){
                      LockJpass.GetXYPosition(event);
                  },
             }
        }
</script>

<style>


</style>
