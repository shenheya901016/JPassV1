<template>
  <!--明细-->
  <el-form :model="ruleFormProjectDetail" ref="ruleFormProjectDetail" label-width="100px" class="demo-ruleForm" label-position="top" style="width:80%;height:95%;margin: auto;text-align: left;margin-top:3%;">
    <el-form-item v-if="this.$store.state.mainPage.projectEvent != ''" style="margin-bottom: 5vh;margin-top: 5vh;" prop="name">
      <div style="display: inline-block;width:80%;height:8vh;">
        <img v-if="this.$store.state.mainPage.projectEvent.bgcolor != ''" :src="this.$store.state.mainPage.projectEvent.tempBase64" :style="{ background: this.$store.state.mainPage.projectEvent.bgcolor }" class="detail_icon" />
        <img v-else="this.$store.state.mainPage.projectEvent.bgcolor == ''" :src="this.$store.state.mainPage.projectEvent.tempBase64" style="background:#999999" class="detail_icon" />
        <ul style="display: inline-block;margin-top: 20px;height:8vh;margin-left:15%">
          <li style="font-size: 25px;font-weight: bolder;" :title="this.$store.state.mainPage.projectEvent.name">
            {{
                    this.$store.state.mainPage.projectEvent.name.length > 15
                      ? this.$store.state.mainPage.projectEvent.name.substring(0, 12) + "..."
                      : this.$store.state.mainPage.projectEvent.name
                  }}
          </li>
          <li style="margin-top: 1vh" :title="this.$store.state.mainPage.projectEvent.modelsName">
            {{ this.$store.state.mainPage.projectEvent.modelsName }}
          </li>
        </ul>
      </div>
      <img v-if="this.$store.state.mainPage.projectEvent.modelsId.indexOf('scj') == -1" src="@/views/jpass/img/start.svg" style="float: right;margin-right:8%;margin-top:3%;" @click="favorite(this.$store.state.mainPage.projectEvent)" />
      <img v-if="this.$store.state.mainPage.projectEvent.modelsId.indexOf('scj') != -1" src="@/views/jpass/img/start_sc.svg" style="float:right;margin-right:8%;margin-top:3%;" @click="unfavorite(this.$store.state.mainPage.projectEvent)" />
    </el-form-item>
    <template v-for="(data, index) in this.$store.state.mainPage.projectEvent.datas">
      <el-form-item v-if="data.type === 'password' && !showPassword && data.val != ''" :label="data.tempkey" :prop="data.tempkey" style="margin-bottom:3px;" :key="index">
        <input type="password" v-model="data.val" readonly style="width:90%;color: #606266" />
        <a href="#" @click="changePass($event)">
          <i class="el-icon-view"></i>
        </a>
        <div style="width:50%;display: inline-block;line-height: 10px; vertical-align: middle;">
          <el-progress id="process" :stroke-width="15" :percentage="data.percentage" :show-text="false" :color="data.pwdstatus"></el-progress>
        </div>
        <span style="margin-left: 5%;">{{ data.format }}</span>
        <hr />
      </el-form-item>
      <el-form-item v-else-if="
                data.type === 'password' && showPassword && data.val != '' " :label="data.tempkey" :prop="data.tempkey" style="margin-bottom:3px;" :key="data.tempkey">
        <input type="text" v-model="data.val" readonly style />
        <a href="#" @click="changePass($event)">
          <i class="el-icon-view"></i>
        </a>
        <div style="width:50%;display: inline-block;line-height: 10px; vertical-align: middle;">
          <el-progress id="process" :stroke-width="15" :percentage="data.percentage" :color="data.pwdstatus" :show-text="false"></el-progress>
        </div>
        <span style="margin-left: 5%;">{{ data.format }}</span>
        <hr />
      </el-form-item>
      <el-form-item v-else-if="data.type === 'text' && data.val != ''" :label="data.tempkey" :prop="data.tempkey" :key="data.tempkey" style="margin-bottom:3px;">
        <input type="text" v-model="data.val" readonly />
        <hr />
      </el-form-item>
      <el-form-item v-else-if="data.type === 'website' && data.val != ''" :label="data.tempkey" :prop="data.tempkey" :key="data.tempkey" style="margin-bottom:3px;">
        <input type="text" v-model="data.val" readonly />
        <a :href="data.val.indexOf('https://') == -1 &&data.val.indexOf('http://') == -1? 'https://' + data.val: data.val" target="_blank">
          <i class="el-icon-info"></i>
        </a>
        <hr />
      </el-form-item>
      <el-form-item v-else-if="data.type === 'login' && data.val != ''" :label="data.tempkey" :prop="data.tempkey" :key="data.tempkey" style="margin-bottom:3px;">
        <input type="text" v-model="data.val" readonly />
        <hr />
      </el-form-item>
      <el-form-item v-else-if="data.type === 'date' && data.val != ''" :label="data.tempkey" :prop="data.tempkey" :key="data.tempkey" style="margin-bottom:3px;">
        <input type="text" v-model="data.val" readonly />
        <hr />
      </el-form-item>
    </template>
    <template v-for="(data, index) in this.$store.state.mainPage.projectEvent.note">
      <el-form-item v-if="data.notes != ''" :label="data.tempkey" :prop="data.tempkey" :key="data.tempkey" style="margin-bottom:3px;">
        <div id="textarea" ref="textarea" v-html="data.notes.replace(/\n|\r\n/g, '<br />')" style="border:0;white-space: pre-wrap;" readonly></div>
        <hr />
      </el-form-item>
    </template>
    <el-button v-if="this.$store.state.mainPage.projectEvent != '' && this.$store.state.mainPage.projectEvent.isDel != true" size="small" @click="editProject()" style="margin-left: 3%">{{ $t("main.modify") }}</el-button>
    <el-button v-if="this.$store.state.mainPage.projectEvent != '' && this.$store.state.mainPage.projectEvent.isDel == true" size="small" @click="dialogRecover = true">{{ $t("main.recover") }}</el-button>
  </el-form>
</template>
<script>
export default {
  props: ["value"],
  data () {
    return {
      ruleFormProjectDetail: {
        name: ""
      },
      showPassword: this.$store.state.mainPage.showPassword,

    };

    me
  },

}
</script>