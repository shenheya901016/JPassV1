<template>
  <el-dialog :title="$t('main.passwordUnlock')" :visible.sync="dialogVisible" width="35%" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
    <el-form label-width="9vw" class="demo-ruleForm" style="width:80%;" @submit.native.prevent>
      <el-form-item :label="$t('main.loginPassword')" prop="password">
        <input type="password" v-model="password" style="width:85%;border-radius:4px;border: 1px solid #C0C4CC;height: 4vh;" @keyup.enter.native="unlock()" />
        <a href="#" @click="changePass($event)" style="margin-left:2%">
          <i class="el-icon-view"></i>
        </a>
      </el-form-item>
      <el-form-item label prop style="margin-bottom: 7%;margin-top: 10%">
        <el-button type="primary" size="small" @click="unlock()">{{ $t("main.unlock") }}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>

// import mainPage from "@/store/mainpage";

export default {
  props: ["value"],
  data () {
    return {
      dialogVisible: false,
      password: "",
    };
  },
  methods: {
    async unlock () {
      let secret = "";
      let wallet = new this.$JINGCHUANGWallet();
      let keyStoreString = localStorage.getItem(this.$store.state.mainPage.loginObj.name);
      let objKeyStore = this.$JSON5.parse(keyStoreString);
      let keystring = "";
      try {
        //钱包生成密钥
        wallet.setJingchangWallet(objKeyStore);
        var address = objKeyStore.wallets[0].address;
        keystring = wallet.getSecretWithAddress(this.password, address);
        await keystring.then(function (value) {
          secret = value;
        });
      } catch (e) {
        console.log(e);
        this.$message.error(this.$t('main.thePasswordIsIncorrectPleaseReEnter'));
        return false;
      }
      this.$store.state.mainPage.loginObj.lock = false;
      sessionStorage.setItem("userkeyObj", this.$JSON5.stringify(this.$store.state.mainPage.loginObj));
      this.$message.success(this.$t('main.unlockedSuccessfully'));
      this.password = "";
      this.closeLock();
    },

    closeLock () {
      this.dialogVisible = false;
      this.$emit('closeLock', false); // 关闭弹框的传值
    },

    //密码显示控制
    changePass (e) {
      this.$store.commit('changePass', e);
    }
  },
  watch: {
    value: function (data) {
      this.dialogVisible = data;
    }
  }
};
</script>
