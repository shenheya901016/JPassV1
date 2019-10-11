<template>
    <div id="main" style="width:100%;">
        <div style="margin-left:5px;width:150px;">
            <a href="#">
                <img src="../../img/logo.png" alt="" style="width:150px;">
            </a>
        </div>
        <div style="width:30%;margin:0 auto;border-radius:10px; box-shadow: 0 0 7px 1px #c5c5c5;border:1px solid white;margin-top:5%">
            <div style="width:100%;height:20%;border-radius:10px 10px 0 0;font-size:20px;margin-top:50px">
                解锁jpass
            </div>
            <el-form :model="ruleForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm"
                     style="width:75%; margin:10% 20% 5% 10%;">
                <!--<el-form-item label="用户名称" prop="name">-->
                    <!--<el-select placeholder="请选择登录用户" v-model="ruleForm.name" title="请选择登录用户，如果下拉框无数据，请先注册用户或导入已有钱包！" style="width:100%;">-->
                        <!--<el-option v-for="item in names" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item label="登录密码" prop="password" style="margin-top:10%">
                    <el-input type="password" v-model="ruleForm.password" style="width:100%;"></el-input>
                </el-form-item>
                <el-form-item label="" prop=""  style="margin-top:10%;margin-bottom: 15%">
                    <el-button type="primary" style="width:100%;" @click="submitForm('ruleForm')">解锁</el-button>
                </el-form-item>
            </el-form>
            <vue-canvas-nest :config="{color:'255,0,0', count:100}" :el="'#main'"></vue-canvas-nest>
        </div>
    </div>
</template>

<script type="es6">
    import vueCanvasNest from 'vue-canvas-nest';
    export default {
        components: {
            vueCanvasNest
        },
        data() {
            return {
                //进度条值
                percentage: 0,
                dialogVisible: false,
                names: [],
                ruleForm: {
                    name: '',
                    password: '',
                },
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.login();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            async  login(){
                let loginString=sessionStorage.getItem("userkeyObj");
                let loginObj= this.$JSON5.parse(loginString);
                let secret = "";
                let wallet = new this.$JINGCHUANGWallet();
                let keyStoreString = localStorage.getItem(loginObj.name);
                let objKeyStore = this.$JSON5.parse(keyStoreString);
                let keystring = "";
                    try {
                        //钱包生成密钥
                        wallet.setJingchangWallet(objKeyStore);
                        var address = objKeyStore.wallets[0].address;
                        keystring = wallet.getSecretWithAddress(this.ruleForm.password, address);
                        await keystring.then(function (value) {
                            secret = value;
                        });
                    } catch (e) {
                        this.$message.error("密码有误，请重新输入！");
                        return false;
                    }
                    this.$message.success("解锁成功！");
                    this.$router.go(-1);
            },
        }
    }
</script>

<style>
    .bottom {
        display: inline-block;
        width: 20%;
        height: 20px;
        line-height: 20px;
        color: #1989FA;
        border: 0px;
        background: none;
    }

    .bottomalert {
        border: 0px;
        background: #1989FA;
        border-radius: 4px;
        color: #fff;
        width: 90px;
        height: 35px;
        display: inline-block;
        margin-right: 30px;
        margin-top: 34px;
    }
</style>
