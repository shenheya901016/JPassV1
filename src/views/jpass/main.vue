<template>

  <body class="sy" @mousemove="GetXYPosition">
    <!-- 头部 -->
    <header class="header">
      <!-- 全局隐藏域 -->
      <img :src="`${publicPath}img/misc/lock.svg`" ref="icon_default" style="display: none" />
      <h1 style="margin-left: 40px;">
        <a href="#">
          <img src="./img/Logo-4.svg" alt />
        </a>
      </h1>
      <ul class="link">
        <li>
          <el-button @click="addDirectoryOP" style="border:0;padding: 5px 5px;">
            <img style="top:-2px;height: 25px;width: 25px;" src="./img/tianjiawenjianjia.svg" alt />
            {{ $t("main.newFolder") }}
          </el-button>
        </li>
        <li>
          <el-button @click="addNote" style="border:0;padding: 5px 5px;">
            <img style="top:-2px;height: 20px;width: 20px;" src="./img/moban.svg" alt />
            {{ $t("main.newNote") }}
          </el-button>
        </li>
        <li>
          <el-button @click="selectTemplate" style="border:0;padding: 5px 5px;">
            <img style="top:-2px;height: 20px;width: 20px;" src="./img/tianjiaxiangmu.svg" alt />
            {{ $t("main.newProject") }}
          </el-button>
        </li>
        <li>
          <el-button :disabled="this.$store.state.mainPage.isDisabled" @click="remove" id="delbtn" style="border:0;padding: 5px 5px;">
            <img style="top:-2px;" src="./img/ICON-SC.svg" alt />
            {{ $t("main.delete") }}
          </el-button>
        </li>
        <li>
          <el-button v-if="this.$store.state.mainPage.showTrash == true" style="border:0;padding: 5px 5px;" @click="dialogclearTrash = true">
            <img style="top:-2px;height: 25px;width: 25px;" src="./img/trash.svg" alt />
            {{ $t("main.cleartrash") }}
          </el-button>
        </li>
        <li>
          <el-button style="border:0;padding:5px 5px;" @click="synchronization()">
            <img style="top:-2px;" src="./img/ICON-TB.svg" />
            {{ $t("main.synchronize") }}
          </el-button>
        </li>
        <li>
          <el-button style="border:0;padding: 5px 5px;" @click="lockSystem()">
            <img style="top:-2px;" src="./img/ICON-SD.svg" alt />
            {{ $t("main.locking") }}
          </el-button>
        </li>
        <li>
          <el-button style="border:0;padding: 5px 5px;" @click="passwordGeneratorMain()">
            <img style="top:-2px;height: 25px;width: 25px;" src="./img/钥匙.svg" alt />
            {{ $t("main.PasswordGenerator") }}
          </el-button>
        </li>
        <li>
          <el-button style="border:0;padding: 5px 5px;">
            <img alt src="./img/download.svg" style="top:-2px;height: 25px;width: 25px;" />
            {{ $t("main.export") }}
          </el-button>
        </li>
        <li>
          <el-button style="border:0;padding: 5px 5px;">
            <img alt src="./img/upload.svg" style="top:-2px;height: 25px;width: 25px;" />
            {{ $t("main.import") }}
          </el-button>
        </li>
      </ul>
      <div class="hr" style="width: 40%;">
        <a style="width: 50px;" @click="openSetting">
          <img style="height:30px;" src="./img/icon_sz.svg" alt />
        </a>
        <div>
          <img style="height:50px;" src="./img/tx.svg" @click="myInfo" alt />
        </div>
        <el-button style="border:0;height: 50px;margin: auto 0;" @click="logOut">
          <img style="top:-2px;height: 25px;width: 25px;" src="./img/退出登录.svg" alt />
        </el-button>
      </div>
    </header>
    <!-- 侧边栏 -->
    <aside class="aside">
      <!-- 导航栏 -->
      <nav class="nav" style>
        <h3>Jpass</h3>
        <ul class="dh" id="projectUL" style>
          <li v-for="(project, index) in this.$store.state.mainPage.DProject.project" @click="projectclick(project, $event)" :data-index="index" :class="index == currentProjectTemp ? click : disclick" @contextmenu.prevent="openMenu_1(project, $event)" :key="index">
            <span>
              {{ project.name }}
              <i>{{ project.count }}</i>
            </span>
          </li>
        </ul>
        <h3>{{ $t("main.folder") }}</h3>
        <ul class="wjj" style="display: flex;flex-direction: column;padding: 0 1.8vw 0 2.5vw;">
          <li style="height: 35px;line-height: 35px;border-radius: 7px;margin-bottom: 2%" v-for="(project, index) in this.$store.state.mainPage.DDirectory.directory" @click.left="directoryclick(project, $event)" @dblclick="rename()" :data-index="index"
            :class="index == currentDirectoryTemp ? click : disclick" @contextmenu.prevent="openMenu_1(project, $event)" :key="index">
            <img style="height: 35px;width: 20px;float: left;text-align: left;margin-left: 2px" :src="`${publicPath}img/directory/${project.imgPath}`" alt />
            <span :title="project.name" style="float: left;text-align: left;margin-left:3%;">{{
                project.name.length > 5
                  ? project.name.substring(0, 5) + "..."
                  : project.name
              }}</span>
            <i style="float: right;color: #A8B1C6;width: 47px;height: 23px;text-align: center;border-radius: 11.5px;line-height: 23px; margin-top: 7px;position: absolute;right: 2vw;">{{ project.count }}</i>
          </li>
        </ul>
        <h3>{{ $t("main.special") }}</h3>
        <ul class="special" style>
          <li v-for="(project, index) in this.$store.state.mainPage.DSpecial.special" @click="specialclick(project, $event)" :data-index="index" :class="index == currentSpecialTemp ? click : disclick" @contextmenu.prevent="openMenu_1(project, $event)" :key="index">
            <span>
              {{ project.name }}
              <i>{{ project.count }}</i>
            </span>
          </li>
        </ul>
      </nav>

      <!-- 副导航栏 -->
      <article class="article" @click.right="openMenu_empty($event)">
        <input class="ss" type="text" v-model="searchTemp" :placeholder="$t('main.pleaseEnterWhatYouWantToSearch')" @input="search(searchTemp)" />
        <ul class="list">
          <li v-for="(project, index) in this.$store.state.mainPage.projects" @click.left="noteslick(project, $event)" :data-index="index" :class="index == currentNoteTemp || project.checked ? click : disclick" style="margin-top: 5px;" @contextmenu.prevent="openMenu_1(project, $event)" :key="index">
            <span>
              <img :src="project.tempBase64" :style="{ background: project.bgcolor }" class="list_icon" />
            </span>
            <div style="width: 70%;text-align: left;">
              <h5 :title="project.name">
                {{
                  project.name.length > 13
                    ? project.name.substring(0, 13) + "..."
                    : project.name
                }}
              </h5>
              <span :title="project.modelsName">{{
                project.modelsName.length > 12
                  ? project.modelsName.substring(0, 12) + "..."
                  : project.modelsName
              }}</span>
            </div>
            <span style="float: right;height:5.5vh;">
              <img v-if="project.modelsId.indexOf('weakPwd') != -1" src="./img/gantanlist.svg" />
              <img v-if="
                  project.modelsId.indexOf('scj') == -1 &&
                    project.modelsId.indexOf('weakPwd') == -1
                " src="./img/start.svg" @click="favorite(project)" />
              <img v-if="
                  project.modelsId.indexOf('scj') != -1 &&
                    project.modelsId.indexOf('weakPwd') == -1
                " src="./img/start_sc.svg" @click="unfavorite(project)" />
            </span>
          </li>
        </ul>
      </article>
      <section class="section">
        <!--明细-->
        <detail></detail>
      </section>
      <!--密码生成器-->
      <passwordGenerator :dialogopen="dialogPasswordGenerator" @dialogPasswordGeneratorclose="closedialog" @transpassword="getPassword" :dialogclose="dialogclose" @recoverdialogtag="recovertag"></passwordGenerator>
      <!--主密码生成器-->
      <passwordGeneratorMain :dialogopenMain="dialogPasswordGeneratorMain" @dialogPasswordGeneratorcloseMain="closedialogMain" :dialogcloseMain="dialogcloseMain" @onCopy="onCopy" @onError="onError"></passwordGeneratorMain>
      <!--支付-->
      <pay :dialogopen="dialogPayGenerator" @dialogPayGeneratorclose="closedialogPay"></pay>
      <!--鎖定框-->
      <lockSystem v-model="dialogVisible" @closeLock="closeLock"></lockSystem>
      <!--同步-->
      <synchronization v-model="dialogSynchronization" @closeSynchronization="closeSynchronization" @locksystem="locksystem"></synchronization>
      <!--个人信息-->
      <myInfo v-model="dialogMyInfo" @closeMyInfo="closeMyInfo"></myInfo>
      <!--设置-->
      <setting v-model="dialogVisibleSetting" @closeSetting="closeSetting" @locksystem="locksystem"></setting>
      <!--删除，清空垃圾桶自检-->
      <remove :dialogVisibledDataM="dialogVisibledData" @closeDialogVisibledData="closeDialogVisibledData" :dialogVisibledProjectDelM="dialogVisibledProjectDel" @closeDialogVisibledProjectDel="closeDialogVisibledProjectDel" :dialogclearTrashM="dialogclearTrash"
        @closeDialogclearTrash="closeDialogclearTrash" :dialogVisibledDirectoryM="dialogVisibledDirectory" @closeDialogVisibledDirectory="closeDialogVisibledDirectory"></remove>
      <!--新建标签-->
      <directory :dialogVisible2M="dialogVisible2" @closeDialogVisible2="closeDialogVisible2" :dialogVisibleRenameM="dialogVisibleRename" @closeDialogVisibleRename=closeDialogVisibleRename></directory>
      <!--右击菜单-->
      <menu_1></menu_1>
    </aside>

  </body>
</template>
<script type="es6">
import isElectron from "is-electron";
import low from "lowdb";
import LocalStorage from "lowdb/adapters/LocalStorage";
import password from "../../password.js";
import ipfs from "@/jcc_ipfs.js";
let FileSaver = require("file-saver");
import config from "../../../package.json";
const util = require("util");
let request = require("request");
let timecurl = "http://api.m.taobao.com/";


