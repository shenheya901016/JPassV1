<template>
  <el-dialog :title="$t('main.prompt')" :visible.sync="dialogSynchronization" width="30%">
    <span>{{ $t("main.synchronizationInfo") }}</span>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="localToIpfs()">{{
                $t("main.localToIpfs")
            }}</el-button>
      <el-button size="small" type="primary" @click="ipfsToLocal()">{{
                $t("main.ipfsToLocal")
            }}</el-button>
      <el-button size="small" @click="closeDialogSynchronization">{{
                $t("main.cancelFormat")
            }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: ["value"],
  data () {
    return {
      dialogSynchronization: false,
    };
  },
  methods: {
    //本地覆盖ipfs
    async localToIpfs () {
      let localdata = this.$store.state.mainPage.db.__wrapped__;
      let result = await this.$myIpfs.Ipfs.write(this.$store.state.mainPage.loginObj.secret, this.$JSON5.stringify(localdata), "/main");
      if (result.indexOf("success") === -1) {
        this.$message({
          message: "同步数据失败！",
          type: "error"
        });
      } else {
        this.closeDialogSynchronization();
      }
    },

    //ipfs 覆盖本地
    async ipfsToLocal () {
      let secret = this.$store.state.mainPage.loginObj.secret;
      let tempipfsData = await this.$myIpfs.Ipfs.read(secret, "/main", this.$store.state.mainPage.loginObj.address);
      tempipfsData = this.$JSON5.parse(tempipfsData); //ipfs转成对象
      tempipfsData = this.$JSON5.parse(this.$JSON5.stringify(tempipfsData)); //序列化新对象
      await this.$store.state.mainPage.db.set("models", tempipfsData.models).write();
      await this.$store.state.mainPage.db.set("project", tempipfsData.project).write();
      await this.$store.state.mainPage.db.set("templates", tempipfsData.templates).write();
      await this.$store.state.mainPage.db.set("settings", tempipfsData.settings).write();
      await this.$store.state.mainPage.db.set("machineId", this.$Uuidv1()).write();
      await this.$store.state.mainPage.db.set("version", tempipfsData.version).write();
      //更新设置
      this.$store.commit('updatesetting');
      //启动锁定定时器
      this.locksystem();
      this.$emit('locksystem'); // 关闭弹框的传值
      //设置语言
      this.$store.dispatch('changeLang', this.$store.state.mainPage.language);

      this.closeDialogSynchronization();
    },

    closeDialogSynchronization () {
      this.dialogSynchronization = false
      this.$emit('closeSynchronization', false); // 关闭弹框的传值
    }
  },
  watch: {
    value: function (data) {
      this.dialogSynchronization = data;
    }
  }
}
</script>
      