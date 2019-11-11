<template>
    <div style="width:40%;border:1px solid  #51A7FF;margin:0 auto;border-radius:10px;">
        <div style="width:100%;border:1px solid #51A7FF;height:70px;line-height:70px;border-radius:10px 10px 0 0;border:0px;
        background-color: #ECF5FF;vertical-align:middle;margin:auto auto;color:#51A7FF;font-size:25px;">
            助记词找回
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
                 style="width:70%; margin:10% 20% 10% 10%">
            <el-form-item label="输入助记词" prop="mnemonic">
                <el-input v-model="ruleForm.mnemonic"></el-input>
            </el-form-item>
            <el-form-item label="钱包地址" prop="">
                <el-input v-model="ruleForm.mnemonicAddress" oncopy="return false" onpaste="return false"
                          readonly="readonly"></el-input>
            </el-form-item>
            <el-form-item label="钱包秘钥" prop="password">
                <el-input v-model="ruleForm.mnemonicSecret" oncopy="return false" onpaste="return false"
                          readonly="readonly"></el-input>
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
                ruleForm: {
                    mnemonic: '',
                    mnemonicAddress: '',
                    mnemonicSecret: '',
                },
                rules: {
                    mnemonic: [
                        {required: true, message: '请输入12位助记词', trigger: 'blur'},
                        // { min: 12, max:20, message: '长度在 12 到 24 个字符', trigger: 'blur' }
                    ],
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.mnemonicfind();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            mnemonicfind() {
                var mnemonic = this.ruleForm.mnemonic;
                //先去掉所有空格
                mnemonic = mnemonic.replace(/\s+/g, "");
                //加上空格
                mnemonic = mnemonic.split("").join(" ");
                try {
                    var seed = this.$JPassUtil.Mnemonic.wordsToEntropy(mnemonic, this.$i18n.locale);
                    var jtWallet = this.$JPassUtil.Wallet.generateWallet(seed);
                } catch (e) {
                    this.$message("助记词错误，请重新输入！");
                }
                this.ruleForm.mnemonicAddress = jtWallet.address;
                this.ruleForm.mnemonicSecret = jtWallet.secret;
            },
        }
    }
</script>

<style>


</style>