//判断是否为开发者模式
if (process.env.NODE_ENV === "development") {
  timecurl = "http://localhost:8080/altime/";
}
export default {
  created () {
    this.$store.commit("keyevent");
  },
  mounted: function () {
    this.$store.state.mainPage.lockFlag = localStorage.getItem("lockFlag") === "true";//锁定状态
    this.$store.state.mainPage.autoStartFlag = localStorage.getItem("autoStartFlag") === "true";//锁定状态
    if (this.$store.state.mainPage.lockFlag) {
      window.ipcRenderer.send("disableLock")//启用锁定快捷键
      if (window.ipcRenderer.sendSync("isRegistered")) {
        this.$store.state.mainPage.autoStartFlag = false;
        alert("锁定快捷键,已被其他应用占用");
        return;
      }
      window.ipcRenderer.send("enableLock")//启用锁定快捷键
    }
    if (this.$store.state.mainPage.autoStartFlag) {
      window.ipcRenderer.send("setLoginItemSettings", this.$store.state.mainPage.autoStartFlag);//是否启用开机自启
    }
    window['lock'] = () => {
      this.lock();
    };
    //网络检查
    window.addEventListener("online", this.online);
    window.addEventListener("offline", this.outline);
    //阻止浏览器右击菜单
    window.oncontextmenu = function () {
      return false;
    };
    this.initialize();
    this.unshow();
  },

  //销毁监听事件
  beforeDestroy () {
    window.removeEventListener("online", this.online);
    window.removeEventListener("offline", this.outline);
  },


  data () {
    return {
      //密码框
      dialogPasswordGenerator: false, // 密码生成器弹出框
      dialogPasswordGeneratorMain: false, //主密码生成器弹出框
      dialogclose: false, //关闭密码器指示
      dialogcloseMain: false, //关闭密码器指示
      dialogVisible: false,//锁定弹出框
      templateItemsTemp: "",
      templateItems: {
        templateItems: [
          {
            id: "fdbce150-fec4-11e9-bd32-854c67bf088b",
            key: this.$t("selects.password"),
            type: "password",
            val: "",
            tempkey: "Password",
            percentage: 0,
            pwdstatus: ""
          },
          {
            id: "fdbce150-fec4-11e9-bd32-854c67bf388b",
            key: this.$t("selects.number"),
            type: "text",
            val: "",
            tempkey: "Number"
          },
          {
            id: "fdbce150-fec4-11e9-bd32-984c67bf088b",
            key: this.$t("selects.email"),
            type: "text",
            val: "",
            tempkey: "Email"
          },
          {
            id: "fdbce150-fec4-11e9-bd32-854d67bf088b",
            key: this.$t("selects.address"),
            type: "text",
            val: "",
            tempkey: "Address"
          },
          {
            id: "fdbce150-fec4-11e9-bd32-854d35bf088b",
            key: this.$t("selects.login"),
            type: "login",
            val: "",
            tempkey: "Login"
          },
          {
            id: "fdbce150-fec4-11e9-bd32-898d67bf088b",
            key: this.$t("selects.phone"),
            type: "text",
            val: "",
            tempkey: "Phone"
          },
          {
            id: "fdbce150-fec4-11e9-bd32-908d67bf088b",
            key: this.$t("selects.date"),
            type: "date",
            val: "",
            tempkey: "Date"
          },
          {
            id: "fdbce150-fec4-11e9-bd32-854c67bf397b",
            key: this.$t("selects.webside"),
            type: "website",
            val: "",
            tempkey: "Website"
          }
        ]
      },
      operateTemplates: "",
      templates: {
        templates: [
          {
            id: "01",
            name: "membership",
            modelsId: ["mb"],
            modelsName: "模板",
            type: "template",
            isDel: false,
            imgtype: "url",
            imgurl: `${process.env.BASE_URL}img/misc/lock.svg`,
            hasnote: false,
            isnote: false, //笔记类型
            note: "",
            checked: false,
            datas: [
              {
                id: "fdbce150-fec4-11e9-bd45-854c67bf088b",
                key: "Number",
                type: "text",
                val: "",
                tempkey: "Number"
              },
              {
                id: "fdbce182-fec4-11e9-bd32-854c67bf088b",
                key: "Login",
                type: "text",
                val: "",
                tempkey: "Login"
              },
              {
                id: "fdbce150-fob4-11e9-bd32-854c67bf088b",
                key: "Password",
                type: "password",
                val: "",
                tempkey: "Password",
                percentage: 0,
                pwdstatus: ""
              },
              {
                id: "fdbce196-fec4-11e9-bd32-854c67bf088b",
                key: "Website",
                type: "website",
                val: "",
                tempkey: "Website"
              },
              {
                id: "fdbce150-fec4-11e9-bd32-854c67bf987b",
                key: "Phone",
                type: "text",
                val: "",
                tempkey: "Phone"
              }
            ]
          },
          {
            id: "02",
            name: "EmailAccount",
            modelsId: ["mb"],
            modelsName: "模板",
            type: "template",
            isDel: false,
            imgtype: "url",
            hasnote: false,
            isnote: false, //笔记类型
            note: "",
            imgurl: `${process.env.BASE_URL}img/misc/lock.svg`,
            hasnote: false,
            isnote: false, //笔记类型
            note: "",
            checked: false,
            datas: [
              {
                id: "fdbce183-fec4-11e9-bd32-854c67bf088b",
                key: "Email",
                type: "text",
                val: "",
                tempkey: "Email"
              },
              {
                id: "fdbce269-fec4-11e9-bd32-854c67bf088b",
                key: "Password",
                type: "password",
                val: "",
                tempkey: "Password",
                percentage: 0,
                pwdstatus: ""
              },
              {
                id: "fffce150-fec4-11e9-bd32-854c67bf088b",
                key: "Website",
                type: "website",
                val: "",
                tempkey: "Website"
              },
              {
                id: "fdbce161-fec4-11e9-bd32-854c67bf088b",
                key: "One-time Password",
                type: "text",
                val: "",
                tempkey: "One-time Password"
              }
            ]
          },
          {
            id: "03",
            name: "Login/Password",
            modelsId: ["mb"],
            modelsName: "模板",
            type: "template",
            isDel: false,
            imgtype: "url",
            hasnote: false,
            isnote: false, //笔记类型
            note: "",
            imgurl: `${process.env.BASE_URL}img/misc/lock.svg`,
            hasnote: false,
            isnote: false, //笔记类型
            note: "",
            checked: false,
            datas: [
              {
                id: "fdbce150-fec4-20e9-bd32-854c67bf088b",
                key: "Website",
                type: "website",
                val: "",
                tempkey: "Website"
              },
              {
                id: "fdbce150-fec4-18e9-bd32-854c67bf088b",
                key: "Name",
                type: "text",
                val: "",
                tempkey: "Name"
              },
              {
                id: "fdbce150-feb9-11e9-bd32-854c67bf088b",
                key: "Password",
                type: "password",
                val: "",
                tempkey: "Password",
                percentage: 0,
                pwdstatus: ""
              }
            ]
          }
        ]
      },
      dialogMyInfo: false, //个人信息弹出框
      dialogVisibleSetting: false, //设置弹出框





      isScj: false,
      progressDialog: false,
      progress: 0,
      //setting

      updateDialog: false,
      //   package_version: "0.0.0",
      //   auto_update: false,
      options: [
        {
          value: "jpassword",
          label: "jpassword"
        },
        {
          value: "safeincloud",
          label: "safeincloud"
        },
        {
          value: "1password",
          label: "1password"
        }
      ],
      importFileDialog: false,
      import_file_type: "jpassword",
      isCover: false,
      //   checkedArray: [],
      dialogVisibleNoteEdit: false, //修改笔记
      dialogVisibleAddNote: false, //增加笔记
      network: true,
      publicPath: process.env.BASE_URL,
      status: "#E5E9F2",
      templatedisable: true,
      dialogPayGenerator: false, //支付页面弹出框
      product: "product",
      dialogVisiblePay: false,
      temppassword: "",
      savePasswords: [],
      //   lockFlag: localStorage.getItem("lockFlag"), //锁定状态
      //   autoStartFlag: localStorage.getItem("autoStartFlag"), //开机自启状态
      //   locktimedisabled: "",
      showpass: "", //弹出框
      ImageBase64: "",
      color: "#999999",
      ruleFormRename: false,
      dialogVisibleRename: false, //文件夹重命名
      dialogSymbolcolor: false, //图片库颜色
      dialogDirlcolor: false, //文件夹图片颜色
      dialogSymbol: false, //图片库

      dialogVisible2: false, //增加文件夹弹出框
      dialogVisibledDirectory: false, //删除文件夹弹出框
      dialogVisibledProject: false, //删除项目弹出框
      dialogVisibledData: false, //删除项目弹出框
      //   dialogVisibledTemplate: false, //删除模板弹框
      dialogVisibledProjectDel: false, //删除项目弹出框(直接删除)
      dialogVisibleTemplate: false, //模板弹出框
      dialogVisibleAddProject: false, //增加项目弹出框
      dialogVisibleItems: false, //增加Items 弹出框
      dialogVisibleEdit: false, //修改项目弹出框
      dialogVisibleAddTemplate: false, //增加模板
      dialogVisibleAddTempItems: false, //增加模板项弹出框
      dialogVisibleTemplateEdit: false, //修改模板弹出框
      dialogVisibleItemsEdit: false, //修改模板项弹出框

      dialogRecover: false, //恢复弹出框
      dialogclearTrash: false, //清空垃圾箱
      dialogSynchronization: false, //同步数据提示
      mouse1: "",
      mouse2: "",
      eventID: "",
      currentSecond: 5,
      password: "",
      loginObj: this.$JSON5.parse(sessionStorage.getItem("userkeyObj")),
      currentTemplate: this.$store.state.mainPage.currentTemplate,
      DSpecial: "",
      click: "click",
      disclick: "disclick",
      delobj: "",
      isDisabled: true,
      percentage: 0,
      percentageTemplate: 0,
      tempPercentage: 0,
      synStatus: "exception", //同步进度条状态
      templateStatus: "exception",
      localData: "", //本地数据
      processShow: false, //同步进度条是否显示
      //   projectEvent: "",
      //   labels: "",
      //   selectlabels: "",
      filed: "", //添加项
      filedName: "", //添加项名称
      editobject: "", //修改对象
      tempTemplate: [], //新增模板构造变量

      templateEvent: "",
      searchTemp: "",
      imageBase64: "",
      imgHash: "",
      imgtype: "",
      imgurl: "",
      //   username: "",
      key: "",
      //   myInfoKey: "",
      //   directoryClickId: "sy",
      //   showTrash: "false",
      activeIndex: "1",
      activeIndex2: "1",
      show: "none",
      operationType: "", //symbol 新建或修改对象类型
      //   //menu 右击菜单
      //   addNoteClasses: [], //新建笔记样式表
      //   renameClasses: [], //rename
      //   addDirClasses: [], //新建文件夹样式表
      //   addProjectClasses: [], //新建项目样式表
      //   addTemplateClasses: [], //新建模板样式表
      //   emptyTrashClasses: [], //清空垃圾样式表
      //   deleteClasses: [], //删除样式表
      //   recoverClass: [], //恢复样式表
      //   selectColorClasses: [], //选择颜色样式表
      newProject: {
        id: "",
        name: "",
        modelsId: [],
        modelsName: "",
        type: "project",
        datas: "",
        dateTime: "",
        tempBase64: "",
        imgHash: "",
        imgtype: "",
        imgurl: "",
        isDel: false,
        bgcolor: "",
        hasnote: false,
        isnote: false, //笔记类型
        note: "",
        checked: false
      },
      newTemplate: {
        id: "",
        name: "",
        modelsId: ["mb"],
        modelsName: "模板",
        type: "template",
        datas: [],
        tempBase64: "",
        imgHash: "",
        imgtype: "",
        imgurl: "",
        isDel: false,
        bgcolor: "",
        hasnote: false,
        isnote: false, //笔记类型
        note: "",
        checked: false
      },


      settings: {
        systemlock: true, //锁定开关
        locktime: 5, //自动锁定时间
        language: "中文", //语言选择
        showPassword: false, //是否显示密码
        savePassword: "ask"
      },
      ruleFormAddProject: {
        name: "",
        models: ""
      },
      ruleFormProjectEdit: {},
      ruleFormAddTemplate: {
        name: ""
      },
      ruleFormAddTtemp: {
        filedName: ""
      },
      ruleFormAddTEdit: {
        filedName: ""
      },
      ruleFormAddPro: {
        filedName: ""
      },
      ruleFormTemplateEdit: {},
      ruleFormAddNote: {
        notes: "",
        name: ""
      },
      ruleFormNoteEdit: {
        notes: "",
        name: ""
      },

      rules: {
        filedName: [
          {
            required: true,
            message: this.$t("main.pleaseEnterAName"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    currentProjectTemp: function () {
      return this.$store.state.mainPage.currentProject;
    },
    currentSpecialTemp: function () {
      return this.$store.state.mainPage.currentSpecial;
    },
    currentDirectoryTemp: function () {
      return this.$store.state.mainPage.currentDirectory;
    },
    currentNoteTemp: function () {
      return this.$store.state.mainPage.currentNote;
    }
  },
  methods: {
    //打开密码生成器
    passwordGenerator (data) {
      this.temppassword = data;
      this.dialogPasswordGenerator = true;
      this.percentage = 0;
    },
    //子组件关闭后还原dialogPasswordGenerator为false
    closedialog (data) {
      this.dialogPasswordGenerator = data;
    },
    //密码器赋值
    getPassword (data) {
      this.temppassword.val = data;
      //更新进度条
      this.pwdLength(this.temppassword);
      this.dialogclose = true;
    },
    //子组件关闭后还原dialogclose值为false
    recovertag (data) {
      this.dialogclose = data;
    },

    //主密码器
    passwordGeneratorMain () {
      this.dialogPasswordGeneratorMain = true;
      this.percentage = 0;
    },
    //子组件关闭后还原dialogPasswordGenerator为false
    closedialogMain (data) {
      this.dialogPasswordGeneratorMain = data;
    },
    //子组件关闭后还原dialogPayGenerator为false
    closedialogPay (data) {
      this.dialogPayGenerator = data;
    },
    //手动触发锁定
    lockSystem () {
      this.$store.state.mainPage.loginObj.lock = true;
      sessionStorage.setItem("userkeyObj", this.$JSON5.stringify(this.$store.state.mainPage.loginObj));
      this.dialogVisible = true;
    },
    //关闭锁定弹出框
    closeLock (data) {
      this.dialogVisible = data;
    },

    //关闭同步框
    closeSynchronization (data) {
      this.dialogSynchronization = data;
    },

    closeDialogVisibledData (data) {
      this.dialogVisibledData = data;
    },
    closeDialogVisibledProjectDel (data) {
      this.dialogVisibledProjectDel = data;
    },
    closeDialogclearTrash (data) {
      this.dialogclearTrash = data;
    },

    closeDialogVisibledDirectory (data) {
      this.dialogVisibledDirectory = data;
    },

    closeDialogVisible2 (data) {
      this.dialogVisible2 = data;
    },

    closeDialogVisibleRename (data) {
      this.dialogVisibleRename = data;
    },

    GetXYPosition () {
      var x, y;
      var e = window.event;
      x =
        e.clientX +
        document.body.scrollLeft +
        document.documentElement.scrollLeft;
      y =
        e.clientY +
        document.body.scrollTop +
        document.documentElement.scrollTop;
      this.mouse2 = x + "," + y;
    },
    CheckTime () {
      let timeout = this.$store.state.mainPage.locktime * 60 * 1000; //设定超时时间，单位毫秒
      if (this.mouse1 == this.mouse2) {
        this.currentSecond = this.currentSecond + 1000;
        if (this.currentSecond > timeout) {
          clearInterval(this.eventID);
          this.dialogVisible = true;
          this.$store.state.mainPage.loginObj.lock = true;
          sessionStorage.setItem("userkeyObj", this.$JSON5.stringify(this.$store.state.mainPage.loginObj)
          );
          this.currentSecond = 0;
        }
      } else {
        this.currentSecond = 0;
        this.mouse1 = this.mouse2;
      }
    },
    //退出登录
    logOut () {
      sessionStorage.removeItem("userkeyObj");
      localStorage.removeItem("userkeyObj");
      this.$router.push("/jpass/login");
    },

    online () {
      this.network = true;
    },
    outline () {
      this.network = false;
    },

    //密码显示控制
    changePass (e) {
      this.$store.commit('changePass', e);
    },

    //用户信息
    async myInfo () {
      const getPromise = util.promisify(request.get);
      let url = "https://stats.jccdex.cn/sum/jpassword/get_charge_list/:uuid?w=" + this.$store.state.mainPage.myInfoKey + "&t=0";
      let result = await getPromise(url);
      let msg = this.$JSON5.parse(result.body);
      if (msg.data.list.length > 0) {
        this.$store.commit("formatDate", msg.data.list[0].end_time);
        this.$store.state.mainPage.vip = this.$store.state.utils.vipTime;
      } else {
        this.$store.state.mainPage.vip = this.$t("main.notvip");
      }
      this.dialogMyInfo = true;
    },
    //关闭用户信息
    closeMyInfo (data) {
      this.dialogMyInfo = data;
    },

    //打开设置页面
    openSetting () {
      this.dialogVisibleSetting = true;
      this.$store.state.mainPage.package_version = config.version;
    },
    //关闭设置页面
    closeSetting (data) {
      this.dialogVisibleSetting = data;
    },


    addDirectoryOP () {
      this.dialogVisible2 = true;
    },

    projectclick (note, event) {
      this.clearChecked();
      var target = event.currentTarget;
      var index = Number(target.getAttribute("data-index"));
      console.log(index);
      this.$store.state.mainPage.currentProject = index;
      this.$store.state.mainPage.currentDirectory = -1;
      this.$store.state.mainPage.currentSpecial = -1;
      this.$store.state.mainPage.currentNote = -1;
      this.$store.state.mainPage.isDisabled = true;
      this.$store.state.mainPage.delobj = note;
      this.$store.state.mainPage.directoryClickId = note.id;
      this.$store.dispatch('notesBytargeId', note);
      this.searchTemp = ""; //清空搜索框
      this.$store.state.mainPage.projectEvent = "";
    },
    specialclick (note, event) {
      this.clearChecked();
      var target = event.currentTarget;
      var index = Number(target.getAttribute("data-index"));
      this.$store.state.mainPage.currentSpecial = index;
      this.$store.state.mainPage.currentProject = -1;
      this.$store.state.mainPage.currentDirectory = -1;
      this.$store.state.mainPage.currentNote = -1;
      this.$store.state.mainPage.isDisabled = true;
      this.$store.state.mainPage.delobj = note;
      this.$store.state.mainPage.directoryClickId = note.id;
      this.$store.dispatch('notesBytargeId', note);
      this.searchTemp = ""; //清空搜索框
      this.$store.state.mainPage.projectEvent = "";
    },
    directoryclick (note, event) {
      this.clearChecked();
      var target = event.currentTarget;
      var index = Number(target.getAttribute("data-index"));
      this.$store.state.mainPage.currentDirectory = index;
      this.$store.state.mainPage.currentProject = -1;
      this.$store.state.mainPage.currentSpecial = -1;
      this.$store.state.mainPage.currentNote = -1;
      this.$store.state.mainPage.delobj = note;
      this.$store.state.mainPage.isDisabled = false;
      this.$store.state.mainPage.directoryClickId = note.id;
      this.searchTemp = ""; //清空搜索框
      this.$store.state.mainPage.projectEvent = "";
      this.$store.dispatch('notesBytargeId', note);
    },
    noteslick (project, event) {
      //更新密码强度（中英文切换）
      let items = project.datas;
      for (var item in items) {
        if (items[item].type == "password") {
          this.$store.commit("cryptLevel", items[item].val);
          items[item].format = this.$store.state.utils.des;
          this.$store.commit("getPercentage", items[item].val);
          items[item].percentage = this.$store.state.utils.percentage;
          items[item].pwdstatus = this.$store.state.utils.status;
        }
      }
      let target = event.currentTarget;
      let index = Number(target.getAttribute("data-index"));
      this.$store.state.mainPage.currentNote = index;
      this.$store.state.mainPage.delobj = project;
      this.$store.state.mainPage.isDisabled = false;
      this.$store.state.mainPage.projectEvent = project;
      if (this.$store.state.utils.isctrl == true) {
        let repetitive = false; //判断是否重复标识
        if (this.$store.state.mainPage.checkedArray.length > 0) {
          //array>0时判断是否有重复，重复不加入新对象
          this.$store.state.mainPage.checkedArray.forEach(item => {
            if (item.id == project.id) {
              repetitive = true;
            }
          });
          if (!repetitive) {
            project.checked = true;
            this.$store.state.mainPage.checkedArray.push(project);
            console.log(this.$store.state.mainPage.checkedArray);
          }
        } else {
          project.checked = true;
          this.$store.state.mainPage.checkedArray.push(project);
        }
      } else {
        this.clearChecked();
        project.checked = true;
        this.$store.state.mainPage.checkedArray.push(project);
        console.log(this.$store.state.mainPage.checkedArray);
      }
    },

    remove () {
      let type = this.$store.state.mainPage.delobj.type;
      console.log(type);
      console.log(this.$store.state.mainPage.checkedArray.length);
      //多选操作
      if (this.$store.state.mainPage.checkedArray.length > 0) {
        //通过数字第一个对象判断其类型
        if (
          this.$store.state.mainPage.checkedArray[0].type == "project" &&
          this.$store.state.mainPage.checkedArray[0].isDel != true
        ) {
          this.dialogVisibledData = true;
        }
        if (
          this.$store.state.mainPage.checkedArray[0].type == "template" &&
          this.$store.state.mainPage.checkedArray[0].isDel != true
        ) {
          this.dialogVisibledData = true;
        }

        if (this.$store.state.mainPage.checkedArray[0].isDel == true) {
          this.dialogVisibledProjectDel = true;
        }
      } else {
        console.log("单独操作");
        //单选操作
        if (type == "model") {
          this.dialogVisibledDirectory = true;
        }
        if (type == "project" && this.delobj.isDel != true) {
          this.dialogVisibledData = true;
        }

        if (type == "template" && this.delobj.isDel != true) {
          this.dialogVisibledData = true;
        }
        if (this.$store.state.mainPage.delobj.isDel == true) {
          this.dialogVisibledProjectDel = true;
        }
      }
    },



    //启动加载
    async initialize () {
      let loginObj = this.$JSON5.parse(sessionStorage.getItem("userkeyObj"));
      this.$store.state.mainPage.loginObj = loginObj;
      let address = this.$store.state.mainPage.loginObj.address;
      let secret = this.$store.state.mainPage.loginObj.secret;
      this.$store.state.mainPage.myInfoKey = address;
      this.$store.state.mainPage.username = this.$store.state.mainPage.loginObj.name;
      let db_name = "db_" + address;
      this.$store.state.mainPage.db = await this.$Lowdb(db_name);
      this.$store.state.mainPage.localdb = await this.$Lowdb(db_name + "_local");
      //取ipfs数据
      let ipfsData = await this.$myIpfs.Ipfs.read(secret, "/main", address);
      ipfsData = this.$JSON5.parse(ipfsData); //ipfs转成对象
      ipfsData = this.$JSON5.parse(this.$JSON5.stringify(ipfsData)); //序列化新对象
      this.templateItemsTemp = this.$JSON5.parse(this.$JSON5.stringify(this.templateItems)); //初始化模板添加选项
      if (this.$store.state.mainPage.db.get("machineId").value() == undefined) {
        //判断machineId是否undefind
        if (ipfsData.machineId == "" || ipfsData.machineId == undefined) {
          //初始化新数据
          let profiles = {
            name: loginObj.name,
            address: address
          };
          let newdata = this.$JSON5.parse(
            '{"profiles":"' +
            this.$JSON5.stringify(profiles) +
            '","project":[],"models":[{"id":"sy","name":"allProjects","modelsType":"project","type":"model"}, {"id":"scj","name":"favorites","modelsType":"project","type":"model"}, {"id":"mm","name":"password","modelsType":"project","type":"model"}, {"id":"mb","name":"template","modelsType":"project","type":"model"}, {"id":"wbj","name":"unmarked","modelsType":"project","type":"model"},{"id":"ljt","name":"trash","modelsType":"project","type":"model"},{"id":"weakPwd","name":"weakpassword","modelsType":"project","type":"model"}]}'
          );
          await this.$store.state.mainPage.db.defaults(newdata).write();
          let imgdata = { img: [] };
          this.$store.state.mainPage.localdb.defaults(imgdata).write();
          this.operateTemplates = this.$JSON5.parse(this.$JSON5.stringify(this.templates));
          await this.$store.state.mainPage.db.set("templates", this.operateTemplates.templates).write();
          await this.$store.state.mainPage.db.set("settings", this.settings).write();
          await this.$store.state.mainPage.db.set("machineId", this.$Uuidv1()).write();
          await this.$store.state.mainPage.db.set("version", 0).write();
          this.$store.dispatch('getdirectory');
        } else {
          //图片数据库初始化
          let imgdata = { img: [] };
          await this.$store.state.mainPage.localdb.defaults(imgdata).write();
          //数据同步
          await this.$store.state.mainPage.db.set("models", ipfsData.models).write();
          await this.$store.state.mainPage.db.set("project", ipfsData.project).write();
          await this.$store.state.mainPage.db.set("templates", ipfsData.templates).write();
          await this.$store.state.mainPage.db.set("settings", ipfsData.settings).write();
          await this.$store.state.mainPage.db.set("machineId", this.$Uuidv1()).write();
          await this.$store.state.mainPage.db.set("version", ipfsData.version).write();
          this.$store.dispatch('getdirectory');
        }
      } else if (ipfsData.machineId == "" || ipfsData.machineId == undefined) {
        this.$store.dispatch('getdirectory');
      } else if (ipfsData.machineId != "" && ipfsData.machineId != undefined) {
        if (this.$store.state.mainPage.db.get("machineId").value() == ipfsData.machineId) {
          this.$store.dispatch('getdirectory');
        } else if (ipfsData.version > this.$store.state.mainPage.db.get("version").value()) {
          this.$store.dispatch('getdirectory');
          this.dialogSynchronization = true;
        } else {
          this.$store.dispatch('getdirectory');
        }
      }
      //更新设置
      this.$store.commit('updatesetting');
      //启动锁定定时器
      this.locksystem();
      //设置语言
      this.$store.dispatch('changeLang', this.$store.state.mainPage.language);
    },
    //手动同步
    async synchronization () {
      if (!this.network) {
        this.$message.error(this.$t("login.outline"));
        return false;
      } else {
        var address = this.$store.state.mainPage.loginObj.address;
        let userSecret = this.$store.state.mainPage.loginObj.secret;
        //读取IPFS中数据
        let tempipfsData = await this.$myIpfs.Ipfs.read(userSecret, "/main", address);
        tempipfsData = this.$JSON5.parse(tempipfsData); //ipfs转成对象
        tempipfsData = this.$JSON5.parse(this.$JSON5.stringify(tempipfsData)); //序列化新对象
        if (tempipfsData.machineId != undefined) {
          if (tempipfsData.version > this.$store.state.mainPage.db.get("version").value()) {
            //version越大内容越新
            await this.$store.state.mainPage.db.set("models", tempipfsData.models).write();
            await this.$store.state.mainPage.db.set("project", tempipfsData.project).write();
            await this.$store.state.mainPage.db.set("templates", tempipfsData.templates).write();
            await this.$store.state.mainPage.db.set("settings", tempipfsData.settings).write();
            await this.$store.state.mainPage.db.set("machineId", this.$Uuidv1()).write();
            await this.$store.state.mainPage.db.set("version", tempipfsData.version).write();
            this.$message({
              message: this.$t("main.synchronizationSuccessful"),
              type: "success"
            });
            this.$store.dispatch('getdirectory');
          } else if (tempipfsData.version < this.$store.state.mainPage.db.get("version").value()) {
            let localdata = this.$store.state.mainPage.db.__wrapped__;
            let result = await this.$myIpfs.Ipfs.write(userSecret, this.$JSON5.stringify(localdata), "/main");
            if (result.indexOf("success") > 0) {
              this.$message({
                message: this.$t("main.synchronizationSuccessful"),
                type: "success"
              });
            } else if (result.indexOf("lackoil") > 0) {
              this.$message({
                message: this.$t("main.NonMember"),
                type: "error"
              });
            } else if (result.indexOf("error") > 0) {
              this.$message({
                message: this.$t("main.lineError"),
                type: "error"
              });
            }
          } else if (tempipfsData.version == this.$store.state.mainPage.db.get("version").value()) {
            this.$message({
              message: this.$t("main.withoutSynchronization"),
              type: "success"
            });
          }
        } else {
          let localdata = this.$store.state.mainPage.db.__wrapped__;
          let result = await this.$myIpfs.Ipfs.write(this.$store.state.mainPage.loginObj.secret, this.$JSON5.stringify(localdata), "/main");
          if (result.indexOf("success") > 0) {
            this.$message({
              message: this.$t("main.synchronizationSuccessful"),
              type: "success"
            });
          } else if (result.indexOf("lackoil") > 0) {
            this.$message({
              message: this.$t("main.NonMember"),
              type: "error"
            });
          } else if (result.indexOf("error") > 0) {
            this.$message({
              message: this.$t("main.lineError"),
              type: "error"
            });
          }
        }
        //更新设置
        this.$store.commit('updatesetting');
        //启动锁定定时器
        this.locksystem();
        //设置语言
        this.$store.dispatch('changeLang', this.$store.state.mainPage.language);

        this.$store.dispatch('notesBytargeId', this.$store.state.mainPage.db.get("models").find({ id: this.$store.state.mainPage.directoryClickId }).value());
      }
    },
    pwdLength (obj) {
      obj.format = this.cryptLevel(obj.val);
      this.getPercentage(obj.val);
      obj.percentage = this.percentage;
      obj.pwdstatus = this.status;
    },
    async selectTemplate () {
      var loginObj = this.$JSON5.parse(sessionStorage.getItem("userkeyObj"));
      let userSecret = this.loginObj.secret;
      this.dialogVisibleTemplate = true;
      this.selectlabels = "";
      var projectArray = this.$JSON5.parse(
        this.$JSON5.stringify(
          this.db
            .get("templates")
            .filter({ isDel: false })
            .value()
        )
      );
      //图片载入
      for (var index in projectArray) {
        if (projectArray[index].imgtype == "url") {
          projectArray[index].tempBase64 = projectArray[index].imgurl;
        } else if (projectArray[index].imgtype == "base64") {
          if (projectArray[index].imgHash != "") {
            let img = this.localdb
              .get("img")
              .find({ id: projectArray[index].imgHash })
              .value();
            if (img != undefined) {
              projectArray[index].tempBase64 = img.value;
            } else {
              //取ipfs值
              let result = await this.$myIpfs.Ipfs.read(
                userSecret,
                projectArray[index].imgHash,
                loginObj.address
              );
              projectArray[index].tempBase64 = result;
              //缓存到本地localdb库
              img = { id: projectArray[index].imgHash, value: result };
              this.localdb
                .get("img")
                .push(img)
                .write();
            }
          } else {
            projectArray[index].tempBase64 = "";
          }
        }
      }
      this.operateTemplates = projectArray;
    },
    async projectlick (project, event) {
      var loginObj = this.$JSON5.parse(sessionStorage.getItem("userkeyObj"));
      let userSecret = this.loginObj.secret;
      let temp = this.db
        .get("templates")
        .find({ id: project.id })
        .value();
      let target = event.currentTarget;
      let index = Number(target.getAttribute("data-index"));
      this.currentTemplate = index;
      //图片继承
      if (temp.imgtype == "url") {
        temp.tempBase64 = temp.imgurl;
      } else if (temp.imgtype == "base64") {
        if (temp.imgHash != "") {
          let img = this.localdb
            .get("img")
            .find({ id: temp.imgHash })
            .value();
          if (img != undefined) {
            temp.tempBase64 = img.value;
          } else {
            //取ipfs值
            let result = await this.$myIpfs.Ipfs.read(
              userSecret,
              temp.imgHash,
              loginObj.address
            );
            temp.tempBase64 = result;
            //缓存到本地localdb库
            img = { id: temp.imgHash, value: result };
            this.localdb
              .get("img")
              .push(img)
              .write();
          }
        }
      }
      this.templateEvent = this.$JSON5.parse(this.$JSON5.stringify(temp));
      let modelsId = temp.modelsId;
      if (modelsId.indexOf("scj") != -1) {
        this.isScj = true;
      } else {
        this.isScj = false;
      }
      let models = [];
      for (var idIndex in modelsId) {
        //下拉框不显示mb
        if (
          modelsId[idIndex].indexOf("mb") == -1 &&
          modelsId[idIndex].indexOf("sy") == -1 &&
          modelsId[idIndex].indexOf("weakPwd") == -1 &&
          modelsId[idIndex].indexOf("wbj") == -1 &&
          modelsId[idIndex].indexOf("scj") == -1
        ) {
          models.push(modelsId[idIndex]);
        }
      }
      this.selectlabels = models;
    },
    addproject () {
      if (this.templateEvent == "") {
        this.$message.error(this.$t("main.pleaseChooseATemplate"));
        return false;
      } else {
        this.dialogVisibleTemplate = false;
        this.dialogVisibleAddProject = true;
        this.operationType = "project_add";
      }
    }, //数据提交
    async submitproject () {
      if (!this.network) {
        this.$message.error(this.$t("login.outline"));
        return false;
      } else {
        let projectName = this.ruleFormAddProject.name;
        let formData = this.templateEvent;
        let imgtype = "";
        let img = formData.tempBase64;
        //设置分类
        this.setlabels(this.selectlabels, formData.datas);
        console.log(this.selectlabels);
        //图片
        if (this.imgtype == "url") {
          imgtype = "url";
          formData.imgHash = "";
        } else if (this.imgtype == "base64") {
          formData.imgurl = "";
          imgtype = "base64";
        } else {
          //继承模板图片
          imgtype = formData.imgtype;
        }

        this.newProject = {
          id: this.$Uuidv1(),
          name: projectName,
          modelsId: this.selectlabels, // "modelsName":newArray.toString(),
          isDel: false,
          type: "project",
          datas: formData.datas,
          dateTime: await this.getTime(),
          tempBase64: "",
          imgHash: formData.imgHash,
          imgtype: imgtype,
          imgurl: formData.tempBase64,
          bgcolor: formData.bgcolor,
          isnote: false, //笔记类型
          hasnote: false,
          note: "",
          checked: false
        };
        //db project 追加数据
        this.db
          .get("project")
          .push(this.$JSON5.parse(this.$JSON5.stringify(this.newProject)))
          .write();
        this.db.set("version", await this.getTime()).write();
        this.selectlabels = "";
        this.dialogVisibleAddProject = false;
        this.ruleFormAddProject.name = "";
        this.color = "";
        this.isScj = false;
        this.getdirectory();
        this.notesBytargeId(
          this.db
            .get("models")
            .find({ id: "sy" })
            .value()
        ); //刷新列表页
        if (imgtype == "base64") {
          this.uploadImg(img, this.newProject.type, this.newProject.id);
        }
        //二次刷新
        this.getdirectory();
        //    this.notesBytargeId(this.db.get("models").find({id: "sy"}).value());//刷新列表页
        this.afterChecked(this.newProject.id, this.newProject.type);
        this.templateEvent = "";
      }
    }, //增加选中项
    selectFiled (command) {
      this.dialogVisibleItems = true;
      this.filed = this.$JSON5.parse(this.$JSON5.stringify(command));
      this.filedName = command.key;
      this.ruleFormAddPro.filedName = command.key;
    }, //添加项目，模板增加项
    addFiled (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogVisibleItems = false;
          this.filed.tempkey = this.ruleFormAddPro.filedName;
          (this.filed.id = this.$Uuidv1()),
            this.templateEvent.datas.push(this.filed);
          this.filed = "";
          this.ruleFormAddPro.filedName = "";
        } else {
          return false;
        }
      });
    }, //修改选中项
    editSelectFiled (command) {
      this.dialogVisibleItemsEdit = true;
      this.filed = this.$JSON5.parse(this.$JSON5.stringify(command));
      this.filedName = command.key;
      this.ruleFormAddTEdit.filedName = command.key;
    }, //修改项目，模板增加项
    editAddFiled (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogVisibleItemsEdit = false;
          this.filed.tempkey = this.ruleFormAddTEdit.filedName;
          (this.filed.id = this.$Uuidv1()),
            this.editobject.datas.push(this.filed);
          this.filed = "";
          this.ruleFormAddTEdit.filedName = "";
        } else {
          return false;
        }
      });
    },
    //修改页面
    editProject () {
      this.editobject = this.$JSON5.parse(
        this.$JSON5.stringify(this.projectEvent)
      );
      if (this.editobject.name) {
        this.editobject.name = this.editobject.name.replace(/^\s+|\s+$/g, "");
        let name = this.editobject.name;
        if (name.trim().length > 0) {
          this.templatedisable = false;
        } else {
          this.templatedisable = true;
        }
      } else {
        this.templatedisable = true;
      }
      let items = this.editobject.datas;
      for (var item in items) {
        if (items[item].type == "password") {
          items[item].format = this.cryptLevel(items[item].val);
        }
      }
      if (this.editobject.type == "project" && this.editobject.isnote != true) {
        let modelsId = this.editobject.modelsId;
        if (modelsId.indexOf("scj") != -1) {
          this.isScj = true;
        } else {
          this.isScj = false;
        }
        let models = [];
        for (var index in modelsId) {
          //下拉框不显示sy,wbj
          if (
            modelsId[index].indexOf("sy") == -1 &&
            modelsId[index].indexOf("wbj") == -1 &&
            modelsId[index].indexOf("weakPwd") == -1 &&
            modelsId[index].indexOf("scj") == -1
          ) {
            models.push(modelsId[index]);
          }
        }
        this.selectlabels = models;
        this.dialogVisibleEdit = true;
        this.operationType = "project_edit";
      } else if (
        this.editobject.type == "project" &&
        this.editobject.isnote == true
      ) {
        let modelsId = this.editobject.modelsId;
        if (modelsId.indexOf("scj") != -1) {
          this.isScj = true;
        } else {
          this.isScj = false;
        }
        let models = [];
        for (var index in modelsId) {
          //下拉框不显示sy,wbj
          if (
            modelsId[index].indexOf("sy") == -1 &&
            modelsId[index].indexOf("wbj") == -1 &&
            modelsId[index].indexOf("weakPwd") == -1 &&
            modelsId[index].indexOf("scj") == -1
          ) {
            models.push(modelsId[index]);
          }
        }
        this.selectlabels = models;
        this.dialogVisibleNoteEdit = true;
        this.operationType = "note_edit";
        this.ruleFormNoteEdit.notes = this.editobject.note[0].notes;
      } else if (this.editobject.type == "template") {
        var modelsId = this.editobject.modelsId;
        if (modelsId.indexOf("scj") != -1) {
          this.isScj = true;
        } else {
          this.isScj = false;
        }
        var models = [];
        for (var index in modelsId) {
          //下拉框不显示mb
          if (
            modelsId[index].indexOf("mb") == -1 &&
            modelsId[index].indexOf("weakPwd") == -1 &&
            modelsId[index].indexOf("wbj") == -1 &&
            modelsId[index].indexOf("sy") == -1 &&
            modelsId[index].indexOf("scj") == -1
          ) {
            models.push(modelsId[index]);
          }
        }
        this.selectlabels = models;
        this.dialogVisibleTemplateEdit = true;
        this.operationType = "template_edit";
      }
    },
    //修改project
    async editDo () {
      if (!this.network) {
        this.$message.error(this.$t("login.outline"));
        return false;
      } else {
        try {
          this.db
            .get("project")
            .remove({ id: this.editobject.id })
            .write();
          var img = this.$JSON5.parse(
            this.$JSON5.stringify(this.editobject.tempBase64)
          );
          this.setlabels(this.selectlabels, this.editobject.datas);
          this.editobject.modelsId = this.selectlabels;
          //图片处理
          if (this.imgtype == "url") {
            this.imgHash = "";
            this.editobject.imgtype = "url";
            this.editobject.imgurl = this.editobject.tempBase64;
          } else if (this.imgtype == "base64") {
            this.editobject.imgurl = "";
            this.editobject.tempBase64 = ""; //先删除tempBase64
            this.editobject.imgtype = "base64";
          }

          this.editobject.checked = false;
          this.db
            .get("project")
            .push(this.$JSON5.parse(this.$JSON5.stringify(this.editobject)))
            .write();
          this.db.set("version", await this.getTime()).write();
          this.dialogVisibleEdit = false;
          this.editobject.tempBase64 = img;
          this.$message.success(this.$t("main.successfullyModified"));
          this.selectlabels = "";
          this.color = "";
          this.isScj = false;
          this.getdirectory();
          if (this.imgtype == "base64") {
            if (this.editobject.imgHash != "") {
              //判断原来对象与新对象中的imgbase64 是否相同，不同的话，重新上传数据
              let imgBase64 = this.localdb
                .get("img")
                .find({ id: this.editobject.imgHash })
                .value();
              if (
                imgBase64 == undefined ||
                imgBase64.value != this.editobject.tempBase64
              ) {
                this.uploadImg(
                  this.editobject.tempBase64,
                  this.editobject.type,
                  this.editobject.id
                );
              }
            } else {
              this.uploadImg(
                this.editobject.tempBase64,
                this.editobject.type,
                this.editobject.id
              );
            }
          }
          //二次刷新
          this.getdirectory();
          this.projectEvent = this.db
            .get("project")
            .find({ id: this.editobject.id })
            .value();
          this.afterEditchecked(this.editobject.id);
          this.editobject = "";
        } catch (e) {
          this.$message.error(this.$t("main.failToEdit"));
        }
      }
    },
    openDialogTemplate () {
      this.currentTemplate = -1;
      this.templateEvent = "";
    },

    addTemplate () {
      this.selectlabels = [];
      this.dialogVisibleAddTemplate = true;
      this.operationType = "template_add";
    },
    selectFiledTemplate (command) {
      this.dialogVisibleAddTempItems = true;
      this.filed = this.$JSON5.parse(this.$JSON5.stringify(command));
      this.filedName = command.key;
      this.ruleFormAddTtemp.filedName = command.key;
    },
    addFiledTemplate (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogVisibleAddTempItems = false;
          this.filed.tempkey = this.ruleFormAddTtemp.filedName;
          (this.filed.id = this.$Uuidv1()), this.tempTemplate.push(this.filed);
          this.filed = "";
          this.ruleFormAddTtemp.filedName = "";
        } else {
          return false;
        }
      });
    }, //增加模板
    async saveTemplate () {
      if (!this.network) {
        this.$message.error(this.$t("login.outline"));
        return false;
      } else {
        //处理分类
        this.setlabels(this.selectlabels, this.tempTemplate);
        if (this.selectlabels.indexOf("mb") == -1) {
          this.selectlabels.push("mb"); //必须增加模板分类
        }
        //图片处理
        if (this.imageBase64 == "") {
          //默认图片
          // this.imageBase64 = this.$refs.icon_default.src;
          this.imageBase64 = `${this.publicPath}img/misc/lock.svg`;
          this.imgtype = "url";
        }
        if (this.imgtype == "url") {
          this.imgHash = "";
          this.imgurl = this.imageBase64;
        } else if (this.imgtype == "base64") {
          this.imgurl = "";
        }
        this.newTemplate = {
          id: this.$Uuidv1(),
          name: this.ruleFormAddTemplate.name,
          modelsId: this.selectlabels,
          modelsName: "模板",
          isDel: false,
          type: "template",
          datas: this.tempTemplate,
          tempBase64: "",
          imgHash: this.imgHash,
          imgtype: this.imgtype,
          imgurl: this.imgurl,
          bgcolor: this.color,
          isnote: false, //笔记类型
          hasnote: false,
          note: "",
          checked: false
        };
        this.db
          .get("templates")
          .push(this.$JSON5.parse(this.$JSON5.stringify(this.newTemplate)))
          .write();
        this.db.set("version", await this.getTime()).write();
        //清空变量
        this.ruleFormAddTemplate.name = "";
        this.color = "";
        this.tempTemplate = [];
        this.selectlabels = "";
        this.dialogVisibleAddTemplate = false;
        this.getdirectory();
        this.notesBytargeId(
          this.db
            .get("models")
            .find({ id: "mb" })
            .value()
        ); //刷新列表页
        if (this.imgtype == "base64") {
          this.uploadImg(
            this.imageBase64,
            this.newTemplate.type,
            this.newTemplate.id
          );
        }
        //二次刷新
        this.getdirectory();
        // this.notesBytargeId(this.db.get("models").find({id: "mb"}).value());//刷新列表页
        this.afterChecked(this.newTemplate.id, this.newTemplate.type);
        this.imageBase64 = "";
        this.newTemplate = "";
      }
    }, //修改模板
    async editTemplate () {
      if (!this.network) {
        this.$message.error(this.$t("login.outline"));
        return false;
      } else {
        this.setlabels(this.selectlabels, this.editobject.datas);
        if (this.selectlabels.indexOf("mb") == -1) {
          this.selectlabels.push("mb"); //必须增加模板分类
        }
        var img = this.$JSON5.parse(
          this.$JSON5.stringify(this.editobject.tempBase64)
        );

        if (this.imgtype == "url") {
          this.imgHash = "";
          this.editobject.imgtype = "url";
          this.editobject.imgurl = this.editobject.tempBase64;
        } else if (this.imgtype == "base64") {
          this.editobject.imgurl = "";
          this.editobject.tempBase64 = ""; //先删除tempBase64
          this.editobject.imgtype = "base64";
        }
        try {
          this.editobject.checked = false;
          this.db
            .get("templates")
            .remove({ id: this.editobject.id })
            .write();
          this.editobject.modelsId = this.selectlabels;
          this.db
            .get("templates")
            .push(this.$JSON5.parse(this.$JSON5.stringify(this.editobject)))
            .write();
          this.db.set("version", await this.getTime()).write();
          this.dialogVisibleTemplateEdit = false;
          this.$message.success(this.$t("main.successfullyModified"));
          this.editobject.tempBase64 = img;
          this.selectlabels = "";
          this.getdirectory();
          this.color = "";
          this.isScj = false;
          this.notesBytargeId(
            this.db
              .get("models")
              .find({ id: "mb" })
              .value()
          ); //刷新列表页
          if (this.imgtype == "base64") {
            if (this.editobject.imgHash != "") {
              //判断原来对象与新对象中的imgbase64 是否相同，不同的话，重新上传数据
              let imgBase64 = this.localdb
                .get("img")
                .find({ id: this.editobject.imgHash })
                .value();
              if (
                imgBase64 == undefined ||
                imgBase64.value != this.editobject.tempBase64
              ) {
                this.uploadImg(
                  this.editobject.tempBase64,
                  this.editobject.type,
                  this.editobject.id
                );
              }
            } else {
              this.uploadImg(
                this.editobject.tempBase64,
                this.editobject.type,
                this.editobject.id
              );
            }
          }
          //二次刷新
          this.getdirectory();
          this.projectEvent = this.db
            .get("templates")
            .find({ id: this.editobject.id })
            .value();
          this.afterEditchecked(this.editobject.id);
          this.editobject = "";
        } catch (e) {
          this.$message.error(this.$t("main.failToEdit"));
        }
      }
    }, //删除项(修改模板，项目)
    editRemoveItem (itemsId) {
      let itemArray = this.editobject.datas;
      for (var i = 0; i < itemArray.length; i++) {
        if (itemArray[i].id === itemsId) {
          itemArray.splice(i, 1);
        }
      }
    }, //删除项(增加模板)
    addTemplageRemoveItem (itemsId) {
      let itemArray = this.tempTemplate;
      for (var i = 0; i < itemArray.length; i++) {
        if (itemArray[i].id === itemsId) {
          itemArray.splice(i, 1);
        }
      }
    }, //删除项(增加项目)
    addProjectRemoveItem (itemsId) {
      let itemArray = this.templateEvent.datas;
      for (var i = 0; i < itemArray.length; i++) {
        if (itemArray[i].id === itemsId) {
          itemArray.splice(i, 1);
        }
      }
    },
    //启动定时器
    locksystem () {
      console.log("启动定时器");
      if (this.$store.state.mainPage.loginObj.lock) {
        this.dialogVisible = true;
      } else if (this.$store.state.mainPage.systemlock) {
        this.$store.state.mainPage.locktimedisabled = false;
        this.eventID = setInterval(this.CheckTime, 1000);
      } else {
        this.$store.state.mainPage.locktimedisabled = true;
        clearInterval(this.eventID);
      }
    },


    //搜索框
    async search (temp) {
      if (this.directoryClickId != "") {
        this.notesBytargeId(
          this.db
            .get("models")
            .find({ id: this.directoryClickId })
            .value()
        ); //刷新列表页
      } else {
        this.notesBytargeId(
          this.db
            .get("models")
            .find({ id: "sy" })
            .value()
        ); //刷新列表页
      }
      let projectArray = [];
      let listProject = this.projects;
      for (var projectIndex in listProject) {
        if (listProject[projectIndex].name.indexOf(temp) != -1) {
          projectArray.push(listProject[projectIndex]);
        }
      }
      this.projects = projectArray;
    },

    //图片处理(增加模板)
    handleAvatarSuccessAdd (res, file) {
      let temp = this;
      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = async function (e) {
        temp.imageBase64 = this.result;
      };
      this.imgtype = "base64";
    }, //图片处理（修改模板）
    handleAvatarSuccessEdit (res, file) {
      let temp = this;
      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = async function (e) {
        temp.imageBase64 = this.result;
        temp.editobject.tempBase64 = this.result;
      };
      this.imgtype = "base64";
    }, //图片处理（增加项目）
    handleAvatarSuccessAddPro (res, file) {
      let temp = this;
      console.log(temp);
      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = async function (e) {
        temp.imageBase64 = this.result;
        temp.templateEvent.tempBase64 = this.result;
      };
      this.imgtype = "base64";
    },
    //图片处理（增加笔记）
    handleAvatarSuccessAddNote (res, file) {
      let temp = this;
      console.log(temp);
      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = async function (e) {
        temp.imageBase64 = this.result;
      };
      this.imgtype = "base64";
    },
    //图片大小验证
    beforeAvatarUpload (file) {
      let types = [
        "image/jpeg",
        "image/gif",
        "image/bmp",
        "image/png",
        "image/svg"
      ];
      const isImage = types.includes(file.type);
      const isLt200K = file.size / 1024 < 20;
      if (!isImage) {
        this.$message.error("上传头像图片只能是 JPG ,GIF,BMP,PNG,SVG 格式!");
      }
      if (!isLt200K) {
        this.$message.error("上传头像图片大小不能超过 20KB!");
      }
      return isImage && isLt200K;
    },
    async favorite (obj) {
      if (obj.isDel) {
        return false;
      }
      obj.modelsId.push("scj");
      if (obj.type == "project") {
        this.db.get("project").remove({ id: obj.id }).write();
        this.db.get("project").push(this.$JSON5.parse(this.$JSON5.stringify(obj))).write();
      } else if (obj.type == "template") {
        this.db.get("templates").remove({ id: obj.id }).write();
        this.db
          .get("templates")
          .push(this.$JSON5.parse(this.$JSON5.stringify(obj)))
          .write();
      }
      this.db.set("version", await this.getTime()).write();
      this.getdirectory();
      this.notesBytargeId(
        this.db
          .get("models")
          .find({ id: this.directoryClickId })
          .value()
      ); //刷新列表页
    },
    async unfavorite (obj) {
      if (obj.isDel) {
        return false;
      }
      //删除指定项
      obj.modelsId = obj.modelsId.filter(function (item) {
        return item !== "scj";
      });
      if (obj.type == "project") {
        this.db
          .get("project")
          .remove({ id: obj.id })
          .write();
        this.db
          .get("project")
          .push(this.$JSON5.parse(this.$JSON5.stringify(obj)))
          .write();
      } else if (obj.type == "template") {
        this.db
          .get("templates")
          .remove({ id: obj.id })
          .write();
        this.db
          .get("templates")
          .push(this.$JSON5.parse(this.$JSON5.stringify(obj)))
          .write();
      }
      this.db.set("version", await this.getTime()).write();
      this.getdirectory();
      this.notesBytargeId(
        this.db
          .get("models")
          .find({ id: this.directoryClickId })
          .value()
      ); //刷新列表页
    },
    //恢复
    async recover () {
      //批量恢复
      if (this.checkedArray.length > 0) {
        this.checkedArray.forEach(item => {
          if (item.type == "project")
            this.db
              .get("project")
              .find({ id: item.id })
              .set("isDel", false)
              .write();
          if (item.type == "template")
            this.db
              .get("templates")
              .find({ id: item.id })
              .set("isDel", false)
              .write();
        });
        this.clearChecked();
      } else {
        //单个恢复
        if (this.projectEvent.type == "project") {
          this.db
            .get("project")
            .find({ id: this.projectEvent.id })
            .set("isDel", false)
            .write();
        } else if (this.projectEvent.type == "template") {
          this.db
            .get("templates")
            .find({ id: this.projectEvent.id })
            .set("isDel", false)
            .write();
        }
      }
      this.db.set("version", await this.getTime()).write();
      this.dialogRecover = false;
      this.getdirectory();
      this.notesBytargeId(
        this.db
          .get("models")
          .find({ id: this.directoryClickId })
          .value()
      ); //刷新列表页
      this.currentNote = -1;
      this.projectEvent = "";
    },

    showIconMenu () {
      var uils = document.getElementsByClassName("choosepic");
      for (var i = 0; i < uils.length; i++) {
        uils[i].style.display = "block";
      }
    },
    //打开图片选择菜单
    dialogSymbolOpen () {
      this.dialogSymbol = true;
    },
    //打开颜色选择框
    opencolor (obj) {
      if (this.operationType == "project_add") {
        this.imageBase64 = obj.tempBase64;
      } else if (this.operationType == "project_edit") {
        this.imageBase64 = obj.tempBase64;
      } else if (this.operationType == "template_add") {
        //新建模板，给默认图片
        if (this.imageBase64 == "") {
          // this.imageBase64 = this.$refs.icon_default.src;
          this.imageBase64 = `${this.publicPath}img/misc/lock.svg`;
        }
      } else if (this.operationType == "template_edit") {
        this.imageBase64 = obj.tempBase64;
      } else if (this.operationType == "note_add") {
        //新建模板，给默认图片
        if (this.imageBase64 == "") {
          // this.imageBase64 = this.$refs.icon_default.src;
          this.imageBase64 = `${this.publicPath}img/misc/lock.svg`;
        }
      } else if (this.operationType == "note_edit") {
        this.imageBase64 = obj.tempBase64;
      }

      this.dialogSymbolcolor = true;
    },
    setImageBase64 (path, realpath) {
      //进行修改操作时插入图片
      if (this.operationType == "template_edit") {
        this.editobject.tempBase64 = realpath;
        this.dialogSymbol = false;
        this.imgtype = "url";
      } else if (this.operationType == "template_add") {
        //进行新建操作时插入图片
        this.imageBase64 = realpath;
        this.dialogSymbol = false;
        this.imgtype = "url";
      } else if (this.operationType == "project_add") {
        this.templateEvent.tempBase64 = realpath;
        this.dialogSymbol = false;
        this.imgtype = "url";
      } else if (this.operationType == "project_edit") {
        this.editobject.tempBase64 = realpath;
        this.dialogSymbol = false;
        this.imgtype = "url";
      } else if (this.operationType == "note_add") {
        //进行新建操作时插入图片
        this.imageBase64 = realpath;
        this.dialogSymbol = false;
        this.imgtype = "url";
      } else if (this.operationType == "note_edit") {
        this.editobject.tempBase64 = realpath;
        this.dialogSymbol = false;
        this.imgtype = "url";
      }
    },
    setcolor (color) {
      if (this.operationType == "template_edit") {
        this.editobject.bgcolor = color;
        this.dialogSymbolcolor = false;
      } else if (this.operationType == "template_add") {
        this.color = color;
        this.dialogSymbolcolor = false;
      } else if (this.operationType == "project_add") {
        this.templateEvent.bgcolor = color;
        this.dialogSymbolcolor = false;
      } else if (this.operationType == "project_edit") {
        this.editobject.bgcolor = color;
        this.dialogSymbolcolor = false;
      } else if (this.operationType == "note_add") {
        this.color = color;
        this.dialogSymbolcolor = false;
      } else if (this.operationType == "note_edit") {
        this.editobject.bgcolor = color;
        this.dialogSymbolcolor = false;
      }
    },
    //隐藏菜单
    unshow () {
      document.onclick = function (e) {
        var e = e || window.event;
        var uils = document.getElementsByClassName("choosepic");
        for (var i = 0; i < uils.length; i++) {
          if (
            uils[i].style.display == "block" &&
            e.target.className != "avatar"
          ) {
            uils[i].style.display = "none";
          }
        }
        //隐藏右击菜单1
        if (
          document.getElementById("menu_1").style.display == "block" &&
          e.target != document.getElementById("menu_1")
        ) {
          document.getElementById("menu_1").style.display = "none";
        }
      };
    },
    //关闭添加模板框
    cleartype () {
      this.operationType = "";
      this.imageBase64 = "";
      this.color = "";
      this.templatedisable = true;
    },
    //关闭添加模板框，清空数据
    clearDataTemplate () {
      this.ruleFormAddTemplate.name = "";
      this.tempTemplate = [];
    },
    //关闭添加项目框，清空数据
    clearDataProject () {
      this.ruleFormAddProject.name = "";
      this.tempTemplate = [];
    },
    // openMenu_1 (project, obj) {
    //   console.log(this.delobj);
    //   if (project.type == "model") {
    //     if (project.modelsType == "directory") {
    //       this.isDisabled = false; //启用删除
    //     } else {
    //       this.isDisabled = true;
    //     }
    //   }
    //   if (project.type == "project") {
    //     this.isDisabled = false; //启用删除
    //   }
    //   this.delobj = project; //赋值删除对象
    //   if (project.type != "model") {
    //     //indexof undefind 问题
    //     this.projectEvent = project;
    //   }
    //   var menu = document.getElementById("menu_1");
    //   var position = obj.target.getBoundingClientRect(); //获取点击元素的位置
    //   menu.style.display = "block";
    //   menu.style.left = position.right + 10 + "px";
    //   if (document.body.clientHeight > menu.clientHeight + position.bottom) {
    //     menu.style.top = position.top + position.height + 10 + "px";
    //   } else {
    //     menu.style.top = position.top - menu.clientHeight - 10 + "px";
    //   }
    //   this.menulistchange(project);
    //   this.stopPropagation(obj);
    // },
    // //阻止冒泡
    // stopPropagation (e) {
    //   e = e || window.event;
    //   if (e.stopPropagation) {
    //     //W3C阻止冒泡方法
    //     e.stopPropagation();
    //   } else {
    //     e.cancelBubble = true; //IE阻止冒泡方法
    //   }
    // },
    // //点击空白地区显示菜单
    // openMenu_empty (obj) {
    //   this.addDirClasses = [];
    //   this.renameClasses = [];
    //   this.addProjectClasses = [];
    //   this.addTemplateClasses = [];
    //   this.emptyTrashClasses = [];
    //   this.addNoteClasses = [];
    //   this.deleteClasses = [];
    //   this.selectColorClasses = [];
    //   this.recoverClass = ["unuse"];
    //   var menu = document.getElementById("menu_1");
    //   var e = e || window.event;
    //   var x = e.clientX;
    //   var y = e.clientY;
    //   menu.style.display = "block";
    //   menu.style.left = x + "px";
    //   menu.style.top = y + "px";
    //   this.exportClasses.push("unuse");
    //   this.deleteClasses.push("unuse");
    //   this.recoverClass.push("unuse");
    //   this.addDirClasses.push("unuse");
    //   this.renameClasses.push("unuse");
    //   this.selectColorClasses.push("unuse");
    // },
    // //菜单变化
    // menulistchange (obj) {
    //   this.addDirClasses = [];
    //   this.renameClasses = [];
    //   this.addProjectClasses = [];
    //   this.addTemplateClasses = [];
    //   this.addNoteClasses = [];
    //   this.emptyTrashClasses = [];
    //   this.deleteClasses = [];
    //   this.selectColorClasses = [];
    //   this.recoverClass = ["unuse"];
    //   this.exportClasses = ["unuse"];
    //   if (
    //     (obj.type === "model" && obj.count > 0) ||
    //     obj.type === "project" ||
    //     obj.type === "template"
    //   ) {
    //     this.exportClasses = [];
    //   }
    //   if (obj.modelsType == "directory") {
    //     this.emptyTrashClasses.push("unuse");
    //     this.addProjectClasses.push("unuse");
    //     this.addTemplateClasses.push("unuse");
    //     this.emptyTrashClasses.push("unuse");
    //     this.addNoteClasses.push("unuse");
    //   } else if (obj.modelsType == "project") {
    //     this.emptyTrashClasses.push("unuse");
    //     this.addProjectClasses.push("unuse");
    //     this.addTemplateClasses.push("unuse");
    //     this.addNoteClasses.push("unuse");
    //     this.emptyTrashClasses.push("unuse");
    //     this.deleteClasses.push("unuse");
    //     this.selectColorClasses.push("unuse");
    //     this.renameClasses.push("unuse");
    //   }
    //   if (this.showTrash != true) {
    //     this.emptyTrashClasses.push("unuse");
    //   }
    //   if (obj.isDel) {
    //     this.recoverClass = [];
    //     // this.deleteClasses = ["unuse"];
    //   }
    //   if (obj.type != "model") {
    //     this.renameClasses.push("unuse");
    //     this.addDirClasses.push("unuse");
    //     this.selectColorClasses.push("unuse");
    //   }
    //   if (obj.id == "ljt" && this.showTrash == true) {
    //     this.emptyTrashClasses = [];
    //   }
    // },

    //图片上传ipfs
    async uploadImg (value, type, id) {
      if (type == "project") {
        let imgHash = this.$Uuidv1();
        this.db
          .get("project")
          .find({ id: id })
          .set("imgHash", imgHash)
          .write();
        let img = { id: imgHash, value: value };
        this.localdb
          .get("img")
          .push(img)
          .write();
        //上传ipfs
        await this.$myIpfs.Ipfs.write(this.loginObj.secret, value, imgHash);
      } else if (type == "template") {
        let imgHash = this.$Uuidv1();
        this.db
          .get("templates")
          .find({ id: id })
          .set("imgHash", imgHash)
          .write();
        let img = { id: imgHash, value: value };
        this.localdb
          .get("img")
          .push(img)
          .write();
        //上传ipfs
        await this.$myIpfs.Ipfs.write(this.loginObj.secret, value, imgHash);
      }
    },


    /**
     * 文件夹颜色选择框
     * @param pwd
     * @return {string}
     */
    selectColor () {
      this.dialogDirlcolor = true;
    },

    /**
     * 设置文件夹颜色
     */
    async setcolorD (value) {
      let id = this.delobj.id;
      let directory = this.db
        .get("models")
        .find({ id: id })
        .value();
      directory.imgPath = value;
      this.db
        .get("models")
        .remove({ id: id })
        .write();
      this.db
        .get("models")
        .push(this.$JSON5.parse(this.$JSON5.stringify(directory)))
        .write();
      let now = await this.getTime();
      this.db.set("version", now).write();
      this.getdirectory();
      this.dialogDirlcolor = false;
    },
    /**
     * 文件夹重命名
     */
    rename () {
      this.ruleFormRename.pName = this.delobj.name;
      this.dialogVisibleRename = true;
    },

    // 增加笔记页面打开
    addNote () {
      this.selectlabels = [];
      this.dialogVisibleAddNote = true;
      this.operationType = "note_add";
    },
    // 保存笔记
    async saveNote () {
      if (!this.network) {
        this.$message.error(this.$t("login.outline"));
        return false;
      } else {
        this.setlabels(this.selectlabels, null);
        let projectName = this.ruleFormAddNote.name;
        //图片
        if (this.imageBase64 == "") {
          //默认图片
          this.imageBase64 = `${this.publicPath}img/misc/lock.svg`;
          this.imgtype = "url";
        }
        if (this.imgtype == "url") {
          this.imgHash = "";
          this.imgurl = this.imageBase64;
        } else if (this.imgtype == "base64") {
          this.imgurl = "";
        }

        this.newProject = {
          id: this.$Uuidv1(),
          name: projectName,
          modelsId: this.selectlabels, // "modelsName":newArray.toString(),
          isDel: false,
          type: "project",
          datas: [],
          dateTime: await this.getTime(),
          tempBase64: "",
          imgHash: this.imgHash,
          imgtype: this.imgtype,
          imgurl: this.imgurl,
          bgcolor: this.color,
          isnote: true, //笔记类型
          hasnote: true, //是否有笔
          note: [{ notes: this.ruleFormAddNote.notes }],
          checked: false
        };
        //db project 追加数据
        this.db
          .get("project")
          .push(this.$JSON5.parse(this.$JSON5.stringify(this.newProject)))
          .write();
        this.db.set("version", await this.getTime()).write();
        this.selectlabels = "";
        this.dialogVisibleAddNote = false;
        this.ruleFormAddNote.name = "";
        this.color = "";
        this.ruleFormAddNote.notes = "";
        this.getdirectory();
        this.notesBytargeId(
          this.db
            .get("models")
            .find({ id: "sy" })
            .value()
        ); //刷新列表页
        if (this.imgtype == "base64") {
          console.log(this.imageBase64);
          this.uploadImg(
            this.imageBase64,
            this.newProject.type,
            this.newProject.id
          );
        }
        //二次刷新
        this.getdirectory();
        //    this.notesBytargeId(this.db.get("models").find({id: "sy"}).value());//刷新列表页
        this.afterChecked(this.newProject.id, this.newProject.type);
        this.imageBase64 = "";
        this.newProject = "";
      }
    },

    async editNote () {
      if (!this.network) {
        this.$message.error(this.$t("login.outline"));
        return false;
      } else {
        this.setlabels(this.selectlabels, null);
        var img = this.$JSON5.parse(
          this.$JSON5.stringify(this.editobject.tempBase64)
        );
        if (this.imgtype == "url") {
          this.imgHash = "";
          this.editobject.imgtype = "url";
          this.editobject.imgurl = this.editobject.tempBase64;
        } else if (this.imgtype == "base64") {
          this.editobject.imgurl = "";
          this.editobject.tempBase64 = ""; //先删除tempBase64
          this.editobject.imgtype = "base64";
        }
        try {
          this.editobject.checked = false;
          this.db
            .get("project")
            .remove({ id: this.editobject.id })
            .write();
          this.editobject.modelsId = this.selectlabels;
          this.editobject.note[0].notes = this.ruleFormNoteEdit.notes;
          this.db
            .get("project")
            .push(this.$JSON5.parse(this.$JSON5.stringify(this.editobject)))
            .write();
          this.db.set("version", await this.getTime()).write();
          this.dialogVisibleNoteEdit = false;
          this.$message.success(this.$t("main.successfullyModified"));
          this.editobject.tempBase64 = img;
          this.selectlabels = "";
          this.isScj = false;
          this.getdirectory();
          this.color = "";
          if (this.imgtype == "base64") {
            if (this.editobject.imgHash != "") {
              //判断原来对象与新对象中的imgbase64 是否相同，不同的话，重新上传数据
              let imgBase64 = this.localdb
                .get("img")
                .find({ id: this.editobject.imgHash })
                .value();
              if (
                imgBase64 == undefined ||
                imgBase64.value != this.editobject.tempBase64
              ) {
                this.uploadImg(
                  this.editobject.tempBase64,
                  this.editobject.type,
                  this.editobject.id
                );
              }
            } else {
              this.uploadImg(
                this.editobject.tempBase64,
                this.editobject.type,
                this.editobject.id
              );
            }
          }
          //二次刷新
          this.getdirectory();
          this.projectEvent = this.db
            .get("project")
            .find({ id: this.editobject.id })
            .value();
          this.afterEditchecked(this.editobject.id);
          this.editobject = "";
        } catch (e) {
          this.$message.error(this.$t("main.failToEdit"));
        }
      }
    },

    //清除选中
    clearChecked () {
      let project = this.$store.state.mainPage.db.get("project").value();
      let template = this.$store.state.mainPage.db.get("templates").value();
      project.forEach(item => {
        item.checked = false;
      });

      template.forEach(item => {
        item.checked = false;
      });

      this.$store.state.mainPage.checkedArray.forEach(item => {
        item.checked = false;
      });
      this.$store.state.mainPage.checkedArray = [];
    },

    // 复制成功
    onCopy (e) {
      this.$message.success("内容已复制到剪切板！");
    },
    // 复制失败
    onError (e) {
      this.$message.error("抱歉，复制失败！");
    },

    //关闭添加模板框，清空数据
    clearDataNote () {
      this.ruleFormAddNote.name = "";
      this.tempTemplate = [];
      this.ruleFormAddNote.notes = "";
    },

    setlabels (labels, data) {
      this.isWeakPwd = false; //重置默认状态
      let hasLabels = false; //判断分类中是否存在自定义labels分组
      //判断是否为弱密码
      if (data != null) {
        //笔记类型，data = null
        for (let index in data) {
          if (data[index].type == "password" && data[index].val != "") {
            if (data[index].percentage < 35) {
              this.isWeakPwd = true;
              break;
            } else {
              this.isWeakPwd = false;
            }
          } else if (data[index].type == "password" && data[index].val == "") {
            this.isWeakPwd = false;
          }
        }
      }
      if (labels.indexOf("scj") == -1 && this.isScj) {
        labels.push("scj"); //所有项必须有
      }

      //所有项必须有
      if (labels.indexOf("sy") == -1) {
        labels.push("sy"); //所有项必须有
      }
      //判断是否增加弱密码
      if (this.isWeakPwd && labels.indexOf("weakPwd") == -1) {
        labels.push("weakPwd"); //所有项必须有
      }

      //判断是否减去弱密码
      if (!this.isWeakPwd && labels.indexOf("weakPwd") != -1) {
        labels = labels.filter(function (item) {
          return item != "weakPwd";
        });
      }

      //判断labels 中是否有自定义label分类
      let dirlist = this.DDirectory.directory;
      for (let index in dirlist) {
        if (labels.indexOf(dirlist[index].id) != -1) {
          hasLabels = true;
          break;
        }
      }

      //判断是否增加wbj 分类
      if (
        labels.indexOf("mm") == -1 &&
        labels.indexOf("wbj") == -1 &&
        !hasLabels
      ) {
        labels.push("wbj");
      }

      //判断是否删除wbj 分类
      // if(labels.indexOf("mm")>0 || labels.indexOf("mb")!=-1 ||hasLabels){
      if (labels.indexOf("mm") != -1 || hasLabels) {
        if (labels.indexOf("wbj") != -1) {
          labels = labels.filter(function (item) {
            return item !== "wbj";
          });
        }
      }
      this.selectlabels = labels;
    },



    //单独刷新左侧菜单
    getDirectoryLeft () {
      var alldata = this.db.get("models").value(); // 获取所有分类
      var allProjects = this.db.get("project").value();
      var projectstring = "";
      var directoryString = "";
      var specialString = "";
      var jsonSpecicalString = "";
      var jsonProjectstring = "";
      var jsonDirectoryString = "";
      //设置每一项数量
      for (var modelkey in alldata) {
        var count = 0;
        if (alldata[modelkey].id != "mb" && alldata[modelkey].id != "ljt") {
          for (var projectkey in allProjects) {
            var project = allProjects[projectkey];
            var types = project.modelsId;
            if (
              types.indexOf(alldata[modelkey].id) != -1 &&
              project.isDel != true
            ) {
              count++;
            }
          }
        } else if (alldata[modelkey].id == "mb") {
          count = this.db
            .get("templates")
            .filter({ isDel: false })
            .size()
            .value();
        } else if (alldata[modelkey].id == "ljt") {
          count =
            this.db
              .get("templates")
              .filter({ isDel: true })
              .size()
              .value() +
            this.db
              .get("project")
              .filter({ isDel: true })
              .size()
              .value();
          if (count > 0) {
            this.showTrash = true; //是否显示清空垃圾桶图标
          } else {
            this.showTrash = false; //是否显示清空垃圾桶图标
          }
        }
        alldata[modelkey].count = count;
      }
      //分组
      for (var key in alldata) {
        var object = alldata[key];
        if (object.modelsType == "project") {
          if (object.id == "sy" || object.id == "scj") {
            projectstring = projectstring + this.$JSON5.stringify(object) + ",";
          } else {
            specialString = specialString + this.$JSON5.stringify(object) + ",";
          }
        }
        if (object.modelsType == "directory") {
          directoryString =
            directoryString + this.$JSON5.stringify(object) + ",";
        }
      }
      projectstring = projectstring.substring(0, projectstring.length - 1);
      jsonProjectstring = "{project:[" + projectstring + "]}";
      directoryString = directoryString.substring(
        0,
        directoryString.length - 1
      );
      jsonDirectoryString = "{directory:[" + directoryString + "]}";
      specialString = specialString.substring(0, specialString.length - 1);
      jsonSpecicalString = "{special:[" + specialString + "]}";

      //文件夹
      this.DDirectory = this.$JSON5.parse(jsonDirectoryString);
      //目录国际化
      var jsonProjects = this.$JSON5.parse(jsonProjectstring).project;
      for (var obj in jsonProjects) {
        jsonProjects[obj].name = this.international(jsonProjects[obj].name);
      }
      this.DProject = { project: jsonProjects };
      //special 国际化
      var jsonSpecial = this.$JSON5.parse(jsonSpecicalString).special;
      for (var obj in jsonSpecial) {
        jsonSpecial[obj].name = this.international(jsonSpecial[obj].name);
      }
      this.DSpecial = { special: jsonSpecial };
      //更新排序
      this.sort();
    },

    //创建后checked 问题
    afterChecked (objId, objType) {
      let listproject = "";
      //增加项目，笔记
      if (objType == "project") {
        this.directoryClickId = "sy";
        this.notesBytargeId(
          this.db
            .get("models")
            .find({ id: "sy" })
            .value()
        ); //刷新列表页}
        listproject = this.projects;
        this.currentProject = 0; //目录check 指向sy
        this.currentSpecial = -1;
        this.currentDirectory = -1;
        for (let index in listproject) {
          if (listproject[index].id == objId) {
            this.projectEvent = listproject[index];
            this.currentNote = index; //项目列表指向当前
            break;
          }
        }
      }
      if (objType == "template") {
        let specialList = this.DSpecial.special;
        console.log(specialList);
        this.directoryClickId = "mb";
        this.notesBytargeId(
          this.db
            .get("models")
            .find({ id: "mb" })
            .value()
        ); //刷新列表页
        listproject = this.projects;
        console.log(listproject);
        this.currentProject = -1;
        this.currentDirectory = -1;
        for (let index in listproject) {
          if (listproject[index].id == objId) {
            this.projectEvent = listproject[index];
            this.currentNote = index; //项目列表指向当前添加项
            break;
          }
        }
        for (let index in specialList) {
          if (specialList[index].id == "mb") {
            this.currentSpecial = index; //目录指向模板
            break;
          }
        }
      }
    },

    afterEditchecked (objId) {
      let listproject = "";
      this.notesBytargeId(
        this.db
          .get("models")
          .find({ id: this.directoryClickId })
          .value()
      ); //刷新列表页
      listproject = this.projects;
      for (let index in listproject) {
        if (listproject[index].id == objId) {
          this.currentNote = index; //项目列表指向当前
          this.projectEvent = listproject[index];
          break;
        } else {
          this.currentNote = 0; //项目列表指向当前
          this.projectEvent = listproject[0];
        }
      }
    },

    //设置重构
    settingDialog () { }
  },

  watch: {
    "ruleFormAddTemplate.name": function () {
      if (this.ruleFormAddTemplate.name) {
        this.ruleFormAddTemplate.name = this.ruleFormAddTemplate.name.replace(
          /^\s+|\s+$/g,
          ""
        );
        if (this.ruleFormAddTemplate.name.trim().length > 0) {
          this.templatedisable = false;
        } else {
          this.templatedisable = true;
        }
      } else {
        this.templatedisable = true;
      }
    },

    "editobject.name": function () {
      if (this.editobject.name) {
        this.editobject.name = this.editobject.name.replace(/^\s+|\s+$/g, "");
        let name = this.editobject.name;
        if (name.trim().length > 0) {
          this.templatedisable = false;
        } else {
          this.templatedisable = true;
        }
      } else {
        this.templatedisable = true;
      }
    },

    "ruleFormAddProject.name": function () {
      if (this.ruleFormAddProject.name) {
        this.ruleFormAddProject.name = this.ruleFormAddProject.name.replace(
          /^\s+|\s+$/g,
          ""
        );
        if (this.ruleFormAddProject.name.trim().length > 0) {
          this.templatedisable = false;
        } else {
          this.templatedisable = true;
        }
      } else {
        this.templatedisable = true;
      }
    },
    "ruleFormAddNote.name": function () {
      if (this.ruleFormAddNote.name) {
        this.ruleFormAddNote.name = this.ruleFormAddNote.name.replace(
          /^\s+|\s+$/g,
          ""
        );
        if (this.ruleFormAddNote.name.trim().length > 0) {
          this.templatedisable = false;
        } else {
          this.templatedisable = true;
        }
      } else {
        this.templatedisable = true;
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "./css/base.css";
@import "./css/sy.css";

.mb .el-form--label-top .el-form-item__label {
  float: none;
  display: inline-block;
  text-align: left;
  padding: 0 0 0 0;
  line-height: 15px;
  font-weight: bold;
  font-size: 10px;
}

.format {
  margin-left: 10px;
  font-weight: bold;
  font-size: 10px;
}

.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.el-row {
  margin-bottom: 20px;
}

.input-class {
  width: 25vw;
}
.input-class-template-edit {
  width: 21vw;
}

.input-class-template {
  width: 21vw;
}
:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.messageInput {
  width: 100%;
  float: left;
}
</style>
