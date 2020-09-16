<template>
  <!--密码生成器-->
  <el-dialog
    :title="$t('main.passwordGenerator')"
    :visible.sync="dialogPasswordGeneratorMain"
    width="50%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="true"
    @closed="clearPass"
  >
    <el-input v-model="crypt" readonly disabled></el-input>
    <el-progress
      :show-text="false"
      :stroke-width="5"
      :percentage="percentage"
      :status="status"
      style="margin-top: 1%;"
    ></el-progress>
    <div style="display: block;height:3vh;">{{ level }}</div>
    <el-radio-group v-model="radio">
      <el-radio :label="1">{{ $t("main.easyMemorize") }}</el-radio>
      <el-radio :label="2">{{ $t("main.lettersAndNumbers") }}</el-radio>
      <el-radio :label="3">{{ $t("main.completelyRandom") }}</el-radio>
      <el-radio :label="4">{{ $t("main.numberOnly") }}</el-radio>
    </el-radio-group>
    <el-slider
      :step="1"
      :min="8"
      :max="20"
      show-stops
      v-model="value2"
    ></el-slider>
    <el-button
      type="primary"
      size="medium"
      v-clipboard:copy="crypt"
      v-clipboard:success="onCopy"
      v-clipboard:error="onError"
      :disabled="copydisabled"
      >复制</el-button
    >
  </el-dialog>
</template>

<script>
export default {
  props: ["dialogopenMain", "dialogcloseMain"],
  data() {
    return {
      //密码生成器
      dialogPasswordGeneratorMain: false, // 密码生成器弹出框
      crypt: "",
      level: "",
      radio: 3,
      value2: 0, //系统设置配置项
      //进度条值
      percentage: 0,
      status: "exception",
      copydisabled: true
    };
  },
  methods: {
    //关闭密码器清除相关数据
    clearPass() {
      this.value2 = 0;
      this.level = "";
      this.crypt = "";
      this.$emit("dialogPasswordGeneratorcloseMain", false);
    },
    /**
     * 判断密码强度
     * @param p
     * @return {string}
     */
    cryptLevel(p) {
      let des = "";
      let hasUpper = false;
      let hasLow = false;
      let hasNum = false;
      let hasOther = false;
      let out = "";
      for (let i = 0; i < p.length; i++) {
        let c = p.charCodeAt(i);
        if (c >= 65 && c <= 90) hasUpper = true;
        else if (c >= 97 && c <= 122) hasLow = true;
        else if (c >= 48 && c <= 57) hasNum = true;
        else hasOther = true;
      }
      let pwdNum = 0;
      if (hasUpper) pwdNum += 26;
      if (hasLow) pwdNum += 26;
      if (hasNum) pwdNum += 10;
      if (hasOther) pwdNum += 32;
      let num = Math.pow(pwdNum, p.length);
      if (num == 1) {
        num = 0;
      }
      out = this.formatTime(num / (1024 * 1024 * 1024 * 2.4 * 2));
      if (out != "") {
        des = this.$t("main.breakTime") + out;
      }
      return des;
    },

    // 复制成功
    onCopy(e) {
      this.$emit("onCopy");
    },
    // 复制失败
    onError(e) {
      this.$emit("onError");
    },

    formatTime(s) {
      var str = "";
      if (s == 0) return (str = "");
      s = Math.floor(s);
      if (s < 1) return (str = this.$t("main.moment"));
      s = Math.floor(s);
      if (s >= 1) str = (s % 60) + this.$t("main.seconds") + str;
      s = Math.floor(s / 60);
      if (s >= 1) str = (s % 60) + this.$t("main.mintues") + str;
      s = Math.floor(s / 60);
      if (s >= 1) str = (s % 24) + this.$t("main.hours") + str;
      s = Math.floor(s / 24);
      if (s >= 1) {
        str = Math.ceil(s + this.$t("main.day")) + str;
        if (s <= 28) {
          str = Math.ceil(s / 7) + this.$t("main.weeks");
        } else if (s >= 30 && s <= 360) {
          str = Math.ceil(s / 30) + this.$t("main.month");
        } else if (s >= 360 && s <= 36000) {
          str = Math.ceil(s / 360) + this.$t("main.years");
        } else {
          str = this.$t("main.century");
        }
      }
      return str;
    },

    /**
     * 获取进度条百分比
     * @param pwd
     * @return {string}
     */
    getPercentage(pwd) {
      let level = this.cryptLevel(pwd);
      if (level.indexOf(this.$t("main.century")) !== -1) {
        this.percentage = 100;
        this.status = "success";
      } else if (level.indexOf(this.$t("main.years")) !== -1) {
        this.percentage = 80;
        this.status = "success";
      } else if (level.indexOf(this.$t("main.month")) !== -1) {
        this.status = "success";
        this.percentage = 60;
      } else if (level.indexOf(this.$t("main.weeks")) !== -1) {
        this.percentage = 40;
        this.status = "warning";
      } else if (level.indexOf(this.$t("main.day")) !== -1) {
        this.percentage = 35;
        this.status = "exception";
      } else if (level.indexOf(this.$t("main.hours")) !== -1) {
        this.percentage = 30;
        this.status = "exception";
      } else if (level.indexOf(this.$t("main.mintues")) !== -1) {
        this.percentage = 15;
        this.status = "exception";
      } else if (level.indexOf(this.$t("main.seconds")) !== -1) {
        this.percentage = 10;
        this.status = "exception";
      } else if (level.indexOf(this.$t("main.moment")) !== -1) {
        this.percentage = 5;
        this.status = "exception";
      } else {
        this.percentage = 0;
        this.level = "";
      }
    }
  },
  watch: {
    //密码生成器自动生成
    crypt: function() {
      if (this.crypt.length > 0) {
        this.copydisabled = false;
      } else {
        this.copydisabled = true;
      }
    },
    value2: function() {
      this.crypt = this.$createPassword.genCrypt(this.radio, this.value2);
      this.level = this.cryptLevel(this.crypt);
      this.getPercentage(this.crypt);
    },
    radio: function() {
      this.crypt = this.$createPassword.genCrypt(this.radio, this.value2);
      this.level = this.cryptLevel(this.crypt);
      this.getPercentage(this.crypt);
    },
    dialogopenMain: function(data) {
      this.dialogPasswordGeneratorMain = data;
    },
    dialogcloseMain: function(data) {
      if (data) {
        this.dialogPasswordGeneratorMain = false;
        this.$emit("recoverdialogtagMain", false);
      }
    }
  }
};
</script>

<style></style>
