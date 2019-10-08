<template>

    <div style="width:100%;" id="main">
        <div style="margin-left:5px;width:150px;">
            <a href="#">
                <img src="../../img/logo.png" alt="" style="width:150px;">
            </a>
        </div>
        <div style="width:40%;border:1px solid white;margin:0 auto;border-radius:10px;margin-top:5%;box-shadow: 0 0 7px 1px #c5c5c5;">
            <div style="width:100%;border-radius:10px 10px 0 0; font-size:20px;margin-top:50px; color: #66B1FF">
                恭喜您，钱包注册成功,请您用<span style="color: red">钱包地址</span>到井通官网激活钱包！
                <p style="color: red;font-size: 15px">注:请您及时抄录并妥善保存好以下信息，这是找回您钱包的必要资料，请不要外泄!</p>
                <!--<p style="color: red">注：1.请您及时记录您的私钥和助记词,并妥善保管，这是找回您钱包的必要信息，请不要外泄。</p>-->
                <!--<p>2.keystore 文件用于钱包的导入，请妥善保存。</p>-->

            </div>

            <el-form :model="ruleForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm"
                     style="width:75%; margin:10% 20% 10% 10%;">
                <el-form-item label="助记词:">
                    <el-input  style="width:90%;"  v-model="ruleForm.mnemonic" readonly="readonly"  oncut="return false" onpaste="return false"
                               oncopy="return false">></el-input>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </el-form-item>
                <el-form-item label="钱包地址:">
                    <el-input  style="width:90%;"  v-model="ruleForm.address" readonly="readonly" ></el-input>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </el-form-item>
                <el-form-item label="私钥:">
                    <el-input  style="width:90%;"  v-model="ruleForm.secret" readonly="readonly" oncut="return false" onpaste="return false"
                               oncopy="return false"></el-input>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </el-form-item>
                <el-form-item label="keystore文件:" prop="password">
                    <el-button type="primary" size="small" @click="exportkeystore">keystore导出</el-button>
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
                    name: '',
                    password: '',
                    address:this.$route.params.address,
                    secret: this.$route.params.secret,
                    mnemonic:this.$route.params.mnemonic ,
                    keystore: '',
                },
            };
        },
        methods: {
            //导出keystore 文件
            exportkeystore(){
                let userObjString = sessionStorage.getItem("userObj");
                let username = this.$JSON5.parse(userObjString).name;
                let wallet = localStorage.getItem(username);
                let FileSaver = require('file-saver');
                let blob = new Blob([wallet], {type: "text/plain;charset=utf-8"});
                saveAs(blob, "keystore");
            },
        },
    }
</script>
<style>


</style>
