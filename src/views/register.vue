<template>
   <div style="margin-top: 10px">
              用户名：<input v-model="form.name"></input> <br>
              密码: <input type="password" v-model="form.password" style="margin-left: 10px"> <br>
              <!--邮箱: <input type="email" v-model="form.email"  style="margin-left: 10px" > <br> -->
              <button  @click="register">注册钱包</button> <br>
              <button  @click="mnemonicfind">助记词找回钱包</button> <br>
              <button  @click="keystorefind">keystore找回钱包</button> <br>
              助记词生成的钱包地址：<span>{{form.address}}</span> <br>
              助记词生成的钱包秘钥：<span>{{form.secret}}</span> <br>
              助记词显示：<span>{{form.mnemonic}}</span> <br>
              keystore数据：<span>{{form.keystore}}</span> <br>
         -------------------------------------------------------------------------------------<br>
               助记词找回钱包地址：<span>{{form.mnemonicAddress}}</span> <br>
               助记词找回钱包秘钥：<span>{{form.mnemonicSecret}}</span> <br>
          -------------------------------------------------------------------------------------<br>
              keystore找回钱包地址：<span>{{form.keystoreAddress}}</span> <br>
              keystore找回钱包秘钥：<span>{{form.keystoreSecret}}</span> <br>
           -------------------------------------------------------------------------------------<br>
            <input type="button" @click="exportkeystore" value="导出keystore文件"/><br>
            -------------------------------------------------------------------------------------<br>
             <input type="file" id="readfile" @change="readKeystore"/><br>
              导入keystore生成地址：<span>{{form.importAddress}}</span> <br>
              导入keystore生成钱包秘钥：<span>{{form.importSecret}}</span> <br>


   </div>

</template>

<script>
export default {
  name: "register",
  data() {
             return {
               form: {
                     name: '',
                     password:'',
                     email:'',
                     address:'',
                     secret:'',
                     secret1:'',
                     mnemonic:'',
                     keystore:'',
                     mnemonicAddress:'',
                     mnemonicSecret:'',
                     keystoreAddress:'',
                     keystoreSecret:'',
                     importAddress:'',
                     importSecret:'',
                   }
             }
         },
  components: {
  },
   methods: {
         async  register(){
                //助记词生成钱包
                  var mnemonic =this.$JPassUtil.Mnemonic.createMnemonic(12, this.$i18n.locale)
                  var seed =  this.$JPassUtil.Mnemonic.wordsToEntropy(mnemonic,this.$i18n.locale);
                  var jtWallet = this.$JPassUtil.Wallet.generateWallet(seed);
                  this.form.secret=jtWallet.secret;
                  console.log(jtWallet.secret);
                  this.form.address=jtWallet.address;
                  this.form.mnemonic=mnemonic;
                  var keystore="";
                  //生成井昌钱包
                  var jingchuangWallet = this.$JCCWallet.JingchangWallet.generate("123456",jtWallet.secret);
                   await  jingchuangWallet.then(function (value) {
                          keystore= value;
                     });
                   console.log(keystore);
                   this.form.keystore=keystore;
              }  ,
            mnemonicfind (){
                      var seed =  this.$JPassUtil.Mnemonic.wordsToEntropy(this.form.mnemonic,this.$i18n.locale);
                      var jtWallet = this.$JPassUtil.Wallet.generateWallet(seed);
                      this.form.mnemonicAddress=jtWallet.address;
                      this.form.mnemonicSecret=jtWallet.secret;
            },
             //keystore 逆推钱包地址和秘钥
             async keystorefind(){
                        var address = this.form.keystore.wallets[0].address;
                        var password = "123456";
                        var wallet = new this.$JINGCHUANGWallet();
                        wallet.setJingchangWallet(this.form.keystore);
                        var secret = wallet.getSecretWithAddress(password,address);
                        await secret.then(function (value){
                                 secret=value;
                          });
                         this.form.keystoreAddress=this.form.keystore.wallets[0].address;
                         this.form.keystoreSecret=secret;
                       },
                       //导出keystore 文件
                       exportkeystore(){
                             var content =this.form.keystore;
                             var keystoreString = this.$JSON5.stringify(content);
                             var FileSaver = require('file-saver');
                             var blob = new Blob([keystoreString], {type: "text/plain;charset=utf-8"});
                             saveAs(blob, "keystore");
                       },
                      //导入keystore 生成钱包地址，秘钥
                       async  readKeystore(){
                            var fileReade =document.getElementById("readfile").files[0];
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
                                  })

                              //生成钱包
                               var address = keyStoreObj.wallets[0].address;
                               var password = "123456";
                               wallet.setJingchangWallet(keyStoreObj);
                               var secret = wallet.getSecretWithAddress(password,address);
                                     await secret.then(function (value){
                                          secret=value;
                                          console.log(secret);
                                        });
                                        this.form.importAddress=address;
                                        this.form.importSecret=secret;
                                        //清空input框
                                        var fileReade =document.getElementById("readfile").value="";
                            },
                             //导出keystore 文件
                                 exportkeystore(){
                                     var content =this.ruleForm.keystore;
                                     var keystoreString = this.$JSON5.stringify(content);
                                     var FileSaver = require('file-saver');
                                     var blob = new Blob([keystoreString], {type: "text/plain;charset=utf-8"});
                                     saveAs(blob, "keystore");
                                 },
                  }
             }
</script>
