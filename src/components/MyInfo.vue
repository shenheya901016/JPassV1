<template>
  <el-dialog title="" :visible.sync="dialogMyInfo" width="50%" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="true" @closed="closeMyInfo">
    <img src="@/views/jpass/img/tx.svg" alt="" />
    <el-form label-width="110px" class="demo-ruleForm">
      <el-form-item :label="$t('myInfo.name')" prop="username" style="margin-top: 5%">
        <div style="text-align: left;margin-top: 3px;">{{ this.$store.state.mainPage.username }}</div>
      </el-form-item>
      <el-form-item :label="$t('myInfo.walletAddress')" prop="this.$store.state.mainPage.myInfoKey">
        <div style="text-align: left;margin-top: 3px;">{{ this.$store.state.mainPage.myInfoKey }}</div>
      </el-form-item>
      <el-form-item :label="$t('myInfo.vip')" prop="vip">
        <div style="text-align: left;margin-top: 3px;">{{ this.$store.state.mainPage.vip }}</div>
      </el-form-item>
      <el-form-item :label="$t('myInfo.keystoreFile')">
        <el-button type="primary" size="small" style="float: left;margin-top: 5px;" @click="exportkeystore">
          {{ $t("myInfo.exportKeystoreFile") }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
export default {
  props: ["value"],
  data () {
    return {
      dialogMyInfo: false, //个人信息弹出框
    };
  },
  methods: {
    exportkeystore () {
      let userObjString = this.$JSON5.parse(sessionStorage.getItem("userkeyObj"));
      let username = userObjString.name;
      let wallet = localStorage.getItem(username);
      let FileSaver = require("file-saver");
      let blob = new Blob([wallet], { type: "text/plain;charset=utf-8" });
      saveAs(blob, "keystore");
    },
    closeMyInfo () {
      this.dialogMyInfo = false;
      this.$emit('closeMyInfo', false); // 关闭弹框的传值
    },
  },
  watch: {
    value: function (data) {
      this.dialogMyInfo = data;
    }
  }

}
</script>