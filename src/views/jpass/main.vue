<template>
    <body class="sy" @mousemove="GetXYPosition">
    <!-- 头部 -->
    <header class="header">
        <!-- 全局隐藏域 -->
        <img src="./img/misc/lock.svg" ref="icon_default" style="display: none"/>
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
                <el-button @click="addTemplate" style="border:0;padding: 5px 5px;"
                ><img
                        style="top:-2px;height: 20px;width: 20px;"
                        src="./img/moban.svg"
                        alt=""
                />{{ $t("main.newTemplate") }}
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
                <el-progress
                        :percentage="percentage"
                        :stroke-width="4"
                        :color="customColor"
                        :status="synStatus"
                        :show-text="true"
                        v-show="processShow"
                ></el-progress>
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
            <!-- <li>
                <el-button
                        style="border:0;padding: 5px 5px;"
                        @click="openpay()"
                ><img
                        style="top:-2px;height: 25px;width: 25px;"
                        src="./img/ICON-SCQ.svg"
                        alt=""
                />充值
                </el-button>
            </li> -->
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
                >
            <span
            >{{ project.name }} <i>{{ project.count }}</i></span
            >
                </li>
            </ul>
            <h3>{{ $t("main.folder") }}</h3>
            <ul class="dhwjj" id="DirUL">
                <li
                        v-for="(project, index) in DDirectory.directory"
                        @click.left="directoryclick(project, $event)"
                        :data-index="index"
                        :class="index == currentDirectory ? click : disclick"
                        @contextmenu.prevent="openMenu_1(project, $event)"
                >
            <span :title="project.name"
            >{{
                project.name.length > 10
                  ? project.name.substring(0, 10) + "..."
                  : project.name
              }}<i>{{ project.count }}</i></span
            >
                </li>
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
            <li ref="addTemp" :class="addTemplateClasses" @click="addTemplate">
                <img src="./img/moban.svg" alt=""/>
                {{ $t("main.newTemplate") }}
            </li>
            <li ref="addPro" :class="addProjectClasses" @click="selectTemplate">
                <img src="./img/tianjiaxiangmu.svg" alt=""/>
                {{ $t("main.newProject") }}
            </li>
            <li ref="delete" :class="deleteClasses" @click="remove">
                <img style="margin-right: 0.6vw" src="./img/ICON-SC.svg" alt=""/>
                {{ $t("main.delete") }}
            </li>
            <li ref="recover" :class="recoverClass" @click="dialogRecover = true">
                <img src="./img/recover.png" alt=""/>{{ $t("main.recover") }}
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
                        :class="index == currentNote ? click : disclick"
                        style="margin-top: 5px;"
                        @contextmenu.prevent="openMenu_1(project, $event)"
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
                      v-if="project.modelsId.indexOf('scj') == -1"
                      src="./img/start.svg"
                      @click="favorite(project)"
              />
              <img
                      v-if="project.modelsId.indexOf('scj') != -1"
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
                                    :status="data.pwdstatus"
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
                                    :status="data.pwdstatus"
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
                            style="margin-bottom:3px;"
                    >
                        <input type="text" v-model="data.val" readonly/>
                        <hr/>
                    </el-form-item>
                     <el-form-item
                            v-else-if="data.type === 'webside'"
                            :label="data.tempkey"
                            :prop="data.tempkey"
                            style="margin-bottom:3px;"
                    >
                        <input type="text" v-model="data.val" readonly/>
                        <hr/>
                    </el-form-item>
                     <el-form-item
                            v-else-if="data.type === 'login'"
                            :label="data.tempkey"
                            :prop="data.tempkey"
                            style="margin-bottom:3px;"
                    >
                        <input type="text" v-model="data.val" readonly/>
                        <hr/>
                    </el-form-item>
                    <el-form-item
                            v-else-if="data.type === 'date'"
                            :label="data.tempkey"
                            :prop="data.tempkey"
                            style="margin-bottom:3px;"
                    >
                        <input type="text" v-model="data.val" readonly/>
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
        >
            <el-form label-width="9vw" class="demo-ruleForm" style="width:80%;">
                <el-form-item :label="$t('main.loginPassword')" >
                    <el-input
                            type="password"
                            v-model="password"
                            style="width:90%;"
                            @keyup.enter.native="unlock()"
                    ></el-input>
                </el-form-item>
                <el-form-item
                        label=""
                        prop=""
                        style="margin-bottom: 7%;margin-top: 10%"
                >
                    <el-button
                            type="primary"
                            size="small"
                            @click="unlock()"
                    >
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
            >
                <!--<el-form-item label="类型选择" prop="modelsType">-->
                <!--<el-radio v-model="ruleForm.modelsType" label="project" style="float:left;line-height: inherit">目录</el-radio>-->
                <!--<el-radio v-model="ruleForm.modelsType" label="directory" style="float:left;line-height: inherit">文件夹</el-radio>-->
                <!--</el-form-item>-->
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
        <!--删除文件夹弹出框-->
        <el-dialog
                :title="$t('main.prompt')"
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
                :title="$t('main.prompt')"
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
        <!--清空垃圾箱弹出框-->
        <el-dialog
                :title="$t('main.prompt')"
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
                :title="$t('main.prompt')"
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
                <span style="height:7vh;width:4vw;" @click.right="showIconMenu()">
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
                                                :status="data.pwdstatus"
                                        ></el-progress>
                                        <span class="format">{{data.format}}</span>
                                    </div>

                                </el-form-item>
                                <el-form-item
                                        v-else-if="data.type === 'password' && showPassword"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
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
                                                :status="data.pwdstatus"
                                        ></el-progress>
                                        <span class="format">{{data.format}}</span>
                                    </div>

                                </el-form-item>
                                <el-form-item
                                        v-else-if="data.type === 'text'"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
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
                                        v-else-if="data.type === 'webside'"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
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
                                                v-for="(item, index) in this.templateItemsTemp
                          .templateItems"
                                                :command="item"
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
                <span style="height:7vh;width:4vw;" @click.right="showIconMenu()">
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
                                                :status="data.pwdstatus"
                                                :show-text="false"
                                        ></el-progress>
                                        <span class="format">{{data.format}}</span>
                                    </div>

                                </el-form-item>
                                <el-form-item
                                        v-if="data.type === 'password' && showPassword"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
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
                                                :status="data.pwdstatus"
                                                :show-text="false"
                                        ></el-progress>
                                        <span class="format">{{data.format}}</span>
                                    </div>
                                </el-form-item>
                                <el-form-item
                                        v-else-if="data.type === 'text'"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
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
                                        v-else-if="data.type === 'webside'"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
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
                                                v-for="(item, index) in this.templateItemsTemp
                          .templateItems"
                                                :command="item"
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
                <span style="height:7vh;width:4vw;" @click.right="showIconMenu()">
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
                                    <a href="#"><i class="el-icon-close" @click="addTemplageRemoveItem(data.id)"> </i></a>
                                    <div style="width:21vw;display: inline-block;">
                                        <el-progress
                                                id="process"
                                                :show-text="false"
                                                :stroke-width="5"
                                                :percentage="data.percentage"
                                                :status="data.pwdstatus"
                                        ></el-progress>
                                        <span class="format">{{data.format}}</span>
                                    </div>
                                </el-form-item>
                                <el-form-item
                                        v-else-if="data.type === 'text'"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
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
                                        v-else-if="data.type === 'webside'"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
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
                                        style="width: 90%;margin-bottom:0;"
                                >
                                    <el-date-picker v-model="data.val" class="input-class-template" value-format="yyyy-MM-dd"  type="date" placeholder="选择日期" size="large" ></el-date-picker>
                                    <!-- <input
                                            type="text"
                                            v-model="data.val"
                                            style="width:90%;float: left"
                                            class="myInput"
                                    /> -->
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
                                                v-for="(item, index) in this.templateItems
                          .templateItems"
                                                :command="item"
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
                <span style="height:7vh;width:4vw;" @click.right="showIconMenu()">
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
                                                :status="data.pwdstatus"
                                        ></el-progress>
                                        <span class="format">{{data.format}}</span>
                                    </div>
                                </el-form-item>
                                <el-form-item
                                        v-else-if="data.type === 'text'"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
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
                                        v-else-if="data.type === 'webside'"
                                        :label="data.tempkey"
                                        :prop="data.tempkey"
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
                                                v-for="(item, index) in this.templateItems
                          .templateItems"
                                                :command="item"
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
                            <el-slider v-model="locktime" :disabled="locktimedisabled"></el-slider>
                        </span>
                    </fieldset>
                </el-form-item>
                <el-form-item prop="">
                    <fieldset style="width: 80%;margin: auto;height: 15vh;border: 1px solid #6C6C6C">
                        <legend style="margin-left: 1%">
                            {{ $t("main.language") }}
                        </legend>
                        <span style="margin-left: 2vw">
                            <el-select v-model="language" :placeholder="$t('main.languageSelection')"
                                       @change="">
                                <el-option v-for="item in this.languages" :key="item.value" :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                        </span>
                    </fieldset>
                </el-form-item>
                <el-form-item prop="">
                    <fieldset style="width: 80%;height: 19vh;margin: auto;border: 1px solid #6C6C6C">
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
        ></passwordGeneratorMain>


        <!--支付-->
        <pay :dialogopen="dialogPayGenerator"
             @dialogPayGeneratorclose="closedialogPay">
        </pay>
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

    </aside>
    </body>
