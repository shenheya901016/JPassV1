<template>
  <div>
    <!--增加文件夹-->
    <el-dialog :title="$t('main.addDirectory')" :visible.sync="dialogVisible2" width="30%" :close-on-click-modal="false" :show-close="false">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="width: 80%;" :rules="rules" @submit.native.prevent>
        <el-form-item :label="$t('main.name')" prop="pName" style="">
          <el-input v-model.trim="ruleForm.pName" style="width:100%;"></el-input>
        </el-form-item>
        <el-form-item label="" prop="" style="margin-top:10%;text-align: center">
          <el-button type="primary" size="small" @click="submitForm('ruleForm')">{{ $t("main.ok") }}
          </el-button>
          <el-button size="small" @click="cancel('ruleForm')">{{ $t("main.cancel") }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改文件夹名称-->
    <el-dialog :title="$t('main.rename')" :visible.sync="dialogVisibleRename" width="30%" :close-on-click-modal="false" :show-close="false">
      <el-form :model="ruleFormRename" ref="ruleFormRename" label-width="100px" class="demo-ruleForm" style="width: 80%;" :rules="rules" @submit.native.prevent>
        <el-form-item :label="$t('main.name')" prop="pName" style="">
          <el-input v-model.trim="ruleFormRename.pName" style="width:100%;"></el-input>
        </el-form-item>
        <el-form-item label="" prop="" style="margin-top:10%;text-align: center">
          <el-button type="primary" size="small" @click="submitFormRename('ruleFormRename')">{{ $t("main.ok") }}
          </el-button>
          <el-button size="small" @click="cancelRename('ruleFormRename')">{{ $t("main.cancel") }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ["dialogVisible2M", "dialogVisibleRenameM"],
  data () {
    return {
      dialogVisible2: false,
      dialogVisibleRename: false,
      ruleFormRename: {
        pName: ""
      },
      ruleForm: {
        modelsType: "",
        pName: ""
      },
      rules: {
        modelsType: [
          {
            required: true,
            message: this.$t("main.pleaseChooseTheType"),
            trigger: "blur"
          }
        ],
        pName: [
          {
            required: true,
            message: this.$t("main.pleaseEnterAName"),
            trigger: "blur"
          }
        ],
      }
    }
  },
  methods: {
    openRename () {
      this.ruleFormRename.pName = this.$store.state.mainPage.delobj.name;
      this.dialogVisibleRename = true;
    },
    closeDialogVisible2 () {
      this.dialogVisible2 = false;
      this.$emit('closeDialogVisible2', false); // 关闭弹框的传值
    },
    closeDialogVisibleRename () {
      this.dialogVisibleRename = false;
      this.$emit('closeDialogVisibleRename', false); // 关闭弹框的传值
    },

    //提交添加目录
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addDirectory(formName);
        } else {
          return false;
        }
      });
    },
    cancel (formName) {
      this.$refs[formName].resetFields();
      this.closeDialogVisible2();
    },

    cancelRename (formName) {
      this.$refs[formName].resetFields();
      this.closeDialogVisibleRename();
    },


    //增加文件夹
    async addDirectory (formName) {
      let id = this.$Uuidv1();
      let name = this.ruleForm.pName;
      let newModel =
        '{"id":"' +
        id +
        '" ,"name" :"' +
        name +
        '","modelsType":"directory","imgPath":"aside_999999.svg","type":"model","isDel":false,"top":false,"index":""}';
      this.$store.state.mainPage.db.get("models").push(this.$JSON5.parse(newModel)).write();
      this.closeDialogVisible2();
      this.$store.dispatch('newVersion');
      this.$store.dispatch('getdirectory');
      this.$refs[formName].resetFields();
    },

    /**
    * 文件夹重命名
    * @param formName
    */
    submitFormRename (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.renameDo(formName);
        } else {
          return false;
        }
      });
    },

    //增加文件夹
    async renameDo (formName) {
      let id = this.$store.state.mainPage.delobj.id;
      let directory = this.$store.state.mainPage.db.get("models").find({ id: id }).value();
      if (directory.name != this.ruleFormRename.pName) {
        directory.name = this.ruleFormRename.pName;
        this.$store.state.mainPage.db.get("models").remove({ id: id }).write();
        this.$store.state.mainPage.db.get("models").push(this.$JSON5.parse(this.$JSON5.stringify(directory))).write();
        this.$store.dispatch('newVersion');
      }
      this.closeDialogVisibleRename();
      this.$store.dispatch('getdirectory');
      //check
      let listproject = this.$store.state.mainPage.DDirectory.directory;
      for (let index in listproject) {
        if (listproject[index].id == this.$store.state.mainPage.directoryClickId) {
          this.$store.state.mainPage.currentDirectory = index;
          this.$store.state.mainPage.currentProject = -1; //目录check 指向sy
          this.$store.state.mainPage.currentSpecial = -1;
          break;
        }
      }
      this.$refs[formName].resetFields();
      this.$store.dispatch('notesBytargeId', this.$store.state.mainPage.db.get("models").find({ id: this.$store.state.mainPage.directoryClickId }).value());
    },

    //置顶
    async toTop () {
      let id = this.$store.state.mainPage.delobj.id;
      let topDirectory = this.$store.state.mainPage.db.get("models").find({ id: id }).value();
      let directorylist = this.$store.state.mainPage.DDirectory.directory;
      if (topDirectory.modelsType == "directory") {
        for (let index in directorylist) {
          if (directorylist[index].id == topDirectory.id) {
            if (directorylist[index].top != true) {
              //增加置顶
              directorylist[index].top = true;
              directorylist[index].index = 0;
              this.$store.state.mainPage.db.get("models").remove({ id: id }).write();
              this.$store.state.mainPage.db.get("models").push(this.$JSON5.parse(this.$JSON5.stringify(directorylist[index]))).write();
              this.$store.dispatch('newVersion');
            } else {
              //取消置顶
              directorylist[index].top = false;
              directorylist[index].index = "";
              this.$store.state.mainPage.db.get("models").remove({ id: id }).write();
              this.$store.state.mainPage.db.get("models").push(this.$JSON5.parse(this.$JSON5.stringify(directorylist[index]))).write();
              this.$store.dispatch('newVersion');
            }
          } else if (directorylist[index].top != false) {
            directorylist[index].index = directorylist[index].index + 1;
            this.$store.state.mainPage.db.get("models").remove({ id: directorylist[index].id }).write();
            this.$store.state.mainPage.db.get("models").push(this.$JSON5.parse(this.$JSON5.stringify(directorylist[index]))).write();
            this.$store.dispatch('newVersion');
          }
        }
      }
      this.$store.dispatch('getDirectoryLeft');
      //重新排序后设置选中按钮位置
      directorylist = this.$store.state.mainPage.DDirectory.directory;
      for (let index in directorylist) {
        if (directorylist[index].id == this.$store.state.mainPage.delobj.id) {
          this.$store.state.mainPage.currentDirectory = index;
        }
      }
    },
  },
  watch: {
    dialogVisible2M: function (data) {
      this.dialogVisible2 = data;
    },
    dialogVisibleRenameM: function (data) {
      this.dialogVisibleRename = data;
    },
  }
}
</script>