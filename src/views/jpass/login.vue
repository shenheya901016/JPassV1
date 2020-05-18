<template>
    <div id="main" style="width:100%;">
        <div style="margin:30px auto;width:150px;">
            <a href="#">
                <img src="../../img/logo.png" alt="" style="width:150px;"/>
            </a>
        </div>
        <div
                style="width:35%;margin:2% auto;border-radius:10px; box-shadow: 0 0 7px 1px #c5c5c5;border:1px solid white;"
        >
            <div
                    style="width:100%;height:20%;border-radius:10px 10px 0 0;font-size:20px;margin-top:50px"
            >
                {{ $t("login.title") }}
            </div>
            <el-form
                    :model="ruleForm"
                    :rules="rules"
                    ref="ruleForm"
                    label-width="100px"
                    class="demo-ruleForm"
                    style="width:75%; margin:10% 20% 5% 10%;"
            >
                <el-form-item :label="$t('login.name')" prop="name">
                    <el-select
                            :placeholder="$t('login.selectuser')"
                            v-model="ruleForm.name"
                            :title="$t('login.nametitle')"
                            style="width:100%;"
                    >
                        <el-option
                                v-for="item in names"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        :label="$t('login.password')"
                        prop="password"
                        style="margin-top:10%"
                >
                    <el-input
                            type="password"
                            v-model="ruleForm.password"
                            style="width:100%;"
                            show-password
                    ></el-input>
                </el-form-item>
                <el-form-item label="" prop="">
                    <el-button
                            type="primary"
                            style="width:90%;"
                            native-type="submit"
                            size="small"
                            @click="submitForm('ruleForm')"
                    >{{ $t("login.login") }}
                    </el-button
                    >
                </el-form-item>
            </el-form>
            <div style="margin-bottom:4%;">
                <button class="bottom" @click="register">
                    {{ $t("login.register") }}
                </button>
                <button class="bottom" @click="dialogVisible = true">
                    {{ $t("login.importwallet") }}
                </button>
            </div>
            <el-dialog
                    :title="$t('login.importmode')"
                    :visible.sync="dialogVisible"
                    width="30%"
            >
                <el-button
                        type="primary"
                        style="width:30%;"
                        size="small"
                        @click="importwallet(0)"
                >{{ $t("login.importkey") }}
                </el-button
                >
                <el-button
                        type="primary"
                        style="width:30%;"
                        size="small"
                        @click="importwallet(1)"
                >{{ $t("login.importkeystory") }}
                </el-button
                >
                <el-button
                        type="primary"
                        style="width:30%;"
                        size="small"
                        @click="importwallet(2)"
                >{{ $t("login.importmnemonic") }}
                </el-button
                >
            </el-dialog>
            <vue-canvas-nest
                    :config="{ color: '255,0,0', count: 100 }"
                    :el="'#main'"
            ></vue-canvas-nest>
        </div>
    </div>
</template>

<script type="es6">
    import vueCanvasNest from "vue-canvas-nest";

    export default {
        components: {
            vueCanvasNest
        },
        data() {
            return {
                dialogVisible: false,
                names: [],
                operatorJID: "jHDbFiFZ6rfDjhfRnhD1ReCwY2erhpiYBS", //运营商钱包地址
                operatorSecret: "ssxWidEVcs6bCtsVbfd7gMXUoRfMW", //运营商密钥
                ruleForm: {
                    name: "",
                    password: ""
                },
                rules: {
                    name: [
                        {
                            required: true,
                            message: this.$t("login.namevalidation"),
                            trigger: "blur"
                        }
                    ],
                    password: [
                        {
                            required: true,
                            message: this.$t("login.pwdvalidaion"),
                            trigger: "blur"
                        },
                        {
                            min: 4,
                            max: 20,
                            message: this.$t("login.pwdlengthvalidaion"),
                            trigger: "blur"
                        }
                    ]
                }
            };
        },
        async mounted() {
            if (this.$IpcRenderer) {
                this.$IpcRenderer.on("closeEditorWarning", event => {
                    this.$IpcRenderer.send("app.exit");
                });
            }
            //select 数据生成
            var names = localStorage.getItem("name_string");
            if (names != null) {
                var nameArray = names.split(",");
                nameArray.pop(); //删除最后一项（最后一个项为空）
                this.names = nameArray.map(item => {
                    return {value: item, label: item};
                });
            }
            let a = await this.$Ipfs.Ipfs.writeTest("sa9UcyBBD3A3JU3Ux3ZKcbNCxVw9h", "测试数据", "/mian.txt")
            console.log(a)
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.login();
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },
            register() {
                this.$router.push("/jpass/register");
            },
            importwallet(type) {
                if (type == 0) {
                    this.$router.push("/jpass/keyimport");
                }
                if (type == 1) {
                    this.$router.push("/jpass/keystoreimport");
                }
                if (type == 2) {
                    this.$router.push("/jpass/mnemonicimport");
                }
            },
            async login() {
                let secret = "";
                let wallet = new this.$JINGCHUANGWallet();
                let keyStoreString = localStorage.getItem(this.ruleForm.name);
                let objKeyStore = this.$JSON5.parse(keyStoreString);
                let keystring = "";
                let bal = "";
                if (keyStoreString != null) {
                    try {
                        //钱包生成密钥
                        wallet.setJingchangWallet(objKeyStore);
                        var address = objKeyStore.wallets[0].address;
                        keystring = wallet.getSecretWithAddress(
                            this.ruleForm.password,
                            address
                        );
                        await keystring.then(function (value) {
                            secret = value;
                        });
                    } catch (e) {
                        this.$message.error(this.$t("login.pwderror"));
                        return false;
                    }
                    // if(await this.$myIpfs.bal("j4M4AoSi522XxNpywfyBahmjzQihc4EegL") === "success"){
                    // if(await this.$myIpfs.bal(objKeyStore.wallets[0].address) === "success"){
                    //       await this.$myIpfs.initTest( objKeyStore.wallets[0].address, secret,this.operatorJID,this.operatorSecret,"data");
                    //       await this.$myIpfs.initTest( objKeyStore.wallets[0].address, secret,this.operatorJID,this.operatorSecret,"file");
                    //      bal=true;
                    //  }else{
                    //      bal=false;
                    //  }
                    bal = true;
                    let userkeyObj = {
                        name: this.ruleForm.name,
                        secret: secret,
                        address: objKeyStore.wallets[0].address,
                        lock: false, //是否锁定
                        bal: bal
                    };
                    sessionStorage.setItem("userkeyObj", this.$JSON5.stringify(userkeyObj));
                    //this.$message.success("用户登录成功！");
                    this.$router.push("/jpass/main");
                } else {
                    this.$message.error(this.$t("login.loginerror"));
                }
            }
        }
    };
</script>

<style>
    .bottom {
        display: inline-block;
        width: 20%;
        height: 20px;
        line-height: 20px;
        color: #1989fa;
        border: 0px;
        background: none;
    }

    .bottomalert {
        border: 0px;
        background: #1989fa;
        border-radius: 4px;
        color: #fff;
        width: 90px;
        height: 35px;
        display: inline-block;
        margin-right: 30px;
        margin-top: 34px;
    }
</style>
