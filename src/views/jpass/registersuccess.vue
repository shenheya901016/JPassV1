<template>

    <div style="width:100%;" id="main">
        <div style="margin:30px auto;width:150px;">
            <a href="#">
                <img src="../../img/logo.png" alt="" style="width:150px;">
            </a>
        </div>
        <div style="width:45%;border:1px solid white;margin:2% auto;border-radius:10px;box-shadow: 0 0 7px 1px #c5c5c5;">
            <div style="width:100%;border-radius:10px 10px 0 0; font-size:18px;margin-top:50px; color: #66B1FF;text-align: left">
                <div v-html="$t('registersuccess.title')"></div>

                <!--<p style="color: red">注：1.请您及时记录您的私钥和助记词,并妥善保管，这是找回您钱包的必要信息，请不要外泄。</p>-->
                <!--<p>2.keystore 文件用于钱包的导入，请妥善保存。</p>-->
            </div>
            <el-form :model="ruleForm" ref="ruleForm" label-width="10vw" class="demo-ruleForm" style="width:80%; margin:10% 20% 10% 10%;">
                <el-form-item :label="$t('registersuccess.mnemonic')">
                    <el-input style="width:95%;float: left;" v-model="ruleForm.mnemonic" readonly="readonly" oncut="return false" disabled
                              onpaste="return false"
                              oncopy="return false">
                    </el-input>

                </el-form-item>
                <el-form-item :label="$t('registersuccess.walletAddress')">
                    <el-input style="width:95%;float: left;" v-model="ruleForm.address" readonly="readonly" disabled></el-input>

                </el-form-item>
                <el-form-item :label="$t('registersuccess.secret')">
                    <el-input style="width:95%;float: left;" v-model="ruleForm.secret" readonly="readonly" oncut="return false" disabled
                              onpaste="return false"
                              oncopy="return false"></el-input>
                </el-form-item>
                <el-form-item :label="$t('registersuccess.keystoreFile')" prop="password">
                    <el-button type="primary" size="small" @click="exportkeystore" style="float: left;">{{$t('registersuccess.exportKeystoreFile')}}</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" style="width:95%;margin-left: -50px" @click="toMainPage">{{$t('registersuccess.login')}}</el-button>
                </el-form-item>
            </el-form>
            <div style="margin-bottom:30px">
            </div>
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
            return {
                //进度条值
                percentage: 0,
                ruleForm: {
                    name: this.$route.params.name,
                    password: this.$route.params.password,
                    address: this.$route.params.address,
                    secret: this.$route.params.secret,
                    mnemonic: this.$route.params.mnemonic,
                    keystore: '',
                },
            };
        },
        methods: {
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

            toMainPage(){
                 this.$router.push("/jpass/login");
            },

            //导出keystore 文件
            exportkeystore() {
                let userObjString = sessionStorage.getItem("userObj");
                let username = this.$JSON5.parse(userObjString).name;
                let wallet = localStorage.getItem(username);
                let FileSaver = require('file-saver');
                let blob = new Blob([wallet], {type: "text/plain;charset=utf-8"});
                saveAs(blob, "keystore");
            },
        },
        mounted() {
            console.log( this.$route.params)
        }
    }
</script>
<style>


</style>
