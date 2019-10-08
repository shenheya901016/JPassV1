<template>
 <div style="width:100%;"id="main">
      <div style="margin-left:5px;width:150px;">
          <a href="#">
              <img src="../../img/logo.png" alt="" style="width:150px;">
          </a>
      </div>
   <div style="width:40%;box-shadow: 0 0 7px 1px #c5c5c5;border:1px solid white;margin:0 auto;border-radius:10px;">
    <div style="width:100%;height:20%;border-radius:10px 10px 0 0;font-size:20px;margin-top:50px">
         钱包密钥导入
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="width:70%; margin:10% 20% 10% 10%">
      <el-form-item label="钱包密钥" prop="secret">
        <el-input v-model="ruleForm.secret" style="width:90%;" ></el-input><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
      </el-form-item>
       <el-form-item label="新用户名称" prop="name">
              <el-input v-model="ruleForm.name"  style="width:90%;"></el-input><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
       </el-form-item>
       <el-form-item label="新密码" prop="password">
              <el-input type="password" v-model="ruleForm.password"  @input="pwdLength"  style="width:90%;"></el-input>&nbsp;<span
               id="strong">&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </el-form-item>
        <el-form-item>
               <el-progress id="process"  :stroke-width="5" :percentage="percentage" :show-text="false"  style="width:90%;margin-left:3%;"></el-progress>
        </el-form-item>
         <el-form-item label="密码重复" prop="repassword">
              <el-input type="password" v-model="ruleForm.repassword"  style="width:90%;"></el-input><span>&nbsp;&nbsp;&nbsp;</span>
         </el-form-item>
         <el-form-item label="" >
              <el-button type="primary"  style="width:90%;"  @click="submitForm('ruleForm')">导入钱包</el-button>
         </el-form-item>
           <el-dialog title="钱包导入成功，keystore 文件已经更新，请及时下载并妥善保管！" :visible.sync="dialogVisible" width="30%" >
                      <el-button type="primary"  size="small" @click="exportkeystore">keystore导出</el-button>
           </el-dialog>
       </el-form>
       <vue-canvas-nest :config="{color:'255,0,0', count:100}" :el="'#main'"></vue-canvas-nest>
    </div>

 </div>
</template>

<script type="es6">
  import vueCanvasNest from 'vue-canvas-nest';
  import password from '../../password.js';
 export default {
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
            console.log(nameString);
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
        };
      return {
       //进度条值
        percentage:0,
        dialogVisible: false,
        ruleForm: {
            secret:'',
            name:'',
            password:'',
            keystore:'',
        },
        rules: {
          secret: [
             { required: true, message: '请输入钱包密钥', trigger: 'blur' },
          ],
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
               this.keyImport();
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
      async keyImport(){
                var keystore ="";
                try{
                  //生成井昌钱包
                   this.ruleForm.secret=this.ruleForm.secret.replace(/\s+/g,"");//去掉所有空格
                   var jingchuangWallet = this.$JCCWallet.JingchangWallet.generate(this.ruleForm.password,this.ruleForm.secret);
                    await  jingchuangWallet.then(function (value) {
                           keystore= value;
                      });
                    this.ruleForm.keystore=keystore;
                    // console.log("新keystore:"+this.$JSON5.stringify(this.ruleForm.keystore));
                    // console.log("用户名称:"+this.ruleForm.name );
                 }catch(e){
                   this.$message.error("密钥错误，请重新输入！");
                    return false;
                }
                  try{
                      this.addToLocalStorage(this.ruleForm.name,keystore);
                      this.dialogVisible = true;
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
           //导出keystore 文件
               exportkeystore(){
                     var content =this.ruleForm.keystore;
                     var keystoreString = this.$JSON5.stringify(content);
                     var FileSaver = require('file-saver');
                     var blob = new Blob([keystoreString], {type: "text/plain;charset=utf-8"});
                     saveAs(blob, "keystore");
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
            }
         }
      }
</script>