</template>
<script type="es6">
    import low from 'lowdb';
    import LocalStorage from 'lowdb/adapters/LocalStorage';
    import password from '../../password.js';
    import ipfs from '@/jcc_ipfs.js'

    const util = require('util');

    let request = require("request");

    export default {
        mounted: function () {
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
        },
        data() {
            return {
                publicPath: process.env.BASE_URL,
                status:"",
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
                // showpassword: "",
                locktimedisabled: "",
                showpass: "", //弹出框
                ImageBase64: "",
                color: "#999999",
                dialogSymbolcolor: false,//图片库颜色
                dialogSymbol: false,//图片库
                // dialogVisiblePasswordGenerator: false,// 密码生成器弹出框
                dialogVisible: false,//密码锁定弹出框
                dialogVisible2: false,//增加文件夹弹出框
                dialogVisibledDirectory: false,//删除文件夹弹出框
                dialogVisibledProject: false,//删除项目弹出框
                dialogVisibledTemplate: false, //删除模板弹框
                dialogVisibleTemplate: false,//模板弹出框
                dialogVisibleAddProject: false, //增加项目弹出框
                dialogVisibleItems: false,//增加Items 弹出框
                dialogVisibleEdit: false, //修改项目弹出框
                dialogVisibleSetting: false,//设置弹出框
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
                currentDirectory: -1,
                currentNote: -1,
                currentTemplate: -1,
                DProject: '',
                DDirectory: '',
                click: 'click',
                disclick: 'disclick',
                delobj: '',
                isDisabled: true,
                customColor: "",
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
                addDirClasses: [],//新建文件夹样式表
                addProjectClasses: [],//新建项目样式表
                addTemplateClasses: [],//新建模板样式表
                emptyTrashClasses: [],//清空垃圾样式表
                deleteClasses: [],//删除样式表
                recoverClass: [],//恢复样式表
                // tempipfsData: "", //ipfs 数据
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
                    "bgcolor": ""
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
                    "bgcolor": ""
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
                        "imgurl":this.publicPath+"img/misc/lock.svg",
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
                            "type": "text",
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
                        "imgurl": this.publicPath+"img/misc/lock.svg",
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
                            "type": "text",
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
                        "imgurl": this.publicPath+"img/misc/lock.svg",
                        "datas": [{
                            "id": "fdbce150-fec4-20e9-bd32-854c67bf088b",
                            "key": "Website",
                            "type": "text",
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
                        "type": "webside",
                        "val": "",
                        "tempkey": "Webside"
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
                rules: {
                    modelsType: [{required: true, message: this.$t('main.pleaseChooseTheType'), trigger: 'blur'}],
                    pName: [{required: true, message: this.$t('main.pleaseEnterAName'), trigger: 'blur'},
                        {
                            min: 1,
                            max: 10,
                            message: this.$t('main.theLengthIsBetween1And10Characters'),
                            trigger: 'blur'
                        }],
                    filedName: [{required: true, message: this.$t('main.pleaseEnterAName'), trigger: 'blur'}],

                },
            };
        },
        methods: {
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
                console.log(e);
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
                    // console.log(this.currentSecond);
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
                console.log(msg)
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
                var alldata = this.db.get("models").value();
                var allProjects = this.db.get("project").value();
                // console.log(alldata);
                // console.log(allProjects);
                var projectstring = ""
                var directoryString = ""
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
                            this.showTrash = true;
                        } else {
                            this.showTrash = false;
                        }
                    }
                    alldata[modelkey].count = count;
                    console.log("contname:"+alldata[modelkey].name+alldata[modelkey].count);
                }
                //分组
                for (var key in alldata) {
                    var object = alldata[key];
                    if (object.modelsType == "project") {
                        projectstring = projectstring + this.$JSON5.stringify(object) + ",";
                    }
                    if (object.modelsType == "directory") {
                        directoryString = directoryString + this.$JSON5.stringify(object) + ",";
                    }
                    if (object.id != "sy" && object.id != "wbj" && object.id != "mb" && object.id != "ljt") {
                        labelsString = labelsString + this.$JSON5.stringify(object) + ",";
                    }
                }
                projectstring = projectstring.substring(0, projectstring.length - 1);
                jsonProjectstring = "{project:[" + projectstring + "]}";
                directoryString = directoryString.substring(0, directoryString.length - 1);
                jsonDirectoryString = "{directory:[" + directoryString + "]}";
                labelsString = labelsString.substring(0, labelsString.length - 1);
                jsonLabelsString = "{labels:[" + labelsString + "]}";
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
                                console.log("从ipfs 取数据！");
                                //取ipfs值
                                let result = await this.$myIpfs.Ipfs.read(secret, projectArray[index].imgHash, this.loginObj.address);
                                projectArray[index].tempBase64 = result;
                                //缓存到本地localdb库
                                img = {"id": projectArray[index].imgHash, "value": result};
                                // console.log(this.localdb.get("img").value());
                                this.localdb.get("img").push(img).write();
                            }
                        } else {
                            projectArray[index].tempBase64 = "";
                        }
                    }
                }
                this.projects = projectArray;
            },
            addDirectoryOP() {
                this.dialogVisible2 = true;
            }, //提交添加目录
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addDirectory(formName);
                    } else {
                        console.log(this.$t('main.theInputIsIncorrectPleaseConfirmItAndSubmitItAgain'));
                        return false;
                    }
                });
                //this.addDirectory(formName);
            }, cancel(formName) {
                this.$refs[formName].resetFields();
                this.dialogVisible2 = false;
            }, //增加文件夹
            addDirectory(formName) {
                let id = this.$Uuidv1();
                let name = this.ruleForm.pName;
                let newModel = '{"id":"' + id + '" ,"name" :"' + name + '","modelsType":"directory","imgPaht":"","type":"model","isDel":false,}';
                this.db.get("models").push(this.$JSON5.parse(newModel)).write();
                this.db.set('version', new Date().valueOf()).write();
                this.dialogVisible2 = false, this.getdirectory();
                this.$refs[formName].resetFields();
            },
            projectclick(note, event) {
                var target = event.currentTarget;
                var index = Number(target.getAttribute("data-index"));
                this.currentProject = index;
                this.currentDirectory = -1;
                this.isDisabled = true;
                this.delobj = note;
                this.directoryClickId = note.id;
                this.notesBytargeId(note);
                this.searchTemp = "";//清空搜索框
            },
            directoryclick(note, event) {
                var target = event.currentTarget;
                var index = Number(target.getAttribute("data-index"));
                this.currentDirectory = index;
                this.currentProject = -1;
                this.delobj = note;
                this.isDisabled = false;
                this.directoryClickId = note.id;
                this.searchTemp = "";//清空搜索框
                this.notesBytargeId(note);
            }, noteslick(project, event) {
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
                console.log(project);
                var target = event.currentTarget;
                var index = Number(target.getAttribute("data-index"));
                this.currentNote = index;
                this.delobj = project;
                if (this.delobj.isDel != true) {
                    this.isDisabled = false;
                }
                this.projectEvent = project;
            }, remove() {
                var type = this.delobj.type;
                var id = this.delobj.id;
                if (type == "model") {
                    this.dialogVisibledDirectory = true;
                } else if (type == "project") {
                    this.dialogVisibledProject = true;
                } else if (type == "template") {
                    this.dialogVisibledTemplate = true;
                }
            }, //删除数据
            removeData() {
                var type = this.delobj.type;
                var id = this.delobj.id;
                if (type == "model") {
                    var projects = this.db.get("project").value();
                    this.db.get("models").remove({id: id}).write();
                    this.db.set('version', new Date().valueOf()).write();
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
                            }
                        }
                        //更新project中的类别
                        this.db.get('project').find({id: projects[project].id}).assign({modelsId: this.selectlabels}).write();
                        this.selectlabels = "";
                    }
                    //更新template中的类别
                    var templates = this.db.get("templates").value();
                    if (templates.length > 0) {
                        for (var template in templates) {
                            var index = templates[template].modelsId.indexOf(id);
                            if (index > -1) {
                                templates[template].modelsId.splice(index, 1);
                            }
                            this.db.get('templates').find({id: templates[template].id}).assign({modelsId: templates[template].modelsId}).write();
                        }
                    }
                    this.isDisabled = true;
                    this.dialogVisibledDirectory = false;
                    this.getdirectory();
                } else if (type == "project") {
                    var projects = this.db.get("project").value();
                    this.db.get("project").find({id: this.delobj.id}).set('isDel', true).write();
                    this.db.set('version', new Date().valueOf()).write();
                    this.currentNote = -1;
                    this.isDisabled = true;
                    this.dialogVisibledProject = false;
                    this.projectEvent = "";
                    this.getdirectory();
                    this.notesBytargeId(this.db.get("models").find({id: this.directoryClickId}).value());//刷新列表页
                } else if (type == "template") {
                    // this.db.get("templates").remove({id: id}).write();
                    //this.delobj.isDel = true;
                    this.db.get("templates").find({id: this.delobj.id}).set('isDel', true).write();
                    this.db.set('version', new Date().valueOf()).write();
                    //更新template 在project中显示
                    this.projects = this.db.get("templates").value();
                    this.dialogVisibledTemplate = false;
                    this.projectEvent = "";
                    this.isDisabled = true;
                    this.getdirectory();
                    this.notesBytargeId(this.db.get("models").find({id: "mb"}).value());
                    this.currentNote = -1;
                }
            }, //点击目录生成projects列表
            async notesBytargeId(obj) {
                let loginObj = this.$JSON5.parse(sessionStorage.getItem("userkeyObj"));
                let secret = loginObj.secret;
                let id = obj.id;
                let projectArray = new Array();
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
                                    console.log("从ipfs 取数据！");
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
                                    console.log("从ipfs 取数据！");
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
                                    console.log("从ipfs 取数据！");
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
                this.projects = projectArray;
            },
            //启动加载
            async initialize() {
                console.log("初始化....");
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
                console.log("本地机器码:" + this.db.get("machineId").value());
                console.log("ipfs机器码:" + ipfsData.machineId);
                if (this.db.get("machineId").value() == undefined) {  //判断machineId是否undefind
                    if (ipfsData.machineId == "" || ipfsData.machineId == undefined) {
                        console.log("初始化");
                        //初始化新数据
                        var newversion = new Date().valueOf();
                        let profiles = {
                            name: loginObj.name, address: address,
                        }
                        var newdata = this.$JSON5.parse('{"profiles":"' + this.$JSON5.stringify(profiles) + '","project":[],"models":[{"id":"sy","name":"allProjects","modelsType":"project","type":"model"}, {"id":"scj","name":"favorites","modelsType":"project","type":"model"}, {"id":"mm","name":"password","modelsType":"project","type":"model"}, {"id":"mb","name":"template","modelsType":"project","type":"model"}, {"id":"wbj","name":"unmarked","modelsType":"project","type":"model"},{"id":"ljt","name":"trash","modelsType":"project","type":"model"}, {"id":"06","name":"测试","modelsType":"directory","type":"model"}, ]}');
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
                        console.log("本地为空，取ipfs 数据同步到本地");
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
                    console.log("本地有数据，ipfs 没有数据,系统默认不同步数据");
                    this.getdirectory();
                }else if(ipfsData.machineId != "" && ipfsData.machineId !=undefined){
                    if(this.db.get("machineId").value() == ipfsData.machineId){
                        this.getdirectory();
                        console.log("机器码相同,不执行任何操作！");
                    }else if(ipfsData.version >this.db.get("version").value()){
                        console.log("本地与ipfs 机器码不同,弹出提示框让用户选择!");
                        this.getdirectory();
                        this.dialogSynchronization = true;
                    }else {
                        console.log("本地与ipfs 机器码不同,但其版本号相同，加载列表！");
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
                var loginObj = this.$JSON5.parse(sessionStorage.getItem("userkeyObj"));
                var address = this.loginObj.address;
                let userSecret = this.loginObj.secret;
                //读取IPFS中数据
                let tempipfsData = await this.$myIpfs.Ipfs.read(userSecret, "/main", address);
                tempipfsData = this.$JSON5.parse(tempipfsData)//ipfs转成对象
                tempipfsData = this.$JSON5.parse(this.$JSON5.stringify(tempipfsData));//序列化新对象
                console.log(tempipfsData);
                console.log("本机版本：" + this.db.get("version").value());
                console.log("ipfs版本：" + tempipfsData.version);
                if(tempipfsData.machineId !=undefined){
                    if (tempipfsData.version > this.db.get("version").value()) {//version越大内容越新
                        console.log("ipfs版本大于本地版本");
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
                        console.log("ipfs版本小于本地版本");
                        let localdata = this.db.__wrapped__;
                        let result = await this.$myIpfs.Ipfs.write(this.loginObj.secret, this.$JSON5.stringify(localdata), "/main");
                        if(result.indexOf("success")>0){
                            console.log("数据同步成功！");
                            this.$message({
                                message:this.$t("main.synchronizationSuccessful"),
                                type: 'success'
                            });
                        }else if(result.indexOf("lackoil")>0){
                            console.log("未充值");
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
                        console.log("本地数据与ipfs 数据相同，无需同步");
                        this.$message({
                            message:this.$t("main.withoutSynchronization"),
                            type: 'success'
                        });
                    }
                }  else{
                    console.log("ipfs无数据,本地数据同步到ipfs端");
                    let localdata = this.db.__wrapped__;
                    let result = await this.$myIpfs.Ipfs.write(this.loginObj.secret, this.$JSON5.stringify(localdata), "/main");
                    if(result.indexOf("success")>0){
                        console.log("数据同步成功！");
                        this.$message({
                            message:this.$t("main.synchronizationSuccessful"),
                            type: 'success'
                        });
                    }else if(result.indexOf("lackoil")>0){
                        console.log("未充值");
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
                                console.log("从ipfs 取数据！");
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
                            console.log("从ipfs 取数据！");
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
                    if (modelsId[idIndex].indexOf("mb") == -1) {
                        models.push(modelsId[idIndex]);
                    }
                }
                this.selectlabels = models;
            },
            addproject() {
                console.log(this.templateEvent);
                if (this.templateEvent == "") {
                    this.$message.error(this.$t('main.pleaseChooseATemplate'));
                    return false;
                } else {
                    this.dialogVisibleTemplate = false;
                    this.dialogVisibleAddProject = true;
                    this.operationType = "project_add";
                }
            }, //数据提交
            submitproject() {
                let projectName = this.ruleFormAddProject.name;
                let formData = this.templateEvent;
                let newProject = ""
                let imgtype = ""
                let img = formData.tempBase64;
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
                    "dateTime": new Date().valueOf(),
                    "tempBase64": "",
                    "imgHash": formData.imgHash,
                    "imgtype": imgtype,
                    "imgurl": formData.tempBase64,
                    "bgcolor": formData.bgcolor
                };
                //db project 追加数据
                this.db.get("project").push(this.$JSON5.parse(this.$JSON5.stringify(this.newProject))).write();
                this.db.set('version', new Date().valueOf()).write();
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
                this.notesBytargeId(this.db.get("models").find({id: "sy"}).value());//刷新列表页
                this.templateEvent = "";
            }, //增加选中项
            selectFiled(command) {
                this.dialogVisibleItems = true;
                this.filed = this.$JSON5.parse(this.$JSON5.stringify(command));
                this.filedName = command.key
                this.ruleFormAddPro.filedName = command.key
            }, //添加项目，模板增加项
            addFiled(formName) {
                console.log(formName);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.dialogVisibleItems = false;
                        this.filed.tempkey = this.ruleFormAddPro.filedName;
                        this.filed.id = this.$Uuidv1(),
                            this.templateEvent.datas.push(this.filed);
                        this.filed = "";
                        this.ruleFormAddPro.filedName= "";
                    } else {
                        console.log('error submit!!');
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
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //修改页面
            editProject() {
                this.editobject = this.$JSON5.parse(this.$JSON5.stringify(this.projectEvent));
                let  items = this.editobject.datas
                for(var item in items){
                    if (items[item].type=="password"){
                        items[item].format = this.cryptLevel(items[item].val);
                    }
                }
                if (this.editobject.type == "project") {
                    let modelsId = this.editobject.modelsId;
                    let models = [];
                    for (var index in modelsId) { //下拉框不显示sy,wbj
                        if (modelsId[index].indexOf("sy") == -1 && modelsId[index].indexOf("wbj")) {
                            models.push(modelsId[index]);
                        }
                    }
                    this.selectlabels = models;
                    this.dialogVisibleEdit = true;
                    this.operationType = "project_edit";
                } else if (this.editobject.type == "template") {
                    var modelsId = this.editobject.modelsId;
                    var models = [];
                    for (var index in modelsId) { //下拉框不显示mb
                        if (modelsId[index].indexOf("mb") == -1) {
                            models.push(modelsId[index]);
                        }
                    }
                    this.selectlabels = models;
                    this.dialogVisibleTemplateEdit = true;
                    this.operationType = "template_edit";
                }
            }, //修改project
            editDo() {
                try {
                    this.db.get("project").remove({id: this.editobject.id}).write();
                    var img = this.$JSON5.parse(this.$JSON5.stringify(this.editobject.tempBase64));
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
                    this.db.get("project").push(this.$JSON5.parse(this.$JSON5.stringify(this.editobject))).write();
                    this.db.set('version', new Date().valueOf()).write();
                    this.dialogVisibleEdit = false
                    this.editobject.tempBase64 = img;
                    this.$message.success(this.$t('main.successfullyModified'));
                    this.projectEvent = this.editobject;
                    this.selectlabels = "";
                    this.color = "";
                    this.getdirectory();
                    this.notesBytargeId(this.db.get("models").find({id: this.directoryClickId}).value());//刷新列表页
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
                    this.notesBytargeId(this.db.get("models").find({id: this.directoryClickId}).value());//刷新列表页
                    this.editobject = "";
                } catch (e) {
                    console.log(e);
                    this.$message.error(this.$t('main.failToEdit'));
                }
            }, openDialogTemplate() {
                this.currentTemplate = -1;
                this.templateEvent = ""
            },
            openSetting() {
                /*this.savePasswords = [{value: 'ask', label: this.$t('main.ask')}, {
                    value: 'off',
                    label: this.$t('main.shutDown')
                }, {value: 'automatically', label: this.$t('main.autofill')}];*/
                this.dialogVisibleSetting = true;
            }, //清除数据库数据
            cleardb() {
                this.db.unset("project").write();
                this.db.unset("models").write();
                this.db.unset("version").write();
                this.db.unset("templates").write();
                this.db.unset("profiles").write();
                this.db.unset("settings").write();
            }, addTemplate() {
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
                        console.log('error submit!!');
                        return false;
                    }
                });



            }, //增加模板
            async saveTemplate() {
                var loginObj = this.$JSON5.parse(sessionStorage.getItem("userkeyObj"));
                var address = loginObj.address;
                //处理分类
                if (this.selectlabels.indexOf("mb") == -1) {
                    this.selectlabels.push("mb");//必须增加模板分类
                    console.log(this.selectlabels);
                }
                //图片处理
                if (this.imageBase64 == '') {
                    //默认图片
                    this.imageBase64 = this.$refs.icon_default.src;
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
                    "bgcolor": this.color
                }
                this.db.get("templates").push(this.$JSON5.parse(this.$JSON5.stringify(this.newTemplate))).write();
                this.db.set('version', new Date().valueOf()).write();
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
                this.notesBytargeId(this.db.get("models").find({id: "mb"}).value());//刷新列表页
                this.imageBase64 = "";
                this.newTemplate = "";
            }, //修改模板
            editTemplate() {
                var img = this.$JSON5.parse(this.$JSON5.stringify(this.editobject.tempBase64));
                if (this.selectlabels.indexOf("mb") == -1) {
                    this.selectlabels.push("mb");//必须增加模板分类
                }
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
                    this.db.get("templates").remove({id: this.editobject.id}).write();
                    this.editobject.modelsId = this.selectlabels;
                    this.db.get("templates").push(this.$JSON5.parse(this.$JSON5.stringify(this.editobject))).write();
                    this.db.set('version', new Date().valueOf()).write();
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
                    this.notesBytargeId(this.db.get("models").find({id: "mb"}).value());//刷新列表页
                    this.editobject = "";
                } catch (e) {
                    console.log(e);
                    this.$message.error(this.$t('main.failToEdit'));
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
                console.log("加载定时器");
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
                console.log("更新用户设置:"+setting.systemlock);
                this.systemlock = setting.systemlock;
                this.locktimedisabled = !this.systemlock;
                this.locktime = setting.locktime;//自动锁定时间
                this.language = setting.language;//语言选择
                this.showPassword = setting.showPassword;//是否显示密码
                this.savePassword = setting.savePassword;
            },
            //保存设置
            savesettings() {
                try {
                    this.locksystem();
                    this.changeLang(this.language);
                    this.db.get("settings").set("systemlock", this.systemlock).write();
                    this.db.get("settings").set("locktime", this.locktime).write();
                    this.db.get("settings").set("showPassword", this.showPassword).write();
                    this.db.get("settings").set("savePassword", this.savePassword).write();
                    this.db.get("settings").set("language", this.language).write();
                    this.db.set('version', new Date().valueOf()).write();
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
            search(temp) {
                console.log(temp);
                console.log(this.delobj.id);
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
                    this.projects = tempProjects;
                } else if(this.delobj.id =="mb") {
                    //template
                    templateArray = this.db.get("templates").filter({isDel: !true}).value();
                    for (var templateIndex in templateArray) {
                        if (templateArray[templateIndex].name.indexOf(temp) != -1) {
                            tempTemplates.push(templateArray[templateIndex]);
                        }
                    }
                    this.projects = tempTemplates;
                }else if(this.delobj.id =="ljt"){
                    projectArray = this.db.get("project").filter({isDel: true}).value();
                    templateArray = this.db.get("templates").filter({isDel: true}).value();
                    console.log(projectArray);
                    console.log(templateArray );
                    ljtArray =projectArray.concat(templateArray);
                    for(var ljtIndex in ljtArray){
                        if(ljtArray[ljtIndex].name.indexOf(temp) != -1){
                            templjtArray.push(ljtArray[ljtIndex]);
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
                var reader = new FileReader();
                var base64 = "";
                reader.readAsDataURL(file.raw);
                reader.onload = async function (e) {
                    temp.imageBase64 = this.result;
                    temp.templateEvent.tempBase64 = this.result;
                }
                this.imgtype = "base64";
            }, //图片大小验证
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
            favorite(obj) {
                if (obj.isDel) {
                    return false;
                }
                obj.modelsId.push("scj");
                if (obj.modelsId.indexOf("wbj") != -1) {//有未标记项，删除
                    obj.modelsId = obj.modelsId.filter(function (item) {
                        return item !== "wbj"
                    })
                }
                if (obj.type == "project") {
                    this.db.get("project").remove({id: obj.id}).write();
                    this.db.get("project").push(this.$JSON5.parse(this.$JSON5.stringify(obj))).write();
                } else if (obj.type == "template") {
                    this.db.get("templates").remove({id: obj.id}).write();
                    this.db.get("templates").push(this.$JSON5.parse(this.$JSON5.stringify(obj))).write();
                }
                this.db.set('version', new Date().valueOf()).write();
                this.getdirectory();
                this.notesBytargeId(this.db.get("models").find({id: this.directoryClickId}).value());//刷新列表页
            },
            unfavorite(obj) {
                if (obj.isDel) {
                    return false;
                }
                //删除指定项
                obj.modelsId = obj.modelsId.filter(function (item) {
                    return item !== "scj"
                })
                if (obj.modelsId.length == 1 && obj.modelsId.indexOf("sy") != -1) {
                    obj.modelsId.push("wbj");//只有所有项，增加未标记项
                }
                if (obj.type == "project") {
                    this.db.get("project").remove({id: obj.id}).write();
                    this.db.get("project").push(this.$JSON5.parse(this.$JSON5.stringify(obj))).write();
                } else if (obj.type == "template") {
                    this.db.get("templates").remove({id: obj.id}).write();
                    this.db.get("templates").push(this.$JSON5.parse(this.$JSON5.stringify(obj))).write();
                }
                this.db.set('version', new Date().valueOf()).write()
                this.getdirectory();
                this.notesBytargeId(this.db.get("models").find({id: this.directoryClickId}).value());//刷新列表页
            },
            // passwordGenerator() {
            //     this.dialogVisiblePasswordGenerator = true;
            // },
            //国际化(整体配置)
            changeLang(lan) {
                console.log("更新语言");
                if (lan === "中文") {
                    this.$i18n.locale = 'zh-CN';
                    //模板添加选项更新
                    console.log(this.templateItems);
                } else if (lan === "English") {
                    this.$i18n.locale = 'en-US';
                    //模板添加选项更新
                    // console.log(this.templateItems);
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
                    "trash": this.$t('main.trash')
                };
                for (var index in directory) {
                    if (name == index) {
                        name = directory[index];
                    }
                }
                return name;
            },
            //恢复
            recover() {
                if (this.projectEvent.type == "project") {
                    this.db.get("project").find({id: this.projectEvent.id}).set("isDel", false).write();
                } else if (this.projectEvent.type == "template") {
                    this.db.get("templates").find({id: this.projectEvent.id}).set("isDel", false).write();
                }
                this.dialogRecover = false;
                this.getdirectory();
                this.notesBytargeId(this.db.get("models").find({id: this.directoryClickId}).value());//刷新列表页
                this.currentNote = -1;
            },
            //清空垃圾箱
            clearTrash() {
                let delTemplate = this.db.get("templates").filter({isDel: true}).value();
                for (var index in delTemplate) {
                    this.db.get("templates").remove({id: delTemplate[index].id}).write();
                }
                let delProject = this.db.get("project").filter({isDel: true}).value();
                for (var index in delProject) {
                    this.db.get("project").remove({id: delProject[index].id}).write();
                }
                this.dialogclearTrash = false;
                this.getdirectory();
            },
            showIconMenu() {
                var uils = document.getElementsByClassName("choosepic")
                for (var i = 0; i < uils.length; i++) {
                    uils[i].style.display = "block";
                }
            },
            //打开图片选择菜单
            dialogSymbolOpen() {
                this.dialogSymbol = true;
                // var ui =document.getElementById("choosepic");
                // ui.style.display="none"
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
                        this.imageBase64 = this.$refs.icon_default.src;
                    }
                } else if (this.operationType == "template_edit") {
                    this.imageBase64 = obj.tempBase64;
                }
                // if(this.imageBase64==""){
                //     this.imageBase64=this.$refs.icon_default.src;
                // }
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
                }
            },
            //隐藏菜单
            unshow() {
                document.onclick = function (e) {
                    var e = e || window.event;
                    var uils = document.getElementsByClassName("choosepic")
                    for (var i = 0; i < uils.length; i++) {
                        if (uils[i].style.display == "block") {
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
                if (project.isDel != true) {
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
                this.addProjectClasses = [];
                this.addTemplateClasses = [];
                this.emptyTrashClasses = [];
                this.deleteClasses = [];
                this.recoverClass = ["unuse"];
                var menu = document.getElementById("menu_1");
                var e = e || window.event;
                var x = e.clientX;
                var y = e.clientY;
                menu.style.display = "block";
                menu.style.left = x + "px";
                menu.style.top = y + "px"
                this.deleteClasses.push("unuse");
                this.recoverClass.push("unuse");
                this.addDirClasses.push("unuse");
            },
            //菜单变化
            menulistchange(obj) {
                this.addDirClasses = [];
                this.addProjectClasses = [];
                this.addTemplateClasses = [];
                this.emptyTrashClasses = [];
                this.deleteClasses = [];
                this.recoverClass = ["unuse"];
                if (obj.modelsType == "directory") {
                    this.emptyTrashClasses.push("unuse");
                    this.addProjectClasses.push("unuse");
                    this.addTemplateClasses.push("unuse");
                    this.emptyTrashClasses.push("unuse");
                } else if (obj.modelsType == "project") {
                    this.emptyTrashClasses.push("unuse");
                    this.addProjectClasses.push("unuse");
                    this.addTemplateClasses.push("unuse");
                    this.emptyTrashClasses.push("unuse");
                    this.deleteClasses.push("unuse");
                }
                if (this.showTrash != true) {
                    this.emptyTrashClasses.push("unuse");
                }
                if (obj.isDel) {
                    this.recoverClass = [];
                    this.deleteClasses = ["unuse"];
                }
                if (obj.type != "model") {
                    this.addDirClasses.push("unuse");
                }
                if (obj.id == "ljt" && this.showTrash == true) {
                    this.emptyTrashClasses = [];
                }
            },
            //ipfs 覆盖本地
            async ipfsToLocal() {
                console.log("ipfs 覆盖到本地")
                let loginObj = this.$JSON5.parse(sessionStorage.getItem("userkeyObj"));
                let secret = loginObj.secret;
                let tempipfsData = await this.$myIpfs.Ipfs.read(secret,"/main", this.loginObj.address);
                console.log(tempipfsData);
                tempipfsData = this.$JSON5.parse(tempipfsData)//ipfs转成对象
                tempipfsData = this.$JSON5.parse(this.$JSON5.stringify(tempipfsData));//序列化新对象
                console.log(this.db.value());
                await this.db.set("models", tempipfsData.models).write();
                await this.db.set("project", tempipfsData.project).write();
                await this.db.set("templates", tempipfsData.templates).write();
                await this.db.set('settings', tempipfsData.settings).write();
                await this.db.set('machineId', this.$Uuidv1()).write();
                await this.db.set('version', tempipfsData.version).write();
                this.dialogSynchronization = false
                this.getdirectory();
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
                console.log(this.temppassword);
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
             * 获取进度条百分比
             * @param pwd
             * @return {string}
             */
            getPercentage(pwd){
                let level=this.cryptLevel(pwd);
                if (level.indexOf(this.$t('main.century')) !== -1) {
                    this.percentage = 100;
                    this.status="success"
                } else if (level.indexOf(this.$t('main.years')) !== -1) {
                    this.percentage = 80;
                    this.status="success"
                } else if (level.indexOf(this.$t('main.month')) !== -1) {
                    this.status="success"
                    this.percentage = 60;
                } else if (level.indexOf(this.$t('main.weeks')) !== -1) {
                    this.percentage = 40;
                    this.status="warning"
                } else if (level.indexOf(this.$t('main.day')) !== -1 ) {
                    this.percentage = 35;
                    this.status="exception"
                }
                else if (level.indexOf(this.$t('main.hours')) !== -1) {
                    this.percentage = 30;
                    this.status="exception"
                }
                else if (level.indexOf(this.$t('main.mintues')) !== -1) {
                    this.percentage = 15;
                    this.status="exception"
                }
                else if (level.indexOf(this.$t('main.seconds') ) !== -1) {
                    this.percentage = 10;
                    this.status="exception"
                }else if(level.indexOf(this.$t('main.moment')) !== -1){
                    this.percentage =5;
                    this.status="exception"
                }else {
                    this.percentage =0;
                    this.level="";
                }

            },
        },

        watch: {  //密码生成器自动生成
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
