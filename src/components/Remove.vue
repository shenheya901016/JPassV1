<template>
  <div>
    <!--删除文件夹弹出框-->
    <el-dialog :title="$t('main.delete')" :visible.sync="dialogVisibledDirectory" width="30%" @closed="closeDialogVisibledDirectory">
      <span>{{ $t("main.doYouWantToDeleteTheFolder") }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="removeData()">{{
            $t("main.okFormat")
          }}</el-button>
        <el-button size="small" @click="dialogVisibledDirectory = false">{{
            $t("main.cancelFormat")
          }}</el-button>
      </span>
    </el-dialog>
    <!--删除项目弹出框-->
    <!-- <el-dialog :title="$t('main.delete')" :visible.sync="dialogVisibledProject" width="30%">
      <span>{{ $t("main.doYouWantToDeleteTheProject") }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="removeData()">{{
            $t("main.okFormat")
          }}</el-button>
        <el-button size="small" @click="dialogVisibledProject = false">{{
            $t("main.cancelFormat")
          }}</el-button>
      </span>
    </el-dialog> -->
    <!--删除模板/项目弹框-->
    <el-dialog :title="$t('main.delete')" :visible.sync="dialogVisibledData" width="30%" @closed="closeDialogVisibledData">
      <span>{{ $t("main.doYouWantToDeleteTheTemplate") }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="removeData()">{{
            $t("main.okFormat")
          }}</el-button>
        <el-button size="small" @click="dialogVisibledData = false">{{
            $t("main.cancelFormat")
          }}</el-button>
      </span>
    </el-dialog>
    <!--删除项目弹出框(trash)-->
    <el-dialog :title="$t('main.delete')" :visible.sync="dialogVisibledProjectDel" width="30%" @closed="closeDialogVisibledProjectDel">
      <span>{{ $t("main.doYouWantToDeleteTheProjectrestore") }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="removeDataTrash()">{{
            $t("main.okFormat")
          }}</el-button>
        <el-button size="small" @click="dialogVisibledProjectDel = false">{{
            $t("main.cancelFormat")
          }}</el-button>
      </span>
    </el-dialog>
    <!--清空垃圾箱弹出框-->
    <el-dialog :title="$t('main.cleartrash')" :visible.sync="dialogclearTrash" width="30%" @closed="closeDialogclearTrash">
      <span>{{ $t("main.clearTashTitle") }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="clearTrash()">{{
            $t("main.okFormat")
          }}</el-button>
        <el-button size="small" @click="dialogclearTrash = false">{{
            $t("main.cancelFormat")
          }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ["dialogVisibledDataM", "dialogVisibledProjectDelM", "dialogclearTrashM", "dialogVisibledDirectoryM"],
  data () {
    return {
      dialogVisibledDirectory: false,
      dialogVisibledData: false,
      dialogVisibledProjectDel: false,
      dialogclearTrash: false,
      dialogVisibledDirectory: false,
    };
  },
  methods: {
    //删除数据
    async removeData () {
      var type = this.$store.state.mainPage.delobj.type;
      var id = this.$store.state.mainPage.delobj.id;
      console.log(this.$store.state.mainPage.delobj.name);
      let nextObj = "";
      //批量删除
      if (this.$store.state.mainPage.checkedArray.length > 0) {
        if (this.$store.state.mainPage.checkedArray.length == 1) {
          console.log("单独删除");
          //单个删除后确定check为删除元素的下一个元素，check该元素
          let projectslist = this.$store.state.mainPage.projects;
          for (let i = 0; i < projectslist.length; i++) {
            //删除其他项
            if (projectslist[i].id == id && projectslist.length - 1 != i) {
              this.$store.state.mainPage.currentNote = i;
              i++;
              nextObj = projectslist[i];
              break;
            } else if (projectslist.length - 1 == i) {
              //删除最后一项
              nextObj = projectslist[0];
              this.$store.state.mainPage.currentNote = 0;
            }
          }
          if (
            this.$store.state.mainPage.checkedArray[0].type == "project" &&
            this.$store.state.mainPage.checkedArray[0].isDel != true
          ) {
            this.$store.state.mainPage.checkedArray.forEach(item => {
              this.$store.state.mainPage.db.get("project").find({ id: item.id }).set("isDel", true).write();
            });
            //阿里时间
            this.$store.dispatch('getTime');
            let now = this.$store.state.utils.aliTime;
            this.$store.state.mainPage.db.set("version", now).write();
            this.closeDialogVisibledData();
            this.$store.dispatch('getdirectory');
            this.$store.dispatch('notesBytargeId', this.$store.state.mainPage.db.get("models").find({ id: this.$store.state.mainPage.directoryClickId }).value());
          }
          if (
            this.$store.state.mainPage.checkedArray[0].type == "template" &&
            this.$store.state.mainPage.checkedArray[0].isDel != true
          ) {
            this.$store.state.mainPage.checkedArray.forEach(item => {
              this.$store.state.mainPage.db.get("templates").find({ id: item.id }).set("isDel", true).write();
            });
            //阿里时间
            this.$store.dispatch('getTime');
            let now = this.$store.state.utils.aliTime;
            this.$store.state.mainPage.db.set("version", now).write();
            this.closeDialogVisibledData();
            this.$store.dispatch('getdirectory');
            this.$store.dispatch('notesBytargeId', this.$store.state.mainPage.db.get("models").find({ id: "mb" }).value());
          }
          this.$store.state.mainPage.delobj = nextObj;
          //先清除checkedArray，再push 删除对象的下一个对象
          this.$store.state.mainPage.checkedArray = [];
          if (this.$store.state.mainPage.projects.length > 0) {
            //判断当前目录是否删除空，删空的话清除明细，按钮置灰。
            //  this.checkedArray.push(nextObj);
            this.$store.state.mainPage.projectEvent = nextObj;
          } else {
            this.$store.state.mainPage.projectEvent = "";
            this.$store.state.mainPage.isDisabled = true;
          }
        } else {
          console.log("批量删除");
          if (
            this.$store.state.mainPage.checkedArray[0].type == "project" &&
            this.$store.state.mainPage.checkedArray[0].isDel != true
          ) {
            this.$store.state.mainPage.checkedArray.forEach(item => {
              this.$store.state.mainPage.db.get("project").find({ id: item.id }).set("isDel", true).write();
            });
            //阿里时间
            this.$store.dispatch('getTime');
            let now = this.$store.state.utils.aliTime;
            this.$store.state.mainPage.db.set("version", now).write();
            this.closeDialogVisibledData();
            this.$store.state.mainPage.projectEvent = "";
            this.$store.dispatch('getdirectory');
            console.log(this.$store.state.mainPage.directoryClickId);
            this.$store.dispatch('notesBytargeId', this.$store.state.mainPage.db.get("models").find({ id: this.$store.state.mainPage.directoryClickId }).value());
          }
          if (
            this.$store.state.mainPage.checkedArray[0].type == "template" &&
            this.$store.state.mainPage.checkedArray[0].isDel != true
          ) {
            this.$store.state.mainPage.checkedArray.forEach(item => {
              this.$store.state.mainPage.db.get("templates").find({ id: item.id }).set("isDel", true).write();
            });
            //阿里时间
            this.$store.dispatch('getTime');
            let now = this.$store.state.utils.aliTime;
            this.$store.state.mainPage.db.set("version", now).write();
            this.closeDialogVisibledData();
            this.$store.state.mainPage.projectEvent = "";
            this.$store.dispatch('getdirectory');
            this.$store.dispatch('notesBytargeId', this.$store.state.mainPage.db.get("models").find({ id: "mb" }).value());
          }
          this.$store.state.mainPage.checkedArray = [];
          this.$store.state.mainPage.currentNote = -1;
          this.$store.state.mainPage.isDisabled = true;
        }
      } else if (type != "model") {
        console.log("右击单独删除");
        //单个删除后确定check为删除元素的下一个元素，check该元素
        let projectslist = this.$store.state.mainPage.projects;
        for (let i = 0; i < projectslist.length; i++) {
          //删除其他项
          if (projectslist[i].id == id && projectslist.length - 1 != i) {
            this.$store.state.mainPage.currentNote = i;
            i++;
            nextObj = projectslist[i];
            break;
          } else if (projectslist.length - 1 == i) {
            //删除最后一项
            nextObj = projectslist[0];
            this.$store.state.mainPage.currentNote = 0;
          }
        }
        if (type == "project" && this.$store.state.mainPage.delobj.isDel != true) {
          this.$store.state.mainPage.db.find({ id: id }).set("isDel", true).write();
          //阿里时间
          this.$store.dispatch('getTime');
          let now = this.$store.state.utils.aliTime;
          this.$store.state.mainPage.db.set("version", now).write();
          this.closeDialogVisibledData();
          this.$store.dispatch('getdirectory');
          console.log(this.$store.state.mainPage.directoryClickId);
          this.$store.dispatch('notesBytargeId', this.$store.state.mainPage.db.get("models").find({ id: this.$store.state.mainPage.directoryClickId }).value());
        }
        if (type == "template" && this.$store.state.mainPage.delobj.isDel != true) {
          this.$store.state.mainPage.db.get("templates").find({ id: id }).set("isDel", true).write();
          //阿里时间
          this.$store.dispatch('getTime');
          let now = this.$store.state.utils.aliTime;
          this.$store.state.mainPage.db.set("version", now).write();
          this.closeDialogVisibledData();
          this.$store.dispatch('getdirectory');
          this.$store.dispatch('notesBytargeId', this.$store.state.mainPage.db.get("models").find({ id: "mb" }).value());
        }
        this.$store.state.mainPage.delobj = nextObj;
        if (this.$store.state.mainPage.projects.length > 0) {
          //判断当前目录是否删除空，删空的话清除明细，按钮置灰。
          //  this.checkedArray.push(nextObj);
          this.$store.state.mainPage.projectEvent = nextObj;
        } else {
          this.$store.state.mainPage.projectEvent = "";
          this.$store.state.mainPage.isDisabled = true;
        }
      }
      if (type == "model") {
        //删除labels
        console.log("删除labels");
        let directorylist = this.$store.state.mainPage.DDirectory.directory;
        for (let i = 0; i < directorylist.length; i++) {
          //删除其他项
          if (directorylist[i].id == id && directorylist.length - 1 != i) {
            this.$store.state.mainPage.currentDirectory = i;
            i++;
            nextObj = directorylist[i];
            break;
          } else if (directorylist.length - 1 == i) {
            //删除最后一项
            nextObj = directorylist[0];
            this.$store.state.mainPage.currentDirectory = 0;
          }
        }
        var projects = this.$store.state.mainPage.db.get("project").value();
        this.$store.state.mainPage.db.get("models").remove({ id: id }).write();
        if (projects.length > 0) {
          for (var project in projects) {
            var index = projects[project].modelsId.indexOf(id);
            if (index > -1) {
              //删除modelsId数组中指定位置的项
              projects[project].modelsId.splice(index, 1);
              this.$store.state.mainPage.selectlabels = projects[project].modelsId;
              //处理分类
              if (this.$store.state.mainPage.selectlabels.indexOf("sy") == -1) {
                this.$store.state.mainPage.selectlabels.push("sy"); //所有项必须有
              }
              if (
                this.$store.state.mainPage.selectlabels.length == 1 &&
                this.$store.state.mainPage.selectlabels.indexOf("sy") != -1
              ) {
                this.$store.state.mainPage.selectlabels.push("wbj"); //只有所有项，增加未标记项
              }
              if (
                this.$store.state.mainPage.selectlabels.length > 2 &&
                this.$store.state.mainPage.selectlabels.indexOf("sy") != -1 &&
                this.$store.state.mainPage.selectlabels.indexOf("wbj") != -1
              ) {
                //大于2项，包含所有项和为标记项时删除为标记项
                this.$store.state.mainPage.selectlabels = this.$store.state.mainPage.selectlabels.filter(function (item) {
                  return item !== "wbj";
                });
              }
              projects[project].modelsId = this.$JSON5.parse(
                this.$JSON5.stringify(this.$store.state.mainPage.selectlabels)
              );
              //更新project中的类别
              this.$store.state.mainPage.db.get("project").find({ id: projects[project].id }).assign({ modelsId: this.$store.state.mainPage.selectlabels }).write();
              this.$store.state.mainPage.selectlabels = "";
            }
          }
        }
        //更新template中的类别
        var templates = this.$store.state.mainPage.db.get("templates").value();
        if (templates.length > 0) {
          for (var template in templates) {
            var index = templates[template].modelsId.indexOf(id);
            if (index > -1) {
              templates[template].modelsId.splice(index, 1);
              this.$store.state.mainPage.db.get("templates").find({ id: templates[template].id }).assign({ modelsId: templates[template].modelsId }).write();
            }
          }
        }
        //阿里时间
        this.$store.dispatch('getTime');
        let now = this.$store.state.utils.aliTime;
        this.$store.state.mainPage.db.set("version", now).write();
        this.closeDialogVisibledDirectory();
        this.$store.dispatch('getdirectory');
        console.log(nextObj);
        this.$store.state.mainPage.delobj = nextObj;
        this.$store.dispatch('notesBytargeId', nextObj);
      }
    },
    //垃圾桶直接删除
    async removeDataTrash () {
      var type = this.$store.state.mainPage.delobj.type;
      var id = this.$store.state.mainPage.delobj.id;
      let nextObj = "";
      if (this.$store.state.mainPage.checkedArray.length > 0) {
        if (this.$store.state.mainPage.checkedArray.length == 1) {
          console.log("单独删除");
          //单个删除后确定check为删除元素的下一个元素，check该元素
          let projectslist = this.$store.state.mainPage.projects;
          for (let i = 0; i < projectslist.length; i++) {
            //删除其他项
            if (projectslist[i].id == id && projectslist.length - 1 != i) {
              this.$store.state.mainPage.currentNote = i;
              i++;
              nextObj = projectslist[i];
              break;
            } else if (projectslist.length - 1 == i) {
              //删除最后一项
              nextObj = projectslist[0];
              this.$store.state.mainPage.currentNote = 0;
            }
          }
          if (this.$store.state.mainPage.checkedArray[0].isDel == true) {
            this.$store.state.mainPage.checkedArray.forEach(item => {
              if (item.type == "project") {
                this.$store.state.mainPage.db.get("project").remove({ id: item.id }).write();
              }
              if (item.type == "template") {
                this.$store.state.mainPage.db.get("templates").remove({ id: item.id }).write();
              }
            });
            this.closeDialogVisibledProjectDel();
            this.$store.state.mainPage.projectEvent = "";
            this.$store.dispatch('getdirectory');
            console.log(2234);
            console.log(this.$store.state.mainPage.directoryClickId);
            this.$store.dispatch('notesBytargeId', this.$store.state.mainPage.db.get("models").find({ id: this.$store.state.mainPage.directoryClickId }).value());
          }
          this.$store.state.mainPage.delobj = nextObj;
          //先清除checkedArray，再push 删除对象的下一个对象
          this.$store.state.mainPage.checkedArray = [];
          if (this.$store.state.mainPage.projects.length > 0) {
            //判断当前目录是否删除空，删空的话清除明细，按钮置灰。
            //  this.checkedArray.push(nextObj);
            this.$store.state.mainPage.projectEvent = nextObj;
          } else {
            this.$store.state.mainPage.projectEvent = "";
            this.$store.state.mainPage.isDisabled = true;
          }
        } else {
          //批量删除
          if (this.$store.state.mainPage.checkedArray[0].isDel == true) {
            this.$store.state.mainPage.checkedArray.forEach(item => {
              if (item.type == "project") {
                this.$store.state.mainPage.db.get("project").remove({ id: item.id }).write();
              }
              if (item.type == "template") {
                this.$store.state.mainPage.db.get("templates").remove({ id: item.id }).write();
              }
            });
            this.closeDialogVisibledProjectDel();
            this.$store.state.mainPage.projectEvent = "";
            this.$store.dispatch('getdirectory');
            this.$store.dispatch('notesBytargeId', this.$store.state.mainPage.db.get("models").find({ id: this.$store.state.mainPage.directoryClickId }).value());
          }
          this.$store.state.mainPage.checkedArray = [];
          this.$store.state.mainPage.currentNote = -1;
          this.$store.state.mainPage.isDisabled = true;
        }
      } else {
        console.log("右击单独删除");
        //单个删除后确定check为删除元素的下一个元素，check该元素
        let projectslist = this.$store.state.mainPage.projects;
        for (let i = 0; i < projectslist.length; i++) {
          //删除其他项
          if (projectslist[i].id == id && projectslist.length - 1 != i) {
            this.$store.state.mainPage.currentNote = i;
            i++;
            nextObj = projectslist[i];
            break;
          } else if (projectslist.length - 1 == i) {
            //删除最后一项
            nextObj = projectslist[0];
            this.$store.state.mainPage.currentNote = 0;
          }
        }
        if (this.$store.state.mainPage.delobj.isDel == true) {
          if (type == "project") {
            this.$store.state.mainPage.db.get("project").remove({ id: id }).write();
          }
          if (type == "template") {
            this.$store.state.mainPage.db.get("templates").remove({ id: id }).write();
          }
          this.closeDialogVisibledProjectDel();
          this.$store.state.mainPage.projectEvent = "";
          this.$store.dispatch('getdirectory');
          this.$store.dispatch('notesBytargeId', this.$store.state.mainPage.db.get("models").find({ id: this.$store.state.mainPage.directoryClickId }).value());

        }
        this.$store.state.mainPage.delobj = nextObj;
        if (this.$store.state.mainPage.projects.length > 0) {
          //判断当前目录是否删除空，删空的话清除明细，按钮置灰。
          //  this.checkedArray.push(nextObj);
          this.$store.state.mainPage.projectEvent = nextObj;
        } else {
          this.$store.state.mainPage.projectEvent = "";
          this.$store.state.mainPage.isDisabled = true;
        }
      }
      //阿里时间
      this.$store.dispatch('getTime');
      let now = this.$store.state.utils.aliTime;
      this.$store.state.mainPage.db.set("version", now).write();
    },

    //清空垃圾箱
    async clearTrash () {
      console.log(11111);
      let delTemplate = this.$store.state.mainPage.db.get("templates").filter({ isDel: true }).value();
      for (var index in delTemplate) {
        this.$store.state.mainPage.db.get("templates").remove({ id: delTemplate[index].id }).write();
      }
      let delProject = this.$store.state.mainPage.db.get("project").filter({ isDel: true }).value();
      for (var index in delProject) {
        this.$store.state.mainPage.db.get("project").remove({ id: delProject[index].id }).write();
      }
      //阿里时间
      this.$store.dispatch('getTime');
      let now = this.$store.state.utils.aliTime;
      this.$store.state.mainPage.db.set("version", now).write();
      this.closeDialogclearTrash();
      this.$store.dispatch('getdirectory');
      this.$store.dispatch('notesBytargeId', this.$store.state.mainPage.db.get("models").find({ id: this.$store.state.mainPage.directoryClickId }).value());
      this.$store.state.mainPage.projectEvent = "";
    },

    //关闭窗口（删除项目，模板）
    closeDialogVisibledData () {
      this.dialogVisibledData = false;
      this.$emit('closeDialogVisibledData', false); // 关闭弹框的传值
    },

    //关闭窗口（删除项目，模板）
    closeDialogVisibledDirectory () {
      this.dialogVisibledDirectory = false;
      this.$emit('closeDialogVisibledDirectory', false); // 关闭弹框的传值
    },

    closeDialogVisibledProjectDel () {
      this.dialogVisibledProjectDel = false;
      this.$emit('closeDialogVisibledProjectDel', false); // 关闭弹框的传值
    },

    closeDialogclearTrash () {
      this.dialogclearTrash = false;
      this.$emit('closeDialogclearTrash', false); // 关闭弹框的传值
    }

  },

  watch: {
    dialogVisibledDataM: function (data) {
      this.dialogVisibledData = data;
    },
    dialogVisibledProjectDelM: function (data) {
      this.dialogVisibledProjectDel = data;
    },
    dialogclearTrashM: function (data) {
      this.dialogclearTrash = data;
    },
    dialogVisibledDirectoryM: function (data) {
      this.dialogVisibledDirectory = data;
    },

  }

}
</script>

