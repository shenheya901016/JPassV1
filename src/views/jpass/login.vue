<template>
    <div id="main" style="width:100%;">
        <div style="margin-left:5px;width:150px;">
            <a href="#">
                <img src="../../img/logo.png" alt="" style="width:150px;">
            </a>
        </div>
        <div style="width:30%;margin:0 auto;border-radius:10px; box-shadow: 0 0 7px 1px #c5c5c5;border:1px solid white;margin-top:5%"
             id="dd">
            <div style="width:100%;height:20%;border-radius:10px 10px 0 0;font-size:20px;margin-top:50px">
                登录jpass
            </div>
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm"
                     style="width:75%; margin:10% 20% 5% 10%;">
                <el-form-item label="用户名称" prop="name">
                    <el-input v-model="ruleForm.name" style="width:90%;"></el-input>
                </el-form-item>
                <el-form-item label="用户密码" prop="password">
                    <el-input v-model="ruleForm.password" style="width:90%;"></el-input>
                </el-form-item>
                <el-form-item label="" prop="">
                    <el-button type="primary" style="width:90%;" @click="login()">登录</el-button>
                </el-form-item>
            </el-form>
            <div style="margin-bottom:4%;">
                <button class="bottom" @click="register">注册</button>
                <button class="bottom" @click="dialogVisible = true">导入钱包</button>
            </div>
            <el-dialog title="导入方式选择" :visible.sync="dialogVisible" width="30%">
                <el-button type="primary" style="width:30%;" @click="importwallet(0)">密钥导入</el-button>
                <el-button type="primary" style="width:30%;" @click="importwallet(1)">keystore</el-button>
                <el-button type="primary" style="width:30%;" @click="importwallet(2)">助记词导入</el-button>
            </el-dialog>
            <vue-canvas-nest :config="{color:'255,0,0', count:100}" :el="'#main'"></vue-canvas-nest>
        </div>
    </div>
</template>

<script>
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
                ruleForm: {
                    name: '',
                    password: '',
                },

            };

        },
        mounted() {


        },
        methods: {
            register() {
                this.$router.push('/jpass/register');
                // console.log(this.config);
            },
            importwallet(type) {
                if (type == 0) {
                    this.$router.push('/jpass/keyimport');
                }
                if (type == 1) {
                    this.$router.push('/jpass/keystoreimport');
                }
                if (type == 2) {
                    this.$router.push('/jpass/mnemonicimport');
                }
            },
            login() {
                this.$router.push('/index');
            }
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
