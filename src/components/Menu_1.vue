<template>
  <ul id="menu_1" class="menu">
    <li ref="addDir" :class="addDirClasses" @click="addDirectoryOP">
      <img src="@/views/jpass/img/tianjiawenjianjia.svg" style="width: 2vw;    margin-left: 0.5vw;margin-right: 0.1vw;" alt />
      {{ $t("main.newFolder") }}
    </li>
    <li ref="export" :class="exportClasses">
      <img alt src="@/views/jpass/img/download.svg" style="width: 2vw;margin-left: 0.5vw;margin-right: 0.1vw;" />
      {{ $t("main.export") }}
    </li>
    <li ref :class="renameClasses" @click="rename">
      <img src="@/views/jpass/img/edit.svg" style="width: 2vw;    margin-left: 0.5vw;margin-right: 0.1vw;" alt />
      {{ $t("main.rename") }}
    </li>
    <li ref :class="selectColorClasses" @click="selectColor">
      <img src="@/views/jpass/img/tsp.png" style="width: 2vw;margin-left: 0.5vw;margin-right: 0.1vw;" alt />
      {{ $t("main.selectColorD") }}
    </li>
    <li v-if="delobj.modelsType == 'directory'" :class="toTop" @click="toTop">
      <img v-if="delobj.top == true" style="width: 2vw;margin-left: 0.5vw;margin-right: 0.1vw;" src="@/views/jpass/img/bottom.svg" />
      <img v-if="delobj.top == false" style="width: 2vw;margin-left: 0.5vw;margin-right: 0.1vw;" src="@/views/jpass/img/top.svg" />
      {{ $t("main.toTop") }}
    </li>
    <li ref="addNote" :class="addNoteClasses" @click="addNote">
      <img src="@/views/jpass/img/aside_icon4.svg" alt />
      {{ $t("main.newNote") }}
    </li>
    <li ref="addTemp" :class="addTemplateClasses" @click="addTemplate">
      <img src="@/views/jpass/img/moban.svg" alt />
      {{ $t("main.newTemplate") }}
    </li>
    <li ref="addPro" :class="addProjectClasses" @click="selectTemplate">
      <img src="@/views/jpass/img/tianjiaxiangmu.svg" alt />
      {{ $t("main.newProject") }}
    </li>
    <li ref="delete" :class="deleteClasses" @click="remove">
      <img src="@/views/jpass/img/ICON-SC.svg" alt />
      {{ $t("main.delete") }}
    </li>
    <li ref="recover" :class="recoverClass" @click="recover">
      <img src="@/views/jpass/img/recover.png" alt />
      &nbsp;{{ $t("main.recover") }}
    </li>
    <li ref="emptyTrash" :class="emptyTrashClasses" @click="clearTrash">
      <img src="@/views/jpass/img/trash.svg" alt />
      {{ $t("main.cleartrash") }}
    </li>
  </ul>
</template>
<script>
export default {
  props: [""],
  data () {
    return {
      //menu 右击菜单
      addNoteClasses: [], //新建笔记样式表
      renameClasses: [], //rename
      addDirClasses: [], //新建文件夹样式表
      addProjectClasses: [], //新建项目样式表
      addTemplateClasses: [], //新建模板样式表
      emptyTrashClasses: [], //清空垃圾样式表
      deleteClasses: [], //删除样式表
      recoverClass: [], //恢复样式表
      selectColorClasses: [], //选择颜色样式表
      exportClasses: [],

    };
  },
  methods: {
    addDirectoryOP () {

    },

    rename () {

    },

    selectColor () {

    },
    toTop () {

    },
    addNote () {

    },
    addTemplate () {

    },
    selectTemplate () {

    },

    remove () {

    },
    recover () {

    },

    clearTrash () {

    },

    openMenu_1 (project, obj) {
      console.log(this.delobj);
      if (project.type == "model") {
        if (project.modelsType == "directory") {
          this.isDisabled = false; //启用删除
        } else {
          this.isDisabled = true;
        }
      }
      if (project.type == "project") {
        this.isDisabled = false; //启用删除
      }
      this.delobj = project; //赋值删除对象
      if (project.type != "model") {
        //indexof undefind 问题
        this.projectEvent = project;
      }
      var menu = document.getElementById("menu_1");
      var position = obj.target.getBoundingClientRect(); //获取点击元素的位置
      menu.style.display = "block";
      menu.style.left = position.right + 10 + "px";
      if (document.body.clientHeight > menu.clientHeight + position.bottom) {
        menu.style.top = position.top + position.height + 10 + "px";
      } else {
        menu.style.top = position.top - menu.clientHeight - 10 + "px";
      }
      this.menulistchange(project);
      this.stopPropagation(obj);
    },
    //阻止冒泡
    stopPropagation (e) {
      e = e || window.event;
      if (e.stopPropagation) {
        //W3C阻止冒泡方法
        e.stopPropagation();
      } else {
        e.cancelBubble = true; //IE阻止冒泡方法
      }
    },
    //点击空白地区显示菜单
    openMenu_empty (obj) {
      this.addDirClasses = [];
      this.renameClasses = [];
      this.addProjectClasses = [];
      this.addTemplateClasses = [];
      this.emptyTrashClasses = [];
      this.addNoteClasses = [];
      this.deleteClasses = [];
      this.selectColorClasses = [];
      this.recoverClass = ["unuse"];
      var menu = document.getElementById("menu_1");
      var e = e || window.event;
      var x = e.clientX;
      var y = e.clientY;
      menu.style.display = "block";
      menu.style.left = x + "px";
      menu.style.top = y + "px";
      this.exportClasses.push("unuse");
      this.deleteClasses.push("unuse");
      this.recoverClass.push("unuse");
      this.addDirClasses.push("unuse");
      this.renameClasses.push("unuse");
      this.selectColorClasses.push("unuse");
    },
    //菜单变化
    menulistchange (obj) {
      this.addDirClasses = [];
      this.renameClasses = [];
      this.addProjectClasses = [];
      this.addTemplateClasses = [];
      this.addNoteClasses = [];
      this.emptyTrashClasses = [];
      this.deleteClasses = [];
      this.selectColorClasses = [];
      this.recoverClass = ["unuse"];
      this.exportClasses = ["unuse"];
      if (
        (obj.type === "model" && obj.count > 0) ||
        obj.type === "project" ||
        obj.type === "template"
      ) {
        this.exportClasses = [];
      }
      if (obj.modelsType == "directory") {
        this.emptyTrashClasses.push("unuse");
        this.addProjectClasses.push("unuse");
        this.addTemplateClasses.push("unuse");
        this.emptyTrashClasses.push("unuse");
        this.addNoteClasses.push("unuse");
      } else if (obj.modelsType == "project") {
        this.emptyTrashClasses.push("unuse");
        this.addProjectClasses.push("unuse");
        this.addTemplateClasses.push("unuse");
        this.addNoteClasses.push("unuse");
        this.emptyTrashClasses.push("unuse");
        this.deleteClasses.push("unuse");
        this.selectColorClasses.push("unuse");
        this.renameClasses.push("unuse");
      }
      if (this.showTrash != true) {
        this.emptyTrashClasses.push("unuse");
      }
      if (obj.isDel) {
        this.recoverClass = [];
        // this.deleteClasses = ["unuse"];
      }
      if (obj.type != "model") {
        this.renameClasses.push("unuse");
        this.addDirClasses.push("unuse");
        this.selectColorClasses.push("unuse");
      }
      if (obj.id == "ljt" && this.showTrash == true) {
        this.emptyTrashClasses = [];
      }
    },


  },
  watch: {

  }
};
</script>