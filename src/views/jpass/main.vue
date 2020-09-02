<template>
    <body class="sy" @mousemove="GetXYPosition">
    <!-- 头部 -->
    <header class="header">
        <!-- 全局隐藏域 -->
        <img :src='`${publicPath}img/misc/lock.svg`' ref="icon_default" style="display: none"/>
        <h1 style="margin-left: 40px;">
            <a href="#"> <img src="./img/Logo-4.svg" alt=""/> </a>
        </h1>
        <ul class="link">
            <li>
                <el-button @click="addDirectoryOP" style="border:0;padding: 5px 5px;">
                    <img style="top:-2px;height: 25px;width: 25px;" src="./img/tianjiawenjianjia.svg" alt=""/>
                    {{ $t("main.newFolder") }}
                </el-button>
            </li>
            <li>
                <el-button @click="addNote" style="border:0;padding: 5px 5px;"
                ><img
                        style="top:-2px;height: 20px;width: 20px;"
                        src="./img/moban.svg"
                        alt=""
                />{{ $t("main.newNote") }}
                </el-button>
            </li>
            <li>
                <el-button @click="selectTemplate" style="border:0;padding: 5px 5px;"
                ><img
                        style="top:-2px;height: 20px;width: 20px;"
                        src="./img/tianjiaxiangmu.svg"
                        alt=""
                />{{ $t("main.newProject") }}
                </el-button>
            </li>
            <li>
                <el-button
                        :disabled="isDisabled"
                        @click="remove"
                        id="delbtn"
                        style="border:0;padding: 5px 5px;"
                ><img style="top:-2px;" src="./img/ICON-SC.svg" alt=""/>{{
                    $t("main.delete")
                    }}
                </el-button>
            </li>
            <li>
                <el-button
                        v-if="showTrash == true"
                        style="border:0;padding: 5px 5px;"
                        @click="dialogclearTrash = true"
                >
                    <img
                            style="top:-2px;height: 25px;width: 25px;"
                            src="./img/trash.svg"
                            alt=""
                    />{{ $t("main.cleartrash") }}
                </el-button>
            </li>
            <li>
                <el-button
                        style="border:0;padding:5px 5px;"
                        @click="synchronization()"
                ><img style="top:-2px;" src="./img/ICON-TB.svg"/>{{
                    $t("main.synchronize")
                    }}
                </el-button>
            </li>
            <li>
                <el-button style="border:0;padding: 5px 5px;" @click="lock()"
                ><img style="top:-2px;" src="./img/ICON-SD.svg" alt=""/>{{
                    $t("main.locking")
                    }}
                </el-button>
            </li>
            <li>
                <el-button
                        style="border:0;padding: 5px 5px;"
                        @click="passwordGeneratorMain()"
                ><img
                        style="top:-2px;height: 25px;width: 25px;"
                        src="./img/钥匙.svg"
                        alt=""
                />{{ $t("main.PasswordGenerator") }}
                </el-button>
            </li>
            <li>
                <el-button style="border:0;padding: 5px 5px;" @click="exportFileAll()">
                  <img alt="" src="./img/钥匙.svg" style="top:-2px;height: 25px;width: 25px;"/>{{ $t("main.export") }}
                </el-button>
            </li>
            <li ref="" @click="importFileDialog = true">
                <el-button style="border:0;padding: 5px 5px;">
                  <img alt="" src="./img/钥匙.svg" style="top:-2px;height: 25px;width: 25px;"/>{{ $t("main.import") }}
                </el-button>
            </li>
        </ul>
        <div class="hr" style="width: 40%;">
            <a style="width: 50px;" @click="openSetting">
                <img style="height:30px;" src="./img/icon_sz.svg" alt=""/>
            </a>
            <div>
                <img style="height:50px;" src="./img/tx.svg" @click="myInfo" alt=""/>
            </div>
            <el-button style="border:0;height: 50px;margin: auto 0;" @click="logOut">
                <img style="top:-2px;height: 25px;width: 25px;" src="./img/退出登录.svg" alt=""/>
            </el-button>
        </div>
    </header>
    <!-- 侧边栏 -->
    <aside class="aside">
        <!-- 导航栏 -->
        <nav class="nav" style="">
            <h3>Jpass</h3>
            <ul class="dh" id="projectUL" style="">
                <li
                        v-for="(project, index) in DProject.project"
                        @click="projectclick(project, $event)"
                        :data-index="index"
                        :class="index == currentProject ? click : disclick"
                        @contextmenu.prevent="openMenu_1(project, $event)"
                        :key="index"
                >
            <span
            >{{ project.name }} <i>{{ project.count }}</i></span
            ></li>
            </ul>
            <h3>{{ $t("main.folder") }}</h3>
            <ul class="wjj"  style="display: flex;flex-direction: column;padding: 0 1.8vw 0 2.5vw;">
                <li style="height: 35px;line-height: 35px;border-radius: 7px;margin-bottom: 2%"
                        v-for="(project, index) in DDirectory.directory"
                        @click.left="directoryclick(project, $event)"
                        @dblclick="rename()"
                        :data-index="index"
                        :class="index == currentDirectory ? click : disclick"
                        @contextmenu.prevent="openMenu_1(project, $event)"
                        :key="index"
                >
             <img style="height: 35px;width: 20px;float: left;text-align: left;margin-left: 2px" :src='`${publicPath}img/directory/${project.imgPath}`'  alt=""/>
            <span :title="project.name" style="float: left;text-align: left;margin-left:3%;">
                {{
                   project.name.length > 5
                  ? project.name.substring(0, 5) + "..."
                  : project.name
                }}</span>
              <i style="float: right;color: #A8B1C6;width: 47px;height: 23px;text-align: center;border-radius: 11.5px;line-height: 23px; margin-top: 7px;position: absolute;right: 2vw;">{{ project.count }}</i>
            </li>
            </ul>
            <h3>{{ $t("main.special") }}</h3>
            <ul class="special" style="">
                <li
                        v-for="(project, index) in DSpecial.special"
                        @click="specialclick(project, $event)"
                        :data-index="index"
                        :class="index == currentSpecial ? click : disclick"
                        @contextmenu.prevent="openMenu_1(project, $event)"
                        :key="index"
                >
            <span
            >{{ project.name }} <i>{{ project.count }}</i></span
            ></li>
            </ul>
        </nav>
        <ul id="menu_1" class="menu">
            <li ref="addDir" :class="addDirClasses" @click="addDirectoryOP">
                <img
                        src="./img/tianjiawenjianjia.svg"
                        style="width: 2vw;    margin-left: 0.5vw;margin-right: 0.1vw;"
                        alt=""
                />
                {{ $t("main.newFolder") }}
            </li>
            <li ref="export" :class="exportClasses" @click="exportFile">
                <img alt="" src="./img/edit.svg" style="width: 2vw;margin-left: 0.5vw;margin-right: 0.1vw;"/>
                {{ $t("main.export") }}
            </li>
             <li ref="" :class="renameClasses" @click="rename">
                <img
                        src="./img/edit.svg"
                        style="width: 2vw;    margin-left: 0.5vw;margin-right: 0.1vw;"
                        alt=""
                />
                {{ $t("main.rename") }}
            </li>
            <li ref="" :class="selectColorClasses" @click="selectColor">
              <img
                  src="./img/tsp.png"
                  style="width: 2vw;margin-left: 0.5vw;margin-right: 0.1vw;"
                  alt=""
              />
              {{ $t("main.selectColorD") }}
            </li>
             <li  v-if="delobj.modelsType == 'directory'" :class="toTop" @click="toTop">
                <img
                      v-if="delobj.top==true"
                      style="width: 2vw;margin-left: 0.5vw;margin-right: 0.1vw;"
                      src="./img/bottom.svg"
                />
                <img
                      v-if="delobj.top==false"
                      style="width: 2vw;margin-left: 0.5vw;margin-right: 0.1vw;"
                      src="./img/top.svg"
                />
              {{ $t("main.toTop") }}
            </li>
             <li ref="addNote" :class="addNoteClasses" @click="addNote">
                <img src="./img/aside_icon4.svg" alt=""/>
                {{ $t("main.newNote") }}
            </li>
            <li ref="addTemp" :class="addTemplateClasses" @click="addTemplate">
                <img src="./img/moban.svg" alt=""/>
                {{ $t("main.newTemplate") }}
            </li>
            <li ref="addPro" :class="addProjectClasses" @click="selectTemplate">
                <img src="./img/tianjiaxiangmu.svg" alt=""/>
                {{ $t("main.newProject") }}
            </li>
            <li ref="delete" :class="deleteClasses" @click="remove">
                <img  src="./img/ICON-SC.svg" alt=""/>
                {{ $t("main.delete") }}
            </li>
            <li ref="recover" :class="recoverClass" @click="dialogRecover = true">
                <img src="./img/recover.png" alt=""/>&nbsp;{{ $t("main.recover") }}
            </li>
            <li
                    ref="emptyTrash"
                    :class="emptyTrashClasses"
                    @click="dialogclearTrash = true"
            >
                <img src="./img/trash.svg" alt=""/>
                {{ $t("main.cleartrash") }}
            </li>
        </ul>

        <!-- 副导航栏 -->
        <article class="article" @click.right="openMenu_empty($event)">
            <input
                    class="ss"
                    type="text"
                    v-model="searchTemp"
                    :placeholder="$t('main.pleaseEnterWhatYouWantToSearch')"
                    @input="search(searchTemp)"
            />
            <ul class="list">
                <li
                        v-for="(project, index) in projects"
                        @click.left="noteslick(project, $event)"
                        :data-index="index"
                        :class="index == currentNote || project.checked ? click : disclick"
                        style="margin-top: 5px;"
                        @contextmenu.prevent="openMenu_1(project, $event)"
                        :key="index"
                >
            <span>
              <img
                      :src="project.tempBase64"
                      :style="{ background: project.bgcolor }"
                      class="list_icon"
              />
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
              <img
                      v-if="project.modelsId.indexOf('weakPwd') != -1"
                      src="./img/gantanlist.svg"
              />
              <img
                      v-if="project.modelsId.indexOf('scj') == -1 && project.modelsId.indexOf('weakPwd') == -1"
                      src="./img/start.svg"
                      @click="favorite(project)"
              />
              <img
                      v-if="project.modelsId.indexOf('scj') != -1 && project.modelsId.indexOf('weakPwd') == -1"
                      src="./img/start_sc.svg"
                      @click="unfavorite(project)"
              />
            </span>
                </li>
            </ul>
        </article>
        <!--明细-->
        <section class="section">
            <el-form
                    :model="ruleFormProjectDetail"
                    ref="ruleFormProjectDetail"
                    label-width="100px"
                    class="demo-ruleForm"
                    label-position="top"
                    style="width:80%;height:95%;margin: auto;text-align: left;margin-top:3%;"
            >
                <el-form-item
                        v-if="this.projectEvent != ''"
                        style="margin-bottom: 5vh;margin-top: 5vh;"
                        prop="name"
                >
                    <div style="display: inline-block;width:80%;height:8vh; ">
                        <img
                                v-if="projectEvent.bgcolor != ''"
                                :src="projectEvent.tempBase64"
                                :style="{ background: projectEvent.bgcolor }"
                                class="detail_icon"
                        />
                        <img
                                v-else="projectEvent.bgcolor == ''"
                                :src="projectEvent.tempBase64"
                                style="background:#999999"
                                class="detail_icon"
                        />
                        <ul
                                style="display: inline-block;margin-top: 20px;height:8vh;margin-left:15%"
                        >
                            <li
                                    style="font-size: 25px;font-weight: bolder;"
                                    :title="projectEvent.name"
                            >
                                {{
                                projectEvent.name.length > 15
                                ? projectEvent.name.substring(0, 12) + "..."
                                : projectEvent.name
                                }}
                            </li>
                            <li style="margin-top: 1vh" :title="projectEvent.modelsName">
                                {{ projectEvent.modelsName}}
                            </li>
                        </ul>
                    </div>
                    <img
                            v-if="projectEvent.modelsId.indexOf('scj') == -1"
                            src="./img/start.svg"
                            style="float: right;margin-right:8%;margin-top:3%;"
                            @click="favorite(projectEvent)"
                    />
                    <img
                            v-if="projectEvent.modelsId.indexOf('scj') != -1"
                            src="./img/start_sc.svg"
                            style="float:right;margin-right:8%;margin-top:3%;"
                            @click="unfavorite(projectEvent)"
                    />
                </el-form-item>
                <template v-for="(data, index) in this.projectEvent.datas">
                    <el-form-item
                            v-if="data.type === 'password' && !showPassword"
                            :label="data.tempkey"
                            :prop="data.tempkey"
                            style="margin-bottom:3px;"
                            :key="index"
                    >
                        <input
                                type="password"
                                v-model="data.val"
                                readonly
                                style="width:90%;color: #606266"
                        /><a href="#" @click="changePass($event)"
                    ><i class="el-icon-view"></i
                    ></a>
                        <div style="width:50%;display: inline-block;line-height: 10px; vertical-align: middle;">
                            <el-progress
                                    id="process"
                                    :stroke-width="15"
                                    :percentage="data.percentage"
                                    :show-text="false"
                                    :color="data.pwdstatus"
                            ></el-progress>
                        </div>
                        <span style="margin-left: 5%;">{{data.format}}</span>

                        <hr/>
                    </el-form-item>
                    <el-form-item
                            v-else-if="data.type === 'password' && showPassword"
                            :label="data.tempkey"
                            :prop="data.tempkey"
                            style="margin-bottom:3px;"
                            :key="data.tempkey"
                    >
                        <input type="text" v-model="data.val" readonly style=""/><a
                            href="#"
                            @click="changePass($event)"
                    ><i class="el-icon-view"></i
                    ></a>
                        <div style="width:50%;display: inline-block;line-height: 10px; vertical-align: middle;">
                            <el-progress
                                    id="process"
                                    :stroke-width="15"
                                    :percentage="data.percentage"
                                    :color="data.pwdstatus"
                                    :show-text="false"
                            ></el-progress>
                        </div>
                        <span style="margin-left: 5%;">{{data.format}}</span>
                        <hr/>
                    </el-form-item>
                    <el-form-item
                            v-else-if="data.type === 'text'"
                            :label="data.tempkey"
                            :prop="data.tempkey"
                            :key="data.tempkey"
                            style="margin-bottom:3px;"
                    >
                        <input type="text" v-model="data.val" readonly/>
                        <hr/>
                    </el-form-item>
                     <el-form-item
                            v-else-if="data.type === 'website'"
                            :label="data.tempkey"
                            :prop="data.tempkey"
                            :key="data.tempkey"
                            style="margin-bottom:3px;"
                    >
                    <input type="text" v-model="data.val" readonly /><a :href="data.val.indexOf('https://')==-1 && data.val.indexOf('http://')==-1?'https://'+data.val:data.val" target="_blank" ><i class="el-icon-info"></i></a>

                  <hr/>
                    </el-form-item>
                     <el-form-item
                            v-else-if="data.type === 'login'"
                            :label="data.tempkey"
                            :prop="data.tempkey"
                            :key="data.tempkey"
                            style="margin-bottom:3px;"
                    >
                        <input type="text" v-model="data.val" readonly/>
                        <hr/>
                    </el-form-item>
                    <el-form-item
                            v-else-if="data.type === 'date'"
                            :label="data.tempkey"
                            :prop="data.tempkey"
                            :key="data.tempkey"
                            style="margin-bottom:3px;"
                    >
                        <input type="text" v-model="data.val" readonly/>
                        <hr/>
                    </el-form-item>
                </template>


                <template v-for="(data, index) in this.projectEvent.note">
                     <el-form-item
                             v-if="data!=''"
                            :label="data.tempkey"
                            :prop="data.tempkey"
                            :key="data.tempkey"
                            style="margin-bottom:3px;">
                       <div id="textarea" ref="textarea" v-html="data.notes.replace(/\n|\r\n/g,'<br />')"  style="border:0;white-space: pre-wrap;" readonly ></div>

                          <hr/>
                     </el-form-item>
                </template>
                <el-button
                        v-if="this.projectEvent != '' && this.projectEvent.isDel != true"
                        size="small"
                        @click="editProject()"
                        style="margin-left: 3%"
                >
                    {{ $t("main.modify") }}
                </el-button>
                <el-button
                        v-if="this.projectEvent != '' && this.projectEvent.isDel == true"
                        size="small"
                        @click="dialogRecover = true"
                >{{ $t("main.recover") }}
                </el-button>
            </el-form>
        </section>
        <!--数据同步弹出框-->
        <el-dialog
                :title="$t('main.prompt')"
                :visible.sync="dialogSynchronization"
                @closed="closeInit"
                width="30%"
        >
            <span>{{ $t("main.synchronizationInfo") }}</span>
            <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="localToIpfs()">{{
            $t("main.localToIpfs")
          }}</el-button>
          <el-button size="small" type="primary" @click="ipfsToLocal()">{{
            $t("main.ipfsToLocal")
          }}</el-button>
          <el-button size="small" @click="dialogSynchronization = false">{{
            $t("main.cancelFormat")
          }}</el-button>
        </span>
        </el-dialog>
        <!--锁定框-->
        <el-dialog
                :title="$t('main.passwordUnlock')"
                :visible.sync="dialogVisible"
                width="35%"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :show-close="false"
                @open="auto_update_func"
        >
            <el-form label-width="9vw" class="demo-ruleForm" style="width:80%;" @submit.native.prevent >
                <el-form-item :label="$t('main.loginPassword')" prop="password">
                    <input type="password" v-model="password"  style="width:85%;border-radius:4px;border: 1px solid #C0C4CC;height: 4vh;"  @keyup.enter.native="unlock()"/>
                    <a href="#" @click="changePass($event)" style="margin-left:2%"><i class="el-icon-view"></i></a>
                </el-form-item>
                <el-form-item label="" prop="" style="margin-bottom: 7%;margin-top: 10%">
                    <el-button type="primary" size="small" @click="unlock()">
                        {{ $t("main.unlock") }}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--增加文件夹-->
        <el-dialog
                :title="$t('main.addDirectory')"
                :visible.sync="dialogVisible2"
                width="30%"
                :close-on-click-modal="false"
                :show-close="false"
        >
            <el-form
                    :model="ruleForm"
                    ref="ruleForm"
                    label-width="100px"
                    class="demo-ruleForm"
                    style="width: 80%;"
                    :rules="rules"
                    @submit.native.prevent
            >
                <el-form-item :label="$t('main.name')" prop="pName" style="">
                    <el-input v-model.trim="ruleForm.pName" style="width:100%;"></el-input>
                </el-form-item>
                <el-form-item
                        label=""
                        prop=""
                        style="margin-top:10%;text-align: center"
                >
                    <el-button
                            type="primary"
                            size="small"
                            @click="submitForm('ruleForm')"
                    >{{ $t("main.ok") }}
                    </el-button
                    >
                    <el-button size="small" @click="cancel('ruleForm')">{{
                        $t("main.cancel")
                        }}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
      <!--修改文件夹名称-->
      <el-dialog
          :title="$t('main.rename')"
          :visible.sync="dialogVisibleRename"
          width="30%"
          :close-on-click-modal="false"
          :show-close="false"
      >
        <el-form
            :model="ruleFormRename"
            ref="ruleFormRename"
            label-width="100px"
            class="demo-ruleForm"
            style="width: 80%;"
            :rules="rules"
            @submit.native.prevent
        >
          <el-form-item :label="$t('main.name')" prop="pName" style="">
            <el-input v-model.trim="ruleFormRename.pName" style="width:100%;"></el-input>
          </el-form-item>
          <el-form-item
              label=""
              prop=""
              style="margin-top:10%;text-align: center"
          >
            <el-button
                type="primary"
                size="small"
                @click="submitFormRename('ruleFormRename')"
            >{{ $t("main.ok") }}
            </el-button
            >
            <el-button size="small" @click="cancelRename('ruleFormRename')">{{
                $t("main.cancel")
              }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
        <!--删除文件夹弹出框-->
        <el-dialog
                :title="$t('main.delete')"
                :visible.sync="dialogVisibledDirectory"
                width="30%"
        >
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
        <!--恢复文件夹弹出框-->
        <el-dialog
                :title="$t('main.prompt')"
                :visible.sync="dialogRecover"
                width="30%"
        >
            <span>{{ $t("main.recovertitle") }}</span>
            <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="recover()">{{
            $t("main.okFormat")
          }}</el-button>
          <el-button size="small" @click="dialogRecover = false">{{
            $t("main.cancelFormat")
          }}</el-button>
        </span>
        </el-dialog>
        <!--删除项目弹出框-->
        <el-dialog
                :title="$t('main.delete')"
                :visible.sync="dialogVisibledProject"
                width="30%"
        >
            <span>{{ $t("main.doYouWantToDeleteTheProject") }}</span>
            <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="removeData()">{{
            $t("main.okFormat")
          }}</el-button>
          <el-button size="small" @click="dialogVisibledProject = false">{{
            $t("main.cancelFormat")
          }}</el-button>
        </span>
        </el-dialog>
        <!--删除项目弹出框(trash)-->
        <el-dialog
                :title="$t('main.delete')"
                :visible.sync="dialogVisibledProjectDel"
                width="30%"
        >
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
        <el-dialog
                :title="$t('main.cleartrash')"
                :visible.sync="dialogclearTrash"
                width="30%"
        >
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
        <!--删除模板弹框-->
        <el-dialog
                :title="$t('main.delete')"
                :visible.sync="dialogVisibledTemplate"
                width="30%"
        >
            <span>{{ $t("main.doYouWantToDeleteTheTemplate") }}</span>
            <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="removeData()">{{
            $t("main.okFormat")
          }}</el-button>
          <el-button size="small" @click="dialogVisibledTemplate = false">{{
            $t("main.cancelFormat")
          }}</el-button>
        </span>
        </el-dialog>
        <!--模板弹出框-->
        <el-dialog
                :title="$t('main.selectTemplate')"
                :visible.sync="dialogVisibleTemplate"
                width="30%"
                height="30%"
                :close-on-click-modal="false"
                @open="openDialogTemplate"
        >
            <ul
                    style="border:1px solid #9E9E9E;padding: 2px;height: 40vh;overflow-y:auto;"
            >
                <li
                        v-for="(project, index) in this.operateTemplates"
                        @click="projectlick(project, $event)"
                        :data-index="index"
                        :key="index"
                        :class="index == currentTemplate ? click : disclick"
                        style="height:5vh;border: 0;text-align: left;margin-top: 2px"
                >
                    <img
                            :src="project.tempBase64"
                            class="template_select_img"
                            :style="{ background: project.bgcolor }"
                    />
                    <span style="margin-left: 3%;font-size: 15px">{{
              project.name
            }}</span>
                </li>
            </ul>
            <el-button
                    style="margin-top: 5%"
                    size="small"
                    type="primary"
                    @click="addproject"
            >{{ $t("main.okFormat") }}
            </el-button>
            <el-button size="small" @click="dialogVisibleTemplate = false">{{
                $t("main.cancelFormat")
                }}
            </el-button>
        </el-dialog>
        <!--增加项目弹出框-->
        <el-dialog
                class="mb"
                :title="$t('main.addItem')"
                :visible.sync="dialogVisibleAddProject"
                width="40%"
                height="90%"
                :close-on-click-modal="false"
                @closed="cleartype"
                @close="clearDataProject"
        >
            <div class="titleDiv">
          <span class="titleNameDiv">
            {{ $t("main.name") }}
          </span>
                <span class="titleInputSpan">
            <input
                    type="text"
                    v-model="ruleFormAddProject.name"
                    class="myInputTitle"
            />
          </span>
                <span style="height:7vh;width:4vw;" @click="showIconMenu()">
            <img
                    v-if="templateEvent.tempBase64"
                    :src="templateEvent.tempBase64"
                    class="avatar"
                    :style="{ background: templateEvent.bgcolor }"
            />
            <img
                    v-else
                    src="./img/misc/lock.svg"
                    class="avatar"
                    :style="{ background: color }"
            />
          </span>
            </div>
            <ul
                    style="margin-left:71.5%;z-index: 10;border-radius: 5px;"
                    class="choosepic menu"
            >
                <li @click="dialogSymbolOpen">
                    <img
                            src="./img/tp.png"
                            style="width: 2vw;margin-left: 0.5vw;margin-right: 0.1vw;"
                            alt=""
                    />
                    <span>{{ $t("main.selectSymbol") }}</span>
                </li>
                <li @click="opencolor(templateEvent)">
                    <img
                            src="./img/tsp.png"
                            style="width: 2vw;margin-left: 0.5vw;margin-right: 0.1vw;"
                            alt=""
                    />
                    <span>{{ $t("main.selectColor") }}</span>
                </li>
                <li>
            <span style="display:inline-block">
              <img
                      src="./img/zy.png"
                      style="width: 2vw;margin-left: 0.5vw;margin-right: 0.1vw;"
                      alt=""
              />
              <el-upload
                      action="https://jsonplaceholder.typicode.com/posts/"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccessAddPro"
                      :before-upload="beforeAvatarUpload"
                      style="height:2.5vh;width:8vw;display: inline-block"
              >{{ $t("main.userResource") }}
              </el-upload>
            </span>
                </li>
            </ul>
            <br/>
            <el-tabs type="border-card">
                <el-tab-pane :label="$t('main.fields')">
                    <div style="height:45vh;overflow: auto;">
                        <el-form
                                :model="ruleFormAddProject"
                                ref="ruleFormAddProject"
                                label-width="100px"
                                class="demo-ruleForm"
                                style="width: 95%;margin: auto;text-align: left"
                                label-position="top"
                        >
                            <template v-for="(data, index) in this.templateEvent.datas">
                                <el-form-item
                                        v-if="data.type === 'password' && !showPassword"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
                                        :key="index"
                                        style="width:90%;margin-bottom:0;"
                                >
                                    <input
                                            type="password"
                                            v-model="data.val"
                                            @input="pwdLength(data)"
                                            class="myInput"
                                    />
                                    <a href="#" @click="changePass($event)"><i class="el-icon-view"></i></a>
                                    <a href="#" @click="passwordGenerator(data)"><i class="el-icon-key"></i></a>
                                    <a href="#" @click="addProjectRemoveItem(data.id)"><i class="el-icon-close"></i></a>
                                    <div style="width: 85%;display: inline-block;">
                                        <el-progress
                                                id="process"
                                                :show-text="false"
                                                :stroke-width="5"
                                                :percentage="data.percentage"
                                                :color="data.pwdstatus"
                                        ></el-progress>
                                        <span class="format">{{data.format}}</span>
                                    </div>

                                </el-form-item>
                                <el-form-item
                                        v-else-if="data.type === 'password' && showPassword"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
                                        :key="index"
                                        style="width: 90%;margin-bottom:0;"
                                >
                                    <input
                                            type="text"
                                            v-model="data.val"
                                            @input="pwdLength(data)"
                                            class="myInput"
                                    />
                                    <a href="#" @click="changePass($event)"
                                    ><i class="el-icon-view"></i
                                    ></a>
                                    <a href="#" @click="passwordGenerator(data)"><i class="el-icon-key"></i></a>
                                    <a href="#"
                                    ><i
                                            class="el-icon-close"
                                            @click="addProjectRemoveItem(data.id)"
                                    ></i
                                    ></a>
                                    <div style="width: 85%;display: inline-block;">
                                        <el-progress
                                                id="process"
                                                :show-text="false"
                                                :stroke-width="5"
                                                :percentage="data.percentage"
                                                :color="data.pwdstatus"
                                        ></el-progress>
                                        <span class="format">{{data.format}}</span>
                                    </div>

                                </el-form-item>
                                <el-form-item
                                        v-else-if="data.type === 'text'"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
                                        :key="index"
                                        style="width: 90%;margin-bottom:0;"
                                >
                                    <input type="text" v-model="data.val" class="myInput"/>
                                    <a href="#"
                                    ><i
                                            class="el-icon-close"
                                            @click="addProjectRemoveItem(data.id)"
                                    ></i
                                    ></a>
                                </el-form-item>
                                 <el-form-item
                                        v-else-if="data.type === 'website'"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
                                        :key="index"
                                        style="width: 90%;margin-bottom:0;"
                                >
                                    <input type="text" v-model="data.val" class="myInput"/>
                                    <a href="#"
                                    ><i
                                            class="el-icon-close"
                                            @click="addProjectRemoveItem(data.id)"
                                    ></i
                                    ></a>
                                </el-form-item>
                                  <el-form-item
                                        v-else-if="data.type === 'login'"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
                                         :key="data.tempkey"
                                        style="width: 90%;margin-bottom:0;"
                                >
                                    <input type="text" v-model="data.val" class="myInput"/>
                                    <a href="#"
                                    ><i
                                            class="el-icon-close"
                                            @click="addProjectRemoveItem(data.id)"
                                    ></i
                                    ></a>
                                </el-form-item>
                                <el-form-item
                                        v-else-if="data.type === 'date'"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
                                        :key="data.tempkey"
                                        style="width: 90%;margin-bottom:0;"
                                >
                                    <el-date-picker v-model="data.val" value-format="yyyy-MM-dd" class="input-class"
                                                    type="date" placeholder="选择日期" size="large"></el-date-picker>
                                    <a href="#"
                                    ><i
                                            class="el-icon-close"
                                            @click="addProjectRemoveItem(data.id)"
                                    ></i
                                    ></a>
                                </el-form-item>

                            </template>
                            <el-form-item
                                    :label="$t('main.chooseCategory')"
                                    style="margin-top:1%;margin-bottom: 0px;"
                            >
                                <el-select
                                        v-model="selectlabels"
                                        multiple
                                        :placeholder="$t('main.pleaseChoose')"
                                        style="float: left;width:75%"
                                >
                                    <el-option
                                            v-for="(item, index) in this.labels.labels"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                    :label="$t('main.addOtherItems')"
                                    style="margin-top: 1%;margin-bottom: 0px;"
                            >
                                <el-dropdown @command="selectFiled" style="float: left;">
                                    <el-button style="">
                                        {{ $t("main.addOtherItems")
                                        }}<i class="el-icon-arrow-down el-icon--right"></i>
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item
                                                v-for="(item, index) in this.templateItemsTemp.templateItems"
                                                :command="item"
                                                :key="index"
                                        >{{ item.key }}
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <div style="margin-top:1vh;text-align: center">
                <el-button
                        style="display: inline-block;"
                        type="primary"
                        size="small"
                        @click="submitproject()" :disabled="templatedisable"
                >
                    {{ $t("main.okFormat") }}
                </el-button>
                <el-button
                        style="display: inline-block;"
                        size="small"
                        @click="dialogVisibleAddProject = false"
                >
                    {{ $t("main.cancelFormat") }}
                </el-button>
            </div>
        </el-dialog>
        <!--修改项目-->
        <el-dialog
                class="mb"
                :title="$t('main.modifyTheProject')"
                :visible.sync="dialogVisibleEdit"
                width="40%"
                height="90%"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :show-close="true"
                @closed="cleartype"
        >
            <div class="titleDiv">
          <span class="titleNameDiv">
            {{ $t("main.name") }}
          </span>
                <span class="titleInputSpan">
            <input type="text" v-model="editobject.name" class="myInputTitle"/>
          </span>
                <span style="height:7vh;width:4vw;" @click="showIconMenu()">
            <img
                    :src="editobject.tempBase64"
                    class="avatar"
                    :style="{ background: editobject.bgcolor }"
            />
          </span>
            </div>
            <ul
                    style="margin-left:71.5%;z-index: 10;border-radius: 5px;"
                    class="choosepic menu"
            >
                <li @click="dialogSymbolOpen">
                    <img
                            src="./img/tp.png"
                            style="width: 2vw;margin-left: 0.5vw;margin-right: 0.1vw;"
                            alt=""
                    />
                    <span>{{ $t("main.selectSymbol") }}</span>
                </li>
                <li @click="opencolor(editobject)">
                    <img
                            src="./img/tsp.png"
                            style="width: 2vw;margin-left: 0.5vw;margin-right: 0.1vw;"
                            alt=""
                    />
                    <span>{{ $t("main.selectColor") }}</span>
                </li>
                <li>
            <span style="display: inline-block">
              <img
                      src="./img/zy.png"
                      style="width: 2vw;margin-left: 0.5vw;margin-right: 0.1vw;"
                      alt=""
              />
              <el-upload
                      action="https://jsonplaceholder.typicode.com/posts/"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccessEdit"
                      :before-upload="beforeAvatarUpload"
                      style="height:2.5vh;width:8vw;display: inline-block"
              >{{ $t("main.userResource") }}
              </el-upload>
            </span>
                </li>
            </ul>
            <br/>
            <el-tabs type="border-card">
                <el-tab-pane :label="$t('main.fields')">
                    <div style="height:45vh;overflow: auto;">
                        <el-form
                                :model="ruleFormProjectEdit"
                                ref="ruleFormProjectEdit"
                                label-width="100px"
                                class="demo-ruleForm"
                                style="width: 95%;margin: auto;text-align:left"
                                label-position="top"
                        >
                            <template v-for="(data, index) in this.editobject.datas">
                                <el-form-item
                                        v-if="data.type === 'password' && !showPassword"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
                                        :key="index"
                                        style="width: 90%;margin-bottom: 0"
                                >
                                    <input
                                            type="password"
                                            v-model="data.val"
                                            @input="pwdLength(data)"
                                            class="myInput"
                                    />
                                    <a href="#" @click="changePass($event)"
                                    ><i class="el-icon-view"></i
                                    ></a>
                                    <a href="#" @click="passwordGenerator(data)"><i class="el-icon-key"></i></a>
                                    <a href="#"
                                    ><i
                                            class="el-icon-close"
                                            @click="editRemoveItem(data.id)"
                                    ></i
                                    ></a>
                                    <div style="width: 50%;display: inline-block;">
                                        <el-progress
                                                id="process"
                                                :stroke-width="5"
                                                :percentage="data.percentage"
                                                :color="data.pwdstatus"
                                                :show-text="false"
                                        ></el-progress>
                                        <span class="format">{{data.format}}</span>
                                    </div>

                                </el-form-item>
                                <el-form-item
                                        v-if="data.type === 'password' && showPassword"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
                                        :key="data.tempkey"
                                        style="width: 90%;margin-bottom:0"
                                >
                                    <input
                                            type="text"
                                            v-model="data.val"
                                            @input="pwdLength(data)"
                                            class="myInput"
                                    />
                                    <a href="#" @click="changePass($event)"
                                    ><i class="el-icon-view"></i
                                    ></a>
                                    <a href="#" @click="passwordGenerator(data)"><i class="el-icon-key"></i></a>
                                    <a href="#"
                                    ><i
                                            class="el-icon-close"
                                            @click="editRemoveItem(data.id)"
                                    ></i
                                    ></a>
                                    <div style="width: 85%;display: inline-block;">
                                        <el-progress
                                                id="process"
                                                :stroke-width="5"
                                                :percentage="data.percentage"
                                                :color="data.pwdstatus"
                                                :show-text="false"
                                        ></el-progress>
                                        <span class="format">{{data.format}}</span>
                                    </div>
                                </el-form-item>
                                <el-form-item
                                        v-else-if="data.type === 'text'"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
                                        :key="data.tempkey"
                                        style="width: 90%;margin-bottom:0"
                                >
                                    <input type="text" v-model="data.val" class="myInput"/>
                                    <a href="#"
                                    ><i
                                            class="el-icon-close"
                                            @click="editRemoveItem(data.id)"
                                    ></i
                                    ></a>
                                </el-form-item>
                                <el-form-item
                                        v-else-if="data.type === 'website'"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
                                        :key="data.tempkey"
                                        style="width: 90%;margin-bottom:0"
                                >
                                    <input type="text" v-model="data.val" class="myInput"/>
                                    <a href="#"
                                    ><i
                                            class="el-icon-close"
                                            @click="editRemoveItem(data.id)"
                                    ></i
                                    ></a>
                                </el-form-item>
                                 <el-form-item
                                        v-else-if="data.type === 'login'"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
                                        :key="data.tempkey"
                                        style="width: 90%;margin-bottom:0"
                                >
                                    <input type="text" v-model="data.val" class="myInput"/>
                                    <a href="#"
                                    ><i
                                            class="el-icon-close"
                                            @click="editRemoveItem(data.id)"
                                    ></i
                                    ></a>
                                </el-form-item>
                                <el-form-item
                                        v-else-if="data.type === 'date'"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
                                        :key="data.tempkey"
                                        style="width: 90%;margin-bottom:0;"
                                >
                                    <el-date-picker v-model="data.val" value-format="yyyy-MM-dd" class="input-class"
                                                    type="date" placeholder="选择日期" size="large"></el-date-picker>
                                    <a href="#"
                                    ><i
                                            class="el-icon-close"
                                            @click="editRemoveItem(data.id)"
                                    ></i
                                    ></a>
                                </el-form-item>

                            </template>
                            <el-form-item
                                    :label="$t('main.chooseCategory')"
                                    style="margin-top:1%;margin-bottom: 0px;"
                            >
                                <el-select
                                        v-model="selectlabels"
                                        multiple
                                        :placeholder="$t('main.pleaseChoose')"
                                        style="float: left;width:75%"
                                >
                                    <el-option
                                            v-for="(item, index) in this.labels.labels"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                    :label="$t('main.addOtherItems')"
                                    style="margin-top:1%;margin-bottom: 0px;"
                            >
                                <el-dropdown @command="editSelectFiled" style="float: left;">
                                    <el-button>
                                        {{ $t("main.addOtherItems")
                                        }}<i class="el-icon-arrow-down el-icon--right"></i>
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item
                                                v-for="(item, index) in this.templateItemsTemp.templateItems"
                                                :command="item"
                                                :key="index"
                                        >{{ item.key }}
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <div style="margin-top:1vh;text-align: center">
                <el-button size="small" type="primary" :disabled="templatedisable" @click="editDo">{{
                    $t("main.submit")
                    }}
                </el-button>
                <el-button size="small" @click="dialogVisibleEdit = false">{{
                    $t("main.cancelFormat")
                    }}
                </el-button>
            </div>
        </el-dialog>
        <!--增加模板-->
        <el-dialog
                class="mb"
                :title="$t('main.addTemplate')"
                :visible.sync="dialogVisibleAddTemplate"
                width="40%"
                height="90%"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :show-close="true"
                @closed="cleartype"
                @close="clearDataTemplate"
        >
            <div class="titleDiv">
                <span class="titleNameDiv">{{ $t("main.name") }}</span>
                <span class="titleInputSpan">
            <input v-model="ruleFormAddTemplate.name" class="myInputTitle"/>
          </span>
                <span style="height:7vh;width:4vw;" @click="showIconMenu()">
            <img
                    v-if="imageBase64 != ''"
                    :src="imageBase64"
                    class="avatar"
                    :style="{ background: color }"
            />
            <img
                    v-else
                    src="./img/misc/lock.svg"
                    class="avatar"
                    :style="{ background: color }"
            />
          </span>
            </div>
            <ul
                    style="margin-left:71.5%;z-index: 10;border-radius: 5px;"
                    class="choosepic menu"
            >
                <li @click="dialogSymbolOpen">
                    <img
                            src="./img/tp.png"
                            style="width: 2vw;margin-left: 0.5vw;margin-right: 0.1vw;"
                            alt=""
                    />
                    <span>{{ $t("main.selectSymbol") }}</span>
                </li>
                <li @click="opencolor(tempTemplate)">
                    <img
                            src="./img/tsp.png"
                            style="width: 2vw;margin-left: 0.5vw;margin-right: 0.1vw;"
                            alt=""
                    />
                    <span>{{ $t("main.selectColor") }}</span>
                </li>
                <li>
            <span style="display:inline-block">
              <img
                      src="./img/zy.png"
                      style="width: 2vw;margin-left: 0.5vw;margin-right: 0.1vw;"
                      alt=""
              />
              <el-upload
                      action="https://jsonplaceholder.typicode.com/posts/"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccessAdd"
                      :before-upload="beforeAvatarUpload"
                      style="height:2.5vh;width:8vw;display: inline-block"
              >{{ $t("main.userResource") }}
              </el-upload>
            </span>
                </li>
            </ul>
            <br/>
            <el-tabs type="border-card">
                <el-tab-pane :label="$t('main.fields')">
                    <div style="height:45vh;overflow: auto;">
                        <el-form
                                :model="ruleFormAddTemplate"
                                ref="ruleFormAddTemplate"
                                label-width="100px"
                                class="demo-ruleForm"
                                style="width: 80%;margin: auto;text-align: left"
                                label-position="top"
                        >
                            <template v-for="(data, index) in this.tempTemplate">
                                <el-form-item
                                        v-if="data.type === 'password'"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
                                        :key="index"
                                        style="width: 90%;margin-bottom:0"
                                >
                                    <input
                                            type="password"
                                            v-model="data.val"
                                            style="width:21vw;float: left"
                                            class="myInput"
                                            @input="pwdLength(data)"
                                    />
                                    <a href="#" @click="changePass($event)"><i class="el-icon-view"></i></a>
                                    <a href="#" @click="passwordGenerator(data)"><i class="el-icon-key"></i></a>
                                    <a href="#"><i class="el-icon-close" @click="addOtherItems(data.id)"> </i></a>
                                    <div style="width:21vw;display: inline-block;">
                                        <el-progress
                                                id="process"
                                                :show-text="false"
                                                :stroke-width="5"
                                                :percentage="data.percentage"
                                                :color="data.pwdstatus"
                                        ></el-progress>
                                        <span class="format">{{data.format}}</span>
                                    </div>
                                </el-form-item>
                                <el-form-item
                                        v-else-if="data.type === 'text'"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
                                        :key="data.tempkey"
                                        style="width: 90%;margin-bottom: 0"
                                >
                                    <input
                                            type="text"
                                            v-model="data.val"
                                            style="width:21vw;float: left"
                                            class="myInput"
                                    />
                                    <a href="#"
                                    ><i
                                            class="el-icon-close"
                                            @click="addTemplageRemoveItem(data.id)"
                                    ></i
                                    ></a>
                                </el-form-item>
                                <el-form-item
                                        v-else-if="data.type === 'website'"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
                                        :key="data.tempkey"
                                        style="width: 90%;margin-bottom: 0"
                                >
                                    <input
                                            type="text"
                                            v-model="data.val"
                                            style="width:21vw;float: left"
                                            class="myInput"
                                    />
                                    <a href="#"
                                    ><i
                                            class="el-icon-close"
                                            @click="addTemplageRemoveItem(data.id)"
                                    ></i
                                    ></a>
                                </el-form-item>
                                <el-form-item
                                        v-else-if="data.type === 'login'"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
                                        :key="data.tempkey"
                                        style="width: 90%;margin-bottom: 0"
                                >
                                    <input
                                            type="text"
                                            v-model="data.val"
                                            style="width:21vw;float: left"
                                            class="myInput"
                                    />
                                    <a href="#"
                                    ><i
                                            class="el-icon-close"
                                            @click="addTemplageRemoveItem(data.id)"
                                    ></i
                                    ></a>
                                </el-form-item>
                                <el-form-item
                                        v-else-if="data.type === 'date'"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
                                        :key="data.tempkey"
                                        style="width: 90%;margin-bottom:0;"
                                >
                                    <el-date-picker v-model="data.val" class="input-class-template" value-format="yyyy-MM-dd"  type="date" placeholder="选择日期" size="large" ></el-date-picker>
                                    <a href="#"
                                    ><i
                                            class="el-icon-close"
                                            @click="addTemplageRemoveItem(data.id)"
                                    ></i
                                    ></a>
                                </el-form-item>
                            </template>
                            <el-form-item
                                    :label="$t('main.chooseCategory')"
                                    style="margin-bottom: 1vh"
                            >
                                <el-select
                                        v-model="selectlabels"
                                        multiple
                                        :placeholder="$t('main.pleaseChoose')"
                                        style="float: left;width:75%"
                                >
                                    <el-option
                                            v-for="(item, index) in this.labels.labels"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('main.addOtherItems')">
                                <el-dropdown
                                        @command="selectFiledTemplate"
                                        style="float: left"
                                >
                                    <el-button>
                                        {{ $t("main.addOtherItems")
                                        }}<i class="el-icon-arrow-down el-icon--right"></i>
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item
                                                v-for="(item, index) in this.templateItems.templateItems"
                                                :command="item"
                                                :key="index"
                                        >
                                            {{ item.key }}
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <div style="margin-top:1vh;text-align: center">
                <el-button size="small" type="primary" @click="saveTemplate" :disabled="templatedisable"
                >{{$t('main.submit')}}
                </el-button
                >
                <el-button size="small" @click="dialogVisibleAddTemplate = false"
                >{{$t('keystoreImport.cancel')}}
                </el-button
                >
            </div>
        </el-dialog>
        <!--修改模板弹出框-->
        <el-dialog
                :title="$t('main.modifyTemplate')"
                class="mb"
                :visible.sync="dialogVisibleTemplateEdit"
                width="40%"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :show-close="true"
                @closed="cleartype"
        >
            <div class="titleDiv">
                <span class="titleNameDiv">{{ $t("main.name") }}</span>
                <span class="titleInputSpan">
            <input type="text" v-model="editobject.name" class="myInputTitle"/>
          </span>
                <span style="height:7vh;width:4vw;" @click="showIconMenu()">
            <img
                    :src="editobject.tempBase64"
                    class="avatar"
                    :style="{ background: editobject.bgcolor }"
            />
          </span>
            </div>
            <ul
                    style="margin-left:71.5%;z-index: 10;border-radius: 5px;"
                    class="choosepic menu"
            >
                <li @click="dialogSymbolOpen">
                    <img
                            src="./img/tp.png"
                            style="width: 2vw;margin-left: 0.5vw;margin-right: 0.1vw;"
                            alt=""
                    />
                    <span>{{ $t("main.selectSymbol") }}</span>
                </li>
                <li @click="opencolor(editobject)">
                    <img
                            src="./img/tsp.png"
                            style="width: 2vw;margin-left: 0.5vw;margin-right: 0.1vw;"
                            alt=""
                    />
                    <span>{{ $t("main.selectColor") }}</span>
                </li>
                <li>
            <span style="display:inline-block">
              <img
                      src="./img/zy.png"
                      style="width: 2vw;margin-left: 0.5vw;margin-right: 0.1vw;"
                      alt=""
              />
              <el-upload
                      action="https://jsonplaceholder.typicode.com/posts/"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccessEdit"
                      :before-upload="beforeAvatarUpload"
                      style="height:2.5vh;width:8vw;display: inline-block"
              >{{ $t("main.userResource") }}
              </el-upload>
            </span>
                </li>
            </ul>
            <br/>
            <el-tabs type="border-card">
                <el-tab-pane :label="$t('main.fields')">
                    <div style="height:45vh;overflow: auto;">
                        <el-form
                                :model="ruleFormTemplateEdit"
                                ref="ruleFormTemplateEdit"
                                label-width="100px"
                                class="demo-ruleForm"
                                style="width: 85%;margin: auto;text-align: left"
                                label-position="top"
                        >
                            <template v-for="(data, index) in this.editobject.datas">
                                <el-form-item
                                        v-if="data.type === 'password'"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
                                        style="width: 90%;margin-bottom: 0"
                                        :key="index"
                                >
                                    <input
                                            type="password"
                                            v-model="data.val"
                                            style="float: left;width:21vw;"
                                            @input="pwdLength(data)"
                                            class="myInput"
                                    />
                                    <a href="#" @click="changePass($event)"><i class="el-icon-view"></i></a>
                                    <a href="#" @click="passwordGenerator(data)"><i class="el-icon-key"></i></a>
                                    <a href="#"><i class="el-icon-close" @click="editRemoveItem(data.id)" ></i></a>
                                    <div style="width:21vw;display: inline-block;">
                                        <el-progress
                                                id="process"
                                                :show-text="false"
                                                :stroke-width="5"
                                                :percentage="data.percentage"
                                                :color="data.pwdstatus"
                                        ></el-progress>
                                        <span class="format">{{data.format}}</span>
                                    </div>
                                </el-form-item>
                                <el-form-item
                                        v-else-if="data.type === 'text'"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
                                        :key="data.tempkey"
                                        style="width: 90%;margin-bottom:0"
                                >
                                    <input
                                            type="text"
                                            v-model="data.val"
                                            style="float: left;width:21vw;"
                                            class="myInput"
                                    />
                                    <a href="#"
                                    ><i
                                            class="el-icon-close"
                                            @click="editRemoveItem(data.id)"
                                    ></i
                                    ></a>
                                </el-form-item>
                                 <el-form-item
                                        v-else-if="data.type === 'website'"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
                                        :key="data.tempkey"
                                        style="width: 90%;margin-bottom:0"
                                >
                                    <input
                                            type="text"
                                            v-model="data.val"
                                            style="float: left;width:21vw;"
                                            class="myInput"
                                    />
                                    <a href="#"
                                    ><i
                                            class="el-icon-close"
                                            @click="editRemoveItem(data.id)"
                                    ></i
                                    ></a>
                                </el-form-item>
                                 <el-form-item
                                        v-else-if="data.type === 'login'"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
                                        :key="data.tempkey"
                                        style="width: 90%;margin-bottom:0"
                                >
                                    <input
                                            type="text"
                                            v-model="data.val"
                                            style="float: left;width:21vw;"
                                            class="myInput"
                                    />
                                    <a href="#"
                                    ><i
                                            class="el-icon-close"
                                            @click="editRemoveItem(data.id)"
                                    ></i
                                    ></a>
                                </el-form-item>
                                <el-form-item
                                        v-else-if="data.type === 'date'"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
                                        :key="data.tempkey"
                                        style="width: 90%;margin-bottom:0;"
                                >
                                    <el-date-picker v-model="data.val" class="input-class-template-edit" value-format="yyyy-MM-dd"  type="date" placeholder="选择日期" size="large" ></el-date-picker>
                                    <a href="#"
                                    ><i
                                            class="el-icon-close"
                                            @click="editRemoveItem(data.id)"
                                    ></i
                                    ></a>
                                </el-form-item>
                            </template>
                            <el-form-item
                                    :label="$t('main.chooseCategory')"
                                    style="margin-bottom: 1vh;"
                            >
                                <el-select
                                        v-model="selectlabels"
                                        multiple
                                        :placeholder="$t('main.pleaseChoose')"
                                        style="float: left;width:75%"
                                >
                                    <el-option
                                            v-for="(item, index) in this.labels.labels"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('main.addOtherItems')">
                                <el-dropdown @command="editSelectFiled" style="float: left">
                                    <el-button>
                                        {{ $t("main.addOtherItems")
                                        }}<i class="el-icon-arrow-down el-icon--right"></i>
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item
                                                v-for="(item, index) in this.templateItems.templateItems"
                                                :command="item"
                                                 :key="index"
                                        >
                                            {{ item.key }}
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <div style="margin-top:1vh;text-align: center">
                <el-button size="small" type="primary" :disabled="templatedisable" @click="editTemplate">{{
                    $t("main.submit")
                    }}
                </el-button>
                <el-button size="small" @click="dialogVisibleTemplateEdit = false"
                >{{ $t("main.cancelFormat") }}
                </el-button>
            </div>
        </el-dialog>
        <!--增加Items 弹出框-->
        <el-dialog
                :title="$t('main.additionalItem')"
                :visible.sync="dialogVisibleItems"
                width="30%"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :show-close="true"
        >
            <el-form label-width="100px" class="demo-ruleForm" ref="ruleFormAddPro" :rules="rules"
                     :model="ruleFormAddPro">
                <el-form-item :label="$t('main.name')" prop="filedName" style="margin-top:10%">
                    <el-input
                            type="text"
                            v-model.trim="ruleFormAddPro.filedName"
                            style="width:100%;"
                    ></el-input>
                </el-form-item>
                <el-form-item label="" prop="" style="margin-top:10%">
                    <el-button
                            type="primary"
                            size="small"
                            style="width:35%;float:left;"
                            @click="addFiled('ruleFormAddPro')"
                    >
                        {{ $t("main.ok") }}
                    </el-button>
                    <el-button
                            type="primary"
                            size="small"
                            style="width:35%;float:left;"
                            @click="dialogVisibleItems = false"
                    >{{ $t("main.cancel") }}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--修改模板项弹出框-->
        <el-dialog
                :title="$t('main.additionalItem')"
                :visible.sync="dialogVisibleItemsEdit"
                width="30%"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :show-close="true"
        >
            <el-form label-width="100px" class="demo-ruleForm" ref="ruleFormAddTEdit" :rules="rules"
                     :model="ruleFormAddTEdit">
                <el-form-item :label="$t('main.name')" prop="filedName" style="margin-top:10%">
                    <el-input
                            type="text"
                            v-model.trim="ruleFormAddTEdit.filedName"
                            style="width:100%;"
                    ></el-input>
                </el-form-item>
                <el-form-item label="" prop="" style="margin-top:10%">
                    <el-button
                            type="primary"
                            size="small"
                            style="width:35%;float:left;"
                            @click="editAddFiled('ruleFormAddTEdit')"
                    >
                        {{ $t("main.ok") }}
                    </el-button>
                    <el-button
                            type="primary"
                            size="small"
                            style="width:35%;float:left;"
                            @click="dialogVisibleItemsEdit = false"
                    >{{ $t("main.cancel") }}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--增加模板项弹出框-->
        <el-dialog
                :title="$t('main.additionalItem')"
                :visible.sync="dialogVisibleAddTempItems"
                width="30%"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :show-close="true"
        >
            <el-form label-width="100px" class="demo-ruleForm" ref="ruleFormAddTtemp" :rules="rules"
                     :model="ruleFormAddTtemp">
                <el-form-item :label="$t('main.name')" prop="filedName" style="margin-top:10%">
                    <el-input
                            type="text"
                            v-model.trim="ruleFormAddTtemp.filedName"
                            style="width:100%;"
                    ></el-input>
                </el-form-item>
                <el-form-item label="" prop="" style="margin-top:10%">
                    <el-button
                            type="primary"
                            size="small"
                            style="width:35%;float:left;"
                            @click="addFiledTemplate('ruleFormAddTtemp')"
                    >
                        {{ $t("main.ok") }}
                    </el-button>
                    <el-button
                            type="primary"
                            size="small"
                            style="width:35%;float:left;"
                            @click="dialogVisibleAddTempItems = false"
                    >
                        {{ $t("main.cancel") }}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--设置弹出框-->
        <el-dialog title="" :visible.sync="dialogVisibleSetting" width="50%" :show-close="true" style="text-align: left"
                   :before-close="handleClose">
            <div style="text-align: center;font-weight:bolder;margin-bottom:3%;margin-top: -2%">
                {{ $t("main.systemSettings") }}
            </div>
            <el-form>
                <el-tabs type="border-card" style="height:55vh">
                    <el-tab-pane :label="$t('main.generic')">
                        <el-form-item prop="">
                            <fieldset style="width: 80%;height:14vh;margin: auto;border: 1px solid #6C6C6C">
                                <legend style="margin-left: 1%">
                                    {{ $t("main.mainWindow") }}
                                </legend>
                                <div style="margin-left: 2vw">
                                    {{ $t("main.loginOpenJpass") }}<br/>
                                    <el-switch v-model="autoStartFlag" active-color="#13ce66"
                                            inactive-color="#ff4949" @change="changeAutoStartFlag"></el-switch>
                                </div>
                            </fieldset>
                        </el-form-item>
                        <el-form-item prop="">
                            <fieldset style="width: 80%;height: 14vh;margin: auto;border: 1px solid #6C6C6C">
                                <legend style="margin-left: 1%">
                                    {{ $t("main.KeyboardShortcuts") }}
                                </legend>
                                <div style="margin-left: 2vw">
                                    {{ $t("main.lockRadio") }}<br/>
                                    <el-switch v-model="lockFlag" active-color="#13ce66"
                                            inactive-color="#ff4949" @change="changeLockFlag"></el-switch>
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
                                        <el-option v-for="item in this.languages" :key="item.value" :label="item.label"
                                                :value="item.value"></el-option>
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
                                    <el-switch v-model="showPassword" active-color="#13ce66"
                                            inactive-color="#ff4949"></el-switch>
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
                                    {{ $t("main.version") }}：{{package_version}}
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
                                    {{ $t("main.auto_update_prompt") }}<br/>
                                    <el-switch v-model="auto_update" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                                </div>
                              </fieldset>
                        </el-form-item>
                    </el-tab-pane>
                </el-tabs>
                <el-form-item label="" prop="" style="margin-top:5%;text-align: center">
                    <el-button type="primary" size="small" style="width:35%;" @click="savesettings">
                        {{ $t("main.save") }}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--个人信息弹出框-->
        <el-dialog
                title=""
                :visible.sync="dialogMyInfo"
                width="50%"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :show-close="true"
        >
            <img src="./img/tx.svg" alt=""/>
            <el-form label-width="110px" class="demo-ruleForm">
                <el-form-item :label="$t('myInfo.name')" prop="username" style="margin-top: 5%">
                    <div style="text-align: left;margin-top: 3px;"> {{ username }}</div>
                </el-form-item>
                <el-form-item :label="$t('myInfo.walletAddress')" prop="myInfoKey">
                    <div style="text-align: left;margin-top: 3px;"> {{ myInfoKey }}</div>
                </el-form-item>
                <el-form-item :label="$t('myInfo.vip')" prop="vip">
                    <div style="text-align: left;margin-top: 3px;"> {{ vip }}</div>
                </el-form-item>
                <el-form-item :label="$t('myInfo.keystoreFile')">
                    <el-button type="primary" size="small" style="float: left;margin-top: 5px;" @click="exportkeystore">
                        {{ $t("myInfo.exportKeystoreFile") }}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--密码生成器-->
        <passwordGenerator
                :dialogopen="dialogPasswordGenerator"
                @dialogPasswordGeneratorclose="closedialog"
                @transpassword="getPassword"
                :dialogclose="dialogclose"
                @recoverdialogtag="recovertag"
        ></passwordGenerator>
        <!--主密码生成器-->
        <passwordGeneratorMain
                :dialogopenMain="dialogPasswordGeneratorMain"
                @dialogPasswordGeneratorcloseMain="closedialogMain"
                :dialogcloseMain="dialogcloseMain"
                @onCopy="onCopy"
                @onError="onError"
        ></passwordGeneratorMain>
        <!--支付-->
        <pay :dialogopen="dialogPayGenerator"
             @dialogPayGeneratorclose="closedialogPay">
        </pay>

        <!--设置-->
        <!-- <Setting
            :settingDialogOpen="dialogVisibleSetting"

            >
        </Setting> -->
        <!--图片库-->
        <el-dialog
                :title="$t('main.symbol')"
                :visible.sync="dialogSymbol"
                width="45%"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :show-close="true"
        >
            <el-tabs type="border-card" style="text-align: left">
                <el-tab-pane label="abc">
                    <img
                            src="./img/abc/la.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/abc/la.svg`)"
                    />
                    <img
                            src="./img/abc/lb.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/abc/lb.svg`)"
                    />
                    <img
                            src="./img/abc/lc.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/abc/lc.svg`)"
                    />
                    <img
                            src="./img/abc/ld.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/abc/ld.svg`)"
                    />
                    <img
                            src="./img/abc/le.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/abc/le.svg`)"
                    />
                    <img
                            src="./img/abc/lf.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/abc/lf.svg`)"
                    />
                    <img
                            src="./img/abc/lg.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/abc/lg.svg`)"
                    />
                    <img
                            src="./img/abc/lh.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/abc/lh.svg`)"
                    />
                    <img
                            src="./img/abc/li.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/abc/li.svg`)"
                    />
                    <img
                            src="./img/abc/lj.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/abc/lj.svg`)"
                    />
                    <img
                            src="./img/abc/lk.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/abc/lk.svg`)"
                    />
                    <img
                            src="./img/abc/ll.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/abc/ll.svg`)"
                    />
                    <img
                            src="./img/abc/lm.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/abc/lm.svg`)"
                    />
                    <img
                            src="./img/abc/ln.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/abc/ln.svg`)"
                    />
                    <img
                            src="./img/abc/lo.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/abc/lo.svg`)"
                    />
                    <img
                            src="./img/abc/lp.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/abc/lp.svg`)"
                    />
                    <img
                            src="./img/abc/lq.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/abc/lq.svg`)"
                    />
                    <img
                            src="./img/abc/lr.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/abc/lr.svg`)"
                    />
                    <img
                            src="./img/abc/ls.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/abc/ls.svg`)"
                    />
                    <img
                            src="./img/abc/lt.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/abc/lt.svg`)"
                    />
                    <img
                            src="./img/abc/lu.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/abc/lu.svg`)"
                    />
                    <img
                            src="./img/abc/lv.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/abc/lv.svg`)"
                    />
                    <img
                            src="./img/abc/lw.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/abc/lw.svg`)"
                    />
                    <img
                            src="./img/abc/lx.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/abc/lx.svg`)"
                    />
                    <img
                            src="./img/abc/ly.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/abc/ly.svg`)"
                    />
                    <img
                            src="./img/abc/lz.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/abc/lz.svg`)"
                    />
                </el-tab-pane>
                <el-tab-pane label="finances">
                    <img
                            src="./img/finances/amex.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/finances/amex.svg`)"
                    />
                    <img
                            src="./img/finances/atm.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/finances/atm.svg`)"
                    />
                    <img
                            src="./img/finances/bank.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/finances/bank.svg`)"
                    />
                    <img
                            src="./img/finances/bitcoin.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/finances/bitcoin.svg`)"
                    />
                    <img
                            src="./img/finances/coins.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/finances/coins.svg`)"
                    />
                    <img
                            src="./img/finances/credit_card.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/finances/credit_card.svg`)"
                    />
                    <img
                            src="./img/finances/diners_club.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/finances/diners_club.svg`)"
                    />
                    <img
                            src="./img/finances/dollar.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/finances/dollar.svg`)"
                    />
                    <img
                            src="./img/finances/euro.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/finances/euro.svg`)"
                    />
                    <img
                            src="./img/finances/jcb.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/finances/jcb.svg`)"
                    />
                    <img
                            src="./img/finances/mastercard.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/finances/mastercard.svg`)"
                    />
                    <img
                            src="./img/finances/meastro.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/finances/meastro.svg`)"
                    />
                    <img
                            src="./img/finances/money.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/finances/money.svg`)"
                    />
                    <img
                            src="./img/finances/paypal.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/finances/paypal.svg`)"
                    />
                    <img
                            src="./img/finances/piggy_bank.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/finances/piggy_bank.svg`)"
                    />
                    <img
                            src="./img/finances/pound.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/finances/pound.svg`)"
                    />
                    <img
                            src="./img/finances/ruble.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/finances/ruble.svg`)"
                    />
                    <img
                            src="./img/finances/rupee.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/finances/rupee.svg`)"
                    />
                    <img
                            src="./img/finances/visa.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/finances/visa.svg`)"
                    />
                    <img
                            src="./img/finances/yen.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/finances/yen.svg`)"
                    />
                    <img
                            src="./img/finances/rupay.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/finances/rupay.svg`)"
                    />
                </el-tab-pane>
                <el-tab-pane label="internet">
                    <img
                            src="./img/internet/amazon.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/internet/amazon.svg`)"
                    />
                    <img
                            src="./img/internet/at_sign.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/internet/at_sign.svg`)"
                    />
                    <img
                            src="./img/internet/blog.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/internet/blog.svg`)"
                    />
                    <img
                            src="./img/internet/community.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/internet/community.svg`)"
                    />
                    <img
                            src="./img/internet/download.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/internet/download.svg`)"
                    />
                    <img
                            src="./img/internet/ebay.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/internet/ebay.svg`)"
                    />
                    <img
                            src="./img/internet/email.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/internet/email.svg`)"
                    />
                    <img
                            src="./img/internet/f.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/internet/f.svg`)"
                    />
                    <img
                            src="./img/internet/g.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/internet/g.svg`)"
                    />
                    <img
                            src="./img/internet/in.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/internet/in.svg`)"
                    />
                    <img
                            src="./img/internet/instagram.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/internet/instagram.svg`)"
                    />
                    <img
                            src="./img/internet/joomla.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/internet/joomla.svg`)"
                    />
                    <img
                            src="./img/internet/mail_ru.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/internet/mail_ru.svg`)"
                    />
                    <img
                            src="./img/internet/pinterest.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/internet/pinterest.svg`)"
                    />
                    <img
                            src="./img/internet/rss.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/internet/rss.svg`)"
                    />
                    <img
                            src="./img/internet/s.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/internet/s.svg`)"
                    />
                    <img
                            src="./img/internet/t.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/internet/t.svg`)"
                    />
                    <img
                            src="./img/internet/v.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/internet/v.svg`)"
                    />
                    <img
                            src="./img/internet/vk.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/internet/vk.svg`)"
                    />
                    <img
                            src="./img/internet/web_site.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/internet/web_site.svg`)"
                    />
                    <img
                            src="./img/internet/worldpress.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/internet/worldpress.svg`)"
                    />
                    <img
                            src="./img/internet/y.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/internet/y.svg`)"
                    />
                    <img
                            src="./img/internet/ya.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/internet/ya.svg`)"
                    />
                </el-tab-pane>
                <el-tab-pane label="misc">
                    <img
                            src="./img/misc/alarm.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/misc/alarm.svg`)"
                    />
                    <img
                            src="./img/misc/bag.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/misc/bag.svg`)"
                    />
                    <img
                            src="./img/misc/box.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/misc/box.svg`)"
                    />
                    <img
                            src="./img/misc/default.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/misc/default.svg`)"
                    />
                    <img
                            src="./img/misc/door.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/misc/door.svg`)"
                    />
                    <img
                            src="./img/misc/key.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/misc/key.svg`)"
                    />
                    <img
                            src="./img/misc/lock.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/misc/lock.svg`)"
                    />
                    <img
                            src="./img/misc/movie.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/misc/movie.svg`)"
                    />
                    <img
                            src="./img/misc/music.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/misc/music.svg`)"
                    />
                    <img
                            src="./img/misc/network.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/misc/network.svg`)"
                    />
                    <img
                            src="./img/misc/note.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/misc/note.svg`)"
                    />
                    <img
                            src="./img/misc/picture.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/misc/picture.svg`)"
                    />
                    <img
                            src="./img/misc/safe.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/misc/safe.svg`)"
                    />
                    <img
                            src="./img/misc/sale.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/misc/sale.svg`)"
                    />
                    <img
                            src="./img/misc/shopping_cart.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/misc/shopping_cart.svg`)"
                    />
                    <img
                            src="./img/misc/suitcase.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/misc/suitcase.svg`)"
                    />
                </el-tab-pane>
                <el-tab-pane label="personal">
                    <img
                            src="./img/personal/dental_insurance.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/personal/dental_insurance.svg`)"
                    />
                    <img
                            src="./img/personal/eye.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/personal/eye.svg`)"
                    />
                    <img
                            src="./img/personal/fitness.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/personal/fitness.svg`)"
                    />
                    <img
                            src="./img/personal/food.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/personal/food.svg`)"
                    />
                    <img
                            src="./img/personal/glasses.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/personal/glasses.svg`)"
                    />
                    <img
                            src="./img/personal/health_insurance.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/personal/health_insurance.svg`)"
                    />
                    <img
                            src="./img/personal/hospital.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/personal/hospital.svg`)"
                    />
                    <img
                            src="./img/personal/house.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/personal/house.svg`)"
                    />
                    <img
                            src="./img/personal/id.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/personal/id.svg`)"
                    />
                    <img
                            src="./img/personal/insurance.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/personal/insurance.svg`)"
                    />
                    <img
                            src="./img/personal/membership.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/personal/membership.svg`)"
                    />
                    <img
                            src="./img/personal/passport.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/personal/passport.svg`)"
                    />
                    <img
                            src="./img/personal/pets.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/personal/pets.svg`)"
                    />
                    <img
                            src="./img/personal/prescription.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/personal/prescription.svg`)"
                    />
                    <img
                            src="./img/personal/shield.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/personal/shield.svg`)"
                    />
                    <img
                            src="./img/personal/social_security.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/personal/social_security.svg`)"
                    />
                    <img
                            src="./img/personal/tshirt.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/personal/tshirt.svg`)"
                    />
                    <img
                            src="./img/personal/user.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/personal/user.svg`)"
                    />
                    <img
                            src="./img/personal/user2.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/personal/user2.svg`)"
                    />
                </el-tab-pane>
                <el-tab-pane label="technology">
                    <img
                            src="./img/technology/adobe.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/technology/adobe.svg`)"
                    />
                    <img
                            src="./img/technology/android.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/technology/android.svg`)"
                    />
                    <img
                            src="./img/technology/apple.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/technology/apple.svg`)"
                    />
                    <img
                            src="./img/technology/calling_card.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/technology/calling_card.svg`)"
                    />
                    <img
                            src="./img/technology/camera.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/technology/camera.svg`)"
                    />
                    <img
                            src="./img/technology/cd.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/technology/cd.svg`)"
                    />
                    <img
                            src="./img/technology/computer.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/technology/computer.svg`)"
                    />
                    <img
                            src="./img/technology/gaming.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/technology/gaming.svg`)"
                    />
                    <img
                            src="./img/technology/hard_drive.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/technology/hard_drive.svg`)"
                    />
                    <img
                            src="./img/technology/laptop.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/technology/laptop.svg`)"
                    />
                    <img
                            src="./img/technology/phone.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/technology/phone.svg`)"
                    />
                    <img
                            src="./img/technology/printer.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/technology/printer.svg`)"
                    />
                    <img
                            src="./img/technology/router.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/technology/router.svg`)"
                    />
                    <img
                            src="./img/technology/sd_card.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/technology/sd_card.svg`)"
                    />
                    <img
                            src="./img/technology/server.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/technology/server.svg`)"
                    />
                    <img
                            src="./img/technology/sim_card.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/technology/sim_card.svg`)"
                    />
                    <img
                            src="./img/technology/smartphone.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/technology/smartphone.svg`)"
                    />
                    <img
                            src="./img/technology/source_code.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/technology/source_code.svg`)"
                    />
                    <img
                            src="./img/technology/tablet.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/technology/tablet.svg`)"
                    />
                    <img
                            src="./img/technology/tv.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/technology/tv.svg`)"
                    />
                    <img
                            src="./img/technology/ubuntu.png.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/technology/ubuntu.png.svg`)"
                    />
                    <img
                            src="./img/technology/video.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/technology/video.svg`)"
                    />
                    <img
                            src="./img/technology/voicemail.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/technology/voicemail.svg`)"
                    />
                    <img
                            src="./img/technology/wifi.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/technology/wifi.svg`)"
                    />
                    <img
                            src="./img/technology/windows.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/technology/windows.svg`)"
                    />
                </el-tab-pane>
                <el-tab-pane label="transport">
                    <img
                            src="./img/transport/airplane.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/transport/airplane.svg`)"
                    />
                    <img
                            src="./img/transport/bicycle.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/transport/bicycle.svg`)"
                    />
                    <img
                            src="./img/transport/bus.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/transport/bus.svg`)"
                    />
                    <img
                            src="./img/transport/car.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/transport/car.svg`)"
                    />
                    <img
                            src="./img/transport/garage.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/transport/garage.svg`)"
                    />
                    <img
                            src="./img/transport/gas.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/transport/gas.svg`)"
                    />
                    <img
                            src="./img/transport/helicopter.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/transport/helicopter.svg`)"
                    />
                    <img
                            src="./img/transport/jeep.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/transport/jeep.svg`)"
                    />
                    <img
                            src="./img/transport/motorcycle.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/transport/motorcycle.svg`)"
                    />
                    <img
                            src="./img/transport/parking.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/transport/parking.svg`)"
                    />
                    <img
                            src="./img/transport/scooter.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/transport/scooter.svg`)"
                    />
                    <img
                            src="./img/transport/ship.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/transport/ship.svg`)"
                    />
                    <img
                            src="./img/transport/train.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/transport/train.svg`)"
                    />
                    <img
                            src="./img/transport/truck.svg"
                            :style="{ background: color }"
                            alt=""
                            class="temlateSymbol"
                            @click="setImageBase64($event,`${publicPath}img/transport/truck.svg`)"
                    />
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
        <!--颜色选择弹出框-->
        <el-dialog
                :title="$t('main.color')"
                :visible.sync="dialogSymbolcolor"
                width="20%"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :show-close="true"
        >
            <div
                    style="width:70%;border: 1px solid #9A9A9A;margin: auto;padding: 2% 1%;"
            >
                <img
                        :src="imageBase64"
                        style="background:#F15723"
                        alt=""
                        class="temlateSymbol"
                        @click="setcolor('#F15723')"
                />
                <img
                        :src="imageBase64"
                        style="background:#DC4437"
                        alt=""
                        class="temlateSymbol"
                        @click="setcolor('#DC4437')"
                />
                <img
                        :src="imageBase64"
                        style="background:#F0851D"
                        alt=""
                        class="temlateSymbol"
                        @click="setcolor('#F0851D')"
                />
                <img
                        :src="imageBase64"
                        style="background:#ECA402"
                        alt=""
                        class="temlateSymbol"
                        @click="setcolor('#ECA402')"
                /><br/>
                <img
                        :src="imageBase64"
                        style="background:#F0CA39"
                        alt=""
                        class="temlateSymbol"
                        @click="setcolor('#F0CA39')"
                />
                <img
                        :src="imageBase64"
                        style="background:#C3D140"
                        alt=""
                        class="temlateSymbol"
                        @click="setcolor('#C3D140')"
                />
                <img
                        :src="imageBase64"
                        style="background:#64B044"
                        alt=""
                        class="temlateSymbol"
                        @click="setcolor('#64B044')"
                />
                <img
                        :src="imageBase64"
                        style="background:#109D59"
                        alt=""
                        class="temlateSymbol"
                        @click="setcolor('#109D59')"
                /><br/>
                <img
                        :src="imageBase64"
                        style="background:#11AACC"
                        alt=""
                        class="temlateSymbol"
                        @click="setcolor('#11AACC')"
                />
                <img
                        :src="imageBase64"
                        style="background:#4385F5"
                        alt=""
                        class="temlateSymbol"
                        @click="setcolor('#4385F5')"
                />
                <img
                        :src="imageBase64"
                        style="background:#3F5CA8"
                        alt=""
                        class="temlateSymbol"
                        @click="setcolor('#3F5CA8')"
                />
                <img
                        :src="imageBase64"
                        style="background:#9E69AF"
                        alt=""
                        class="temlateSymbol"
                        @click="setcolor('#9E69AF')"
                /><br/>
                <img
                        :src="imageBase64"
                        style="background:#BC5779"
                        alt=""
                        class="temlateSymbol"
                        @click="setcolor('#BC5779')"
                />
                <img
                        :src="imageBase64"
                        style="background:#89695E"
                        alt=""
                        class="temlateSymbol"
                        @click="setcolor('#89695E')"
                />
                <img
                        :src="imageBase64"
                        style="background:#999999"
                        alt=""
                        class="temlateSymbol"
                        @click="setcolor('#999999')"
                />
                <img
                        :src="imageBase64"
                        style="background:#333333"
                        alt=""
                        class="temlateSymbol"
                        @click="setcolor('#333333')"
                />
            </div>
        </el-dialog>
      <!--文件夹颜色选择弹出框-->
      <el-dialog
          :title="$t('main.color')"
          :visible.sync="dialogDirlcolor"
          width="20%"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :show-close="true"
      >
        <div
            style="width:70%;border: 1px solid #9A9A9A;margin: auto;padding: 2% 1%;"
        >
          <img
              :src='`${publicPath}img/directory/aside_F15723.svg`'
              style="background:#F15723"
              alt=""
              class="temlateSymbol"
              @click="setcolorD('aside_F15723.svg')"
          />
          <img
              :src='`${publicPath}img/directory/aside_DC4437.svg`'
              style="background:#DC4437"
              alt=""
              class="temlateSymbol"
              @click="setcolorD('aside_DC4437.svg')"
          />
          <img
              :src='`${publicPath}img/directory/aside_F0851D.svg`'
              style="background:#F0851D"
              alt=""
              class="temlateSymbol"
              @click="setcolorD('aside_F0851D.svg')"
          />
          <img
              :src='`${publicPath}img/directory/aside_ECA402.svg`'
              style="background:#ECA402"
              alt=""
              class="temlateSymbol"
              @click="setcolorD('aside_ECA402.svg')"
          /><br/>
          <img
              :src='`${publicPath}img/directory/aside_F0CA39.svg`'
              style="background:#F0CA39"
              alt=""
              class="temlateSymbol"
              @click="setcolorD('aside_F0CA39.svg')"
          />
          <img
              :src='`${publicPath}img/directory/aside_C3D140.svg`'
              style="background:#C3D140"
              alt=""
              class="temlateSymbol"
              @click="setcolorD('aside_C3D140.svg')"
          />
          <img
              :src='`${publicPath}img/directory/aside_64B044.svg`'
              style="background:#64B044"
              alt=""
              class="temlateSymbol"
              @click="setcolorD('aside_64B044.svg')"
          />
          <img
              :src='`${publicPath}img/directory/aside_109D59.svg`'
              style="background:#109D59"
              alt=""
              class="temlateSymbol"
              @click="setcolorD('aside_109D59.svg')"
          /><br/>
          <img
              :src='`${publicPath}img/directory/aside_11AACC.svg`'
              style="background:#11AACC"
              alt=""
              class="temlateSymbol"
              @click="setcolorD('aside_11AACC.svg')"
          />
          <img
              :src='`${publicPath}img/directory/aside_4385F5.svg`'
              style="background:#4385F5"
              alt=""
              class="temlateSymbol"
              @click="setcolorD('aside_4385F5.svg')"
          />
          <img
              :src='`${publicPath}img/directory/aside_3F5CA8.svg`'
              style="background:#3F5CA8"
              alt=""
              class="temlateSymbol"
              @click="setcolorD('aside_3F5CA8.svg')"
          />
          <img
              :src='`${publicPath}img/directory/aside_9E69AF.svg`'
              style="background:#9E69AF"
              alt=""
              class="temlateSymbol"
              @click="setcolorD('aside_9E69AF.svg')"
          /><br/>
          <img
              :src='`${publicPath}img/directory/aside_BC5779.svg`'
              style="background:#BC5779"
              alt=""
              class="temlateSymbol"
              @click="setcolorD('aside_BC5779.svg')"
          />
          <img
              :src='`${publicPath}img/directory/aside_89695E.svg`'
              style="background:#89695E"
              alt=""
              class="temlateSymbol"
              @click="setcolorD('aside_89695E.svg')"
          />
          <img
              :src='`${publicPath}img/directory/aside_999999.svg`'
              alt=""
              class="temlateSymbol"
              @click="setcolorD('aside_999999.svg')"
          />
          <img
              :src='`${publicPath}img/directory/aside_333333.svg`'
              style="background:#333333"
              alt=""
              class="temlateSymbol"
              @click="setcolorD('aside_333333.svg')"
          />
        </div>
      </el-dialog>
        <!-- 新建笔记 -->
       <el-dialog
                class="mb"
                :title="$t('main.newNote')"
                :visible.sync="dialogVisibleAddNote"
                width="40%"
                height="90%"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :show-close="true"
                @closed="cleartype"
                @close="clearDataNote"
        >
            <div class="titleDiv">
                <span class="titleNameDiv">{{ $t("main.name") }}</span>
                <span class="titleInputSpan">
            <input v-model="ruleFormAddNote.name" class="myInputTitle"/>
          </span>
                <span style="height:7vh;width:4vw;" @click="showIconMenu()">
            <img
                    v-if="imageBase64 != ''"
                    :src="imageBase64"
                    class="avatar"
                    :style="{ background: color }"
            />
            <img
                    v-else
                    src="./img/misc/lock.svg"
                    class="avatar"
                    :style="{ background: color }"
            />
          </span>
            </div>
            <ul
                    style="margin-left:71.5%;z-index: 10;border-radius: 5px;"
                    class="choosepic menu"
            >
                <li @click="dialogSymbolOpen">
                    <img
                            src="./img/tp.png"
                            style="width: 2vw;margin-left: 0.5vw;margin-right: 0.1vw;"
                            alt=""
                    />
                    <span>{{ $t("main.selectSymbol") }}</span>
                </li>
                <li @click="opencolor(tempTemplate)">
                    <img
                            src="./img/tsp.png"
                            style="width: 2vw;margin-left: 0.5vw;margin-right: 0.1vw;"
                            alt=""
                    />
                    <span>{{ $t("main.selectColor") }}</span>
                </li>
                <li>
            <span style="display:inline-block">
              <img
                      src="./img/zy.png"
                      style="width: 2vw;margin-left: 0.5vw;margin-right: 0.1vw;"
                      alt=""
              />
              <el-upload
                      action="https://jsonplaceholder.typicode.com/posts/"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccessAddNote"
                      :before-upload="beforeAvatarUpload"
                      style="height:2.5vh;width:8vw;display: inline-block"
              >{{ $t("main.userResource") }}
              </el-upload>
            </span>
                </li>
            </ul>
            <br/>
            <el-tabs type="border-card">
                <el-tab-pane :label="$t('main.notes')">
                    <div style="height:40vh;overflow: auto;">
                        <el-form
                                :model="ruleFormAddNote"
                                ref="ruleFormAddNote"
                                label-width="100px"
                                class="demo-ruleForm"
                                style="width: 80%;margin: auto;text-align: left"
                                label-position="top"
                        >
                           <el-form-item>
                                <el-input type="textarea" :rows="14"   v-model="ruleFormAddNote.notes"></el-input>
                           </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
            </el-tabs>
             <div style="margin-top:1vh;text-align: center">
                    <span style="float: left;line-height: 5vh;margin-right: 1vw;">选择分类</span>
                   <el-select v-model="selectlabels" multiple
                   :placeholder="$t('main.pleaseChoose')"
                   style="float: left;width:75%">
                    <el-option
                            v-for="(item, index) in this.labels.labels"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                    ></el-option>
                    </el-select>
              </div>
            <div style="margin-top:7vh;text-align: center">
                <el-button size="small" type="primary" @click="saveNote" :disabled="templatedisable"
                >{{$t('main.submit')}}
                </el-button
                >
                <el-button size="small" @click="dialogVisibleAddNote = false"
                >{{$t('keystoreImport.cancel')}}
                </el-button>
            </div>
        </el-dialog>

        <!--修改笔记-->
        <el-dialog
                :title="$t('main.modifyNote')"
                class="mb"
                :visible.sync="dialogVisibleNoteEdit"
                width="40%"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :show-close="true"
                @closed="cleartype"
        >
            <div class="titleDiv">
                <span class="titleNameDiv">{{ $t("main.name") }}</span>
                <span class="titleInputSpan">
            <input type="text" v-model="editobject.name" class="myInputTitle"/>
          </span>
                <span style="height:7vh;width:4vw;" @click="showIconMenu()">
            <img
                    :src="editobject.tempBase64"
                    class="avatar"
                    :style="{ background: editobject.bgcolor }"
            />
          </span>
            </div>
            <ul
                    style="margin-left:71.5%;z-index: 10;border-radius: 5px;"
                    class="choosepic menu"
            >
                <li @click="dialogSymbolOpen">
                    <img
                            src="./img/tp.png"
                            style="width: 2vw;margin-left: 0.5vw;margin-right: 0.1vw;"
                            alt=""
                    />
                    <span>{{ $t("main.selectSymbol") }}</span>
                </li>
                <li @click="opencolor(editobject)">
                    <img
                            src="./img/tsp.png"
                            style="width: 2vw;margin-left: 0.5vw;margin-right: 0.1vw;"
                            alt=""
                    />
                    <span>{{ $t("main.selectColor") }}</span>
                </li>
                <li>
            <span style="display:inline-block">
              <img
                      src="./img/zy.png"
                      style="width: 2vw;margin-left: 0.5vw;margin-right: 0.1vw;"
                      alt=""
              />
              <el-upload
                      action="https://jsonplaceholder.typicode.com/posts/"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccessEdit"
                      :before-upload="beforeAvatarUpload"
                      style="height:2.5vh;width:8vw;display: inline-block"
              >{{ $t("main.userResource") }}
              </el-upload>
            </span>
                </li>
            </ul>
            <br/>
            <el-tabs type="border-card">
                <el-tab-pane :label="$t('main.fields')">
                    <div style="height:45vh;overflow: auto;">
                        <el-form
                                :model="ruleFormNoteEdit"
                                ref="ruleFormNoteEdit"
                                label-width="100px"
                                class="demo-ruleForm"
                                style="width: 85%;margin: auto;text-align: left"
                                label-position="top"
                        >
                          <el-form-item>
                                <el-input type="textarea" :rows="16" v-model="ruleFormNoteEdit.notes"></el-input>
                          </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
            </el-tabs>
             <div style="margin-top:1vh;text-align: center">
                    <span style="float: left;line-height: 5vh;margin-right: 1vw;">选择分类</span>
                     <el-select  v-model="selectlabels"
                                 multiple
                                 :placeholder="$t('main.pleaseChoose')"
                                 style="float: left;width:75%">
                        <el-option
                                v-for="(item, index) in this.labels.labels"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                      </el-select>
               </div>
            <div style="margin-top:7vh;text-align: center">
                <el-button size="small" type="primary" :disabled="templatedisable" @click="editNote">{{
                    $t("main.submit")
                    }}
                </el-button>
                <el-button size="small" @click="dialogVisibleNoteEdit = false"
                >{{ $t("main.cancelFormat") }}
                </el-button>
            </div>
        </el-dialog>
        <el-dialog :title="$t('main.import')" :visible.sync="importFileDialog" width="30%" @close="importClose">
            <span>
                <el-select v-model="import_file_type" :placeholder="$t('main.pleaseChoose')">
                 <el-option
                     v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
                  </el-option>
                </el-select>
              <el-checkbox v-model="isCover">{{$t('main.cover')}}？</el-checkbox>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-upload :before-upload="importFileValid" :on-success="importFile" :show-file-list="false" action="https://jsonplaceholder.typicode.com/posts/">
                    <el-button slot="trigger" size="small" type="primary">{{$t('main.import')}}</el-button>
                </el-upload>
            </span>
        </el-dialog>
        <el-dialog :title="$t('main.update')" :visible.sync="updateDialog" width="30%">
            <span>若有新版本，是否更新？</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="updateDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="update">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="$t('main.update')" :visible.sync="progressDialog" width="30%" :show-close="false" :close-on-click-modal="false"
                   :close-on-press-escape="false">
            <el-progress :percentage="progress"></el-progress>
        </el-dialog>
    </aside>
    </body>
</template>
<script type="es6">
    import isElectron from 'is-electron'
    import low from 'lowdb';
    import LocalStorage from 'lowdb/adapters/LocalStorage';
    import password from '../../password.js';
    import ipfs from '@/jcc_ipfs.js'
    let FileSaver = require('file-saver');
    import config from '../../../package.json'
    const util = require('util');
    let request = require("request");
    let timecurl = "http://api.m.taobao.com/";
    //判断是否为开发者模式
    if (process.env.NODE_ENV === "development") {
        timecurl = 'http://localhost:8080/altime/';
    }
    export default {
        created() {this.keyevent();},
        mounted: function () {
              window['lock'] = () => {
                    this.lock();
            },
            //网络检查
            window.addEventListener('online',  this.online);
            window.addEventListener('offline', this.outline);
            //阻止浏览器右击菜单
            window.oncontextmenu = function () {
                return false;
            }
            if (window.IpcRenderer) {
                window.IpcRenderer.removeAllListeners("closeEditorWarning");
                window.IpcRenderer.on("closeEditorWarning", event => {
                    if (confirm("还未同步,是否同步")) {
                        alert("同步中....");
                    } else {
                        window.IpcRenderer.send("app.exit");
                    }
                });
            }

            this.initialize();
            this.unshow();
            let vm = this
            if (isElectron()) {
                vm.ipcRenderer = window.ipcRenderer
                vm.ipcRenderer.on('message', (event, data) => {
                    if(data.status===-1){
                        this.$message({
                            message: data.msg,
                            type: 'error'
                        });
                        vm.progressDialog=false;
                    }
                    if(data.status===2){
                        this.$message({
                            message: data.msg,
                            type: 'success'
                        });
                    }
                })
                vm.ipcRenderer.on('downloadProgress', (event, progressObj) => {
                    vm.progress=progressObj.percent.toFixed(0);
                    // 可自定义下载渲染效果

                })
                vm.ipcRenderer.on('isUpdateNow', (event, versionInfo) => {
                    this.$confirm('检测到新版本' + versionInfo.version + ',是否立即升级？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        vm.progressDialog=true;
                        vm.ipcRenderer.send('updateTest');
                    }).catch(() => {
                    });
                })
                vm.ipcRenderer.on('version',(event, versionInfo) => {
                    console.log(versionInfo.version)
                })
            }
        },

        //销毁监听事件
        beforeDestroy(){
            window.removeEventListener('online',   this.online);
            window.removeEventListener('offline',  this.outline);
            // 移除ipcRenderer所有事件
            if (isElectron()) {
              this.ipcRenderer.removeAllListeners()
            }
        },

        data() {
            return {
                progressDialog:false,
                progress:0,
                //setting
                dialogVisibleSetting: false,//设置弹出框




                updateDialog:false,
                exportClasses:[],
                package_version:"0.0.0",
                auto_update:false,
                options: [{
                    value: 'jpassword',
                    label: 'jpassword'
                }, {
                    value: 'safeincloud',
                    label: 'safeincloud'
                }, {
                    value: '1password',
                    label: '1password'
                }],
                importFileDialog: false,
                import_file_type: "jpassword",
                isCover: false,
                checkedArray:[],
                isctrl:"",//是否按下ctrl
                isshift:"",//是否按下shift
                dialogVisibleNoteEdit:false,//修改笔记
                dialogVisibleAddNote:false,//增加笔记
                network:true,
                publicPath: process.env.BASE_URL,
                status:"#E5E9F2",
                vip: "",
                templatedisable: true,
                dialogPayGenerator: false,//支付页面弹出框
                product: "product",
                dialogVisiblePay: false,
                temppassword: "",
                dialogPasswordGenerator: false,// 密码生成器弹出框
                dialogPasswordGeneratorMain: false,//主密码生成器弹出框
                dialogclose: false,//关闭密码器指示
                dialogcloseMain: false,//关闭密码器指示
                systemlock: "",//锁定开关
                locktime: "",//自动锁定时间
                languages: [{value: '中文', label: '中文'}, {value: 'English', label: 'English'}],
                language: '',//语言选择
                showPassword: "",//是否显示密码
                savePassword: "",
                savePasswords: [],
                lockFlag:localStorage.getItem("lockFlag"),//锁定状态
                autoStartFlag:localStorage.getItem("autoStartFlag"),//开机自启状态
                locktimedisabled: "",
                showpass: "", //弹出框
                ImageBase64: "",
                color: "#999999",
                ruleFormRename:false,
                dialogVisibleRename:false,//文件夹重命名
                dialogSymbolcolor: false,//图片库颜色
                dialogDirlcolor:false,//文件夹图片颜色
                dialogSymbol: false,//图片库
                dialogVisible: false,//密码锁定弹出框
                dialogVisible2: false,//增加文件夹弹出框
                dialogVisibledDirectory: false,//删除文件夹弹出框
                dialogVisibledProject: false,//删除项目弹出框
                dialogVisibledTemplate: false, //删除模板弹框
                dialogVisibledProjectDel: false,//删除项目弹出框(直接删除)
                dialogVisibleTemplate: false,//模板弹出框
                dialogVisibleAddProject: false, //增加项目弹出框
                dialogVisibleItems: false,//增加Items 弹出框
                dialogVisibleEdit: false, //修改项目弹出框

                dialogVisibleAddTemplate: false,//增加模板
                dialogVisibleAddTempItems: false,//增加模板项弹出框
                dialogVisibleTemplateEdit: false,//修改模板弹出框
                dialogVisibleItemsEdit: false, //修改模板项弹出框
                dialogMyInfo: false, //个人信息弹出框
                dialogRecover: false,//恢复弹出框
                dialogclearTrash: false,//清空垃圾箱
                dialogSynchronization: false,//同步数据提示
                mouse1: '',
                mouse2: '',
                eventID: '',
                currentSecond: 5,
                password: '',
                loginObj: this.$JSON5.parse(sessionStorage.getItem("userkeyObj")),
                currentProject: -1,//大于li 总数量，如果初始为""，默认选择第0个元素
                currentSpecial: -1,//大于li 总数量，如果初始为""，默认选择第0个元素
                currentDirectory: -1,
                currentNote: -1,
                currentTemplate: -1,
                DProject: '',
                DDirectory: '',
                DSpecial:'',
                click: 'click',
                disclick: 'disclick',
                delobj: '',
                isDisabled: true,
                percentage: 0,
                percentageTemplate: 0,
                tempPercentage: 0,
                synStatus: "exception",//同步进度条状态
                templateStatus: "exception",
                db: '',
                localdb: '',
                projects: [],
                localData: "",//本地数据
                processShow: false,//同步进度条是否显示
                projectEvent: '',
                labels: '',
                selectlabels: '',
                filed: '',//添加项
                filedName: '',//添加项名称
                editobject: '',//修改对象
                tempTemplate: [],//新增模板构造变量
                operateTemplates: "",
                templateEvent: "",
                templateItemsTemp: "",
                searchTemp: "",
                imageBase64: "",
                imgHash: "",
                imgtype: "",
                imgurl: "",
                username: "",
                key: "",
                myInfoKey: "",
                directoryClickId: "sy",
                showTrash: "false",
                activeIndex: '1',
                activeIndex2: '1',
                show: "none",
                operationType: "",//symbol 新建或修改对象类型
                //menu 右击菜单
                addNoteClasses:[],//新建笔记样式表
                renameClasses:[],//rename
                addDirClasses: [],//新建文件夹样式表
                addProjectClasses: [],//新建项目样式表
                addTemplateClasses: [],//新建模板样式表
                emptyTrashClasses: [],//清空垃圾样式表
                deleteClasses: [],//删除样式表
                recoverClass: [],//恢复样式表
                selectColorClasses:[],//选择颜色样式表
                newProject: {
                    "id": "",
                    "name": "",
                    "modelsId": [],
                    "modelsName": "",
                    "type": "project",
                    "datas": "",
                    "dateTime": "",
                    "tempBase64": "",
                    "imgHash": "",
                    "imgtype": "",
                    "imgurl": "",
                    "isDel": false,
                    "bgcolor": "",
                    "hasnote":false,
                    "isnote":false,//笔记类型
                    "note":"",
                    "checked":false,
                },
                newTemplate: {
                    "id": "",
                    "name": "",
                    "modelsId": ["mb"],
                    "modelsName": "模板",
                    "type": "template",
                    "datas": [],
                    "tempBase64": "",
                    "imgHash": "",
                    "imgtype": "",
                    "imgurl": "",
                    "isDel": false,
                    "bgcolor": "",
                    "hasnote":false,
                    "isnote":false,//笔记类型
                    "note":"",
                    "checked":false,
                },
                templates: {
                    "templates": [{
                        "id": "01",
                        "name": "membership",
                        "modelsId": ["mb"],
                        "modelsName": "模板",
                        "type": "template",
                        "isDel": false,
                        "imgtype": "url",
                        "imgurl":`${process.env.BASE_URL}img/misc/lock.svg`,
                        "hasnote":false,
                        "isnote":false,//笔记类型
                        "note":"",
                        "checked":false,
                        "datas": [{
                            "id": "fdbce150-fec4-11e9-bd45-854c67bf088b",
                            "key": "Number",
                            "type": "text",
                            "val": "",
                            "tempkey": "Number",
                        }, {
                            "id": "fdbce182-fec4-11e9-bd32-854c67bf088b",
                            "key": "Login",
                            "type": "text",
                            "val": "",
                            "tempkey": "Login",
                        }, {
                            "id": "fdbce150-fob4-11e9-bd32-854c67bf088b",
                            "key": "Password",
                            "type": "password",
                            "val": "",
                            "tempkey": "Password",
                            "percentage": 0,
                            "pwdstatus": "",
                        }, {
                            "id": "fdbce196-fec4-11e9-bd32-854c67bf088b",
                            "key": "Website",
                            "type": "website",
                            "val": "",
                            "tempkey": "Website"
                        }, {
                            "id": "fdbce150-fec4-11e9-bd32-854c67bf987b",
                            "key": "Phone",
                            "type": "text",
                            "val": "",
                            "tempkey": "Phone"
                        }]
                    }, {
                        "id": "02",
                        "name": "EmailAccount",
                        "modelsId": ["mb"],
                        "modelsName": "模板",
                        "type": "template",
                        "isDel": false,
                        "imgtype": "url",
                        "hasnote":false,
                        "isnote":false,//笔记类型
                        "note":"",
                        "imgurl":`${process.env.BASE_URL}img/misc/lock.svg`,
                        "hasnote":false,
                        "isnote":false,//笔记类型
                        "note":"",
                        "checked":false,
                        "datas": [{
                            "id": "fdbce183-fec4-11e9-bd32-854c67bf088b",
                            "key": "Email",
                            "type": "text",
                            "val": "",
                            "tempkey": "Email"
                        }, {
                            "id": "fdbce269-fec4-11e9-bd32-854c67bf088b",
                            "key": "Password",
                            "type": "password",
                            "val": "",
                            "tempkey": "Password",
                            "percentage": 0,
                            "pwdstatus": "",
                        }, {
                            "id": "fffce150-fec4-11e9-bd32-854c67bf088b",
                            "key": "Website",
                            "type": "website",
                            "val": "",
                            "tempkey": "Website"
                        }, {
                            "id": "fdbce161-fec4-11e9-bd32-854c67bf088b",
                            "key": "One-time Password",
                            "type": "text",
                            "val": "",
                            "tempkey": "One-time Password"
                        }]
                    }, {
                        "id": "03",
                        "name": "Login/Password",
                        "modelsId": ["mb"],
                        "modelsName": "模板",
                        "type": "template",
                        "isDel": false,
                        "imgtype": "url",
                        "hasnote":false,
                        "isnote":false,//笔记类型
                        "note":"",
                        "imgurl": `${process.env.BASE_URL}img/misc/lock.svg`,
                        "hasnote":false,
                        "isnote":false,//笔记类型
                        "note":"",
                        "checked":false,
                        "datas": [{
                            "id": "fdbce150-fec4-20e9-bd32-854c67bf088b",
                            "key": "Website",
                            "type": "website",
                            "val": "",
                            "tempkey": "Website"
                        },
                            {
                                "id": "fdbce150-fec4-18e9-bd32-854c67bf088b",
                                "key": "Name",
                                "type": "text",
                                "val": "",
                                "tempkey": "Name"
                            },
                            {
                                "id": "fdbce150-feb9-11e9-bd32-854c67bf088b",
                                "key": "Password",
                                "type": "password",
                                "val": "",
                                "tempkey": "Password",
                                "percentage": 0,
                                "pwdstatus": "",
                            }]
                    }]
                },
                templateItems: {
                    "templateItems": [{
                        "id": "fdbce150-fec4-11e9-bd32-854c67bf088b",
                        "key": this.$t('selects.password'),
                        "type": "password",
                        "val": "",
                        "tempkey": "Password",
                        "percentage": 0,
                        "pwdstatus": "",
                    }, {
                        "id": "fdbce150-fec4-11e9-bd32-854c67bf388b",
                        "key": this.$t('selects.number'),
                        "type": "text",
                        "val": "",
                        "tempkey": "Number"
                    }, {
                        "id": "fdbce150-fec4-11e9-bd32-984c67bf088b",
                        "key": this.$t('selects.email'),
                        "type": "text",
                        "val": "",
                        "tempkey": "Email"
                    }, {
                        "id": "fdbce150-fec4-11e9-bd32-854d67bf088b",
                        "key": this.$t('selects.address'),
                        "type": "text",
                        "val": "",
                        "tempkey": "Address"
                    },
                        {
                            "id": "fdbce150-fec4-11e9-bd32-854d35bf088b",
                            "key": this.$t('selects.login'),
                            "type": "login",
                            "val": "",
                            "tempkey": "Login"
                        },
                        {
                            "id": "fdbce150-fec4-11e9-bd32-898d67bf088b",
                            "key": this.$t('selects.phone'),
                            "type": "text",
                            "val": "",
                            "tempkey": "Phone"
                        },
                        {
                            "id": "fdbce150-fec4-11e9-bd32-908d67bf088b",
                            "key": this.$t('selects.date'),
                            "type": "date",
                            "val": "",
                            "tempkey": "Date"
                        },
                        {
                        "id": "fdbce150-fec4-11e9-bd32-854c67bf397b",
                        "key": this.$t('selects.webside'),
                        "type": "website",
                        "val": "",
                        "tempkey": "Website"
                        },
                    ]
                },
                settings: {
                    systemlock: true,//锁定开关
                    locktime: 5,//自动锁定时间
                    language: '中文',//语言选择
                    showPassword: false,//是否显示密码
                    savePassword: "ask",
                },
                ruleForm: {
                    modelsType: '', pName: '',
                },
                ruleFormAddProject: {
                    name: '', models: ''
                },
                ruleFormProjectDetail: {
                    name: ""
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
                    notes:"",
                    name:"",
                },
                ruleFormNoteEdit: {
                    notes:"",
                    name:"",
                },
                ruleFormRename:{
                  pName:""
                },
                rules: {
                    modelsType: [{required: true, message: this.$t('main.pleaseChooseTheType'), trigger: 'blur'}],
                    pName: [{required: true, message: this.$t('main.pleaseEnterAName'), trigger: 'blur'},
                        ],
                    filedName: [{required: true, message: this.$t('main.pleaseEnterAName'), trigger: 'blur'}],

                },
            };
        },
        methods: {
            importClose(){
                this.isCover = false;
                this.import_file_type = "jpassword";
            },
            update(){},
            chrome(){
                window.ipcRenderer.send("open","https://chrome.google.com/webstore/category/extensions?h1=zh");
            },
            auto_update_func(){
                if(this.auto_update){
                    this.ipcRenderer.send('checkForUpdate');
                }
            },
            checkForUpdates(){
                this.ipcRenderer.send('checkForUpdate');
            },
            importFile(res, file) {
                let _this = this;
                let reader = new FileReader();
                reader.readAsText(file.raw);
                reader.onload = async function (res) {
                    try{
                        if(_this.import_file_type === "1password"){
                            let passworddata=JSON.parse(res.target.result.split("***")[0]);
                            let id = passworddata.uuid;
                            let name = passworddata.title;
                            let project = _this.db.get("project").find({id: id}).value();
                            let datas=[];
                            try{
                                if(passworddata.secureContents.URLs!==undefined){
                                    let data={
                                        "id": "",
                                        "key": "",
                                        "type": "",
                                        "val": "",
                                        "tempkey": ""
                                    };
                                    data.id=_this.$Uuidv1();
                                    data.key="网址";
                                    data.type="website";
                                    data.val=passworddata.secureContents.URLs[0].url;
                                    data.tempkey="网址";
                                    datas.push(data);
                                }
                            }catch (e){
                                console.log("data.secureContents.URLs");
                            }
                            try{
                                if(passworddata.secureContents.notesPlain!==undefined){
                                    let data={
                                        "id": "",
                                        "key": "",
                                        "type": "",
                                        "val": "",
                                        "tempkey": ""
                                    };
                                    data.id=_this.$Uuidv1();
                                    data.key="笔记";
                                    data.type="text";
                                    data.val=passworddata.secureContents.notesPlain;
                                    data.tempkey="笔记";
                                    datas.push(data);
                                }
                            }catch (e){
                                console.log("data.secureContents.notesPlain");
                            }
                            try{
                                if(passworddata.secureContents.fields!==undefined){
                                    for(let n in passworddata.secureContents.fields){
                                        let data={
                                            "id": "",
                                            "key": "",
                                            "type": "",
                                            "val": "",
                                            "tempkey": ""
                                        };
                                        data.id=_this.$Uuidv1();
                                        data.key=passworddata.secureContents.fields[n].name;
                                        if(passworddata.secureContents.fields[n].type==="P"){
                                            data.type="password";
                                        }else {
                                            data.type="text";
                                        }
                                        data.val=passworddata.secureContents.fields[n].value;
                                        data.tempkey=passworddata.secureContents.fields[n].name;
                                        datas.push(data);
                                    }
                                }
                            }catch (e){
                                console.log("data.secureContents.fields");
                            }
                            try{
                                if(passworddata.secureContents.sections!==undefined){
                                    for(let n in passworddata.secureContents.sections){
                                        console.log(n)
                                        for(let j in passworddata.secureContents.sections[n].fields){
                                            let data={
                                                "id": "",
                                                "key": "",
                                                "type": "",
                                                "val": "",
                                                "tempkey": ""
                                            };
                                            if(passworddata.secureContents.sections[n].fields[j].t!==""){
                                                data.id=_this.$Uuidv1();
                                                data.key=passworddata.secureContents.sections[n].fields[j].t;
                                                if(passworddata.secureContents.sections[n].fields[j].k==="concealed"){
                                                    data.type="password";
                                                }else {
                                                    data.type="text";
                                                }
                                                data.val=passworddata.secureContents.sections[n].fields[j].v;
                                                data.tempkey=passworddata.secureContents.sections[n].fields[j].t;
                                                datas.push(data);
                                            }
                                        }
                                    }
                                }
                            }catch (e){
                                console.log("data.secureContents.sections");
                            }
                            _this.newProject = {
                                "id": id,
                                "name": name,
                                "modelsId": ['wbj','sy'], // "modelsName":newArray.toString(),
                                "isDel": false,
                                "type": "project",
                                "datas": datas,
                                "dateTime": await _this.getTime(),
                                "tempBase64": "",
                                "imgHash": "",
                                "imgtype": "url",
                                "imgurl": "/img/misc/lock.svg",
                                "bgcolor": "#999999",
                                "isnote": false,//笔记类型
                                "hasnote": false,
                                "note": "",
                                "checked": false,
                                "modelsName": ""
                            };
                            //db project 追加数据
                            _this.db.get("project").push(_this.$JSON5.parse(_this.$JSON5.stringify(_this.newProject))).write();
                            _this.db.set('version', await _this.getTime(),).write();
                            _this.selectlabels = "";
                            _this.dialogVisibleAddProject = false;
                            _this.ruleFormAddProject.name = "";
                            _this.color = "";
                            //二次刷新
                            _this.getdirectory();
                            _this.notesBytargeId(_this.db.get("models").find({id: _this.directoryClickId}).value());//刷新列表页
                            _this.templateEvent = "";
                        }else{
                            let parser = new DOMParser();
                            let xmlDoc = parser.parseFromString(res.target.result, "text/xml");
                            let card = xmlDoc.getElementsByTagName("card");
                            let label = xmlDoc.getElementsByTagName("label");
                            let card_length = card.length;
                            let label_length = label.length;
                            let import_type = _this.import_file_type;
                            if (import_type === "jpassword") {
                                for (let n = 0; n < label_length; n++) {
                                    let id = label[n].getAttribute("id");
                                    let name = label[n].getAttribute("name");
                                    let models = _this.db.get("models").find({id: id}).value();
                                    if (models === undefined) {
                                        let newModel = '{"id":"' + id + '" ,"name" :"' + name + '","modelsType":"directory","imgPath":"aside_999999.svg","type":"model","isDel":false,"top":false,"index":""}';
                                        _this.db.get("models").push(_this.$JSON5.parse(newModel)).write();
                                        let now = await _this.getTime();
                                        _this.db.set('version', now).write();
                                        _this.dialogVisible2 = false, _this.getdirectory();
                                    } else {
                                        console.log("数据存在!");
                                    }
                                }
                                for (let n = 0; n < card_length; n++) {
                                    let id = card[n].getAttribute("id");
                                    let name = card[n].getAttribute("name");
                                    let datas = [];
                                    let db_name = "";
                                    let note = [];
                                    let type = ""
                                    if (card[n].getAttribute("isTemplates") === "false") {
                                        db_name = "project";
                                        type = "project";
                                    } else {
                                        db_name = "templates";
                                        note = "";
                                        type = "template";
                                    }
                                    let project = _this.db.get(db_name).find({id: id}).value();
                                    if (project === undefined) {
                                        if (card[n].getAttribute("isnote") === "true") {
                                            let import_notes = card[n].getElementsByTagName("notes");
                                            let notes = {"notes": import_notes[0].childNodes[0].nodeValue};
                                            note.push(notes)
                                        } else {
                                            let field = card[n].getElementsByTagName("field");
                                            let val="";

                                            for (let i = 0; i < field.length; i++) {
                                                try{
                                                    val=field[i].childNodes[0].nodeValue;
                                                }catch (e){
                                                    val="";
                                                }
                                                let data = {
                                                    "id": field[i].getAttribute("id"),
                                                    "key": field[i].getAttribute("key"),
                                                    "type": field[i].getAttribute("type"),
                                                    "val": val,
                                                    "tempkey": field[i].getAttribute("tempkey")
                                                };
                                                datas.push(data);
                                            }
                                        }
                                        let label_id = card[n].getElementsByTagName("label_id");
                                        let modelsId = [];
                                        for (let i = 0; i < label_id.length; i++) {
                                            modelsId.push(label_id[i].childNodes[0].nodeValue)
                                        }
                                        let isDel = card[n].getAttribute("isDel") === "true";
                                        _this.newProject = {
                                            "id": id,
                                            "name": name,
                                            "modelsId": modelsId, // "modelsName":newArray.toString(),
                                            "isDel": isDel,
                                            "type": type,
                                            "datas": datas,
                                            "dateTime": await _this.getTime(),
                                            "tempBase64": card[n].getAttribute("tempBase64"),
                                            "imgHash": card[n].getAttribute("imgHash"),
                                            "imgtype": card[n].getAttribute("imgtype"),
                                            "imgurl": card[n].getAttribute("imgurl"),
                                            "bgcolor": card[n].getAttribute("bgcolor"),
                                            "isnote": card[n].getAttribute("isnote") === "true",//笔记类型
                                            "hasnote": card[n].getAttribute("hasnote") === "true",
                                            "note": note,
                                            "checked": card[n].getAttribute("checked") === "true",
                                            "modelsName": ""
                                        };
                                        //db project 追加数据
                                        _this.db.get(db_name).push(_this.$JSON5.parse(_this.$JSON5.stringify(_this.newProject))).write();
                                        _this.db.set('version', await _this.getTime(),).write();
                                        _this.selectlabels = "";
                                        _this.dialogVisibleAddProject = false;
                                        _this.ruleFormAddProject.name = "";
                                        _this.color = "";
                                        _this.getdirectory();
                                        _this.notesBytargeId(_this.db.get("models").find({id: _this.directoryClickId}).value());//刷新列表页
                                        if (card[n].getAttribute("imgtype") === "base64") {
                                            _this.uploadImg(card[n].getAttribute("tempBase64"), _this.newProject.type, _this.newProject.id);
                                        }
                                        //二次刷新
                                        _this.getdirectory();
                                        _this.notesBytargeId(_this.db.get("models").find({id: _this.directoryClickId}).value());//刷新列表页
                                        _this.templateEvent = "";
                                    } else {
                                        if (_this.isCover) {
                                            _this.db.get(db_name).remove({id: id}).write();
                                            _this.db.set('version', await _this.getTime(),).write();
                                            if (card[n].getAttribute("isnote") === "true") {
                                                let import_notes = card[n].getElementsByTagName("notes");
                                                let notes = {"notes": import_notes[0].childNodes[0].nodeValue};
                                                note.push(notes)
                                            } else {
                                                let field = card[n].getElementsByTagName("field");
                                                let val="";
                                                for (let i = 0; i < field.length; i++) {
                                                    try{
                                                        val=field[i].childNodes[0].nodeValue;
                                                    }catch (e){
                                                        val="";
                                                    }
                                                    let data = {
                                                        "id": field[i].getAttribute("id"),
                                                        "key": field[i].getAttribute("key"),
                                                        "type": field[i].getAttribute("type"),
                                                        "val": val,
                                                        "tempkey": field[i].getAttribute("tempkey")
                                                    };
                                                    datas.push(data);
                                                }
                                            }
                                            let label_id = card[n].getElementsByTagName("label_id");
                                            let modelsId = [];
                                            for (let i = 0; i < label_id.length; i++) {
                                                modelsId.push(label_id[i].childNodes[0].nodeValue)
                                            }
                                            let isDel = card[n].getAttribute("isDel") === "true";
                                            _this.newProject = {
                                                "id": id,
                                                "name": name,
                                                "modelsId": modelsId, // "modelsName":newArray.toString(),
                                                "isDel": isDel,
                                                "type": type,
                                                "datas": datas,
                                                "dateTime": await _this.getTime(),
                                                "tempBase64": card[n].getAttribute("tempBase64"),
                                                "imgHash": card[n].getAttribute("imgHash"),
                                                "imgtype": card[n].getAttribute("imgtype"),
                                                "imgurl": card[n].getAttribute("imgurl"),
                                                "bgcolor": card[n].getAttribute("bgcolor"),
                                                "isnote": card[n].getAttribute("isnote") === "true",//笔记类型
                                                "hasnote": card[n].getAttribute("hasnote") === "true",
                                                "note": note,
                                                "checked": card[n].getAttribute("checked") === "true",
                                                "modelsName": ""
                                            };
                                            //db project 追加数据
                                            _this.db.get(db_name).push(_this.$JSON5.parse(_this.$JSON5.stringify(_this.newProject))).write();
                                            _this.db.set('version', await _this.getTime(),).write();
                                            _this.selectlabels = "";
                                            _this.dialogVisibleAddProject = false;
                                            _this.ruleFormAddProject.name = "";
                                            _this.color = "";
                                            _this.getdirectory();
                                            _this.notesBytargeId(_this.db.get("models").find({id: _this.directoryClickId}).value());//刷新列表页
                                            if(_this.projectEvent.id===_this.newProject.id){
                                                _this.projectEvent=_this.newProject
                                            }
                                            if (card[n].getAttribute("imgtype") === "base64") {
                                                _this.uploadImg(card[n].getAttribute("tempBase64"), _this.newProject.type, _this.newProject.id);
                                            }
                                            //二次刷新
                                            _this.getdirectory();
                                            _this.notesBytargeId(_this.db.get("models").find({id: _this.directoryClickId}).value());//刷新列表页
                                            _this.templateEvent = "";
                                        }
                                    }
                                }
                            } else if (import_type === "safeincloud") {
                                for (let n = 0; n < label_length; n++) {
                                    let id = label[n].getAttribute("id");
                                    let name = label[n].getAttribute("name");
                                    let models = _this.db.get("models").find({id: id}).value();
                                    if (models === undefined) {
                                        let newModel = '{"id":"' + id + '" ,"name" :"' + name + '","modelsType":"directory","imgPath":"aside_999999.svg","type":"model","isDel":false,"top":false,"index":""}';
                                        _this.db.get("models").push(_this.$JSON5.parse(newModel)).write();
                                        let now = await _this.getTime();
                                        _this.db.set('version', now).write();
                                        _this.dialogVisible2 = false, _this.getdirectory();
                                    } else {
                                        console.log("数据存在!");
                                    }
                                }
                                for (let n = 0; n < card_length; n++) {
                                    let id = card[n].getAttribute("id");
                                    let name = card[n].getAttribute("title");
                                    let datas = [];
                                    let db_name = "";
                                    let note = [];
                                    let type = ""
                                    let istemplate = "";
                                    istemplate = card[n].getAttribute("template");
                                    if (istemplate === "false" || istemplate === null) {
                                        db_name = "project";
                                        type = "project";
                                    } else {
                                        db_name = "templates";
                                        note = "";
                                        type = "template";
                                    }
                                    let project = _this.db.get(db_name).find({id: id}).value();
                                    if (project === undefined) {
                                        if (card[n].getAttribute("type") === "note") {
                                            let import_notes = card[n].getElementsByTagName("notes");
                                            let notes = {"notes": import_notes[0].childNodes[0].nodeValue};
                                            note.push(notes)
                                        } else {
                                            let field = card[n].getElementsByTagName("field");
                                            for (let i = 0; i < field.length; i++) {
                                                let field_type = field[i].getAttribute("type");
                                                if (field_type === "website") {
                                                    field_type = "webside";
                                                } else if (field_type === "password") {
                                                    field_type = "password";
                                                } else if (field_type === "date") {
                                                    field_type = "date";
                                                } else {
                                                    field_type = "text";
                                                }
                                                let val = "";
                                                if (istemplate === "false" || istemplate === null) {
                                                    val = field[i].childNodes[0].nodeValue;
                                                }
                                                let data = {
                                                    "id": _this.$Uuidv1(),
                                                    "key": field[i].getAttribute("name"),
                                                    "type": field_type,
                                                    "val": val,
                                                    "tempkey": field[i].getAttribute("name")
                                                };
                                                datas.push(data);
                                            }
                                        }
                                        let label_id = card[n].getElementsByTagName("label_id");
                                        let modelsId = [];
                                        for (let i = 0; i < label_id.length; i++) {
                                            modelsId.push(label_id[i].childNodes[0].nodeValue)
                                        }
                                        if (istemplate === "false" || istemplate === null) {
                                            modelsId.push("sy");
                                        } else {
                                            modelsId.push("mb");
                                        }
                                        let isDel = "";
                                        try {
                                            isDel = card[n].getAttribute("deleted") === "true";
                                        } catch (e) {
                                            isDel = false;
                                        }
                                        _this.newProject = {
                                            "id": id,
                                            "name": name,
                                            "modelsId": modelsId, // "modelsName":newArray.toString(),
                                            "isDel": isDel,
                                            "type": type,
                                            "datas": datas,
                                            "dateTime": await _this.getTime(),
                                            "tempBase64": "",
                                            "imgHash": "",
                                            "imgtype": "url",
                                            "imgurl": "/img/misc/lock.svg",
                                            "bgcolor": card[n].getAttribute("color"),
                                            "isnote": card[n].getAttribute("type") === "note",//笔记类型
                                            "hasnote": card[n].getAttribute("type") === "note",
                                            "note": note,
                                            "checked": false,
                                            "modelsName": ""
                                        };
                                        //db project 追加数据
                                        _this.db.get(db_name).push(_this.$JSON5.parse(_this.$JSON5.stringify(_this.newProject))).write();
                                        _this.db.set('version', await _this.getTime(),).write();
                                        _this.selectlabels = "";
                                        _this.dialogVisibleAddProject = false;
                                        _this.ruleFormAddProject.name = "";
                                        _this.color = "";
                                        _this.getdirectory();
                                        _this.notesBytargeId(_this.db.get("models").find({id: _this.directoryClickId}).value());//刷新列表页
                                        if (card[n].getAttribute("imgtype") === "base64") {
                                            _this.uploadImg(card[n].getAttribute("tempBase64"), _this.newProject.type, _this.newProject.id);
                                        }
                                        //二次刷新
                                        _this.getdirectory();
                                        _this.notesBytargeId(_this.db.get("models").find({id: _this.directoryClickId}).value());//刷新列表页
                                        _this.templateEvent = "";
                                    } else {
                                        console.log(_this.isCover)
                                        if (_this.isCover) {//覆盖
                                            _this.db.get(db_name).remove({id: id}).write();
                                            _this.db.set('version', await _this.getTime(),).write();
                                            console.log(_this.db.value())
                                            if (card[n].getAttribute("type") === "note") {
                                                let import_notes = card[n].getElementsByTagName("notes");
                                                let notes = {"notes": import_notes[0].childNodes[0].nodeValue};
                                                note.push(notes)
                                            } else {
                                                let field = card[n].getElementsByTagName("field");
                                                for (let i = 0; i < field.length; i++) {
                                                    let field_type = field[i].getAttribute("type");
                                                    if (field_type === "website") {
                                                        field_type = "webside";
                                                    } else if (field_type === "password") {
                                                        field_type = "password";
                                                    } else if (field_type === "date") {
                                                        field_type = "date";
                                                    } else {
                                                        field_type = "text";
                                                    }
                                                    let val = "";
                                                    if (istemplate === "false" || istemplate === null) {
                                                        val = field[i].childNodes[0].nodeValue;
                                                    }
                                                    let data = {
                                                        "id": _this.$Uuidv1(),
                                                        "key": field[i].getAttribute("name"),
                                                        "type": field_type,
                                                        "val": val,
                                                        "tempkey": field[i].getAttribute("name")
                                                    };
                                                    datas.push(data);
                                                }
                                            }
                                            let label_id = card[n].getElementsByTagName("label_id");
                                            let modelsId = [];
                                            for (let i = 0; i < label_id.length; i++) {
                                                modelsId.push(label_id[i].childNodes[0].nodeValue)
                                            }
                                            if (istemplate === "false" || istemplate === null) {
                                                modelsId.push("sy");
                                            } else {
                                                modelsId.push("mb");
                                            }
                                            let isDel = "";
                                            try {
                                                isDel = card[n].getAttribute("deleted") === "true";
                                            } catch (e) {
                                                isDel = false;
                                            }
                                            _this.newProject = {
                                                "id": id,
                                                "name": name,
                                                "modelsId": modelsId, // "modelsName":newArray.toString(),
                                                "isDel": isDel,
                                                "type": type,
                                                "datas": datas,
                                                "dateTime": await _this.getTime(),
                                                "tempBase64": "",
                                                "imgHash": "",
                                                "imgtype": "url",
                                                "imgurl": "/img/misc/lock.svg",
                                                "bgcolor": card[n].getAttribute("color"),
                                                "isnote": card[n].getAttribute("type") === "note",//笔记类型
                                                "hasnote": card[n].getAttribute("type") === "note",
                                                "note": note,
                                                "checked": false,
                                                "modelsName": ""
                                            };
                                            //db project 追加数据
                                            _this.db.get(db_name).push(_this.$JSON5.parse(_this.$JSON5.stringify(_this.newProject))).write();
                                            _this.db.set('version', await _this.getTime(),).write();
                                            _this.selectlabels = "";
                                            _this.dialogVisibleAddProject = false;
                                            _this.ruleFormAddProject.name = "";
                                            _this.color = "";
                                            _this.getdirectory();
                                            _this.notesBytargeId(_this.db.get("models").find({id: _this.directoryClickId}).value());//刷新列表页
                                            if (card[n].getAttribute("imgtype") === "base64") {
                                                _this.uploadImg(card[n].getAttribute("tempBase64"), _this.newProject.type, _this.newProject.id);
                                            }
                                            //二次刷新
                                            _this.getdirectory();
                                            _this.notesBytargeId(_this.db.get("models").find({id: _this.directoryClickId}).value());//刷新列表页
                                            _this.templateEvent = "";
                                            if(_this.projectEvent.id===_this.newProject.id){
                                                _this.projectEvent=_this.newProject
                                            }
                                        } else {
                                            console.log("111111111111")
                                        }
                                    }

                                }
                            }
                        }
                        _this.isCover = false;
                        _this.import_file_type = "jpassword";
                    }catch (e) {
                        _this.$message.error('解析失败!');
                    }
                    _this.importFileDialog = false;
                }
            }, //图片大小验证
            importFileValid(file) {
              /*let types = ['text/xml'];
              const isImage = types.includes(file.type);
              const isLt200K = file.size / 1024 < 20;
              if (!isImage) {
                this.$message.error('上传文件只能是 xml 格式!');
              }
              return isImage;*/
            },
            exportFile() {
                let xml = '<?xml version="1.0" encoding="utf-8"?>\n';
                xml += "<database>\n";
                let label_id = "";
                let data_all = this.db.value();
                //获取右击数据
                if (this.delobj.type === "model") {
                    let data = this.db.value();
                    for (let n in data.project) {
                        for (let j in data.project[n].modelsId) {
                            if (data.project[n].modelsId[j] === this.delobj.id||(this.delobj.id==="ljt"&&data.project[n].isDel)) {
                                xml += '\t<card id="' + data.project[n].id + '" name="' + data.project[n].name + '" isDel="'
                                    + data.project[n].isDel + '" dateTime="' + data.project[n].dateTime + '" imgHash="'
                                    + data.project[n].imgHash + '" imgtype="' + data.project[n].imgtype + '" imgurl="'
                                    + data.project[n].imgurl + '" bgcolor="' + data.project[n].bgcolor + '" isnote="'
                                    + data.project[n].isnote + '" hasnote="' + data.project[n].hasnote + '" checked="'
                                    + data.project[n].checked + '" modelsName="' + data.project[n].modelsName + '" tempBase64="'
                                    + data.project[n].tempBase64 + '" isTemplates="false">\n';
                                if (data.project[n].isnote) {
                                    xml += '\t\t<notes>' + data.project[n].note[0].notes + ' </notes>\n';
                                } else {
                                    for (let i in data.project[n].datas) {
                                        xml += '\t\t<field id="' + data.project[n].datas[i].id + '" key="'
                                            + data.project[n].datas[i].key + '" type="' + data.project[n].datas[i].type + '" tempkey="'
                                            + data.project[n].datas[i].tempkey + '">' + data.project[n].datas[i].val + '</field>\n';
                                    }
                                }
                                for (let i in data.project[n].modelsId) {
                                    if (label_id.split(",").indexOf(data.project[n].modelsId[i]) === -1) {
                                        if (i === 0) {
                                            label_id += data.project[n].modelsId[i];
                                        } else
                                            label_id += "," + data.project[n].modelsId[i];
                                    }
                                    xml += '\t\t<label_id>' + data.project[n].modelsId[i] + '</label_id>\n';
                                }
                                xml += '\t</card>\n';
                            }
                        }
                    }
                    if ("mb" === this.delobj.id) {
                        for (let n in data.templates) {
                            xml += '\t<card id="' + data.templates[n].id + '" name="' + data.templates[n].name + '" isDel="'
                                + data.templates[n].isDel + '" dateTime="' + data.templates[n].dateTime + '" imgHash="'
                                + data.templates[n].imgHash + '" imgtype="' + data.templates[n].imgtype + '" imgurl="'
                                + data.templates[n].imgurl + '" bgcolor="' + data.templates[n].bgcolor + '" isnote="'
                                + data.templates[n].isnote + '" hasnote="' + data.templates[n].hasnote + '" checked="'
                                + data.templates[n].checked + '" modelsName="' + data.templates[n].modelsName + '" tempBase64="'
                                + data.templates[n].tempBase64 + '" isTemplates="true">\n';
                            for (let i in data.templates[n].datas) {
                                xml += '\t\t<field id="' + data.templates[n].datas[i].id + '" key="'
                                    + data.templates[n].datas[i].key + '" type="' + data.templates[n].datas[i].type + '" tempkey="'
                                    + data.templates[n].datas[i].tempkey + '">' + data.templates[n].datas[i].val + '</field>\n';
                            }
                            for (let i in data.templates[n].modelsId) {
                                if (label_id.split(",").indexOf(data.templates[n].modelsId[i]) === -1) {
                                    if (i === 0) {
                                        label_id += data.templates[n].modelsId[i];
                                    } else
                                        label_id += "," + data.templates[n].modelsId[i];
                                }
                                xml += '\t\t<label_id>' + data.templates[n].modelsId[i] + '</label_id>\n';
                            }
                            xml += '\t</card>\n';
                        }
                    }
                } else {
                    let db_name = "";
                    let isTemplates = "";
                    if (this.delobj.type === "project") {
                        db_name = "project";
                        isTemplates = "false";
                    } else {
                        db_name = "templates";
                        isTemplates = "true";
                    }
                    let data = this.db.get(db_name).find({id: this.delobj.id}).value();
                    xml += '\t<card id="' + data.id + '" name="' + data.name + '" isDel="'
                        + data.isDel + '" dateTime="' + data.dateTime + '" imgHash="'
                        + data.imgHash + '" imgtype="' + data.imgtype + '" imgurl="'
                        + data.imgurl + '" bgcolor="' + data.bgcolor + '" isnote="'
                        + data.isnote + '" hasnote="' + data.hasnote + '" checked="'
                        + data.checked + '" modelsName="' + data.modelsName + '" tempBase64="'
                        + data.tempBase64 + '" isTemplates="' + isTemplates + '">\n';
                    if(data.isnote){
                        xml += '\t\t<notes>' + data.note[0].notes + ' </notes>\n';
                    }else{
                        for (let i in data.datas) {
                            xml += '\t\t<field id="' + data.datas[i].id + '" key="'
                                + data.datas[i].key + '" type="' + data.datas[i].type + '" tempkey="'
                                + data.datas[i].tempkey + '">' + data.datas[i].val + '</field>\n';
                        }
                    }
                    for (let i in data.modelsId) {
                        if (label_id.split(",").indexOf(data.modelsId[i]) === -1) {
                            if (i === 0) {
                                label_id += data.modelsId[i];
                            } else
                                label_id += "," + data.modelsId[i];
                        }
                        xml += '\t\t<label_id>' + data.modelsId[i] + '</label_id>\n';
                    }
                    xml += '\t</card>\n';
                }
                for (let n in data_all.models) {
                    let label = label_id.split(",");
                    for (let i in label) {
                        if (label[i] === data_all.models[n].id && data_all.models[n].modelsType === "directory") {
                            xml += '\t<label id="' + data_all.models[n].id + '" name="' + data_all.models[n].name + '"></label>\n';
                        }
                    }
                }
                xml += "</database>";
                const blob = new Blob([xml], {
                    type: "text/plain;charset=utf-8"
                });
                saveAs(blob, "test.xml");
            },
            exportFileAll() {
                let xml = '<?xml version="1.0" encoding="utf-8"?>\n';
                xml += "<database>\n";
                let label_id = "";
                let data = this.db.value();
                for (let n in data.project) {
                    xml += '\t<card id="' + data.project[n].id + '" name="' + data.project[n].name + '" isDel="'
                        + data.project[n].isDel + '" dateTime="' + data.project[n].dateTime + '" imgHash="'
                        + data.project[n].imgHash + '" imgtype="' + data.project[n].imgtype + '" imgurl="'
                        + data.project[n].imgurl + '" bgcolor="' + data.project[n].bgcolor + '" isnote="'
                        + data.project[n].isnote + '" hasnote="' + data.project[n].hasnote + '" checked="'
                        + data.project[n].checked + '" modelsName="' + data.project[n].modelsName + '" tempBase64="'
                        + data.project[n].tempBase64 + '" isTemplates="false">\n';
                    if (data.project[n].isnote) {
                        xml += '\t\t<notes>' + data.project[n].note[0].notes + ' </notes>\n';
                    } else {
                        for (let i in data.project[n].datas) {
                            xml += '\t\t<field id="' + data.project[n].datas[i].id + '" key="'
                                + data.project[n].datas[i].key + '" type="' + data.project[n].datas[i].type + '" tempkey="'
                                + data.project[n].datas[i].tempkey + '">' + data.project[n].datas[i].val + '</field>\n';
                        }
                    }
                    for (let i in data.project[n].modelsId) {
                        if (label_id.split(",").indexOf(data.project[n].modelsId[i]) === -1) {
                            if (i === 0) {
                                label_id += data.project[n].modelsId[i];
                            } else
                                label_id += "," + data.project[n].modelsId[i];
                        }
                        xml += '\t\t<label_id>' + data.project[n].modelsId[i] + '</label_id>\n';
                    }
                    xml += '\t</card>\n';
                }
                for (let n in data.templates) {
                    xml += '\t<card id="' + data.templates[n].id + '" name="' + data.templates[n].name + '" isDel="'
                        + data.templates[n].isDel + '" dateTime="' + data.templates[n].dateTime + '" imgHash="'
                        + data.templates[n].imgHash + '" imgtype="' + data.templates[n].imgtype + '" imgurl="'
                        + data.templates[n].imgurl + '" bgcolor="' + data.templates[n].bgcolor + '" isnote="'
                        + data.templates[n].isnote + '" hasnote="' + data.templates[n].hasnote + '" checked="'
                        + data.templates[n].checked + '" modelsName="' + data.templates[n].modelsName + '" tempBase64="'
                        + data.templates[n].tempBase64 + '" isTemplates="true">\n';
                    for (let i in data.templates[n].datas) {
                        xml += '\t\t<field id="' + data.templates[n].datas[i].id + '" key="'
                            + data.templates[n].datas[i].key + '" type="' + data.templates[n].datas[i].type + '" tempkey="'
                            + data.templates[n].datas[i].tempkey + '">' + data.templates[n].datas[i].val + '</field>\n';
                    }
                    for (let i in data.templates[n].modelsId) {
                        if (label_id.split(",").indexOf(data.templates[n].modelsId[i]) === -1) {
                            if (i === 0) {
                                label_id += data.templates[n].modelsId[i];
                            } else
                                label_id += "," + data.templates[n].modelsId[i];
                        }
                        xml += '\t\t<label_id>' + data.templates[n].modelsId[i] + '</label_id>\n';
                    }
                    xml += '\t</card>\n';
                }
                for (let n in data.models) {
                    let label = label_id.split(",");
                    for (let i in label) {
                        if (label[i] === data.models[n].id && data.models[n].modelsType === "directory") {
                            xml += '\t<label id="' + data.models[n].id + '" name="' + data.models[n].name + '"></label>\n';
                        }
                    }
                }
                xml += "</database>";
                const blob = new Blob([xml], {
                    type: "text/plain;charset=utf-8"
                });
                saveAs(blob, "test.xml");
            },
            keyevent() {
                var that =this;
                document.onkeydown = function(e) {        //按下键盘
                 switch (e.keyCode) {
                   case 16:
                 that.isshift = true;
                 console.log('按下shift');
                   break;
                   case 17:
                 that.isctrl = true;
                  console.log('按下ctrl');
                    break;
                  }
                };
                 document.onkeyup = function(e) {        //放弃键盘
                    switch (e.keyCode) {
                    case 16:
                that.isshift = false;
                console.log('释放shift');
                    break;
                    case 17:
                that.isctrl = false;
                console.log('释放ctrl');
                    break;
                   }
               };
    },
            online(){
                this.network=true;
            },
            outline(){
                this.network=false;
            },
            chooseProduct(val) {
                this.product = val;
                if (val === 1) {
                    $("#1").css("border", "solid red 1px");
                }

            },
            pay() {
                let options = {
                    url: "http://localhost:8081/pay",
                    form: {
                        product: this.product,
                    }
                };
                request.post(options, function (error, response, body) {
                    const form = response.body;
                    const div = document.createElement('div')
                    div.id = 'alipay'
                    div.innerHTML = form
                    document.body.appendChild(div)
                    document.querySelector('#alipay').children[0].submit()
                });
            },
            formatTooltip(val) {
                return 8 + Math.floor(val / 5);
            },
            logOut() {
                sessionStorage.removeItem("userkeyObj");
                localStorage.removeItem("userkeyObj");
                this.$router.push("/jpass/login");
            },
            //密码显示控制
            changePass(e) {
                console.log(1111);
                if (e.currentTarget.previousElementSibling.getAttribute('type') == "password") {
                    e.currentTarget.previousElementSibling.setAttribute("type", "text");
                } else {
                    e.currentTarget.previousElementSibling.setAttribute("type", "password");
                }
            },
            GetXYPosition() {
                var x, y;
                var e = window.event;
                x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                this.mouse2 = x + ',' + y;
            },
            CheckTime() {
                    let timeout = this.locktime * 60 * 1000;//设定超时时间，单位毫秒
                    if (this.mouse1 == this.mouse2) {
                        this.currentSecond = this.currentSecond + 1000;
                        if (this.currentSecond > timeout) {
                            clearInterval(this.eventID);
                            this.dialogVisible = true;
                            this.loginObj.lock = true;
                            sessionStorage.setItem("userkeyObj", this.$JSON5.stringify(this.loginObj));
                            this.currentSecond = 0;
                        }
                    } else {
                        this.currentSecond = 0;
                        this.mouse1 = this.mouse2;
                    }
            },
            async unlock() {
                let secret = "";
                let wallet = new this.$JINGCHUANGWallet();
                let keyStoreString = localStorage.getItem(this.loginObj.name);
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
                    this.$message.error(this.$t('main.thePasswordIsIncorrectPleaseReEnter'));
                    return false;
                }
                this.loginObj.lock = false;
                sessionStorage.setItem("userkeyObj", this.$JSON5.stringify(this.loginObj));
                this.dialogVisible = false;
                this.$message.success(this.$t('main.unlockedSuccessfully'));
                this.password = "";
                //继续监听
                // this.eventID = setInterval(this.CheckTime, 1000);
            }, lock() {
                this.loginObj.lock = true;
                sessionStorage.setItem("userkeyObj", this.$JSON5.stringify(this.loginObj));
                this.dialogVisible = true;
            }, async myInfo() {
                const getPromise = util.promisify(request.get);
                let url = "https://stats.jccdex.cn/sum/jpassword/get_charge_list/:uuid?w=" + this.myInfoKey + "&t=0";
                let result = await getPromise(url);
                let msg = this.$JSON5.parse(result.body);
                if (msg.data.list.length > 0) {
                    this.vip = this.formatDate(msg.data.list[0].end_time);
                } else {
                    this.vip = this.$t('main.notvip');
                }
                this.dialogMyInfo = true;
            }, formatDate(datetime) {
                var date = new Date(datetime);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var year = date.getFullYear(),
                    month = ("0" + (date.getMonth() + 1)).slice(-2),
                    sdate = ("0" + date.getDate()).slice(-2),
                    hour = ("0" + date.getHours()).slice(-2),
                    minute = ("0" + date.getMinutes()).slice(-2),
                    second = ("0" + date.getSeconds()).slice(-2);
                // 拼接
                var result = year + "-" + month + "-" + sdate + " " + hour + ":" + minute + ":" + second;
                // 返回
                return result;
            }, async exportKey() {
                let secret = "";
                let wallet = new this.$JINGCHUANGWallet();
                let keyStoreString = localStorage.getItem(this.loginObj.name);
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
                    this.password = "";
                    this.key = "";
                    this.$message.error(this.$t('密码错误'));
                    return false;
                }
                sessionStorage.setItem("userkeyObj", this.$JSON5.stringify(this.loginObj));
                this.$message.success(this.$t('导出成功'));
                this.key = secret;
            }, exportkeystore() {
                let userObjString = this.$JSON5.parse(sessionStorage.getItem("userkeyObj"));
                let username = userObjString.name;
                let wallet = localStorage.getItem(username);
                let FileSaver = require('file-saver');
                let blob = new Blob([wallet], {type: "text/plain;charset=utf-8"});
                saveAs(blob, "keystore");
            }, //获取目录
            async getdirectory() {
                let loginObj = this.$JSON5.parse(sessionStorage.getItem("userkeyObj"));
                let secret = loginObj.secret;
                var alldata = this.db.get("models").value();// 获取所有分类
                var allProjects = this.db.get("project").value();
                var projectstring = ""
                var directoryString = ""
                var specialString =""
                var jsonSpecicalString=""
                var jsonProjectstring = ""
                var jsonDirectoryString = ""
                var labelsString = ""
                var jsonLabelsString = ""
                //设置每一项数量
                for (var modelkey in alldata) {
                    var count = 0
                    if (alldata[modelkey].id != "mb" && alldata[modelkey].id != "ljt") {
                        for (var projectkey in allProjects) {
                            var project = allProjects[projectkey];
                            var types = project.modelsId;
                            if (types.indexOf(alldata[modelkey].id) != -1 && project.isDel != true) {
                                count++;
                            }
                        }
                    } else if (alldata[modelkey].id == "mb") {
                        count = this.db.get("templates").filter({isDel: false}).size().value();
                    } else if (alldata[modelkey].id == "ljt") {
                        count = this.db.get("templates").filter({isDel: true}).size().value() + this.db.get("project").filter({isDel: true}).size().value();
                        if (count > 0) {
                            this.showTrash = true;//是否显示清空垃圾桶图标
                        } else {
                            this.showTrash = false;//是否显示清空垃圾桶图标
                        }
                    }
                    alldata[modelkey].count = count;
                }
                //分组
                for (var key in alldata) {
                    var object = alldata[key];
                    if (object.modelsType == "project") {
                        if(object.id=="sy" || object.id=="scj"){
                             projectstring = projectstring + this.$JSON5.stringify(object) + ",";
                        } else{
                             specialString = specialString + this.$JSON5.stringify(object) + ",";
                        }
                    }
                    if (object.modelsType == "directory") {
                        directoryString = directoryString + this.$JSON5.stringify(object) + ",";
                    }
                    if (object.id != "sy" && object.id != "wbj" && object.id != "mb" && object.id != "ljt" && object.id != "scj" && object.id != "weakPwd") {
                        labelsString = labelsString + this.$JSON5.stringify(object) + ",";
                    }
                }
                projectstring = projectstring.substring(0, projectstring.length - 1);
                jsonProjectstring = "{project:[" + projectstring + "]}";
                directoryString = directoryString.substring(0, directoryString.length - 1);
                jsonDirectoryString = "{directory:[" + directoryString + "]}";
                labelsString = labelsString.substring(0, labelsString.length - 1);
                jsonLabelsString = "{labels:[" + labelsString + "]}";
                specialString = specialString.substring(0, specialString.length - 1);
                jsonSpecicalString = "{special:[" + specialString + "]}";

                //文件夹
                this.DDirectory = this.$JSON5.parse(jsonDirectoryString);
                //分类下拉框国际化
                var jsonlebals = this.$JSON5.parse(jsonLabelsString).labels;
                for (var obj in jsonlebals) {
                    jsonlebals[obj].name = this.international(jsonlebals[obj].name);
                }
                this.labels = {labels: jsonlebals}
                //目录国际化
                var jsonProjects = this.$JSON5.parse(jsonProjectstring).project;
                for (var obj in jsonProjects) {
                    jsonProjects[obj].name = this.international(jsonProjects[obj].name);
                }
                this.DProject = {project: jsonProjects};
                //special 国际化
                var jsonSpecial = this.$JSON5.parse(jsonSpecicalString).special;
                 for (var obj in jsonSpecial) {
                    jsonSpecial[obj].name = this.international(jsonSpecial[obj].name);
                }
                this.DSpecial = {special:jsonSpecial};
                //类型名称
                for (var index in allProjects) {
                    var newArray = new Array();
                    for (var indexMode in allProjects[index].modelsId) {
                        var modelId = allProjects[index].modelsId[indexMode];
                        var model = this.db.get("models").find({id: modelId}).value();
                        if (model != undefined && model.id != "sy") {
                            newArray.push(this.international(model.name));//项目分类国际化
                        }
                    }
                    allProjects[index].modelsName = newArray.toString();
                }
                var projectArray = this.db.get("project").filter({isDel: false}).value();
                projectArray = this.$JSON5.parse(this.$JSON5.stringify(projectArray));
                //图片载入
                for (var index in projectArray) {
                    if (projectArray[index].imgtype == "url") {
                        projectArray[index].tempBase64 = projectArray[index].imgurl;
                    } else if (projectArray[index].imgtype == "base64") {
                        if (projectArray[index].imgHash != "") {
                            let img = this.localdb.get("img").find({id: projectArray[index].imgHash}).value();
                            if (img != undefined) {
                                projectArray[index].tempBase64 = img.value;
                            } else {
                                //取ipfs值
                                let result = await this.$myIpfs.Ipfs.read(secret, projectArray[index].imgHash, this.loginObj.address);
                                projectArray[index].tempBase64 = result;
                                //缓存到本地localdb库
                                img = {"id": projectArray[index].imgHash, "value": result};
                                this.localdb.get("img").push(img).write();
                            }
                        } else {
                            projectArray[index].tempBase64 = "";
                        }
                    }
                }
                this.projects = projectArray;
                 //更新排序
                 this.sort();
            },

            addDirectoryOP() {
                this.dialogVisible2 = true;
            }, //提交添加目录
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addDirectory(formName);
                    } else {
                        return false;
                    }
                });
                //this.addDirectory(formName);
            }, cancel(formName) {
                this.$refs[formName].resetFields();
                this.dialogVisible2 = false;
            },

          cancelRename(formName) {
            this.$refs[formName].resetFields();
            this.dialogVisibleRename = false;
          },

          //增加文件夹
           async addDirectory(formName) {
                let id = this.$Uuidv1();
                let name = this.ruleForm.pName;
                let newModel = '{"id":"' + id + '" ,"name" :"' + name + '","modelsType":"directory","imgPath":"aside_999999.svg","type":"model","isDel":false,"top":false,"index":""}';
                this.db.get("models").push(this.$JSON5.parse(newModel)).write();
                let now= await this.getTime();
                this.db.set('version',now ).write();
                this.dialogVisible2 = false, this.getdirectory();
                this.$refs[formName].resetFields();
            },
            projectclick(note, event) {
                this.clearChecked();
                var target = event.currentTarget;
                var index = Number(target.getAttribute("data-index"));
                this.currentProject = index;
                this.currentDirectory = -1;
                this.currentSpecial = -1;
                this.currentNote = -1;
                this.isDisabled = true;
                this.delobj = note;
                this.directoryClickId = note.id;
                this.notesBytargeId(note);
                this.searchTemp = "";//清空搜索框
                this.projectEvent = "";
            },
             specialclick(note, event) {
                this.clearChecked();
                var target = event.currentTarget;
                var index = Number(target.getAttribute("data-index"));
                this.currentSpecial = index;
                this.currentProject = -1;
                this.currentDirectory = -1;
                this.currentNote = -1;
                this.isDisabled = true;
                this.delobj = note;
                this.directoryClickId = note.id;
                this.notesBytargeId(note);
                this.searchTemp = "";//清空搜索框
                this.projectEvent = "";
            },
            directoryclick(note, event) {
                this.clearChecked();
                var target = event.currentTarget;
                var index = Number(target.getAttribute("data-index"));
                this.currentDirectory = index;
                this.currentProject = -1;
                this.currentSpecial = -1;
                this.currentNote = -1;
                this.delobj = note;
                this.isDisabled = false;
                this.directoryClickId = note.id;
                this.searchTemp = "";//清空搜索框
                this.projectEvent = "";
                this.notesBytargeId(note);
            },
             noteslick(project, event) {
                //更新密码强度（中英文切换）
                let items = project.datas
                for(var item in items){
                    if (items[item].type=="password"){
                        items[item].format = this.cryptLevel(items[item].val);
                        this.getPercentage(items[item].val);
                        items[item].percentage=this.percentage;
                        items[item].pwdstatus= this.status;
                    }
                }
                var target = event.currentTarget;
                var index = Number(target.getAttribute("data-index"));
                this.currentNote = index;
                this.delobj = project;
                this.isDisabled = false;
                this.projectEvent = project;
                if(this.isctrl==true){
                    let repetitive=false;//判断是否重复标识
                     if(this.checkedArray.length>0){ //array>0时判断是否有重复，重复不加入新对象
                          this.checkedArray.forEach(item=>{
                              if(item.id==project.id){
                                  repetitive=true;
                              }
                          })
                      if(!repetitive){
                            project.checked=true;
                            this.checkedArray.push(project);
                            console.log(this.checkedArray);
                      }
                     }else{
                         project.checked=true;
                         this.checkedArray.push(project);
                     }
                }else{
                    this.clearChecked();
                    project.checked=true;
                    this.checkedArray.push(project);
                    console.log(this.checkedArray);
                }

            },


            remove() {
                let type = this.delobj.type;
                let id = this.delobj.id;
                //多选操作
                if(this.checkedArray.length>0){
                     //通过数字第一个对象判断其类型
                     if(this.checkedArray[0].type=="project" && this.checkedArray[0].isDel!=true){
                        this.dialogVisibledProject = true;
                     }
                     if(this.checkedArray[0].type=="template" && this.checkedArray[0].isDel!=true){
                        this.dialogVisibledTemplate = true;
                     }

                    if(this.checkedArray[0].isDel==true){
                        this.dialogVisibledProjectDel = true;
                     }

                }else{
                 //单选操作
                if (type == "model" ) {
                  this.dialogVisibledDirectory = true;
                }
                 if (type == "project" && this.delobj.isDel!=true) {
                  this.dialogVisibledProject = true;
                }

                 if (type == "template" && this.delobj.isDel!=true) {
                  this.dialogVisibledTemplate = true;
                }
                if (this.delobj.isDel==true) {
                  this.dialogVisibledProjectDel = true;
                }


            }


            }, //删除数据
          async  removeData() {
                var type = this.delobj.type;
                var id = this.delobj.id;
                let nextObj ="";
                //批量删除
                if(this.checkedArray.length>0){
                    if(this.checkedArray.length==1){
                       console.log("单独删除");
                    //单个删除后确定check为删除元素的下一个元素，check该元素
                    let projectslist=this.projects;
                    for(let i=0;i< projectslist.length;i++){
                        //删除其他项
                         if(projectslist[i].id ==id && projectslist.length-1!=i){
                            this.currentNote=i;
                            i++;
                            nextObj=projectslist[i];
                            break;
                         }else if(projectslist.length-1==i){
                           //删除最后一项
                            nextObj=projectslist[0];
                            this.currentNote=0
                         }
                    }
                        if(this.checkedArray[0].type=="project" && this.checkedArray[0].isDel!=true){
                            this.checkedArray.forEach(item=>{
                                this.db.get("project").find({id: item.id}).set('isDel', true).write();
                            })
                            let now= await this.getTime();
                            this.db.set('version',now ).write();
                            this.dialogVisibledProject = false;
                            this.getdirectory();
                            console.log(this.directoryClickId);
                            this.notesBytargeId(this.db.get("models").find({id: this.directoryClickId}).value());//刷新列表页
                       }
                        if(this.checkedArray[0].type=="template" && this.checkedArray[0].isDel!=true){
                            this.checkedArray.forEach(item=>{
                                this.db.get("templates").find({id: item.id}).set('isDel', true).write();
                            })
                            let now= await this.getTime();
                            this.db.set('version',now ).write();
                            this.dialogVisibledTemplate = false;
                            this.getdirectory();
                            this.notesBytargeId(this.db.get("models").find({id: "mb"}).value());
                        }
                        this.delobj=nextObj;
                        //先清除checkedArray，再push 删除对象的下一个对象
                        this.checkedArray=[];
                        console.log(nextObj);
                        if(this.projects.length>0){//判断当前目录是否删除空，删空的话清除明细，按钮置灰。
                             this.checkedArray.push(nextObj);
                             this.projectEvent = nextObj;
                        }else{
                             this.projectEvent="";
                             this.isDisabled = true;
                        }

                    }else{
                       console.log("批量删除");
                        if(this.checkedArray[0].type=="project" && this.checkedArray[0].isDel!=true){
                            this.checkedArray.forEach(item=>{
                                this.db.get("project").find({id: item.id}).set('isDel', true).write();
                            })
                            let now= await this.getTime();
                            this.db.set('version',now ).write();
                            this.dialogVisibledProject = false;
                            this.projectEvent = "";
                            this.getdirectory();
                            console.log(this.directoryClickId);
                            this.notesBytargeId(this.db.get("models").find({id: this.directoryClickId}).value());//刷新列表页

                      }
                       if(this.checkedArray[0].type=="template" && this.checkedArray[0].isDel!=true){
                            this.checkedArray.forEach(item=>{
                                this.db.get("templates").find({id: item.id}).set('isDel', true).write();
                            })
                            let now= await this.getTime();
                            this.db.set('version',now ).write();
                            this.dialogVisibledTemplate = false;
                            this.projectEvent = "";
                            this.getdirectory();
                            this.notesBytargeId(this.db.get("models").find({id: "mb"}).value());
                        }
                             this.currentNote=-1
                             this.isDisabled = true;
                    }
                }else{
                    //删除labels
                    console.log("删除labels")
                if (type == "model") {
                    let directorylist=this.DDirectory.directory;
                    for(let i=0;i< directorylist.length;i++){
                        //删除其他项
                         if(directorylist[i].id ==id && directorylist.length-1!=i){
                            this.currentDirectory=i;
                            i++;
                            nextObj=directorylist[i];
                            break;
                         }else if(directorylist.length-1==i){
                           //删除最后一项
                            nextObj=directorylist[0];
                            this.currentDirectory=0
                         }
                    }
                    var projects = this.db.get("project").value();
                    this.db.get("models").remove({id: id}).write();
                    if (projects.length > 0) {
                        for (var project in projects) {
                            var index = projects[project].modelsId.indexOf(id);
                            if (index > -1) {
                                //删除modelsId数组中指定位置的项
                                projects[project].modelsId.splice(index, 1);
                                this.selectlabels = projects[project].modelsId;
                                //处理分类
                                if (this.selectlabels.indexOf("sy") == -1) {
                                    this.selectlabels.push("sy");//所有项必须有
                                }
                                if (this.selectlabels.length == 1 && this.selectlabels.indexOf("sy") != -1) {
                                    this.selectlabels.push("wbj");//只有所有项，增加未标记项
                                }
                                if (this.selectlabels.length > 2 && this.selectlabels.indexOf("sy") != -1 && this.selectlabels.indexOf("wbj") != -1) {
                                    //大于2项，包含所有项和为标记项时删除为标记项
                                    this.selectlabels = this.selectlabels.filter(function (item) {
                                        return item !== "wbj"
                                    })
                                }
                                projects[project].modelsId = this.$JSON5.parse(this.$JSON5.stringify(this.selectlabels));
                                    //更新project中的类别
                                this.db.get('project').find({id: projects[project].id}).assign({modelsId: this.selectlabels}).write();
                                this.selectlabels = "";
                            }
                        }
                    }
                    //更新template中的类别
                    var templates = this.db.get("templates").value();
                    if (templates.length > 0) {
                        for (var template in templates) {
                            var index = templates[template].modelsId.indexOf(id);
                            if (index > -1) {
                                templates[template].modelsId.splice(index, 1);
                                this.db.get('templates').find({id: templates[template].id}).assign({modelsId: templates[template].modelsId}).write();
                            }

                        }
                    }
                    let now= await this.getTime();
                    this.db.set('version',now ).write();
                    this.dialogVisibledDirectory = false;
                    this.getdirectory();
                    console.log(nextObj);
                    this.delobj=nextObj;
                    this.notesBytargeId(nextObj);//刷新列表页
                }
             }
            },

             //垃圾桶直接删除
            async removeDataTrash(){
                 var type = this.delobj.type;
                 var id = this.delobj.id;
                 let nextObj ="";
                 if(this.checkedArray.length>0){
                   if(this.checkedArray.length==1){
                       console.log("单独删除");
                       //单个删除后确定check为删除元素的下一个元素，check该元素
                        let projectslist=this.projects;
                        for(let i=0;i< projectslist.length;i++){
                            //删除其他项
                            if(projectslist[i].id ==id && projectslist.length-1!=i){
                                this.currentNote=i;
                                i++;
                                nextObj=projectslist[i];
                                break;
                            }else if(projectslist.length-1==i){
                            //删除最后一项
                                nextObj=projectslist[0];
                                this.currentNote=0
                            }
                        }
                           if(this.checkedArray[0].isDel==true){
                                this.checkedArray.forEach(item=>{
                                    if(item.type=="project"){
                                        this.db.get("project").remove({id:item.id}).write();
                                    }
                                    if(item.type=="template"){
                                        this.db.get("templates").remove({id: item.id}).write();
                                    }
                                })
                            this.dialogVisibledProjectDel = false;
                            this.projectEvent = "";
                            this.getdirectory();
                            this.notesBytargeId(this.db.get("models").find({id: this.directoryClickId}).value());//刷新列表页
                         }
                         this.delobj=nextObj;
                        //先清除checkedArray，再push 删除对象的下一个对象
                        this.checkedArray=[];
                        if(this.projects.length>0){//判断当前目录是否删除空，删空的话清除明细，按钮置灰。
                             this.checkedArray.push(nextObj);
                             this.projectEvent = nextObj;
                        }else{
                             this.projectEvent="";
                             this.isDisabled = true;
                        }
                       }
                       else{
                        //批量删除
                        if(this.checkedArray[0].isDel==true){
                                this.checkedArray.forEach(item=>{
                                    if(item.type=="project"){
                                        this.db.get("project").remove({id:item.id}).write();
                                    }
                                    if(item.type=="template"){
                                        this.db.get("templates").remove({id: item.id}).write();
                                    }
                                })
                            this.dialogVisibledProjectDel = false;
                            this.projectEvent = "";
                            this.getdirectory();
                            this.notesBytargeId(this.db.get("models").find({id: this.directoryClickId}).value());//刷新列表页
                         }
                             this.currentNote=-1
                             this.isDisabled = true;
                       }
                 }
                let now= await this.getTime();
                this.db.set('version',now ).write();
             },

            //点击目录生成projects列表
            async notesBytargeId(obj) {
                let loginObj = this.$JSON5.parse(sessionStorage.getItem("userkeyObj"));
                let secret = loginObj.secret;
                let id = obj.id;
                let projectArray = new Array();
                console.log(obj);
                if (obj.id != "mb" && obj.id != "ljt") {
                    let projects = this.db.get("project").value();
                    projects = this.$JSON5.parse(this.$JSON5.stringify(projects));
                    for (let key in projects) {
                        let models = projects[key].modelsId;
                        if (models.indexOf(id) != -1 && projects[key].isDel != true) {
                            projectArray.push(projects[key]);
                        }
                    }
                    //图片载入
                    for (var index in projectArray) {
                        if (projectArray[index].imgtype == "url") {
                            projectArray[index].tempBase64 = projectArray[index].imgurl;
                        } else if (projectArray[index].imgtype == "base64") {
                            if (projectArray[index].imgHash != "") {
                                let img = this.localdb.get("img").find({id: projectArray[index].imgHash}).value();
                                if (img != undefined) {
                                    projectArray[index].tempBase64 = img.value;
                                } else {
                                    //取ipfs值
                                    let result = await this.$myIpfs.Ipfs.read(secret, projectArray[index].imgHash, this.loginObj.address);
                                    projectArray[index].tempBase64 = result;
                                    //缓存到本地localdb库
                                    img = {"id": projectArray[index].imgHash, "value": result};
                                    this.localdb.get("img").push(img).write();
                                }
                            } else {
                                projectArray[index].tempBase64 = "";
                            }
                        }
                    }
                } else if (obj.id == "mb") {
                    let projects = this.db.get("templates").filter({isDel: false}).value();
                    projects = this.$JSON5.parse(this.$JSON5.stringify(projects));
                    for (let index in projects) {
                        let newArray = new Array();
                        //插入类别名称
                        for (let indexMode in projects[index].modelsId) {
                            let modelId = projects[index].modelsId[indexMode];
                            let model = this.db.get("models").find({id: modelId}).value();
                            if (model.id != "sy") {
                                newArray.push(this.international(model.name));
                            }
                        }
                        projects[index].modelsName = newArray.toString();
                    }
                    projectArray = projects;
                    //图片载入
                    for (var index in projectArray) {
                        if (projectArray[index].imgtype == "url") {
                            projectArray[index].tempBase64 = projectArray[index].imgurl;
                        } else if (projectArray[index].imgtype == "base64") {
                            if (projectArray[index].imgHash != "") {
                                let img = this.localdb.get("img").find({id: projectArray[index].imgHash}).value();
                                if (img != undefined) {
                                    projectArray[index].tempBase64 = img.value;
                                } else {
                                    //取ipfs值
                                    let result = await this.$myIpfs.Ipfs.read(secret, projectArray[index].imgHash, this.loginObj.address);
                                    projectArray[index].tempBase64 = result;
                                    //缓存到本地localdb库
                                    img = {"id": projectArray[index].imgHash, "value": result};
                                    this.localdb.get("img").push(img).write();
                                }
                            } else {
                                projectArray[index].tempBase64 = "";
                            }
                        }
                    }
                } else if (obj.id == "ljt") {
                    //模板类别名称国际化
                    let delTemplate = this.db.get("templates").filter({isDel: true}).value();
                    delTemplate = this.$JSON5.parse(this.$JSON5.stringify(delTemplate));
                    for (let index in delTemplate) {
                        let newArray = new Array();
                        //插入类别名称
                        for (let indexMode in delTemplate[index].modelsId) {
                            let modelId = delTemplate[index].modelsId[indexMode];
                            let model = this.db.get("models").find({id: modelId}).value();
                            if (model.id != "sy") {
                                newArray.push(this.international(model.name));
                            }
                        }
                        delTemplate[index].modelsName = newArray.toString();
                    }
                    let delProject = this.db.get("project").filter({isDel: true}).value();
                    projectArray = delTemplate.concat(delProject);
                    //图片载入
                    for (var index in projectArray) {
                        if (projectArray[index].imgtype == "url") {
                            projectArray[index].tempBase64 = projectArray[index].imgurl;
                        } else if (projectArray[index].imgtype == "base64") {
                            if (projectArray[index].imgHash != "") {
                                let img = this.localdb.get("img").find({id: projectArray[index].imgHash}).value();
                                if (img != undefined) {
                                    projectArray[index].tempBase64 = img.value;
                                } else {
                                    //取ipfs值
                                    let result = await this.$myIpfs.Ipfs.read(secret, projectArray[index].imgHash, this.loginObj.address);
                                    projectArray[index].tempBase64 = result;
                                    //缓存到本地localdb库
                                    img = {"id": projectArray[index].imgHash, "value": result};
                                    this.localdb.get("img").push(img).write();
                                }
                            } else {
                                projectArray[index].tempBase64 = "";
                            }
                        }
                    }
                }
                projectArray.sort((a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0)); //a~z 排序
                this.projects = projectArray;
            },
            // async initialize1(){
            //     console.log("11111");
            //      let loginObj = this.$JSON5.parse(sessionStorage.getItem("userkeyObj"));
            //     let address = loginObj.address;
            //     let secret = loginObj.secret;
            //     this.myInfoKey = address;
            //     this.username = loginObj.name;
            //     var db_name = "db_" + address;
            //     this.db = await this.$Lowdb(db_name);
            //     this.localdb = await this.$Lowdb(db_name + "_local");
            //     //取ipfs数据
            //     let ipfsData = await this.$myIpfs.Ipfs.read(secret,"/main", address);
            //     ipfsData = this.$JSON5.parse(ipfsData)//ipfs转成对象
            //     ipfsData = this.$JSON5.parse(this.$JSON5.stringify(ipfsData));//序列化新对象
            //     this.templateItemsTemp = this.$JSON5.parse(this.$JSON5.stringify(this.templateItems));//初始化模板添加选项
            //      let profiles = {
            //                 name: loginObj.name, address: address,
            //             }
            //       var newdata = this.$JSON5.parse('{"profiles":"' + this.$JSON5.stringify(profiles) + '","project":[],"models":[{"id":"sy","name":"allProjects","modelsType":"project","type":"model"}, {"id":"scj","name":"favorites","modelsType":"project","type":"model"}, {"id":"mm","name":"password","modelsType":"project","type":"model"}, {"id":"mb","name":"template","modelsType":"project","type":"model"}, {"id":"wbj","name":"unmarked","modelsType":"project","type":"model"},{"id":"ljt","name":"trash","modelsType":"project","type":"model"},{"id":"weakPwd","name":"弱密码","modelsType":"project","type":"model"}]}');
            //             await this.db.defaults(newdata).write();
            //             let imgdata = {"img": []};
            //             await this.localdb.defaults(imgdata).write();
            //             this.operateTemplates = this.$JSON5.parse(this.$JSON5.stringify(this.templates));
            //             await this.db.set("templates", this.operateTemplates.templates).write();
            //             await this.db.set('settings', this.settings).write();
            //             await this.db.set('machineId', this.$Uuidv1()).write();
            //             await this.db.set('version', 0).write();
            //             this.getdirectory();
            // },
            //启动加载
            async initialize() {
                let loginObj = this.$JSON5.parse(sessionStorage.getItem("userkeyObj"));
                let address = loginObj.address;
                let secret = loginObj.secret;
                this.myInfoKey = address;
                this.username = loginObj.name;
                var db_name = "db_" + address;
                this.db = await this.$Lowdb(db_name);
                this.localdb = await this.$Lowdb(db_name + "_local");
                //取ipfs数据
                let ipfsData = await this.$myIpfs.Ipfs.read(secret,"/main", address);
                ipfsData = this.$JSON5.parse(ipfsData)//ipfs转成对象
                ipfsData = this.$JSON5.parse(this.$JSON5.stringify(ipfsData));//序列化新对象
                this.templateItemsTemp = this.$JSON5.parse(this.$JSON5.stringify(this.templateItems));//初始化模板添加选项
                if (this.db.get("machineId").value() == undefined) {  //判断machineId是否undefind
                    if (ipfsData.machineId == "" || ipfsData.machineId == undefined) {
                        //初始化新数据
                        let profiles = {
                            name: loginObj.name, address: address,
                        }
                        var newdata = this.$JSON5.parse('{"profiles":"' + this.$JSON5.stringify(profiles) + '","project":[],"models":[{"id":"sy","name":"allProjects","modelsType":"project","type":"model"}, {"id":"scj","name":"favorites","modelsType":"project","type":"model"}, {"id":"mm","name":"password","modelsType":"project","type":"model"}, {"id":"mb","name":"template","modelsType":"project","type":"model"}, {"id":"wbj","name":"unmarked","modelsType":"project","type":"model"},{"id":"ljt","name":"trash","modelsType":"project","type":"model"},{"id":"weakPwd","name":"weakpassword","modelsType":"project","type":"model"}]}');
                        await this.db.defaults(newdata).write();
                        let imgdata = {"img": []};
                        await this.localdb.defaults(imgdata).write();
                        this.operateTemplates = this.$JSON5.parse(this.$JSON5.stringify(this.templates));
                        await this.db.set("templates", this.operateTemplates.templates).write();
                        await this.db.set('settings', this.settings).write();
                        await this.db.set('machineId', this.$Uuidv1()).write();
                        await this.db.set('version', 0).write();
                        this.getdirectory();
                    } else {
                        //图片数据库初始化
                        let imgdata = {"img": []};
                        await this.localdb.defaults(imgdata).write();
                        //数据同步
                        await this.db.set("models", ipfsData.models).write();
                        await this.db.set("project", ipfsData.project).write();
                        await this.db.set("templates", ipfsData.templates).write();
                        await this.db.set('settings', ipfsData.settings).write();
                        await this.db.set('machineId',  this.$Uuidv1()).write();
                        await this.db.set('version', ipfsData.version).write();
                        this.getdirectory();
                    }
                } else if (ipfsData.machineId == "" ||ipfsData.machineId == undefined) {
                    this.getdirectory();
                }else if(ipfsData.machineId != "" && ipfsData.machineId !=undefined){
                    if(this.db.get("machineId").value() == ipfsData.machineId){
                        this.getdirectory();
                    }else if(ipfsData.version >this.db.get("version").value()){
                        this.getdirectory();
                        this.dialogSynchronization = true;
                    }else {
                        this.getdirectory();
                    }
                }
                //更新设置
                this.updatesetting();
                //启动锁定定时器
                this.locksystem();
                //设置语言
                this.changeLang(this.language);
            },
            //手动同步
            async synchronization() {
                if(!this.network){
                    this.$message.error(this.$t('login.outline'));
                    return false;
                }else{
                var loginObj = this.$JSON5.parse(sessionStorage.getItem("userkeyObj"));
                var address = this.loginObj.address;
                let userSecret = this.loginObj.secret;
                //读取IPFS中数据
                let tempipfsData = await this.$myIpfs.Ipfs.read(userSecret, "/main", address);
                tempipfsData = this.$JSON5.parse(tempipfsData)//ipfs转成对象
                tempipfsData = this.$JSON5.parse(this.$JSON5.stringify(tempipfsData));//序列化新对象
                if(tempipfsData.machineId !=undefined){
                    if (tempipfsData.version > this.db.get("version").value()) {//version越大内容越新
                        await this.db.set("models", tempipfsData.models).write();
                        await this.db.set("project", tempipfsData.project).write();
                        await this.db.set("templates", tempipfsData.templates).write();
                        await this.db.set('settings', tempipfsData.settings).write();
                        await this.db.set('machineId', this.$Uuidv1()).write();
                        await this.db.set('version', tempipfsData.version).write();
                        this.$message({
                            message:this.$t("main.synchronizationSuccessful"),
                            type: 'success'
                        });
                        this.getdirectory();
                    } else if (tempipfsData.version < this.db.get("version").value()) {
                        let localdata = this.db.__wrapped__;
                        let result = await this.$myIpfs.Ipfs.write(this.loginObj.secret, this.$JSON5.stringify(localdata), "/main");
                        if(result.indexOf("success")>0){
                            this.$message({
                                message:this.$t("main.synchronizationSuccessful"),
                                type: 'success'
                            });
                        }else if(result.indexOf("lackoil")>0){
                            this.$message({
                                message: this.$t("main.NonMember"),
                                type: 'error'
                            });
                        } else if(result.indexOf("error")>0){
                            this.$message({
                                message: this.$t("main.lineError"),
                                type: 'error'
                            });
                        }
                    }else if (tempipfsData.version == this.db.get("version").value()) {
                        this.$message({
                            message:this.$t("main.withoutSynchronization"),
                            type: 'success'
                        });
                    }
                }  else{
                    let localdata = this.db.__wrapped__;
                    let result = await this.$myIpfs.Ipfs.write(this.loginObj.secret, this.$JSON5.stringify(localdata), "/main");
                    if(result.indexOf("success")>0){
                        this.$message({
                            message:this.$t("main.synchronizationSuccessful"),
                            type: 'success'
                        });
                    }else if(result.indexOf("lackoil")>0){
                        this.$message({
                            message: this.$t("main.NonMember"),
                            type: 'error'
                        });
                    } else if(result.indexOf("error")>0){
                        this.$message({
                            message: this.$t("main.lineError"),
                            type: 'error'
                        });
                    }
                }
                //更新设置
                this.updatesetting();
                //启动锁定定时器
                this.locksystem();
                //设置语言
                this.changeLang(this.language);
                this.notesBytargeId(this.db.get("models").find({id: this.directoryClickId}).value());//刷新列表页
                }
            },
            pwdLength(obj) {
                obj.format = this.cryptLevel(obj.val);
                this.getPercentage(obj.val);
                obj.percentage = this.percentage;
                obj.pwdstatus = this.status;
            },
            async selectTemplate() {
                var loginObj = this.$JSON5.parse(sessionStorage.getItem("userkeyObj"));
                let userSecret = this.loginObj.secret;
                this.dialogVisibleTemplate = true;
                this.selectlabels = "";
                var projectArray = this.$JSON5.parse(this.$JSON5.stringify(this.db.get("templates").filter({isDel: false}).value()));
                //图片载入
                for (var index in projectArray) {
                    if (projectArray[index].imgtype == "url") {
                        projectArray[index].tempBase64 = projectArray[index].imgurl;
                    } else if (projectArray[index].imgtype == "base64") {
                        if (projectArray[index].imgHash != "") {
                            let img = this.localdb.get("img").find({id: projectArray[index].imgHash}).value();
                            if (img != undefined) {
                                projectArray[index].tempBase64 = img.value;
                            } else {
                                //取ipfs值
                                let result = await this.$myIpfs.Ipfs.read(userSecret,projectArray[index].imgHash, loginObj.address);
                                projectArray[index].tempBase64 = result;
                                //缓存到本地localdb库
                                img = {"id": projectArray[index].imgHash, "value": result};
                                this.localdb.get("img").push(img).write();
                            }
                        } else {
                            projectArray[index].tempBase64 = "";
                        }
                    }
                }
                this.operateTemplates = projectArray;
            },
            async projectlick(project, event) {
                var loginObj = this.$JSON5.parse(sessionStorage.getItem("userkeyObj"));
                let userSecret = this.loginObj.secret;
                let temp = this.db.get("templates").find({id: project.id}).value();
                let target = event.currentTarget;
                let index = Number(target.getAttribute("data-index"));
                this.currentTemplate = index;
                //图片继承
                if (temp.imgtype == "url") {
                    temp.tempBase64 = temp.imgurl;
                } else if (temp.imgtype == "base64") {
                    if (temp.imgHash != "") {
                        let img = this.localdb.get("img").find({id: temp.imgHash}).value();
                        if (img != undefined) {
                            temp.tempBase64 = img.value;
                        } else {
                            //取ipfs值
                            let result = await this.$myIpfs.Ipfs.read(userSecret,temp.imgHash, loginObj.address);
                            temp.tempBase64 = result;
                            //缓存到本地localdb库
                            img = {"id": temp.imgHash, "value": result};
                            this.localdb.get("img").push(img).write();

                        }
                    }
                }
                this.templateEvent = this.$JSON5.parse(this.$JSON5.stringify(temp));
                let modelsId = temp.modelsId;
                let models = [];
                for (var idIndex in modelsId) { //下拉框不显示mb
                    if (modelsId[idIndex].indexOf("mb") == -1 && modelsId[idIndex].indexOf("sy") ==-1) {
                        models.push(modelsId[idIndex]);
                    }
                }
                this.selectlabels = models;
            },
            addproject() {
                if (this.templateEvent == "") {
                    this.$message.error(this.$t('main.pleaseChooseATemplate'));
                    return false;
                } else {
                    this.dialogVisibleTemplate = false;
                    this.dialogVisibleAddProject = true;
                    this.operationType = "project_add";
                }
            }, //数据提交
           async submitproject() {
               if(!this.network){
                   this.$message.error(this.$t('login.outline'));
                   return false;
               }else {
                   let projectName = this.ruleFormAddProject.name;
                   let formData = this.templateEvent;
                   let newProject = ""
                   let imgtype = ""
                   let img = formData.tempBase64;
                   //设置分类
                   this.setlabels(this.selectlabels,formData.datas);
                   console.log(this.selectlabels);
                   //图片
                   if (this.imgtype == "url") {
                       imgtype = "url";
                       formData.imgHash = "";
                   } else if (this.imgtype == "base64") {
                       formData.imgurl = ""
                       imgtype = "base64";
                   } else {
                       //继承模板图片
                       imgtype = formData.imgtype;
                   }

                   this.newProject = {
                       "id": this.$Uuidv1(),
                       "name": projectName,
                       "modelsId": this.selectlabels, // "modelsName":newArray.toString(),
                       "isDel": false,
                       "type": "project",
                       "datas": formData.datas,
                       "dateTime": await this.getTime(),
                       "tempBase64": "",
                       "imgHash": formData.imgHash,
                       "imgtype": imgtype,
                       "imgurl": formData.tempBase64,
                       "bgcolor": formData.bgcolor,
                       "isnote":false,//笔记类型
                       "hasnote":false,
                       "note":"",
                       "checked":false,
                   };
                   //db project 追加数据
                   this.db.get("project").push(this.$JSON5.parse(this.$JSON5.stringify(this.newProject))).write();
                   this.db.set('version', await this.getTime(),).write();
                   this.selectlabels = "";
                   this.dialogVisibleAddProject = false;
                   this.ruleFormAddProject.name = "";
                   this.color = "";
                   this.getdirectory();
                   this.notesBytargeId(this.db.get("models").find({id: "sy"}).value());//刷新列表页
                   if (imgtype == "base64") {
                       this.uploadImg(img, this.newProject.type, this.newProject.id);
                   }
                   //二次刷新
                   this.getdirectory();
                //    this.notesBytargeId(this.db.get("models").find({id: "sy"}).value());//刷新列表页
                    this.afterChecked(this.newProject.id,this.newProject.type);
                   this.templateEvent = "";
               }
            }, //增加选中项
            selectFiled(command) {
                this.dialogVisibleItems = true;
                this.filed = this.$JSON5.parse(this.$JSON5.stringify(command));
                this.filedName = command.key
                this.ruleFormAddPro.filedName = command.key
            }, //添加项目，模板增加项
            addFiled(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.dialogVisibleItems = false;
                        this.filed.tempkey = this.ruleFormAddPro.filedName;
                        this.filed.id = this.$Uuidv1(),
                            this.templateEvent.datas.push(this.filed);
                        this.filed = "";
                        this.ruleFormAddPro.filedName= "";
                    } else {
                        return false;
                    }
                });
            }, //修改选中项
            editSelectFiled(command) {
                this.dialogVisibleItemsEdit = true;
                this.filed = this.$JSON5.parse(this.$JSON5.stringify(command));
                this.filedName = command.key;
                this.ruleFormAddTEdit.filedName = command.key;
            }, //修改项目，模板增加项
            editAddFiled(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.dialogVisibleItemsEdit = false;
                        this.filed.tempkey = this.ruleFormAddTEdit.filedName;
                        this.filed.id = this.$Uuidv1(), this.editobject.datas.push(this.filed);
                        this.filed = "";
                        this.ruleFormAddTEdit.filedName= "";
                    } else {
                        return false;
                    }
                });
            },
            //修改页面
            editProject() {
                    this.editobject = this.$JSON5.parse(this.$JSON5.stringify(this.projectEvent));
                     if(this.editobject.name){
                        this.editobject.name= this.editobject.name.replace(/^\s+|\s+$/g,'');
                        let name=this.editobject.name;
                        if(name.trim().length>0){
                            this.templatedisable=false
                        }else{
                            this.templatedisable=true
                        }
                        }else{
                            this.templatedisable=true
                        }
                    let items = this.editobject.datas
                    for (var item in items) {
                        if (items[item].type == "password") {
                            items[item].format = this.cryptLevel(items[item].val);
                        }
                    }
                    if (this.editobject.type == "project" && this.editobject.isnote!=true) {
                        let modelsId = this.editobject.modelsId;
                        let models = [];
                        for (var index in modelsId) { //下拉框不显示sy,wbj
                            if (modelsId[index].indexOf("sy") == -1 && modelsId[index].indexOf("wbj")==-1 && modelsId[index].indexOf("weakPwd")==-1) {
                                models.push(modelsId[index]);
                            }
                        }
                        this.selectlabels = models;
                        this.dialogVisibleEdit = true;
                        this.operationType = "project_edit";
                    }else if(this.editobject.type == "project" && this.editobject.isnote==true){
                        let modelsId = this.editobject.modelsId;
                        let models = [];
                         for (var index in modelsId) { //下拉框不显示sy,wbj
                            if (modelsId[index].indexOf("sy") == -1 && modelsId[index].indexOf("wbj")==-1 && modelsId[index].indexOf("weakPwd")==-1) {
                                models.push(modelsId[index]);
                            }
                        }
                        this.selectlabels = models;
                        this.dialogVisibleNoteEdit = true;
                        this.operationType = "note_edit";
                        this.ruleFormNoteEdit.notes=this.editobject.note[0].notes;
                    }else if (this.editobject.type == "template") {
                        var modelsId = this.editobject.modelsId;
                        var models = [];
                        for (var index in modelsId) { //下拉框不显示mb
                            if (modelsId[index].indexOf("mb") == -1 && modelsId[index].indexOf("weakPwd")==-1 && modelsId[index].indexOf("wbj")==-1 && modelsId[index].indexOf("sy")==-1) {
                                models.push(modelsId[index]);
                            }
                        }
                        this.selectlabels = models;
                        this.dialogVisibleTemplateEdit = true;
                        this.operationType = "template_edit";
                    }
            },
            //修改project
           async editDo() {
               if(!this.network){
                   this.$message.error(this.$t('login.outline'));
                   return false;
               }else {
                   try {
                       this.db.get("project").remove({id: this.editobject.id}).write();
                       var img = this.$JSON5.parse(this.$JSON5.stringify(this.editobject.tempBase64));
                       this.setlabels(this.selectlabels,this.editobject.datas);
                       this.editobject.modelsId = this.selectlabels;
                       //图片处理
                       if (this.imgtype == "url") {
                           this.imgHash = "";
                           this.editobject.imgtype = "url";
                           this.editobject.imgurl = this.editobject.tempBase64;
                       } else if (this.imgtype == "base64") {
                           this.editobject.imgurl = ""
                           this.editobject.tempBase64 = "";//先删除tempBase64
                           this.editobject.imgtype = "base64";
                       }

                       this.editobject.checked=false;
                       this.db.get("project").push(this.$JSON5.parse(this.$JSON5.stringify(this.editobject))).write();
                       this.db.set('version', await this.getTime()).write();
                       this.dialogVisibleEdit = false
                       this.editobject.tempBase64 = img;
                       this.$message.success(this.$t('main.successfullyModified'));
                       this.projectEvent = this.editobject;
                       this.selectlabels = "";
                       this.color = "";
                       this.getdirectory();
                    //    this.notesBytargeId(this.db.get("models").find({id: this.directoryClickId}).value());//刷新列表页
                       if (this.imgtype == "base64") {
                           if (this.editobject.imgHash != "") {//判断原来对象与新对象中的imgbase64 是否相同，不同的话，重新上传数据
                               let imgBase64 = this.localdb.get("img").find({id: this.editobject.imgHash}).value();
                               if (imgBase64 == undefined || imgBase64.value != this.editobject.tempBase64) {
                                   this.uploadImg(this.editobject.tempBase64, this.editobject.type, this.editobject.id);
                               }
                           } else {
                               this.uploadImg(this.editobject.tempBase64, this.editobject.type, this.editobject.id);
                           }
                       }
                        //二次刷新
                       this.getdirectory();
                    //    this.notesBytargeId(this.db.get("models").find({id: this.directoryClickId}).value());//刷新列表页
                       this.afterEditchecked(this.editobject.id);
                       this.editobject = "";
                   } catch (e) {
                       this.$message.error(this.$t('main.failToEdit'));
                   }
               }
            }, openDialogTemplate() {
                this.currentTemplate = -1;
                this.templateEvent = ""
            },
            openSetting() {
                this.dialogVisibleSetting = true;
                this.package_version=config.version;
            },
            addTemplate() {
                this.selectlabels = [];
                this.dialogVisibleAddTemplate = true;
                this.operationType = "template_add";
            }, selectFiledTemplate(command) {
                this.dialogVisibleAddTempItems = true;
                this.filed = this.$JSON5.parse(this.$JSON5.stringify(command));
                this.filedName = command.key;
                this.ruleFormAddTtemp.filedName = command.key;
            },
            addFiledTemplate(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.dialogVisibleAddTempItems = false;
                        this.filed.tempkey = this.ruleFormAddTtemp.filedName;
                        this.filed.id = this.$Uuidv1(), this.tempTemplate.push(this.filed);
                        this.filed = "";
                        this.ruleFormAddTtemp.filedName= "";
                    } else {
                        return false;
                    }
                });



            }, //增加模板
            async saveTemplate() {
                if(!this.network){
                    this.$message.error(this.$t('login.outline'));
                    return false;
                }else{
                var loginObj = this.$JSON5.parse(sessionStorage.getItem("userkeyObj"));
                var address = loginObj.address;
                //处理分类
                this.setlabels(this.selectlabels, this.tempTemplate);
                if (this.selectlabels.indexOf("mb") == -1) {
                    this.selectlabels.push("mb");//必须增加模板分类
                }
                //图片处理
                if (this.imageBase64 == '') {
                    //默认图片
                    // this.imageBase64 = this.$refs.icon_default.src;
                    this.imageBase64=`${this.publicPath}img/misc/lock.svg`;
                    this.imgtype = "url";
                }
                if (this.imgtype == "url") {
                    this.imgHash = "";
                    this.imgurl = this.imageBase64;
                } else if (this.imgtype == "base64") {
                    this.imgurl = ""
                }
                this.newTemplate = {
                    "id": this.$Uuidv1(),
                    "name": this.ruleFormAddTemplate.name,
                    "modelsId": this.selectlabels,
                    "modelsName": "模板",
                    "isDel": false,
                    "type": "template",
                    "datas": this.tempTemplate,
                    "tempBase64": "",
                    "imgHash": this.imgHash,
                    "imgtype": this.imgtype,
                    "imgurl": this.imgurl,
                    "bgcolor": this.color,
                    "isnote":false,//笔记类型
                    "hasnote":false,
                    "note":"",
                    "checked":false
                }
                this.db.get("templates").push(this.$JSON5.parse(this.$JSON5.stringify(this.newTemplate))).write();
                this.db.set('version', await this.getTime()).write();
                //清空变量
                this.ruleFormAddTemplate.name = "";
                this.color = "";
                this.tempTemplate = [];
                this.selectlabels = "";
                this.dialogVisibleAddTemplate = false;
                this.getdirectory();
                this.notesBytargeId(this.db.get("models").find({id: "mb"}).value());//刷新列表页
                if (this.imgtype == "base64") {
                    this.uploadImg(this.imageBase64, this.newTemplate.type, this.newTemplate.id);
                }
                //二次刷新
                this.getdirectory();
                // this.notesBytargeId(this.db.get("models").find({id: "mb"}).value());//刷新列表页
                this.afterChecked(this.newTemplate.id,this.newTemplate.type);
                this.imageBase64 = "";
                this.newTemplate = "";
                }
            }, //修改模板
          async  editTemplate() {
              if(!this.network){
                  this.$message.error(this.$t('login.outline'));
                  return false;
              }else{

                    this.setlabels(this.selectlabels, this.editobject.datas);
                  if (this.selectlabels.indexOf("mb") == -1) {
                    this.selectlabels.push("mb");//必须增加模板分类
                   }
                var img = this.$JSON5.parse(this.$JSON5.stringify(this.editobject.tempBase64));

                if (this.imgtype == "url") {
                    this.imgHash = "";
                    this.editobject.imgtype = "url";
                    this.editobject.imgurl = this.editobject.tempBase64;
                } else if (this.imgtype == "base64") {
                    this.editobject.imgurl = ""
                    this.editobject.tempBase64 = "";//先删除tempBase64
                    this.editobject.imgtype = "base64";
                }
                try {
                    this.editobject.checked=false;
                    this.db.get("templates").remove({id: this.editobject.id}).write();
                    this.editobject.modelsId = this.selectlabels;
                    this.db.get("templates").push(this.$JSON5.parse(this.$JSON5.stringify(this.editobject))).write();
                    this.db.set('version', await this.getTime()).write();
                    this.dialogVisibleTemplateEdit = false
                    this.$message.success(this.$t('main.successfullyModified'));
                    this.editobject.tempBase64 = img;
                    this.projectEvent = this.editobject;
                    this.selectlabels = "";
                    this.getdirectory();
                    this.color = "";
                    this.notesBytargeId(this.db.get("models").find({id: "mb"}).value());//刷新列表页
                    if (this.imgtype == "base64") {
                        if (this.editobject.imgHash != "") {//判断原来对象与新对象中的imgbase64 是否相同，不同的话，重新上传数据
                            let imgBase64 = this.localdb.get("img").find({id: this.editobject.imgHash}).value();
                            if (imgBase64 == undefined || imgBase64.value != this.editobject.tempBase64) {
                                this.uploadImg(this.editobject.tempBase64, this.editobject.type, this.editobject.id);
                            }
                        } else {
                            this.uploadImg(this.editobject.tempBase64, this.editobject.type, this.editobject.id);
                        }
                    }
                    //二次刷新
                    this.getdirectory();
                    // this.notesBytargeId(this.db.get("models").find({id: "mb"}).value());//刷新列表页
                    this.afterEditchecked(this.editobject.id);
                    this.editobject = "";
                } catch (e) {
                    this.$message.error(this.$t('main.failToEdit'));
                }
              }
            }, //删除项(修改模板，项目)
            editRemoveItem(itemsId) {
                let itemArray = this.editobject.datas;
                for (var i = 0; i < itemArray.length; i++) {
                    if (itemArray[i].id === itemsId) {
                        itemArray.splice(i, 1);
                    }
                }
            }, //删除项(增加模板)
            addTemplageRemoveItem(itemsId) {
                let itemArray = this.tempTemplate;
                for (var i = 0; i < itemArray.length; i++) {
                    if (itemArray[i].id === itemsId) {
                        itemArray.splice(i, 1);
                    }
                }
            }, //删除项(增加项目)
            addProjectRemoveItem(itemsId) {
                let itemArray = this.templateEvent.datas;
                for (var i = 0; i < itemArray.length; i++) {
                    if (itemArray[i].id === itemsId) {
                        itemArray.splice(i, 1);
                    }
                }
            }, //lock定时器启动
            lockchange(){
                if(this.systemlock) {
                    this.locktimedisabled = false;
                }else
                    this.locktimedisabled = true;
            },
            locksystem() {
                if (this.loginObj.lock) {
                    this.dialogVisible = true;
                } else if (this.systemlock) {
                    this.locktimedisabled = false;
                    this.eventID = setInterval(this.CheckTime, 1000);
                } else {
                    this.locktimedisabled = true;
                    clearInterval(this.eventID);
                }
            }, //启动初始化设置参数
            updatesetting() {
                let setting = this.db.get("settings").value();
                this.systemlock = setting.systemlock;
                this.locktimedisabled = !this.systemlock;
                this.locktime = setting.locktime;//自动锁定时间
                this.language = setting.language;//语言选择
                this.showPassword = setting.showPassword;//是否显示密码
                this.savePassword = setting.savePassword;
                this.auto_update = setting.auto_update;
            },
            //保存设置
           async savesettings() {
                try {
                    this.locksystem();
                    this.changeLang(this.language);
                    this.db.get("settings").set("systemlock", this.systemlock).write();
                    this.db.get("settings").set("locktime", this.locktime).write();
                    this.db.get("settings").set("showPassword", this.showPassword).write();
                    this.db.get("settings").set("savePassword", this.savePassword).write();
                    this.db.get("settings").set("language", this.language).write();
                    this.db.get("settings").set("auto_update", this.auto_update).write();
                    this.db.set('version', await this.getTime()).write();
                    this.$confirm(this.$t('main.settingSavedSuccessfully')+this.$t('main.re_login'), this.$t('main.suggest'), {
                        confirmButtonText: this.$t('main.login'),
                        cancelButtonText: this.$t('main.cancel'),
                    }).then(() => {
                        this.dialogVisibleSetting = false;
                        this.$router.push("/jpass/login");
                    }).catch(() => {
                        this.$message({
                            type: 'warning',
                            message: this.$t('main.cancel')+" "+this.$t('main.login')
                        });
                        this.dialogVisibleSetting = false;
                    });
                } catch (e) {
                    this.$message.error(this.$t('main.settingSaveFailed'));
                }
            },
            //未保存设置
            handleClose() {
                this.updatesetting();
                this.dialogVisibleSetting = false;
            },
            //搜索框
          async search(temp) {
                this.projects = [];
                let projectArray = [];
                let templateArray = [];
                let tempProjects = [];
                let tempTemplates = [];
                let ljtArray=[];
                let templjtArray=[];
                //project
                if (this.delobj.id != "mb" && this.delobj.id != "ljt") {
                    projectArray = this.db.get("project").filter({isDel: !true}).value();
                    for (var projectIndex in projectArray) {
                        if (projectArray[projectIndex].name.indexOf(temp) != -1) {
                            tempProjects.push(projectArray[projectIndex]);
                        }
                    }
                    //图片载入
                    for (var index in tempProjects) {
                        if (tempProjects[index].imgtype == "url") {
                            tempProjects[index].tempBase64 = tempProjects[index].imgurl;
                        } else if (tempProjects[index].imgtype == "base64") {
                            if (tempProjects[index].imgHash != "") {
                                let img = this.localdb.get("img").find({id: tempProjects[index].imgHash}).value();
                                if (img != undefined) {
                                    tempProjects[index].tempBase64 = img.value;
                                } else {
                                    //取ipfs值
                                    let result = await this.$myIpfs.Ipfs.read(secret, tempProjects[index].imgHash, this.loginObj.address);
                                    tempProjects[index].tempBase64 = result;
                                    //缓存到本地localdb库
                                    img = {"id": tempProjects[index].imgHash, "value": result};
                                    this.localdb.get("img").push(img).write();
                                }
                            } else {
                                tempProjects[index].tempBase64 = "";
                            }
                        }
                    }
                    this.projects = tempProjects;
                } else if(this.delobj.id =="mb") {
                    //template
                    templateArray = this.db.get("templates").filter({isDel: !true}).value();
                    for (var templateIndex in templateArray) {
                        if (templateArray[templateIndex].name.indexOf(temp) != -1) {
                            tempTemplates.push(templateArray[templateIndex]);
                        }
                    }
                    //图片载入
                    for (var index in tempTemplates) {
                        if (tempTemplates[index].imgtype == "url") {
                            tempTemplates[index].tempBase64 = tempTemplates[index].imgurl;
                        } else if (tempTemplates[index].imgtype == "base64") {
                            if (tempTemplates[index].imgHash != "") {
                                let img = this.localdb.get("img").find({id: tempTemplates[index].imgHash}).value();
                                if (img != undefined) {
                                    tempTemplates[index].tempBase64 = img.value;
                                } else {
                                    //取ipfs值
                                    let result = await this.$myIpfs.Ipfs.read(secret, tempTemplates[index].imgHash, this.loginObj.address);
                                    tempTemplates[index].tempBase64 = result;
                                    //缓存到本地localdb库
                                    img = {"id": tempTemplates[index].imgHash, "value": result};
                                    this.localdb.get("img").push(img).write();
                                }
                            } else {
                                tempTemplates[index].tempBase64 = "";
                            }
                        }
                    }
                    this.projects = tempTemplates;
                }else if(this.delobj.id =="ljt"){
                    projectArray = this.db.get("project").filter({isDel: true}).value();
                    templateArray = this.db.get("templates").filter({isDel: true}).value();
                    ljtArray =projectArray.concat(templateArray);
                    for(var ljtIndex in ljtArray){
                        if(ljtArray[ljtIndex].name.indexOf(temp) != -1){
                            templjtArray.push(ljtArray[ljtIndex]);
                        }
                    }
                    //图片载入
                    for (var index in templjtArray) {
                        if (templjtArray[index].imgtype == "url") {
                            templjtArray[index].tempBase64 = templjtArray[index].imgurl;
                        } else if (templjtArray[index].imgtype == "base64") {
                            if (templjtArray[index].imgHash != "") {
                                let img = this.localdb.get("img").find({id: templjtArray[index].imgHash}).value();
                                if (img != undefined) {
                                    templjtArray[index].tempBase64 = img.value;
                                } else {
                                    //取ipfs值
                                    let result = await this.$myIpfs.Ipfs.read(secret, templjtArray[index].imgHash, this.loginObj.address);
                                    templjtArray[index].tempBase64 = result;
                                    //缓存到本地localdb库
                                    img = {"id": templjtArray[index].imgHash, "value": result};
                                    this.localdb.get("img").push(img).write();
                                }
                            } else {
                                templjtArray[index].tempBase64 = "";
                            }
                        }
                    }
                    this.projects = templjtArray;
                }

            }, //图片处理(增加模板)
            handleAvatarSuccessAdd(res, file) {
                let temp = this;
                var reader = new FileReader();
                var base64 = "";
                reader.readAsDataURL(file.raw);
                reader.onload = async function (e) {
                    temp.imageBase64 = this.result;
                }
                this.imgtype = "base64";
            }, //图片处理（修改模板）
            handleAvatarSuccessEdit(res, file) {
                let temp = this;
                var reader = new FileReader();
                var base64 = "";
                reader.readAsDataURL(file.raw);
                reader.onload = async function (e) {
                    temp.imageBase64 = this.result;
                    temp.editobject.tempBase64 = this.result;
                }
                this.imgtype = "base64";
            }, //图片处理（增加项目）
            handleAvatarSuccessAddPro(res, file) {
                let temp = this;
                console.log(temp);
                var reader = new FileReader();
                var base64 = "";
                reader.readAsDataURL(file.raw);
                reader.onload = async function (e) {
                    temp.imageBase64 = this.result;
                    temp.templateEvent.tempBase64 = this.result;
                }
                this.imgtype = "base64";
            },
              //图片处理（增加笔记）
              handleAvatarSuccessAddNote(res, file) {
                let temp = this;
                console.log(temp);
                var reader = new FileReader();
                var base64 = "";
                reader.readAsDataURL(file.raw);
                reader.onload = async function (e) {
                    temp.imageBase64 = this.result;
                }
                this.imgtype = "base64";
            },
            //图片大小验证
            beforeAvatarUpload(file) {
                let types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png', 'image/svg'];
                const isImage = types.includes(file.type);
                const isLt200K = file.size / 1024<20;
                if (!isImage) {
                    this.$message.error('上传头像图片只能是 JPG ,GIF,BMP,PNG,SVG 格式!');
                }
                if (!isLt200K) {
                    this.$message.error('上传头像图片大小不能超过 20KB!');
                }
                return isImage && isLt200K;
            },
           async favorite(obj) {
                if (obj.isDel) {
                    return false;
                }
                obj.modelsId.push("scj");
                if (obj.type == "project") {
                    this.db.get("project").remove({id: obj.id}).write();
                    this.db.get("project").push(this.$JSON5.parse(this.$JSON5.stringify(obj))).write();
                } else if (obj.type == "template") {
                    this.db.get("templates").remove({id: obj.id}).write();
                    this.db.get("templates").push(this.$JSON5.parse(this.$JSON5.stringify(obj))).write();
                }
                this.db.set('version',await this.getTime()).write();
                this.getdirectory();
                this.notesBytargeId(this.db.get("models").find({id: this.directoryClickId}).value());//刷新列表页
            },
           async unfavorite(obj) {
                if (obj.isDel) {
                    return false;
                }
                //删除指定项
                obj.modelsId = obj.modelsId.filter(function (item) {
                    return item !== "scj"
                })
                if (obj.type == "project") {
                    this.db.get("project").remove({id: obj.id}).write();
                    this.db.get("project").push(this.$JSON5.parse(this.$JSON5.stringify(obj))).write();
                } else if (obj.type == "template") {
                    this.db.get("templates").remove({id: obj.id}).write();
                    this.db.get("templates").push(this.$JSON5.parse(this.$JSON5.stringify(obj))).write();
                }
                this.db.set('version', await this.getTime()).write()
                this.getdirectory();
                this.notesBytargeId(this.db.get("models").find({id: this.directoryClickId}).value());//刷新列表页
            },
            //国际化(整体配置)
            changeLang(lan) {
                if (lan === "中文") {
                    this.$i18n.locale = 'zh-CN';
                } else if (lan === "English") {
                    this.$i18n.locale = 'en-US';
                }
                this.getdirectory();
                //国际化设置菜单中 保存用户和密码下来框
                this.savePasswords = [{value: 'ask', label: this.$t('main.ask')}, {
                    value: 'off',
                    label: this.$t('main.shutDown')
                }, {value: 'automatically', label: this.$t('main.autofill')}];
                localStorage.setItem('lang', this.$i18n.locale);

            },
            //国际化（目录）
            international(name) {
                var directory = {
                    "allProjects": this.$t('main.allProjects'),
                    "favorites": this.$t('main.favorites'),
                    "password": this.$t('main.password'),
                    "template": this.$t('main.template'),
                    "unmarked": this.$t('main.unmarked'),
                    "trash": this.$t('main.trash'),
                    "weakpassword": this.$t('main.weakpassword')
                };
                for (var index in directory) {
                    if (name == index) {
                        name = directory[index];
                    }
                }
                return name;
            },
            //恢复
          async  recover() {
              //批量恢复
                if(this.checkedArray.length>0){
                     this.checkedArray.forEach(item=>{
                         if(item.type == "project")
                            this.db.get("project").find({id: item.id}).set("isDel", false).write();
                         if(item.type == "template")
                            this.db.get("templates").find({id: item.id}).set("isDel", false).write();
                        })
                         this.clearChecked();
                }else{
                //单个恢复
                if (this.projectEvent.type == "project") {
                    this.db.get("project").find({id: this.projectEvent.id}).set("isDel", false).write();
                } else if (this.projectEvent.type == "template") {
                    this.db.get("templates").find({id: this.projectEvent.id}).set("isDel", false).write();
                }
              }
                this.db.set('version',await this.getTime()).write();
                this.dialogRecover = false;
                this.getdirectory();
                this.notesBytargeId(this.db.get("models").find({id: this.directoryClickId}).value());//刷新列表页
                this.currentNote = -1;
            },
            //清空垃圾箱
            async  clearTrash() {
                let delTemplate = this.db.get("templates").filter({isDel: true}).value();
                for (var index in delTemplate) {
                    this.db.get("templates").remove({id: delTemplate[index].id}).write();
                }
                let delProject = this.db.get("project").filter({isDel: true}).value();
                for (var index in delProject) {
                    this.db.get("project").remove({id: delProject[index].id}).write();
                }
                this.db.set('version',await this.getTime()).write();
                this.dialogclearTrash = false;
                this.getdirectory();
                this.notesBytargeId(this.db.get("models").find({id: this.directoryClickId}).value());//刷新列表页
                this.projectEvent ="";
            },
            showIconMenu() {
                var uils = document.getElementsByClassName("choosepic");
                for (var i = 0; i < uils.length; i++) {
                    uils[i].style.display = "block";
                }
            },
            //打开图片选择菜单
            dialogSymbolOpen() {
                this.dialogSymbol = true;
            },
            //打开颜色选择框
            opencolor(obj) {
                if (this.operationType == "project_add") {
                    this.imageBase64 = obj.tempBase64;
                } else if (this.operationType == "project_edit") {
                    this.imageBase64 = obj.tempBase64;
                } else if (this.operationType == "template_add") {
                    //新建模板，给默认图片
                    if (this.imageBase64 == '') {
                        // this.imageBase64 = this.$refs.icon_default.src;
                        this.imageBase64=`${this.publicPath}img/misc/lock.svg`;
                    }
                } else if (this.operationType == "template_edit") {
                    this.imageBase64 = obj.tempBase64;
                } else if(this.operationType == "note_add"){
                   //新建模板，给默认图片
                    if (this.imageBase64 == '') {
                        // this.imageBase64 = this.$refs.icon_default.src;
                        this.imageBase64=`${this.publicPath}img/misc/lock.svg`;
                    }
                } else if(this.operationType == "note_edit"){
                      this.imageBase64 = obj.tempBase64;
                }

                this.dialogSymbolcolor = true;
            },
            setImageBase64(path,realpath) {
                //进行修改操作时插入图片
                if (this.operationType == "template_edit") {
                    this.editobject.tempBase64 =realpath;
                    this.dialogSymbol = false;
                    this.imgtype = "url"
                } else if (this.operationType == "template_add") {
                    //进行新建操作时插入图片
                    this.imageBase64 = realpath;
                    this.dialogSymbol = false;
                    this.imgtype = "url"
                } else if (this.operationType == "project_add") {
                    this.templateEvent.tempBase64 =realpath;
                    this.dialogSymbol = false;
                    this.imgtype = "url"
                } else if (this.operationType == "project_edit") {
                    this.editobject.tempBase64 =realpath;
                    this.dialogSymbol = false;
                    this.imgtype = "url"
                }else if(this.operationType == "note_add"){
                     //进行新建操作时插入图片
                    this.imageBase64 = realpath;
                    this.dialogSymbol = false;
                    this.imgtype = "url"
                }else if(this.operationType == "note_edit"){
                    this.editobject.tempBase64 =realpath;
                    this.dialogSymbol = false;
                    this.imgtype = "url"
                }
            },
            setcolor(color) {
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
                }else if(this.operationType == "note_add"){
                    this.color= color;
                    this.dialogSymbolcolor = false;
                }else if(this.operationType == "note_edit"){
                    this.editobject.bgcolor = color;
                    this.dialogSymbolcolor = false;
                }
            },
            //隐藏菜单
            unshow() {
                document.onclick = function (e) {
                    var e = e || window.event;
                    var uils = document.getElementsByClassName("choosepic")
                    for (var i = 0; i < uils.length; i++) {
                        if (uils[i].style.display == "block" && e.target.className!="avatar") {
                            uils[i].style.display = "none";
                        }
                    }
                    //隐藏右击菜单1
                    if (document.getElementById("menu_1").style.display == "block" && e.target != document.getElementById("menu_1")) {
                        document.getElementById("menu_1").style.display = "none";
                    }
                }
            },
            //关闭添加模板框
            cleartype() {
                this.operationType = "";
                this.imageBase64 = "";
                this.color = "";
                this.templatedisable=true
            },
            //关闭添加模板框，清空数据
            clearDataTemplate() {
                this.ruleFormAddTemplate.name = "";
                this.tempTemplate = [];
            },
            //关闭添加项目框，清空数据
            clearDataProject() {
                this.ruleFormAddProject.name = "";
                this.tempTemplate = [];
            },
            openMenu_1(project, obj) {
                if(project.type=="model") {
                    if(project.modelsType=="directory"){
                         this.isDisabled = false;//启用删除
                    }else{
                    this.isDisabled = true;
                   }
                }
                if(project.type=="project"){
                     this.isDisabled = false;//启用删除
                }
                this.delobj = project;//赋值删除对象
                if (project.type != "model") {//indexof undefind 问题
                    this.projectEvent = project;
                }
                var menu = document.getElementById("menu_1");
                var position = obj.target.getBoundingClientRect();//获取点击元素的位置
                menu.style.display = "block";
                menu.style.left = position.right + 10 + "px";
                if (document.body.clientHeight > menu.clientHeight + position.bottom) {
                    menu.style.top = position.top + position.height + 10 + "px"
                } else {
                    menu.style.top = position.top - menu.clientHeight - 10 + "px"
                }
                this.menulistchange(project);
                this.stopPropagation(obj);
            },
            //阻止冒泡
            stopPropagation(e) {
                e = e || window.event;
                if (e.stopPropagation) { //W3C阻止冒泡方法
                    e.stopPropagation();
                } else {
                    e.cancelBubble = true; //IE阻止冒泡方法
                }
            },
            //点击空白地区显示菜单
            openMenu_empty(obj) {
                this.addDirClasses = [];
                this.renameClasses =[];
                this.addProjectClasses = [];
                this.addTemplateClasses = [];
                this.emptyTrashClasses = [];
                this.addNoteClasses = [];
                this.deleteClasses = [];
                this.selectColorClasses=[];
                this.recoverClass = ["unuse"];
                var menu = document.getElementById("menu_1");
                var e = e || window.event;
                var x = e.clientX;
                var y = e.clientY;
                menu.style.display = "block";
                menu.style.left = x + "px";
                menu.style.top = y + "px"
                this.exportClasses.push("unuse")
                this.deleteClasses.push("unuse");
                this.recoverClass.push("unuse");
                this.addDirClasses.push("unuse");
                this.renameClasses.push("unuse");
                this.selectColorClasses.push("unuse");
            },
            //菜单变化
            menulistchange(obj) {
                // console.log(obj.type);
                // console.log(obj.count);
                this.addDirClasses = [];
                this.renameClasses = [];
                this.addProjectClasses = [];
                this.addTemplateClasses = [];
                this.addNoteClasses = [];
                this.emptyTrashClasses = [];
                this.deleteClasses = [];
                this.selectColorClasses=[];
                this.recoverClass = ["unuse"];
                this.exportClasses=["unuse"];
                if((obj.type==="model"&&obj.count>0)||obj.type==="project"||obj.type==="template"){
                    this.exportClasses=[];
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
                    this.renameClasses.push("unuse")
                }
                if (this.showTrash != true) {
                    this.emptyTrashClasses.push("unuse");
                }
                if (obj.isDel) {
                    this.recoverClass = [];
                    // this.deleteClasses = ["unuse"];
                }
                if (obj.type != "model") {
                    this.renameClasses.push("unuse")
                    this.addDirClasses.push("unuse");
                    this.selectColorClasses.push("unuse");
                }
                if (obj.id == "ljt" && this.showTrash == true) {
                    this.emptyTrashClasses = [];
                }
            },
            //ipfs 覆盖本地
            async ipfsToLocal() {
                let loginObj = this.$JSON5.parse(sessionStorage.getItem("userkeyObj"));
                let secret = loginObj.secret;
                let tempipfsData = await this.$myIpfs.Ipfs.read(secret,"/main", this.loginObj.address);
                tempipfsData = this.$JSON5.parse(tempipfsData)//ipfs转成对象
                tempipfsData = this.$JSON5.parse(this.$JSON5.stringify(tempipfsData));//序列化新对象
                await this.db.set("models", tempipfsData.models).write();
                await this.db.set("project", tempipfsData.project).write();
                await this.db.set("templates", tempipfsData.templates).write();
                await this.db.set('settings', tempipfsData.settings).write();
                await this.db.set('machineId', this.$Uuidv1()).write();
                await this.db.set('version', tempipfsData.version).write();
                this.dialogSynchronization = false
                //更新设置
                this.updatesetting();
                //启动锁定定时器
                this.locksystem();
                //设置语言
                this.changeLang(this.language);
            },
            //本地覆盖ipfs
            async localToIpfs() {
                let localdata = this.db.__wrapped__;
                let result = await this.$myIpfs.Ipfs.write(this.loginObj.secret, this.$JSON5.stringify(localdata), "/main");
                if(result.indexOf("success")===-1){
                    this.$message({
                        message: '同步数据失败！',
                        type: 'error'
                    });
                }else{
                    this.dialogSynchronization = false;
                }
            },
            //关闭同步窗口后关闭同步，防止页面刷新同步数据
            closeInit() {
                this.isinitialize = false;
            },
            //图片上传ipfs
            async uploadImg(value, type, id) {
                if (type == "project") {
                    let imgHash = this.$Uuidv1();
                    this.db.get("project").find({id: id}).set("imgHash", imgHash).write();
                    let img = {"id": imgHash, "value": value};
                    this.localdb.get("img").push(img).write();
                    //上传ipfs
                    let result = await this.$myIpfs.Ipfs.write(this.loginObj.secret, value, imgHash);
                } else if (type == "template") {
                    let imgHash = this.$Uuidv1();
                    this.db.get("templates").find({id: id}).set("imgHash", imgHash).write();
                    let img = {"id": imgHash, "value": value};
                    this.localdb.get("img").push(img).write();
                    //上传ipfs
                    let result = await this.$myIpfs.Ipfs.write(this.loginObj.secret, value, imgHash);
                }
            },
            //打开密码生成器
            passwordGenerator(data) {
                this.temppassword = data;
                this.dialogPasswordGenerator = true;
                this.percentage = 0;
            },
            //子组件关闭后还原dialogPasswordGenerator为false
            closedialog(data) {
                this.dialogPasswordGenerator = data;
            },
            //密码器赋值
            getPassword(data) {
                this.temppassword.val = data
                //更新进度条
                this.pwdLength(this.temppassword);

                this.dialogclose = true;
            },
            //子组件关闭后还原dialogclose值为false
            recovertag(data) {
                this.dialogclose = data;
            },

            //主密码器
            passwordGeneratorMain() {
                this.dialogPasswordGeneratorMain = true;
                this.percentage = 0;
            },
            //子组件关闭后还原dialogPasswordGenerator为false
            closedialogMain(data) {
                this.dialogPasswordGeneratorMain = data;
            },
            //子组件关闭后还原dialogPayGenerator为false
            closedialogPay(data) {
                this.dialogPayGenerator = data;
            },
            /**
             * 判断密码强度
             * @param p
             * @return {string}
             */
            cryptLevel(p) {
                let des="";
                let hasUpper = false;
                let hasLow = false;
                let hasNum = false;
                let hasOther = false;
                let out="";
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
                if(num==1){
                    num=0;
                }
                out=this.formatTime(num / (1024 * 1024 * 1024 * 2.4 * 2));
                if(out!=""){
                    des = this.$t('main.breakTime') + out;
                }
                return des;
            },
            formatTime(s) {
                var str = "";
                if(s==0)
                    return  str = ""
                s = Math.floor(s);
                if (s<1)
                    return  str = this.$t('main.moment');
                s = Math.floor(s);
                if (s >= 1) str = s % 60 + this.$t('main.seconds') + str;
                s = Math.floor(s / 60);
                if (s >= 1) str = s % 60 + this.$t('main.mintues') + str;
                s = Math.floor(s / 60);
                if (s >= 1) str = s % 24 + this.$t('main.hours') + str;
                s = Math.floor(s / 24);
                if (s >= 1) {
                    str = Math.ceil(s + this.$t('main.day')) + str;
                    if (s <= 28) {
                        str = Math.ceil(s / 7) + this.$t('main.weeks');
                    } else if (s >= 30 && s <= 360) {
                        str = Math.ceil(s / 30) + this.$t('main.month');
                    } else if (s >= 360 && s <= 36000) {
                        str = Math.ceil(s / 360) + this.$t('main.years');

                    } else {
                        str = this.$t('main.century');

                    }
                }
                return str;
            },
            /**
             * 阿里云获取国际时间
            **/
            async getTime(){
                const getPromise = util.promisify(request.get);
                let url = timecurl+"rest/api3.do?api=mtop.common.getTimestamp";
                let result = await getPromise(url);
                let timeobj=this.$JSON5.parse((result.body));
                return timeobj.data['t'];
            },


            /**
             * 获取进度条百分比
             * @param pwd
             * @return {string}
             */
            getPercentage(pwd){
                let level=this.cryptLevel(pwd);
                if (level.indexOf(this.$t('main.century')) !== -1) {
                    this.percentage = 100;
                    this.status="#13CE66"
                } else if (level.indexOf(this.$t('main.years')) !== -1) {
                    this.percentage = 80;
                    this.status="#20A0FF"
                } else if (level.indexOf(this.$t('main.month')) !== -1) {
                    this.status="#20A0FF"
                    this.percentage = 60;
                } else if (level.indexOf(this.$t('main.weeks')) !== -1) {
                    this.percentage = 40;
                    this.status="#E6A23C"
                } else if (level.indexOf(this.$t('main.day')) !== -1 ) {
                    this.percentage = 35;
                    this.status="#FF4949"
                }
                else if (level.indexOf(this.$t('main.hours')) !== -1) {
                    this.percentage = 30;
                    this.status="#FF4949"
                }
                else if (level.indexOf(this.$t('main.mintues')) !== -1) {
                    this.percentage = 15;
                    this.status="#FF4949"
                }
                else if (level.indexOf(this.$t('main.seconds') ) !== -1) {
                    this.percentage = 10;
                    this.status="#FF4949"
                }else if(level.indexOf(this.$t('main.moment')) !== -1){
                    this.percentage =5;
                    this.status="#FF4949"
                }else {
                    this.percentage =0;
                    this.level="";
                     this.status="#E5E9F2"

                }

            },
          /**
           * 文件夹颜色选择框
           * @param pwd
           * @return {string}
           */
          selectColor() {
            this.dialogDirlcolor = true;
          },

          /**
           * 设置文件夹颜色
           */
          async setcolorD(value){
             let type = this.delobj.type;
             let id = this.delobj.id;
             let directory = this.db.get("models").find({id: id}).value();
             directory.imgPath = value;
             this.db.get("models").remove({id: id}).write();
             this.db.get("models").push(this.$JSON5.parse(this.$JSON5.stringify(directory))).write();
             let now= await this.getTime();
             this.db.set('version',now ).write();
             this.getdirectory();
             this.dialogDirlcolor = false;
          },
          /**
           * 文件夹重命名
           */
          rename(){
            this.ruleFormRename.pName=this.delobj.name;
            this.dialogVisibleRename = true;

          },
          //增加文件夹
          async renameDo(formName) {
             let id = this.delobj.id;
             let directory = this.db.get("models").find({id: id}).value();
             directory.name =this.ruleFormRename.pName;
             directory
             this.db.get("models").remove({id: id}).write();
             this.db.get("models").push(this.$JSON5.parse(this.$JSON5.stringify(directory))).write();
             let now= await this.getTime();
             this.db.set('version',now).write();
             this.dialogVisibleRename = false,
             this.getdirectory();
             this.$refs[formName].resetFields();
          },
          /**
           * 文件夹重命名
           * @param formName
           */
          submitFormRename(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.renameDo(formName);
              } else {
                return false;
              }
            });
          },

         //置顶
         async toTop(){
               let id = this.delobj.id;
               let topDirectory = this.db.get("models").find({id: id}).value();
               let directorylist =this.DDirectory.directory;
               if (topDirectory.modelsType == "directory") {
                      for(let index in directorylist){
                             if(directorylist[index].id==topDirectory.id){
                                 if(directorylist[index].top!=true){
                                     //增加置顶
                                     directorylist[index].top=true;
                                     directorylist[index].index=0;
                                     this.db.get("models").remove({id: id}).write();
                                     this.db.get("models").push(this.$JSON5.parse(this.$JSON5.stringify(directorylist[index]))).write();
                                     let now= await this.getTime();
                                     this.db.set('version',now).write();
                                 }else{
                                     //取消置顶
                                     directorylist[index].top=false;
                                     directorylist[index].index="";
                                     this.db.get("models").remove({id: id}).write();
                                     this.db.get("models").push(this.$JSON5.parse(this.$JSON5.stringify(directorylist[index]))).write();
                                     let now= await this.getTime();
                                     this.db.set('version',now).write();
                                 }
                             }else if(directorylist[index].top!=false){
                                directorylist[index].index = directorylist[index].index+1;
                                this.db.get("models").remove({id:directorylist[index].id}).write();
                                this.db.get("models").push(this.$JSON5.parse(this.$JSON5.stringify(directorylist[index]))).write();
                                let now= await this.getTime();
                                this.db.set('version',now).write();
                             }
                      }
                }
                this.getDirectoryLeft();
                //重新排序后设置选中按钮位置
                directorylist=this.DDirectory.directory;
                for(let index in directorylist){
                    if(directorylist[index].id ==this.delobj.id){
                        this.currentDirectory=index;
                    }
                }
          },
        //排序
          sort(){
            //   var regExpAZ  = new RegExp("[A-Za-z]+");
            //   var regExpZH = new RegExp("[\u4E00-\u9FA5]+");
            //   var regExp09 = new RegExp("[0-9]+");
             //文件夹排序
              let data =this.DDirectory.directory;
              let topArray =[];
              let indexArray =[];
              for(let index in data){
                  if(data[index].top!=false){
                      topArray.push(data[index]);
                  }else{
                      indexArray.push(data[index])
                  }
              }
              topArray.sort((a, b) => a.index - b.index); //a~z 排序
              indexArray.sort((a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0)); //a~z 排序
              topArray.push(...indexArray); //a.push(...b);
              this.DDirectory.directory=topArray;

              //项目排序
              let project =this.projects;
              console.log(project);
              project.sort((a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0)); //a~z 排序
              this.projects=project;
          },
           // 增加笔记页面打开
           addNote() {
                this.selectlabels = [];
                this.dialogVisibleAddNote = true;
                this.operationType = "note_add";
            },
            // 保存笔记
           async saveNote() {
               if(!this.network){
                   this.$message.error(this.$t('login.outline'));
                   return false;
               }else {
                   this.setlabels(this.selectlabels,null);
                   let projectName = this.ruleFormAddNote.name;
                   let newProject = ""
                   let imgtype = ""
                   //图片
                   if (this.imageBase64 == '') {
                    //默认图片
                    this.imageBase64=`${this.publicPath}img/misc/lock.svg`;
                    this.imgtype = "url";
                   }
                    if (this.imgtype == "url") {
                        this.imgHash = "";
                        this.imgurl = this.imageBase64;
                    } else if (this.imgtype == "base64") {
                        this.imgurl = ""
                    }

                   this.newProject = {
                       "id": this.$Uuidv1(),
                       "name": projectName,
                       "modelsId": this.selectlabels, // "modelsName":newArray.toString(),
                       "isDel": false,
                       "type": "project",
                       "datas": [],
                       "dateTime": await this.getTime(),
                       "tempBase64": "",
                       "imgHash": this.imgHash,
                       "imgtype":this.imgtype,
                       "imgurl": this.imgurl,
                       "bgcolor":this.color,
                       "isnote":true,//笔记类型
                       "hasnote":true,//是否有笔
                       "note":[{"notes":this.ruleFormAddNote.notes}],
                       "checked":false
                   };
                   //db project 追加数据
                   this.db.get("project").push(this.$JSON5.parse(this.$JSON5.stringify(this.newProject))).write();
                   this.db.set('version', await this.getTime(),).write();
                   this.selectlabels = "";
                   this.dialogVisibleAddNote = false;
                   this.ruleFormAddNote.name = "";
                   this.color = "";
                   this.ruleFormAddNote.notes="";
                   this.getdirectory();
                  this.notesBytargeId(this.db.get("models").find({id: "sy"}).value());//刷新列表页
                   if (this.imgtype == "base64") {
                       console.log(this.imageBase64);
                       this.uploadImg(this.imageBase64, this.newProject.type, this.newProject.id);
                   }
                   //二次刷新
                   this.getdirectory();
                //    this.notesBytargeId(this.db.get("models").find({id: "sy"}).value());//刷新列表页
                   this.afterChecked(this.newProject.id,this.newProject.type);
                   this.imageBase64 = "";
                   this.newProject = "";
               }
            },

             async  editNote() {
              if(!this.network){
                  this.$message.error(this.$t('login.outline'));
                  return false;
              }else{
                   this.setlabels(this.selectlabels,null);
                var img = this.$JSON5.parse(this.$JSON5.stringify(this.editobject.tempBase64));
                if (this.imgtype == "url") {
                    this.imgHash = "";
                    this.editobject.imgtype = "url";
                    this.editobject.imgurl = this.editobject.tempBase64;
                } else if (this.imgtype == "base64") {
                    this.editobject.imgurl = ""
                    this.editobject.tempBase64 = "";//先删除tempBase64
                    this.editobject.imgtype = "base64";
                }
                try {
                    this.editobject.checked=false;
                    this.db.get("project").remove({id: this.editobject.id}).write();
                    this.editobject.modelsId = this.selectlabels;
                    this.editobject.note[0].notes=this.ruleFormNoteEdit.notes;
                    this.db.get("project").push(this.$JSON5.parse(this.$JSON5.stringify(this.editobject))).write();
                    this.db.set('version', await this.getTime()).write();
                    this.dialogVisibleNoteEdit = false
                    this.$message.success(this.$t('main.successfullyModified'));
                    this.editobject.tempBase64 = img;
                    this.projectEvent = this.editobject;
                    this.selectlabels = "";
                    this.getdirectory();
                    this.color = "";
                    if (this.imgtype == "base64") {
                        if (this.editobject.imgHash != "") {//判断原来对象与新对象中的imgbase64 是否相同，不同的话，重新上传数据
                            let imgBase64 = this.localdb.get("img").find({id: this.editobject.imgHash}).value();
                            if (imgBase64 == undefined || imgBase64.value != this.editobject.tempBase64) {
                                this.uploadImg(this.editobject.tempBase64, this.editobject.type, this.editobject.id);
                            }
                        } else {
                            this.uploadImg(this.editobject.tempBase64, this.editobject.type, this.editobject.id);
                        }
                    }
                    //二次刷新
                    this.getdirectory();
                    this.afterEditchecked(this.editobject.id);
                    this.editobject = "";
                } catch (e) {
                    this.$message.error(this.$t('main.failToEdit'));
                }
              }
            },

            //清除选中
            clearChecked(){
                  let project =this.db.get("project").value();
                  let template =this.db.get("templates").value();
                  project.forEach(item=>{
                      item.checked=false;
                  });

                  template.forEach(item=>{
                      item.checked=false;
                  });

                  this.checkedArray.forEach(item=>{
                      item.checked=false;
                  });
                this.checkedArray=[];
            },

             // 复制成功
				onCopy(e){
				    this.$message.success("内容已复制到剪切板！")
				},
			// 复制失败
				onError(e){
				    this.$message.error("抱歉，复制失败！")
                },

             //关闭添加模板框，清空数据
            clearDataNote() {
                this.ruleFormAddNote.name = "";
                this.tempTemplate = [];
                this.ruleFormAddNote.notes="";
            },

           setlabels(labels,data){
               this.isWeakPwd=false; //重置默认状态
               let hasLabels=false; //判断分类中是否存在自定义labels分组
               //判断是否为弱密码
               if(data!=null){//笔记类型，data = null
                for (let index in data){
                     if(data[index].type=="password" && data[index].val!=""){
                        if(data[index].percentage<35){
                            this.isWeakPwd=true;
                            break;
                        }else{
                            this.isWeakPwd=false
                        }
                    }else if(data[index].type=="password" && data[index].val==""){
                            this.isWeakPwd=false
                    }
                }
              }

                //所有项必须有
                if (labels.indexOf("sy") == -1) {
                      labels.push("sy");//所有项必须有
                    }
                //判断是否增加弱密码
                if(this.isWeakPwd && labels.indexOf("weakPwd")==-1){
                      labels.push("weakPwd");//所有项必须有
                }

                //判断是否减去弱密码
                 if(!this.isWeakPwd && labels.indexOf("weakPwd")!=-1){
                       labels = labels.filter(function (item) {
                           return item != "weakPwd"
                       })
                }

              //判断labels 中是否有自定义label分类
                    let dirlist =  this.DDirectory.directory
                    for(let index in dirlist){
                          if(labels.indexOf(dirlist[index].id)!=-1){
                            hasLabels=true;
                            break;
                        }
                    }

                 //判断是否增加wbj 分类
                if(labels.indexOf("mm")==-1 && labels.indexOf("wbj")==-1 && !hasLabels){
                      labels.push("wbj");
                }

                //判断是否删除wbj 分类
                // if(labels.indexOf("mm")>0 || labels.indexOf("mb")!=-1 ||hasLabels){
                  if(labels.indexOf("mm")!=-1||hasLabels){
                     if(labels.indexOf("wbj")!=-1){
                          labels = labels.filter(function (item) {
                           return item !== "wbj"
                       })
                     }
                }
                this.selectlabels = labels;
           },

            changeLockFlag(flag){
              if(flag){
                window.ipcRenderer.send("enableLock")//启用锁定快捷键
              }else{
                  window.ipcRenderer.send("disableLock")//禁用锁定快捷键
              }
            },
            changeAutoStartFlag(flag){
              window.ipcRenderer.send("setLoginItemSettings",flag);//是否启用开机自启
            },

             //单独刷新左侧菜单
            getDirectoryLeft() {
                let loginObj = this.$JSON5.parse(sessionStorage.getItem("userkeyObj"));
                let secret = loginObj.secret;
                var alldata = this.db.get("models").value();// 获取所有分类
                var allProjects = this.db.get("project").value();
                var projectstring = ""
                var directoryString = ""
                var specialString =""
                var jsonSpecicalString=""
                var jsonProjectstring = ""
                var jsonDirectoryString = ""
                //设置每一项数量
                for (var modelkey in alldata) {
                    var count = 0
                    if (alldata[modelkey].id != "mb" && alldata[modelkey].id != "ljt") {
                        for (var projectkey in allProjects) {
                            var project = allProjects[projectkey];
                            var types = project.modelsId;
                            if (types.indexOf(alldata[modelkey].id) != -1 && project.isDel != true) {
                                count++;
                            }
                        }
                    } else if (alldata[modelkey].id == "mb") {
                        count = this.db.get("templates").filter({isDel: false}).size().value();
                    } else if (alldata[modelkey].id == "ljt") {
                        count = this.db.get("templates").filter({isDel: true}).size().value() + this.db.get("project").filter({isDel: true}).size().value();
                        if (count > 0) {
                            this.showTrash = true;//是否显示清空垃圾桶图标
                        } else {
                            this.showTrash = false;//是否显示清空垃圾桶图标
                        }
                    }
                    alldata[modelkey].count = count;
                }
                //分组
                for (var key in alldata) {
                    var object = alldata[key];
                    if (object.modelsType == "project") {
                        if(object.id=="sy" || object.id=="scj"){
                             projectstring = projectstring + this.$JSON5.stringify(object) + ",";
                        } else{
                             specialString = specialString + this.$JSON5.stringify(object) + ",";
                        }
                    }
                    if (object.modelsType == "directory") {
                        directoryString = directoryString + this.$JSON5.stringify(object) + ",";
                    }
                }
                projectstring = projectstring.substring(0, projectstring.length - 1);
                jsonProjectstring = "{project:[" + projectstring + "]}";
                directoryString = directoryString.substring(0, directoryString.length - 1);
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
                this.DProject = {project: jsonProjects};
                //special 国际化
                var jsonSpecial = this.$JSON5.parse(jsonSpecicalString).special;
                 for (var obj in jsonSpecial) {
                    jsonSpecial[obj].name = this.international(jsonSpecial[obj].name);
                }
                this.DSpecial = {special:jsonSpecial};
                 //更新排序
                 this.sort();
                },

                //创建后checked 问题
                afterChecked(objId,objType){
                    let listproject ="";
                   //增加项目，笔记
                   if(objType=="project"){
                         this.directoryClickId="sy";
                         this.notesBytargeId(this.db.get("models").find({id: "sy"}).value());//刷新列表页}
                         listproject =this.projects;
                         this.currentProject=0;//目录check 指向sy
                         this.currentSpecial=-1;
                         this.currentDirectory=-1;
                         for(let index in listproject){
                             if(listproject[index].id == objId){
                                 this.projectEvent = listproject[index];
                                 this.currentNote = index;//项目列表指向当前
                                  break;
                             }
                         }
                   }
                   if(objType=="template"){
                       let specialList=this.DSpecial.special;
                       console.log(specialList);
                       this.directoryClickId="mb";
                       this.notesBytargeId(this.db.get("models").find({id: "mb"}).value());//刷新列表页
                       listproject =this.projects;
                       console.log(listproject);
                       this.currentProject=-1;
                       this.currentDirectory=-1;
                       for(let index in listproject){
                             if(listproject[index].id == objId){
                                 this.projectEvent = listproject[index];
                                 this.currentNote = index;//项目列表指向当前添加项
                                 break;
                             }
                         }
                         for(let index in specialList){
                             if(specialList[index].id == "mb"){
                                 this.currentSpecial =index;//目录指向模板
                                 break;
                             }
                         }
                   }
                },

                afterEditchecked(objId){
                       let listproject ="";
                       listproject =this.projects;
                        for(let index in listproject){
                             if(listproject[index].id == objId){
                                 this.currentNote = index;//项目列表指向当前
                                  break;
                             }
                         }
                       this.notesBytargeId(this.db.get("models").find({id: this.directoryClickId}).value());//刷新列表页
                   },

                //设置重构
                settingDialog(){

                }


        },


        watch: {
            'ruleFormAddTemplate.name': function(){
                if(this.ruleFormAddTemplate.name){
                    this.ruleFormAddTemplate.name=this.ruleFormAddTemplate.name.replace(/^\s+|\s+$/g,'');
                    if(this.ruleFormAddTemplate.name.trim().length>0){
                        this.templatedisable=false
                    }else{
                        this.templatedisable=true
                    }
                }else{
                    this.templatedisable=true
                }
            },

            'editobject.name': function(){
                if(this.editobject.name){
                    this.editobject.name= this.editobject.name.replace(/^\s+|\s+$/g,'');
                    let name=this.editobject.name;
                    if(name.trim().length>0){
                        this.templatedisable=false
                    }else{
                        this.templatedisable=true
                    }
                }else{
                    this.templatedisable=true
                }
            },

            'ruleFormAddProject.name':function(){
                if(this.ruleFormAddProject.name){
                    this.ruleFormAddProject.name=this.ruleFormAddProject.name.replace(/^\s+|\s+$/g,'');
                    if( this.ruleFormAddProject.name.trim().length>0){
                        this.templatedisable=false
                    }else{
                        this.templatedisable=true
                    }
                }else{
                    this.templatedisable=true
                }
            },
             'ruleFormAddNote.name':function(){
                if(this.ruleFormAddNote.name){
                    this.ruleFormAddNote.name=this.ruleFormAddNote.name.replace(/^\s+|\s+$/g,'');
                    if( this.ruleFormAddNote.name.trim().length>0){
                        this.templatedisable=false
                    }else{
                        this.templatedisable=true
                    }
                }else{
                    this.templatedisable=true
                }
            },
            }
    }
</script>
<style lang="less"  scoped>
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

    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        line-height: 200px;
    }

    .el-main {
        background-color: #E9EEF3;
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

    .input-class{
        width: 25vw;
    }
    .input-class-template-edit{
       width: 21vw;
    }

    .input-class-template{
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
    .messageInput{
        width:100%;
        float:left;

    }


</style>
