<template>
  <el-dialog title="" :visible.sync="dialogVisibleSetting" width="50%" :show-close="true" style="text-align: left" :before-close="handleClose" @open="open">
    <div style="text-align: center;font-weight:bolder;margin-bottom:3%;margin-top: -2%">
      {{ $t("main.systemSettings") }}
    </div>
    <el-form>
      <el-tabs v-model="activeName" type="border-card" style="height:55vh">
        <el-tab-pane :label="$t('main.generic')" name="generic">
          <el-form-item prop="">
            <fieldset style="width: 80%;height:14vh;margin: auto;border: 1px solid #6C6C6C">
              <legend style="margin-left: 1%">
                {{ $t("main.mainWindow") }}
              </legend>
              <div style="margin-left: 2vw">
                {{ $t("main.loginOpenJpass") }}<br />
                <el-switch v-model="autoStartFlag" active-color="#13ce66" inactive-color="#ff4949" @change="changeAutoStartFlag"></el-switch>
              </div>
            </fieldset>
          </el-form-item>
          <el-form-item prop="">
            <fieldset style="width: 80%;height: 14vh;margin: auto;border: 1px solid #6C6C6C">
              <legend style="margin-left: 1%">
                {{ $t("main.KeyboardShortcuts") }}
              </legend>
              <div style="margin-left: 2vw">
                {{ $t("main.lockRadio") }}<br />
                <el-switch v-model="lockFlag" active-color="#13ce66" inactive-color="#ff4949" @change="changeLockFlag"></el-switch>
              </div>
            </fieldset>
          </el-form-item>
          <el-form-item prop="">
            <fieldset style="width: 80%;margin: auto;height: 12vh;border: 1px solid #6C6C6C">
              <legend style="margin-left: 1%">
                {{ $t("main.language") }}
              </legend>
              <span style="margin-left: 2vw">
                <el-select v-model="language" :placeholder="$t('main.languageSelection')">
                  <el-option v-for="item in this.languages" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </span>
            </fieldset>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane :label="$t('main.security')">
          <el-form-item prop="">
            <fieldset style="width: 80%;height: 10vh;margin: auto;border: 1px solid #6C6C6C">
              <legend style="margin-left: 1%">
                {{ $t("main.passwordService") }}
              </legend>
              <div style="margin-left: 2vw">
                {{ $t("main.showPassword") }}
                <el-switch v-model="showPassword" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
              </div>
            </fieldset>
          </el-form-item>
          <el-form-item prop="">
            <fieldset style="width: 80%;margin: auto;border: 1px solid #6C6C6C">
              <legend style="margin-left: 1%">
                {{ $t("main.locking") }}
              </legend>
              <span style="display:inline-block;width: 60vh;margin-left: 2vw">
                {{ $t("main.timedLock") }}
                <el-switch v-model="systemlock" active-color="#13ce66" inactive-color="#ff4949" @change="lockchange"></el-switch>
              </span>
              <span style="display:inline-block;width: 60vh;margin-left: 2vw">
                {{ $t("main.idleTime") }}
                <el-slider v-model="locktime" :disabled="locktimedisabled" :min="1"></el-slider>
              </span>
            </fieldset>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane :label="$t('main.browser')">
          <el-form-item prop="">
            <fieldset style="width: 80%;height:10vh;margin: auto;border: 1px solid #6C6C6C">
              <legend style="margin-left: 1%">
                {{ $t("main.extention") }}
              </legend>
              <div style="margin-left: 2vw">
                <el-button type="primary" size="small" @click="chrome">
                  chrome
                </el-button>
              </div>
            </fieldset>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane :label="$t('main.update')">
          <el-form-item prop="">
            <fieldset style="width: 80%;height:10vh;margin: auto;border: 1px solid #6C6C6C">
              <legend style="margin-left: 1%">
                {{ $t("main.version") }}：{{ this.$store.state.mainPage.package_version }}
              </legend>
              <div style="margin-left: 2vw">
                <el-button type="primary" size="small" @click="checkForUpdates">
                  {{ $t("main.update") }}
                </el-button>
              </div>
            </fieldset>
          </el-form-item>
          <el-form-item prop="">
            <fieldset style="width: 80%;height:14vh;margin: auto;border: 1px solid #6C6C6C">
              <legend style="margin-left: 1%">
                {{ $t("main.auto_update") }}
              </legend>
              <div style="margin-left: 2vw">
                {{ $t("main.auto_update_prompt") }}<br />
                <el-switch v-model="auto_update" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
              </div>
            </fieldset>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <el-form-item label="" style="margin-top:5%;text-align: center">
        <el-button type="primary" size="small" style="width:35%;" @click="savesettings">
          {{ $t("main.save") }}
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
      dialogVisibleSetting: false,//设置弹出框
      activeName: "generic",
      autoStartFlag: false,
      lockFlag: true,
      language: "",
      showPassword: false,
      systemlock: false,
      locktime: false,
      locktimedisabled: false,
      auto_update: false,
      languages: [
        { value: "中文", label: "中文" },
        { value: "English", label: "English" }
      ],

    };
  },

  methods: {
    open () {
      this.language = this.$store.state.mainPage.language;
      console.log(this.language);
      this.autoStartFlag = this.$store.state.mainPage.autoStartFlag;
      console.log(this.autoStartFlag);
      this.lockFlag = this.$store.state.mainPage.lockFlag;
      console.log(this.lockFlag);
      this.showPassword = this.$store.state.mainPage.showPassword;
      console.log(this.showPassword);
      this.systemlock = this.$store.state.mainPage.systemlock;
      console.log(this.systemlock);
      this.locktime = this.$store.state.mainPage.locktime;
      console.log(this.locktime);
      this.auto_update = this.$store.state.mainPage.auto_update;
      console.log(this.auto_update);
      this.locktimedisabled = this.$store.state.mainPage.locktimedisabled;
      console.log(this.locktimedisabled);
    },
    //关闭setting
    handleClose () {
      this.activeName = "generic";
      this.$store.commit("updatesetting");
      this.dialogVisibleSetting = false;
      this.$emit('closeSetting', false); // 关闭弹框的传值
    },
    changeAutoStartFlag (flag) {
      window.ipcRenderer.send("setLoginItemSettings", flag); //是否启用开机自启
    },

    changeLockFlag (flag) {
      if (flag) {
        if (window.ipcRenderer.sendSync("isRegistered")) {
          this.$store.state.mainPage.autoStartFlag = false;
          alert("锁定快捷键,已被其他应用占用");
          return;
        }
        window.ipcRenderer.send("enableLock"); //启用锁定快捷键
      } else {
        window.ipcRenderer.send("disableLock"); //禁用锁定快捷键
      }
    },

    checkForUpdates () {
      this.ipcRenderer.send('checkForUpdate');
    },

    chrome () {
      window.ipcRenderer.send("open", "https://chrome.google.com/webstore/category/extensions?h1=zh");
    },

    //lock定时器启动
    lockchange () {
      if (this.systemlock) {
        this.locktimedisabled = false;
      } else this.locktimedisabled = true;
    },

    //保存设置
    async savesettings () {
      try {
        this.$store.state.mainPage.systemlock = this.systemlock;
        this.$store.state.mainPage.locktime = this.locktime;
        this.$store.state.mainPage.showPassword = this.showPassword;
        this.$store.state.mainPage.savePassword = this.savePassword;
        this.$store.state.mainPage.language = this.language;
        this.$store.state.mainPage.auto_update = this.auto_update;
        this.$store.state.mainPage.locktimedisabled = this.locktimedisabled;
        this.$store.state.mainPage.db.get("settings").set("systemlock", this.systemlock).write();
        this.$store.state.mainPage.db.get("settings").set("locktime", this.locktime).write();
        this.$store.state.mainPage.db.get("settings").set("showPassword", this.showPassword).write();
        this.$store.state.mainPage.db.get("settings").set("savePassword", this.savePassword).write();
        this.$store.state.mainPage.db.get("settings").set("language", this.language).write();
        this.$store.state.mainPage.db.get("settings").set("auto_update", this.auto_update).write();
        this.$store.state.mainPage.db.get("settings").set("locktimedisabled", this.locktimedisabled).write();
        //阿里时间
        this.$store.dispatch('getTime');
        this.$store.state.mainPage.db.set("version", this.$store.state.utils.aliTime).write();
        this.$emit('locksystem', false); // 关闭弹框的传值
        //语言切换
        // this.$emit('changeLang', this.language); // 关闭弹框的传值
        this.$store.dispatch('changeLang', this.language);

        this.$confirm(
          this.$t("main.settingSavedSuccessfully") + this.$t("main.re_login"),
          this.$t("main.suggest"),
          {
            confirmButtonText: this.$t("main.login"),
            cancelButtonText: this.$t("main.cancel")
          }
        )
          .then(() => {
            this.dialogVisibleSetting = false;
            this.$emit('closeSetting', false); // 关闭弹框的传值
            this.$router.push("/jpass/login");
          })
          .catch(() => {
            this.$message({
              message: this.$t("main.cancel") + " " + this.$t("main.login")
            });
            this.dialogVisibleSetting = false;
            this.$emit('closeSetting', false); // 关闭弹框的传值
          });
      } catch (e) {
        this.$message.error(this.$t("main.settingSaveFailed"));
      }
    },

  },

  watch: {
    value: function (data) {
      this.dialogVisibleSetting = data;
    }
  }
};
</script>
