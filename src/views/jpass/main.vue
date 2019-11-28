<template>
    <body class="sy" @mousemove="GetXYPosition">
    <!-- 头部 -->
    <header class="header">
        <h1 style="margin-left: 40px;">
            <a href="#"> <img src="./img/Logo-4.svg" alt=""> </a>
        </h1>
        <ul class="link">
            <li>
                <el-button @click="addDirectoryOP" style="border:0"><img style="top:-2px;height: 25px;width: 25px;"
                                                                         src="./img/tianjiawenjianjia.svg"
                                                                         alt="">{{$t('main.newFolder')}}
                </el-button>
            </li>
            <li>
                <el-button @click="addTemplate" style="border:0"><img style="top:-2px;height: 20px;width: 20px;"
                                                                      src="./img/moban.svg" alt="">{{$t('main.newTemplate')}}
                </el-button>
            </li>
            <li>
                <el-button @click="selectTemplate" style="border:0"><img style="top:-2px;height: 20px;width: 20px;"
                                                                         src="./img/tianjiaxiangmu.svg"
                                                                         alt="">{{$t('main.newProject')}}
                </el-button>
            </li>

            <li>
                <el-button :disabled="isDisabled" @click="remove()" id="delbtn" style="border:0"><img style="top:-2px;"
                                                                                                      src="./img/ICON-SC.svg"
                                                                                                      alt="">{{$t('main.delete')}}
                </el-button>
            </li>
            <li>
                <el-button style="border:0;" @click="synchronization()"><img style="top:-2px;" src="./img/ICON-TB.svg">{{$t('main.synchronize')}}
                </el-button>
                <el-progress :percentage="percentage" :stroke-width="4" :color="customColor" :status="synStatus"
                             :show-text="true" v-show="processShow"></el-progress>
            </li>
            <li>
                <el-button style="border:0" @click="lock()"><img style="top:-2px;" src="./img/ICON-SD.svg" alt="">{{$t('main.locking')}}
                </el-button>
            </li>
            <li>
                <el-button style="border:0" @click="passwordGenerator()"><img style="top:-2px;height: 25px;width: 25px;"
                                                                              src="./img/钥匙.svg" alt="">{{$t('main.PasswordGenerator')}}
                </el-button>
            </li>
            <li>
                <el-button style="border:0" @click="dialogclearTrash = true"><img style="top:-2px;height: 25px;width: 25px;"
                                                                                  src="./img/钥匙.svg" alt="">{{$t('main.trash')}}
                </el-button>
            </li>
            <!--<li>-->
            <!--<el-button @click=""><img style="top:-2px;" src="./img/ICON-SCQ.svg" alt="">初始化钱包</el-button>-->
            <!--</li>-->
        </ul>
        <div class="hr" style="margin-left: 80%;position: absolute;width: 18%">
            <a style="margin:0;width: 30%;" class="mr4w" @click="openSetting"> <img src="./img/icon_sz.svg" alt=""> </a>
            <div class="touxiang" style="margin:0;">
                <img src="./img/tx.svg" @click="myInfo">
                <!--<div>-->
                <!--<a @click="myInfo">{{username}}</a>-->
                <!--</div>-->
            </div>
            <el-button style="border:0;height: 50px;margin: auto 0" @click="logOut"><img
                    style="top:-2px;height: 25px;width: 25px;"
                    src="./img/退出登录.svg" alt=""></el-button>
        </div>
    </header>
    <!-- 侧边栏 -->
    <aside class="aside">
        <!-- 导航栏 -->
        <nav class="nav" style="">
            <h3>Jpass</h3>
            <ul class="dh" id="projectUL" style="">
                <li v-for="(project,index) in DProject.project" @click="projectclick(project,$event)"
                    :data-index="index"
                    :class="index == currentProject?click:disclick">
                    <span>{{project.name}}</span> <i>{{project.count}}</i>
                </li>
            </ul>
            <h3>{{$t('main.folder')}}</h3>
            <ul class="dhwjj" id="DirUL">
                <li v-for="(project,index) in DDirectory.directory" @click="directoryclick(project,$event)"
                    :data-index="index"
                    :class="index == currentDirectory?click:disclick">
                    <span>{{project.name}}</span> <i>{{project.count}}</i>
                </li>
            </ul>
            <!--<a href="#" class="jh" @click="addDirectoryOP">+</a>-->
        </nav>
        <!-- 副导航栏 -->
        <article class="article">
            <input class="ss" type="text" v-model="searchTemp" :placeholder="$t('main.pleaseEnterWhatYouWantToSearch')"
                   @input="search(searchTemp)">
            <ul class="list">
                <li v-for="(project,index) in projects" @click="noteslick(project,$event)" :data-index="index"
                    :class="index == currentNote?click:disclick" style="margin-top: 5px;">
                    <span>
                         <img :src="project.tempBase64" width="30px" height="30px">
                    </span>
                    <div style="width: 70%;text-align: left;">
                        <h5>{{project.name}}</h5>
                        <span>{{project.modelsName.length>12? project.modelsName.substring(0,12)+"...":project.modelsName}}</span>
                    </div>
                    <span style="float: right;height:5.5vh;">
                        <img v-if="project.modelsId.indexOf('scj')== -1" src="./img/start.svg"
                             @click="favorite(project)">
                         <img v-if="project.modelsId.indexOf('scj')!= -1" src="./img/start_sc.svg"
                              @click="unfavorite(project)">
                    </span>

                </li>
            </ul>
        </article>
        <section class="section">
            <el-form :model="ruleFormProjectDetail" ref="ruleFormProjectDetail" label-width="100px"
                     class="demo-ruleForm" label-position="top"
                     style="width:80%;height:95%;margin: auto;text-align: left;margin-top:3%;">
                <el-form-item v-if="this.projectEvent!=''" style="margin-bottom: 5vh;margin-top: 5vh;" prop="name">
                    <div style="display: inline-block;width:80%;height:8vh; ">
                        <img :src="projectEvent.tempBase64"
                             style="width: 4vw;height:8vh;display: inline-block;position:absolute">
                        <ul style="display: inline-block;margin-top: 20px;height:8vh;margin-left:15%">
                            <li style="font-size: 25px;font-weight: bolder;">{{projectEvent.name}}</li>
                            <li style="margin-top: 1vh">{{projectEvent.modelsName}}</li>
                        </ul>
                    </div>
                    <img v-if="projectEvent.modelsId.indexOf('scj')== -1" src="./img/start.svg"
                         style="float: right;margin-right:8%;margin-top:3%;" @click="favorite(projectEvent)">
                    <img v-if="projectEvent.modelsId.indexOf('scj')!=-1" src="./img/start_sc.svg"
                         style="float:right;margin-right:8%;margin-top:3%;" @click="unfavorite(projectEvent)">
                </el-form-item>
                <template v-for="(data, index) in this.projectEvent.datas">
                    <el-form-item v-if="data.type==='password' && !showPassword" :label="data.tempkey"
                                  :prop="data.tempkey"
                                  style="margin-bottom:3px;">
                        <input type="password" v-model="data.val" readonly style="width:90%;color: #606266"/><a href="#"
                                                                                                                @click="changePass($event)"><i
                            class="el-icon-view"></i></a>
                        <el-progress id="process" :stroke-width="15" :percentage="data.percentage" :text-inside="true"
                                     :status="data.pwdstatus"
                                     :format="format" style="width:50%;margin-top: 1%"></el-progress>
                        <hr/>
                    </el-form-item>
                    <el-form-item v-else-if="data.type==='password' && showPassword" :label="data.tempkey"
                                  :prop="data.tempkey"
                                  style="margin-bottom:3px;">
                        <input type="text" v-model="data.val" readonly style=""/><a href="#"
                                                                                    @click="changePass($event)"><i
                            class="el-icon-view"></i></a>
                        <el-progress id="process" :stroke-width="15" :percentage="data.percentage" :text-inside="true"
                                     :status="data.pwdstatus"
                                     :format="format" style="width:50%;margin-top: 1%"></el-progress>
                        <hr/>
                    </el-form-item>
                    <el-form-item v-else-if="data.type==='text'" :label="data.tempkey" :prop="data.tempkey"
                                  style="margin-bottom:3px;">
                        <input type="text" v-model="data.val" readonly/>
                        <hr/>
                    </el-form-item>
                </template>
                <el-button v-if="this.projectEvent!=''&& this.projectEvent.isDel!=true" size="small"
                           @click="editProject()" style="margin-left: 3%">
                    {{$t('main.modify')}}
                </el-button>
                <el-button v-if="this.projectEvent!=''&& this.projectEvent.isDel==true" size="small" @click="dialogRecover = true">{{$t('main.recover')}}</el-button>
            </el-form>
        </section>
        <el-dialog :title="$t('main.passwordUnlock')" :visible.sync="dialogVisible" width="30%"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false" :show-close="false">
            <el-form label-width="8vw" class="demo-ruleForm" style="width:80%;">
                <el-form-item :label="$t('main.loginPassword')" prop="password">
                    <el-input type="password" v-model="password" style="width:90%;"></el-input>
                </el-form-item>
                <el-form-item label="" prop="" style="margin-bottom: 7%;margin-top: 10%">
                    <el-button type="primary" size="small" @click="unlock()">{{$t('main.unlock')}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog :title="$t('main.addDirectory')" :visible.sync="dialogVisible2" width="30%"
                   :close-on-click-modal="false" :show-close="false">
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="width: 80%;">
                <!--<el-form-item label="类型选择" prop="modelsType">-->
                <!--<el-radio v-model="ruleForm.modelsType" label="project" style="float:left;line-height: inherit">目录</el-radio>-->
                <!--<el-radio v-model="ruleForm.modelsType" label="directory" style="float:left;line-height: inherit">文件夹</el-radio>-->
                <!--</el-form-item>-->
                <el-form-item :label="$t('main.name')" prop="pName" style="">
                    <el-input v-model="ruleForm.pName" style="width:100%;"></el-input>
                </el-form-item>
                <el-form-item label="" prop="" style="margin-top:10%;text-align: center">
                    <el-button type="primary" size="small" @click="submitForm('ruleForm')">{{$t('main.ok')}}</el-button>
                    <el-button size="small" @click="cancel('ruleForm')">{{$t('main.cancel')}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--删除文件夹弹出框-->
        <el-dialog :title="$t('main.prompt')" :visible.sync="dialogVisibledDirectory" width="30%">
            <span>{{$t('main.doYouWantToDeleteTheFolder')}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="removeData()">{{$t('main.okFormat')}}</el-button>
                <el-button size="small" @click="dialogVisibledDirectory = false">{{$t('main.cancelFormat')}}</el-button>
              </span>
        </el-dialog>
        <!--恢复文件夹弹出框-->
        <el-dialog :title="$t('main.prompt')" :visible.sync="dialogRecover" width="30%">
            <span>{{$t('main.recovertitle')}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="recover()">{{$t('main.okFormat')}}</el-button>
                <el-button size="small" @click="dialogRecover = false">{{$t('main.cancelFormat')}}</el-button>
              </span>
        </el-dialog>
        <!--删除项目弹出框-->
        <el-dialog :title="$t('main.prompt')" :visible.sync="dialogVisibledProject" width="30%">
            <span>{{$t('main.doYouWantToDeleteTheProject')}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="removeData()">{{$t('main.okFormat')}}</el-button>
                <el-button size="small" @click="dialogVisibledProject = false">{{$t('main.cancelFormat')}}</el-button>
              </span>
        </el-dialog>
        <!--清空垃圾箱弹出框-->
        <el-dialog :title="$t('main.prompt')" :visible.sync="dialogclearTrash" width="30%">
            <span>{{$t('main.clearTash')}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="clearTrash()">{{$t('main.okFormat')}}</el-button>
                <el-button size="small" @click="dialogclearTrash = false">{{$t('main.cancelFormat')}}</el-button>
              </span>
        </el-dialog>
        <!--删除模板弹框-->
        <el-dialog :title="$t('main.prompt')" :visible.sync="dialogVisibledTemplate" width="30%">
            <span>{{$t('main.doYouWantToDeleteTheTemplate')}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="removeData()">{{$t('main.okFormat')}}</el-button>
                <el-button size="small" @click="dialogVisibledTemplate = false">{{$t('main.cancelFormat')}}</el-button>
              </span>
        </el-dialog>
        <!--模板弹出框-->
        <el-dialog :title="$t('main.selectTemplate')" :visible.sync="dialogVisibleTemplate" width="30%" height="30%"
                   :close-on-click-modal="false"
                   @open='openDialogTemplate'>
            <ul style="border:1px solid #9E9E9E;padding: 2px;height: 40vh;overflow-y:auto;">
                <li v-for="(project,index) in this.operateTemplates" @click="projectlick(project,$event)"
                    :data-index="index"
                    :class="index == currentTemplate?click:disclick" style="height:5vh;border: 0;text-align: left;">
                    <img :src="project.tempBase64"
                         style="display:inline-block;height:5vh;width:5vh;margin-left:2px;line-height:5vh;vertical-align:middle;text-align:center"/>
                    <span style="margin-left: 3%;font-size: 15px">{{project.name}}</span>
                </li>
            </ul>
            <el-button style="margin-top: 5%" size="small" type="primary" @click="addproject">{{$t('main.okFormat')}}
            </el-button>
            <el-button size="small" @click="dialogVisibleTemplate = false">{{$t('main.cancelFormat')}}</el-button>
        </el-dialog>
        <!--增加项目弹出框-->
        <el-dialog class="mb" :title="$t('main.addItem')" :visible.sync="dialogVisibleAddProject" width="40%"
                   height="90%" :close-on-click-modal="false">
            <div style="height: 20%;margin-top: -3vh;margin-bottom: -2vh;">
                <span style="margin-left: 0px;display: inline-block;float: left;height: 7vh;line-height: 7vh;color: #409EFF;font-weight: bold">
                    {{$t('main.name')}}
                </span> <input type="text" v-model="ruleFormAddProject.name" class="myInput"
                               style="width:35%;margin-left: 0.5vw"/>
                <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/"
                           :show-file-list="false" :on-success="handleAvatarSuccessAddPro"
                           :before-upload="beforeAvatarUpload"
                           style="height:7vh;width:4vw;margin-left:45%;">
                    <img v-if="templateEvent.tempBase64" :src="templateEvent.tempBase64" class="avatar">
                    <i v-else class="el-icon-plus" style="height: 6vh;line-height: 6vh;width:3.5vw "></i>
                </el-upload>
            </div>
            <br>
            <el-tabs type="border-card">
                <el-tab-pane :label="$t('main.fields')">
                    <div style="height:45vh;overflow: auto;">
                        <el-form :model="ruleFormAddProject" ref="ruleFormAddProject" label-width="100px"
                                 class="demo-ruleForm"
                                 style="width: 95%;margin: auto;">
                            <!--<el-form-item :label="$t('main.name')" style="width:90%;margin-bottom: -6%" prop="name">-->

                            <!--</el-form-item>-->
                            <template v-for="(data, index) in this.templateEvent.datas">
                                <el-form-item v-if="data.type==='password' && !showPassword" :label="data.tempkey"
                                              :prop="data.tempkey"
                                              style="width:90%;margin-bottom:0;">
                                    <input type="password" v-model="data.val" @input="pwdLength(data)" class="myInput"/>
                                    <a href="#" @click="changePass($event)"><i class="el-icon-view"></i></a>
                                    <a href="#"><i class="el-icon-close" @click="addProjectRemoveItem(data.id)"></i></a>
                                    <el-progress id="process" :stroke-width="15" :percentage="data.percentage"
                                                 :text-inside="true"
                                                 :status="data.pwdstatus" :format="format"
                                                 style="width:80%;margin-top: 0%"></el-progress>
                                </el-form-item>
                                <el-form-item v-else-if="data.type==='password' && showPassword" :label="data.tempkey"
                                              :prop="data.tempkey"
                                              style="width: 90%;margin-bottom:0;">
                                    <input type="text" v-model="data.val" @input="pwdLength(data)" class="myInput"/>
                                    <a href="#" @click="changePass($event)"><i class="el-icon-view"></i></a>
                                    <a href="#"><i class="el-icon-close" @click="addProjectRemoveItem(data.id)"></i></a>
                                    <el-progress id="process" :stroke-width="15" :percentage="data.percentage"
                                                 :text-inside="true"
                                                 :status="data.pwdstatus" :format="format"
                                                 style="width:80%;margin-top: 0%"></el-progress>
                                </el-form-item>
                                <el-form-item v-else-if="data.type==='text'" :label="data.tempkey" :prop="data.tempkey"
                                              style="width: 90%;margin-bottom:0;">
                                    <input type="text" v-model="data.val" class="myInput"/> <a href="#"><i
                                        class="el-icon-close" @click="addProjectRemoveItem(data.id)"></i></a>
                                </el-form-item>
                            </template>
                            <el-form-item :label="$t('main.chooseCategory')" style="margin-top:1%;margin-bottom: 0px;">
                                <el-select v-model="selectlabels" multiple :placeholder="$t('main.pleaseChoose')"
                                           style="float: left;width:75%">
                                    <el-option v-for="(item,index) in this.labels.labels" :key="item.id"
                                               :label="item.name"
                                               :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('main.addOtherItems')" style="margin-top: 1%;margin-bottom: 0px;">
                                <el-dropdown @command="selectFiled" style="float: left;">
                                    <el-button style="">
                                        {{$t('main.addOtherItems')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item v-for="(item,index) in this.templateItemsTemp.templateItems"
                                                          :command="item">{{item.key}}
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <div style="margin-top:1vh;text-align: center">
                <el-button style="display: inline-block;" type="primary" size="small" @click="submitproject()">
                    {{$t('main.okFormat')}}
                </el-button>
                <el-button style="display: inline-block;" size="small" @click="dialogVisibleAddProject = false">
                    {{$t('main.cancelFormat')}}
                </el-button>
            </div>
        </el-dialog>

        <!--修改项目-->
        <el-dialog class="mb" :title="$t('main.modifyTheProject')" :visible.sync="dialogVisibleEdit" width="40%" height="90%"
                   :close-on-click-modal="false" :close-on-press-escape="false" :show-close="true">
            <div style="height: 20%;margin-top: -3vh;margin-bottom: -2vh;">
                <span style="margin-left: 0px;display: inline-block;float: left;height: 7vh;line-height: 7vh;color: #409EFF;font-weight: bold">
                    {{$t('main.name')}}
                </span> <input type="text" v-model="editobject.name" class="myInput"
                               style="width:35%;margin-left: 0.5vw"/>
                <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/"
                           :show-file-list="false" :on-success="handleAvatarSuccessEdit"
                           :before-upload="beforeAvatarUpload" style="height:7vh;width:4vw;margin-left:45%;">
                    <img v-if="editobject.tempBase64" :src="editobject.tempBase64" class="avatar">
                    <i v-else class="el-icon-plus" style="height: 6vh;line-height: 6vh;width:3.5vw "></i>
                </el-upload>
            </div>
            <br>
            <el-tabs type="border-card">
                <el-tab-pane :label="$t('main.fields')">
                    <div style="height:45vh;overflow: auto;">
                        <el-form :model="ruleFormProjectEdit" ref="ruleFormProjectEdit" label-width="100px"
                                 class="demo-ruleForm"
                                 style="width: 95%;margin: auto">
                            <!--<el-form-item label="名称" style="width: 90%;margin-bottom: -6%" prop="name">-->

                            <!--</el-form-item>-->
                            <template v-for="(data, index) in this.editobject.datas">
                                <el-form-item v-if="data.type==='password' && !showPassword" :label="data.tempkey"
                                              :prop="data.tempkey" style="width: 90%;margin-bottom: 0">
                                    <input type="password" v-model="data.val" @input="pwdLength(data)" class="myInput"/>
                                    <a href="#" @click="changePass($event)"><i class="el-icon-view"></i></a>
                                    <a href="#"><i class="el-icon-close" @click="editRemoveItem(data.id)"></i></a>
                                    <el-progress id="process" :stroke-width="15" :percentage="data.percentage"
                                                 :status="data.pwdstatus" :text-inside="true" :format="format"
                                                 style="width:80%;margin-top: 0%"></el-progress>
                                </el-form-item>
                                <el-form-item v-if="data.type==='password' && showPassword" :label="data.tempkey"
                                              :prop="data.tempkey" style="width: 90%;margin-bottom:0">
                                    <input type="text" v-model="data.val" @input="pwdLength(data)" class="myInput"/>
                                    <a href="#" @click="changePass($event)"><i class="el-icon-view"></i></a>
                                    <a href="#"><i class="el-icon-close" @click="editRemoveItem(data.id)"></i></a>
                                    <el-progress id="process" :stroke-width="15" :percentage="data.percentage"
                                                 :status="data.pwdstatus"
                                                 :text-inside="true" :format="format"
                                                 style="width:80%;margin-top: 0%"></el-progress>
                                </el-form-item>
                                <el-form-item v-else-if="data.type==='text'" :label="data.tempkey" :prop="data.tempkey"
                                              style="width: 90%;margin-bottom:0">
                                    <input type="text" v-model="data.val" class="myInput"/> <a href="#"><i
                                        class="el-icon-close" @click="editRemoveItem(data.id)"></i></a>
                                </el-form-item>
                            </template>
                            <el-form-item :label="$t('main.chooseCategory')" style="margin-top:1%;margin-bottom: 0px;">
                                <el-select v-model="selectlabels" multiple :placeholder="$t('main.pleaseChoose')"
                                           style="float: left;width:75%">
                                    <el-option v-for="(item,index) in this.labels.labels" :key="item.id"
                                               :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('main.addOtherItems')" style="margin-top:1%;margin-bottom: 0px;">
                                <el-dropdown @command="editSelectFiled" style="float: left;">
                                    <el-button>
                                        {{$t('main.addOtherItems')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item v-for="(item,index) in this.templateItemsTemp.templateItems" :command="item">{{item.key}}
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </el-form-item>

                        </el-form>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <div style="margin-top:1vh;text-align: center">
                <el-button size="small" type="primary" @click="editDo">{{$t('main.submit')}}</el-button>
                <el-button size="small" @click="dialogVisibleEdit = false">{{$t('main.cancelFormat')}}</el-button>
            </div>
        </el-dialog>
        <!--增加模板-->
        <el-dialog class="mb" :title="$t('main.addTemplate')" :visible.sync="dialogVisibleAddTemplate" width="40%"
                   height="90%"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false" :show-close="true">
            <div style="height: 20%;margin-top: -3vh;margin-bottom: -2vh;">
                 <span style="margin-left: 0px;display: inline-block;float: left;height: 7vh;line-height: 7vh;color: #409EFF;font-weight: bold">
                    {{$t('main.name')}}
                </span> <input type="text" v-model="ruleFormAddTemplate.name" style="width:35%;margin-left: 0.5vw"
                               class="myInput"/>
                <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/"
                           :show-file-list="false"
                           :on-success="handleAvatarSuccessAdd"
                           :before-upload="beforeAvatarUpload" style="height:7vh;width:4vw;margin-left:45%;">
                    <img v-if="imageBase64" :src="imageBase64" class="avatar"> <i v-else class="el-icon-plus"
                                                                                  style="height: 6vh;line-height: 6vh;width:3.5vw "></i>
                </el-upload>
            </div>
            <br>
            <el-tabs type="border-card">
                <el-tab-pane :label="$t('main.fields')">
                    <div style="height:45vh;overflow: auto;">
                        <el-form :model="ruleFormAddTemplate" ref="ruleFormAddTemplate" label-width="100px"
                                 class="demo-ruleForm"
                                 style="width: 80%;margin: auto">
                            <!--<el-form-item :label="$t('main.templateName')" style="width: 90%;margin-bottom: -6%" prop="name">-->
                            <!---->
                            <!--</el-form-item>-->
                            <template v-for="(data, index) in this.tempTemplate">
                                <el-form-item v-if="data.type==='password'" :label="data.tempkey" :prop="data.tempkey"
                                              style="width: 90%;margin-bottom:0">
                                    <input type="password" v-model="data.val" readonly style="width:90%;float: left"
                                           class="myInput"/>
                                    <a href="#"><i class="el-icon-close"
                                                   @click="addTemplageRemoveItem(data.id)"></i></a>
                                </el-form-item>
                                <el-form-item v-else-if="data.type==='text'" :label="data.tempkey" :prop="data.tempkey"
                                              style="width: 90%;margin-bottom: 0">
                                    <input type="text" v-model="data.val" readonly style="width:90%;float: left"
                                           class="myInput"/>
                                    <a href="#"><i class="el-icon-close"
                                                   @click="addTemplageRemoveItem(data.id)"></i></a>
                                </el-form-item>
                            </template>
                            <el-form-item :label="$t('main.chooseCategory')" style="margin-bottom: 1vh">
                                <el-select v-model="selectlabels" multiple :placeholder="$t('main.pleaseChoose')"
                                           style="float: left;width:75%">
                                    <el-option v-for="(item,index) in this.labels.labels" :key="item.id"
                                               :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('main.addOtherItems')">
                                <el-dropdown @command="selectFiledTemplate" style="float: left">
                                    <el-button>
                                        {{$t('main.addOtherItems')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item v-for="(item,index) in this.templateItems.templateItems"
                                                          :command="item">
                                            {{item.key}}
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </el-form-item>

                        </el-form>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <div style="margin-top:1vh;text-align: center">
                <el-button size="small" type="primary" @click="saveTemplate">提交</el-button>
                <el-button size="small" @click="dialogVisibleAddTemplate = false">取 消</el-button>
            </div>
        </el-dialog>
        <!--修改模板弹出框-->
        <el-dialog :title="$t('main.modifyTemplate')" class="mb" :visible.sync="dialogVisibleTemplateEdit" width="40%"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false" :show-close="true">
            <div style="height: 20%;margin-top: -3vh;margin-bottom: -2vh;">
                   <span style="margin-left: 0px;display: inline-block;float: left;height: 7vh;line-height: 7vh;color: #409EFF;font-weight: bold">
                    {{$t('main.name')}}
                </span> <input type="text" v-model="editobject.name" style="width:35%;margin-left: 0.5vw"
                               class="myInput"/>
                <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/"
                           :show-file-list="false"
                           :on-success="handleAvatarSuccessEdit"
                           :before-upload="beforeAvatarUpload" style="height:7vh;width:4vw;margin-left:45%;">
                    <img v-if="editobject.tempBase64" :src="editobject.tempBase64" class="avatar">
                    <i v-else class="el-icon-plus" style="height: 6vh;line-height: 6vh;width:3.5vw "></i>
                </el-upload>
            </div>
            <br>
            <el-tabs type="border-card">
                <el-tab-pane :label="$t('main.fields')">
                    <div style="height:45vh;overflow: auto;">
                        <el-form :model="ruleFormTemplateEdit" ref="ruleFormTemplateEdit" label-width="100px"
                                 class="demo-ruleForm" style="width: 85%;margin: auto">
                            <!--<el-form-item :label="$t('main.name')" style="width: 90%;margin-bottom: -6%" prop="name">-->
                            <!---->
                            <!--</el-form-item>-->
                            <template v-for="(data, index) in this.editobject.datas">
                                <el-form-item v-if="data.type==='password'" :label="data.tempkey" :prop="data.tempkey"
                                              style="width: 90%;margin-bottom: 0">
                                    <input type="password" v-model="data.val" readonly style="float: left;width:90%;"
                                           class="myInput"/>
                                    <a href="#"><i class="el-icon-close" @click="editRemoveItem(data.id)"></i></a>
                                </el-form-item>
                                <el-form-item v-else-if="data.type==='text'" :label="data.tempkey" :prop="data.tempkey"
                                              style="width: 90%;margin-bottom:0">
                                    <input type="text" v-model="data.val" style="float: left;width:90%;" readonly
                                           class="myInput"/>
                                    <a href="#"><i class="el-icon-close" @click="editRemoveItem(data.id)"></i></a>
                                </el-form-item>
                            </template>
                            <el-form-item :label="$t('main.chooseCategory')" style="margin-bottom: 1vh;">
                                <el-select v-model="selectlabels" multiple :placeholder="$t('main.pleaseChoose')"
                                           style="float: left;width:75%">
                                    <el-option v-for="(item,index) in this.labels.labels" :key="item.id"
                                               :label="item.name"
                                               :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('main.addOtherItems')">
                                <el-dropdown @command="editSelectFiled" style="float: left">
                                    <el-button>
                                        {{$t('main.addOtherItems')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item v-for="(item,index) in this.templateItems.templateItems"
                                                          :command="item">
                                            {{item.key}}
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <div style="margin-top:1vh;text-align: center">
                <el-button size="small" type="primary" @click="editTemplate">{{$t('main.submit')}}</el-button>
                <el-button size="small" @click="dialogVisibleTemplateEdit = false">{{$t('main.cancelFormat')}}
                </el-button>
            </div>

        </el-dialog>
        <!--增加Items 弹出框-->
        <el-dialog :title="$t('main.additionalItem')" :visible.sync="dialogVisibleItems" width="30%"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false" :show-close="true">
            <el-form label-width="100px" class="demo-ruleForm">
                <el-form-item label="name" prop="name" style="margin-top:10%">
                    <el-input type="text" v-model="filedName" style="width:100%;"></el-input>
                </el-form-item>
                <el-form-item label="" prop="" style="margin-top:10%">
                    <el-button type="primary" size="small" style="width:35%;float:left;" @click="addFiled">
                        {{$t('main.ok')}}
                    </el-button>
                    <el-button type="primary" size="small" style="width:35%;float:left;"
                               @click="dialogVisibleItems=false">{{$t('main.cancel')}}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--修改模板项弹出框-->
        <el-dialog :title="$t('main.additionalItem')" :visible.sync="dialogVisibleItemsEdit" width="30%"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :show-close="true">
            <el-form label-width="100px" class="demo-ruleForm">
                <el-form-item label="name" prop="name" style="margin-top:10%">
                    <el-input type="text" v-model="filedName" style="width:100%;"></el-input>
                </el-form-item>
                <el-form-item label="" prop="" style="margin-top:10%">
                    <el-button type="primary" size="small" style="width:35%;float:left;" @click="editAddFiled">
                        {{$t('main.ok')}}
                    </el-button>
                    <el-button type="primary" size="small" style="width:35%;float:left;"
                               @click="dialogVisibleItemsEdit=false">{{$t('main.cancel')}}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--增加模板项弹出框-->
        <el-dialog :title="$t('main.additionalItem')" :visible.sync="dialogVisibleAddTempItems" width="30%"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :show-close="true">
            <el-form label-width="100px" class="demo-ruleForm">
                <el-form-item label="name" prop="name" style="margin-top:10%">
                    <el-input type="text" v-model="filedName" style="width:100%;"></el-input>
                </el-form-item>
                <el-form-item label="" prop="" style="margin-top:10%">
                    <el-button type="primary" size="small" style="width:35%;float:left;" @click="addFiledTemplate">
                        {{$t('main.ok')}}
                    </el-button>
                    <el-button type="primary" size="small" style="width:35%;float:left;"
                               @click="dialogVisibleAddTempItems = false">
                        {{$t('main.cancel')}}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!--设置弹出框-->
        <el-dialog title="" :visible.sync="dialogVisibleSetting" width="50%" :show-close="true"
                   style="text-align: left">
            <div style="text-align: center;font-weight:bolder;margin-bottom:3%;margin-top: -2%">
                {{$t('main.systemSettings')}}
            </div>
            <el-form>
                <el-form-item prop="">
                    <fieldset style="width: 80%;margin: auto;border: 1px solid #6C6C6C">
                        <legend style="margin-left: 1%">
                            {{$t('main.locking')}}
                        </legend>
                         <span style="display:inline-block;width: 60vh;margin-left: 2vw">
                            {{$t('main.timedLock')}}
                            <el-switch v-model="systemlock" active-color="#13ce66" inactive-color="#ff4949"
                                       @change="locksystem()"></el-switch>
                          </span>
                         <span style="display:inline-block;width: 60vh;margin-left: 2vw">
                            {{$t('main.idleTime')}}
                             <el-slider v-model="locktime" :disabled="locktimedisabled"></el-slider>
                        </span>
                    </fieldset>

                </el-form-item>
                <el-form-item prop="">
                    <fieldset style="width: 80%;margin: auto;height: 15vh;border: 1px solid #6C6C6C">
                        <legend style="margin-left: 1%">
                            {{$t('main.language')}}
                        </legend>
                        <span style="margin-left: 2vw">
                            <el-select v-model="language" :placeholder="$t('main.languageSelection')" @change="changeLang(language)">
                               <el-option v-for="item in this.languages" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </span>
                    </fieldset>
                </el-form-item>
                <el-form-item prop="">
                    <fieldset style="width: 80%;height: 23vh;margin: auto;border: 1px solid #6C6C6C">
                        <legend style="margin-left: 1%">
                            {{$t('main.passwordService')}}
                        </legend>
                        <div style="margin-left: 2vw">
                            {{$t('main.showPassword')}}
                            <el-switch v-model="showPassword" active-color="#13ce66"
                                       inactive-color="#ff4949"></el-switch>
                        </div>

                        <div style="margin-left: 2vw">
                            {{$t('main.newUserAndPasswordAreAutomaticallySaved')}}
                            <el-select v-model="savePassword" :placeholder="$t('main.pleaseChoose')">
                                <el-option v-for="item in this.savePasswords" :key="item.value" :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                        </div>

                    </fieldset>
                </el-form-item>
                <el-form-item label="" prop="" style="margin-top:5%;text-align: center">
                    <el-button type="primary" size="small" style="width:35%;" @click="savesettings">
                        {{$t('main.save')}}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!--个人信息弹出框-->
        <el-dialog title="" :visible.sync="dialogMyInfo" width="40%" :close-on-click-modal="false"
                   :close-on-press-escape="false" :show-close="true">
            <img src="./img/tx.svg" alt="">
            <el-form label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username" style="margin-top: 5%">
                    <el-input type="text" v-model="username" style="width:100%;" readonly>{{username}}</el-input>
                </el-form-item>
                <el-form-item label="钱包地址" prop="myInfoKey">
                    <el-input type="text" v-model="myInfoKey" style="width:100%;" readonly>{{myInfoKey}}</el-input>
                </el-form-item>
                <el-form-item :label="$t('registersuccess.keystoreFile')">
                    <el-button type="primary" size="small" style="float: left" @click="exportkeystore">
                        {{$t('registersuccess.exportKeystoreFile')}}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--密码生成器-->
        <el-dialog title="密码生成器" :visible.sync="dialogVisiblePasswordGenerator" width="40%"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false" :show-close="true">
            <el-input v-model="crypt"></el-input>
            <el-progress :text-inside="true" :stroke-width="20" :percentage="percentage"></el-progress>
            <el-tag type="danger">{{level}}</el-tag>
            <el-slider
                    :format-tooltip="formatTooltip"
                    :step="5"
                    show-stops
                    v-model="value2">
            </el-slider>
            <el-radio-group v-model="radio">
                <el-radio :label="1">便于记忆</el-radio>
                <el-radio :label="2">仅字母和数字</el-radio>
                <el-radio :label="3">完全随机</el-radio>
                <el-radio :label="4">仅允许数字</el-radio>
            </el-radio-group>
            <br>
            <el-button style="margin-top: 5%" size="small" type="primary" @click="module()">
                {{$t('main.okFormat')}}
            </el-button>
            <el-button size="small" @click="dialogVisiblePasswordGenerator = false">{{$t('main.cancelFormat')}}
            </el-button>
        </el-dialog>
    </aside>
    </body>
</template>
<script type="es6">
    import low from 'lowdb';
    import LocalStorage from 'lowdb/adapters/LocalStorage';
    import password from '../../password.js';
    export default {
        mounted: function () {
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

        }, data() {
            return {
                //密码器
                crypt: "",
                level: "",
                radio: 3,
                value2: 0, //系统设置配置项
                systemlock: "",//锁定开关
                locktime: "",//自动锁定时间
                languages: [{value: '中文', label: '中文'}, {value: 'English', label: 'English'}],
                language: '',//语言选择
                showPassword: "",//是否显示密码
                savePassword: "",
                savePasswords: [],
                showpassword: "",
                locktimedisabled: "",
                showpass: "", //弹出框
                dialogVisiblePasswordGenerator: false,// 密码生成器弹出框
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
                dialogRecover:false,//恢复弹出框
                dialogclearTrash:false,//清空垃圾箱
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
                projects: [],
                operatorJID: "jHDbFiFZ6rfDjhfRnhD1ReCwY2erhpiYBS",//运营商钱包地址
                operatorSecret: "ssxWidEVcs6bCtsVbfd7gMXUoRfMW",//运营商密钥
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
                searchTemp: "",
                username: "",
                key: "",
                myInfoKey: "",
                directoryClickId: "",
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
                    "isDel": false,
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
                    "isDel": false,
                },
                templates: {
                    "templates": [{
                        "id": "01",
                        "name": "membership",
                        "modelsId": ["mb"],
                        "modelsName": "模板",
                        "type": "template",
                        "isDel": false,
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
                        "datas": [{
                            "id": "fdbce150-fec4-20e9-bd32-854c67bf088b",
                            "key": "Email",
                            "type": "text",
                            "val": "",
                            "tempkey": "Email"
                        }, {
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
                        "key": "Password",
                        "type": "password",
                        "val": "",
                        "tempkey": "Password",
                        "percentage": 0,
                        "pwdstatus": "",
                    }, {
                        "id": "fdbce150-fec4-11e9-bd32-854c67bf388b",
                        "key": "Number",
                        "type": "text",
                        "val": "",
                        "tempkey": "Number"
                    }, {
                        "id": "fdbce150-fec4-11e9-bd32-984c67bf088b",
                        "key": "Email",
                        "type": "text",
                        "val": "",
                        "tempkey": "Email"
                    }, {
                        "id": "fdbce150-fec4-11e9-bd32-854d67bf088b",
                        "key": "Address",
                        "type": "text",
                        "val": "",
                        "tempkey": "Address"
                    }]
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
                ruleFormTemplateEdit: {},
                rules: {
                    modelsType: [{required: true, message: this.$t('main.pleaseChooseTheType'), trigger: 'blur'},],
                    pName: [{required: true, message: this.$t('main.pleaseEnterAName'), trigger: 'blur'}, {
                        min: 1, max: 10, message: this.$t('main.theLengthIsBetween1And10Characters'), trigger: 'blur'
                    }]
                }
            };
        }, methods: {
            //密码
            module() {
                console.log(8 + this.value2 / 5);
                console.log(this.radio);
                this.crypt = this.$createPassword.genCrypt(this.radio, 8 + this.value2 / 5);
                this.level = this.$createPassword.cryptLevel(this.crypt);
                if (this.level.indexOf("世纪") !== -1) {
                    this.percentage = 100;
                } else if (this.level.indexOf("年") !== -1) {
                    this.percentage = 80;
                } else if (this.level.indexOf("月") !== -1) {
                    this.percentage = 60;
                } else if (this.level.indexOf("周") !== -1) {
                    this.percentage = 40;
                } else if (this.level.indexOf("天") !== -1) {
                    this.percentage = 20;
                } else {
                    this.percentage = 0;
                }
                console.log(this.crypt);
                console.log(this.level);
            }, formatTooltip(val) {
                return 8 + Math.floor(val / 5);
            }, logOut() {
                sessionStorage.removeItem("userkeyObj");
                this.$router.push("/jpass/login");
            }, //密码显示控制
            changePass(e) {
                if (e.currentTarget.previousElementSibling.getAttribute('type') == "password") {
                    e.currentTarget.previousElementSibling.setAttribute("type", "text");
                } else {
                    e.currentTarget.previousElementSibling.setAttribute("type", "password");
                }
            }, GetXYPosition() {
                var x, y;
                var e = window.event;
                x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                this.mouse2 = x + ',' + y;
            }, CheckTime() {
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
            }, async unlock() {
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
            }, myInfo(){
                this.dialogMyInfo = true;
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
            getdirectory() {
                var alldata = this.db.get("models").value();
                var allProjects = this.db.get("project").value();
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
                        count = this.db.get("templates").filter({isDel: true}).size().value() + this.db.get("project").
                                        filter({isDel: true}).size().value();
                    }
                    alldata[modelkey].count = count;
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
                var jsonlebals =this.$JSON5.parse(jsonLabelsString).labels;
                for(var obj in jsonlebals){
                    jsonlebals[obj].name=this.international(jsonlebals[obj].name);
                }
                this.labels ={labels:jsonlebals}
                //目录国际化
                var jsonProjects =  this.$JSON5.parse(jsonProjectstring).project;
                for(var obj in jsonProjects){
                    jsonProjects[obj].name=this.international(jsonProjects[obj].name);
                }
               this.DProject ={project:jsonProjects};
                //类型名称
                for (var index in  allProjects) {
                    var newArray = new Array();
                    for (var indexMode in allProjects[index].modelsId) {
                        var modelId = allProjects[index].modelsId[indexMode];
                        var model = this.db.get("models").find({id: modelId}).value();
                        if (model.id != "sy") {
                            newArray.push(this.international(model.name));//项目分类国际化
                        }
                    }
                    allProjects[index].modelsName = newArray.toString();
                }
                this.projects = this.db.get("project").filter({isDel: false}).value();
            },
            addDirectoryOP() {
                this.dialogVisible2 = true;
            }, //提交添加目录
            submitForm(formName) {
                // this.$refs[formName].validate((valid) => {
                //     if (valid) {
                //         this.addDirectory(formName);
                //     } else {
                //         console.log(this.$t('main.theInputIsIncorrectPleaseConfirmItAndSubmitItAgain'));
                //         return false;
                //     }
                // });
                this.addDirectory(formName);
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
            },
            directoryclick(note, event) {
                var target = event.currentTarget;
                var index = Number(target.getAttribute("data-index"));
                this.currentDirectory = index;
                this.currentProject = -1;
                this.delobj = note;
                // console.log(note);
                this.isDisabled = false;
                this.directoryClickId = note.id;
                this.notesBytargeId(note);
            }, noteslick(project, event) {
                var target = event.currentTarget;
                var index = Number(target.getAttribute("data-index"));
                this.currentNote = index;
                this.delobj = project;
                this.isDisabled = false;
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
                    for (var project in projects) {
                        var index = projects[project].modelsId.indexOf(id);
                        if (index > -1) {
                            //删除modelsId数组中指定位置的项
                            projects[project].modelsId.splice(index, 1);
                        }
                    }
                    this.isDisabled = true;
                    this.dialogVisibledDirectory = false;
                    this.getdirectory();
                } else if (type == "project") {
                    // this.db.get("project").remove({id: id}).write();
                    this.delobj.isDel = true;
                    this.db.set('version', new Date().valueOf()).write();
                    this.isDisabled = true;
                    this.dialogVisibledProject = false;
                    this.projectEvent = "";
                    this.getdirectory();
                } else if (type == "template") {
                    // this.db.get("templates").remove({id: id}).write();
                    this.delobj.isDel = true;
                    this.db.set('version', new Date().valueOf()).write();
                    //更新template 在project中显示
                    this.projects = this.db.get("templates").value();
                    this.dialogVisibledTemplate = false;
                    this.projectEvent = "";
                    this.getdirectory();
                    this.notesBytargeId(this.db.get("models").find({id: "mb"}).value());
                }
            }, //点击目录生成projects列表
            notesBytargeId(obj) {
                let id = obj.id;
                let projectArray = new Array();
                if (obj.id != "mb" && obj.id != "ljt") {
                    let projects = this.db.get("project").value();
                    for (let key in projects) {
                        let models = projects[key].modelsId;
                        if (models.indexOf(id) != -1 && projects[key].isDel != true) {
                            projectArray.push(projects[key]);
                        }
                    }
                } else if (obj.id == "mb") {
                    let projects = this.db.get("templates").filter({isDel: false}).value();
                    for (let index in  projects) {
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
                } else if (obj.id == "ljt") {
                    //模板类别名称国际化
                    let delTemplate = this.db.get("templates").filter({isDel: true}).value();
                    for (let index in  delTemplate) {
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
                }
                this.projects = projectArray;
            }, //启动加载
            async initialize() {
                let letoperatorJID = this.operatorJID;//运营商钱包地址
                let operatorSecret = this.operatorSecret; //运营商密钥
                var loginObj = this.$JSON5.parse(sessionStorage.getItem("userkeyObj"));
                var address = loginObj.address;
                this.myInfoKey = address;
                this.username = loginObj.name;
                var db_name = "db_" + address;
                this.db = await this.$Lowdb(db_name);
                let version = await this.db.get("version").value();
                // let ipfsData = await this.$myIpfs.read(address, loginObj.secret);
                let ipfsData = {"version": 0};
                let tempipfsData = this.$JSON5.parse(this.$JSON5.stringify(ipfsData));
                console.log("本地version:" + version);
                console.log("ipfsversion:" + tempipfsData.version);
                this.templateItemsTemp = this.$JSON5.parse(this.$JSON5.stringify(this.templateItems));//初始化模板添加选项
                if (!version || version.length <= 0) {  //判断version是否undefind 或者version.length<0
                    if (tempipfsData.version == 0) {
                        console.log("初始化");
                        //初始化新数据
                        var newversion = new Date().valueOf();
                        let profiles = {
                            name: loginObj.name, address: address,
                        }
                        var newdata = this.$JSON5.parse('{"version":"' + newversion + '","profiles":"' + this.$JSON5.stringify(profiles) + '","project":[],"models":[{"id":"sy","name":"allProjects","modelsType":"project","type":"model"}, {"id":"scj","name":"favorites","modelsType":"project","type":"model"}, {"id":"mm","name":"password","modelsType":"project","type":"model"}, {"id":"mb","name":"template","modelsType":"project","type":"model"}, {"id":"wbj","name":"unmarked","modelsType":"project","type":"model"},{"id":"ljt","name":"trash","modelsType":"project","type":"model"}, {"id":"06","name":"测试","modelsType":"directory","type":"model"}, ]}');
                        await this.db.defaults(newdata).write();
                        this.operateTemplates = this.$JSON5.parse(this.$JSON5.stringify(this.templates));
                        await this.db.set("templates", this.operateTemplates.templates).write();
                        await this.db.set('settings', this.settings).write();
                        this.getdirectory();
                    } else if (tempipfsData.version > 0) {
                        await this.db.defaults(tempipfsData).write();
                        this.getdirectory();
                        // console.log(JSON.stringify(this.db));
                    }
                } else if (version > tempipfsData.version) {
                    console.log("本机覆盖ipfs");
                    this.getdirectory();
                    // let transaction = await this.$myIpfs.write(JSON.stringify(this.db), address,loginObj.secret, letoperatorJID, operatorSecret);
                } else if (version < tempipfsData.version) {
                    console.log("ipfs覆盖本机");
                    this.cleardb();
                    await this.db.defaults(tempipfsData).write();
                } else {
                    this.getdirectory();
                }
                this.updatesetting();
                this.locksystem();
                //先删除
                //this.db.unset("project").write();
                //this.db.unset("models").write();
                //localStorage.removeItem(db_name);
                //console.log(localStorage.getItem(db_name));
                //console.log(localStorage.getItem(db_name));
                // this.db.get("project").remove().write();
                // this.db.get("models").remove().write();
            }, //手动同步。
            async synchronization() {
                var loginObj = this.$JSON5.parse(sessionStorage.getItem("userkeyObj"));
                var userJID = loginObj.address;
                // let userJID = "j4M4AoSi522XxNpywfyBahmjzQihc4EegL";
                let userSecret = loginObj.secret;
                // let userSecret = "sa9UcyBBD3A3JU3Ux3ZKcbNCxVw9h";
                let letoperatorJID = this.operatorJID;//运营商钱包地址
                let operatorSecret = this.operatorSecret; //运营商密钥
                let bal = loginObj.bal;//这个值从sessionStorage中取默认为false：未被激活
                if (!bal) {//未被激活时，判断用户钱包地址是否激活
                    this.$notify.error({
                        title: this.$t('main.note'),
                        message: this.$t('main.pleaseGoToTheOfficialWebsiteToActivateYourWallet')
                    });
                } else {
                    //读取IPFS中数据
                    let ipfsData = await this.$myIpfs.read(userJID, userSecret);
                    let tempipfsData = this.$JSON5.parse(this.$JSON5.stringify(ipfsData));
                    console.log(tempipfsData.version);
                    console.log(this.db.get("version").value());
                    if (tempipfsData.version > this.db.get("version").value()) {//version越大 内容越新
                        console.log("ipfs版本大于本地版本");
                        this.db = tempipfsData;
                        this.processShow = true;
                        this.percentage = 100;
                        this.synStatus = "success";
                    } else if (tempipfsData.version < this.db.get("version").value()) {
                        console.log("ipfs版本小于本地版本");
                        let transaction = await this.$myIpfs.write(JSON.stringify(this.db), userJID, userSecret, letoperatorJID, operatorSecret);
                        this.processShow = true;
                        this.percentage = 50;
                        if (await this.$myIpfs.tra(transaction) == "success") {
                            this.percentage = 100;
                            this.synStatus = "success";
                        }
                    } else {
                        console.log("ipfs版本等于本地版本");
                    }
                }
            }, // pwdLength(pwd) {
            //     password.pwStrength(pwd);
            //     this.percentageTemplate = password.percentage;
            //     this.tempPercentage= password.percentage;
            //     this.percentageTemplate=this.$JSON5.parse(this.$JSON5.stringify(this.tempPercentage));
            //     this.templateStatus = password.status;
            // },
            pwdLength(obj) {
                password.pwStrength(obj.val);
                obj.percentage = password.percentage;
                obj.pwdstatus = password.status;
            }, //格式化密码进度条
            format(percentage) {
                console.log(percentage);
                if (percentage <= 50) {
                    return percentage = this.$t('main.weak')
                } else if (percentage == 75) {
                    return percentage = this.$t('main.mid')
                } else if (percentage == 100) {
                    return percentage = this.$t('main.strong')
                }
            }, selectTemplate() {
                this.dialogVisibleTemplate = true;
                this.selectlabels = "";
                this.operateTemplates = this.$JSON5.parse(this.$JSON5.stringify(this.db.get("templates").value()));
            },
            projectlick(project, event) {
                let temp = this.db.get("templates").find({id: project.id}).value();
                let target = event.currentTarget;
                let index = Number(target.getAttribute("data-index"));
                this.currentTemplate = index;
                this.templateEvent = this.$JSON5.parse(this.$JSON5.stringify(temp));
                let modelsId = temp.modelsId;
                let models = [];
                for (var idIndex in modelsId) { //下拉框不显示mb
                    if (modelsId[idIndex].indexOf("mb") == -1) {
                        models.push(modelsId[idIndex]);
                    }
                }
                this.selectlabels = models;
            }, addproject() {
                if (this.templateEvent == "") {
                    this.$message.error(this.$t('main.pleaseChooseATemplate'));
                    return false;
                } else {
                    this.dialogVisibleTemplate = false;
                    this.dialogVisibleAddProject = true;
                }
            }, //数据提交
            submitproject() {
                let projectName = this.ruleFormAddProject.name;
                let formData = this.templateEvent;
                var newProject = ""
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
                this.newProject = {
                    "id": this.$Uuidv1(),
                    "name": projectName,
                    "modelsId": this.selectlabels, // "modelsName":newArray.toString(),
                    "isDel": false,
                    "type": "project",
                    "datas": formData.datas,
                    "dateTime": new Date().valueOf(),
                    "tempBase64": formData.tempBase64,
                    "imgHash": "",
                };
                //db project 追加数据
                this.db.get("project").push(this.$JSON5.parse(this.$JSON5.stringify(this.newProject))).write();
                // console.log(this.db.get("version").value())
                this.db.set('version', new Date().valueOf()).write();
                this.selectlabels = "";
                this.dialogVisibleAddProject = false;
                this.templateEvent = "";
                this.ruleFormAddProject.name = "";
                this.getdirectory();
                this.notesBytargeId(this.db.get("models").find({id: "sy"}).value());//刷新列表页
            }, //增加选中项
            selectFiled(command) {
                this.dialogVisibleItems = true;
                this.filed = this.$JSON5.parse(this.$JSON5.stringify(command));
                this.filedName = command.key
            }, //添加项目，模板增加项
            addFiled() {
                this.dialogVisibleItems = false;
                this.filed.tempkey = this.filedName;
                this.filed.id = this.$Uuidv1();
                this.templateEvent.datas.push(this.filed);
                this.filed = "";
                this.filedName = "";
            }, //修改选中项
            editSelectFiled(command) {
                this.dialogVisibleItemsEdit = true;
                this.filed = this.$JSON5.parse(this.$JSON5.stringify(command));
                this.filedName = command.key
            }, //修改项目，模板增加项
            editAddFiled() {
                this.dialogVisibleItemsEdit = false;
                this.filed.tempkey = this.filedName;
                this.filed.id = this.$Uuidv1(), this.editobject.datas.push(this.filed);
                this.filedName = "";
                this.filed = "";
            }, //修改页面
            editProject() {
                this.editobject = this.$JSON5.parse(this.$JSON5.stringify(this.projectEvent));
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
                }
            }, //修改project
            editDo() {
                try {
                    this.db.get("project").remove({id: this.editobject.id}).write();
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
                    // this.editobject.modelsName=newArray.toString();
                    this.db.get("project").push(this.$JSON5.parse(this.$JSON5.stringify(this.editobject))).write();
                    this.db.set('version', new Date().valueOf()).write();
                    this.dialogVisibleEdit = false
                    this.$message.success(this.$t('main.successfullyModified'));
                    this.projectEvent = this.editobject;
                    this.imageBase64 = "";
                    this.editobject = "";
                    this.selectlabels = "";
                    this.getdirectory();
                    this.notesBytargeId(this.db.get("models").find({id: this.directoryClickId}).value());//刷新列表页
                } catch (e) {
                    this.$message.error(this.$t('main.failToEdit'));
                }
            }, openDialogTemplate() {
                this.currentTemplate = -1;
                this.templateEvent = ""
            }, openSetting() {
                this.savePasswords=[{value: 'ask', label: this.$t('main.ask')}, {value: 'off', label: this.$t('main.shutDown')}, {value: 'automatically', label: this.$t('main.autofill')}];
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
            }, selectFiledTemplate(command) {
                this.dialogVisibleAddTempItems = true;
                this.filed = this.$JSON5.parse(this.$JSON5.stringify(command));
                this.filedName = command.key;
            }, addFiledTemplate() {
                this.dialogVisibleAddTempItems = false;
                this.filed.tempkey = this.filedName;
                this.filed.id = this.$Uuidv1(), this.tempTemplate.push(this.filed);
                this.filed = "";
                this.filedName = "";
            }, //增加模板
            async saveTemplate() {
                let letoperatorJID = this.operatorJID;//运营商钱包地址
                let operatorSecret = this.operatorSecret; //运营商密钥
                var loginObj = this.$JSON5.parse(sessionStorage.getItem("userkeyObj"));
                var address = loginObj.address;
                //处理分类
                if (this.selectlabels.indexOf("mb") == -1) {
                    this.selectlabels.push("mb");//必须增加模板分类
                }
                //图片
                let data = '{"base64":"' + this.imageBase64 + '"}';
                // this.imgHash = await this.$myIpfs.writeTest('file', data,  address,loginObj.secret, letoperatorJID, operatorSecret);
                this.newTemplate = {
                    "id": this.$Uuidv1(),
                    "name": this.ruleFormAddTemplate.name,
                    "modelsId": this.selectlabels,
                    "modelsName": "模板",
                    "isDel": false,
                    "type": "template",
                    "datas": this.tempTemplate,
                    "tempBase64": this.imageBase64,
                    "imgHash": this.imgHash,
                }
                this.db.get("templates").push(this.$JSON5.parse(this.$JSON5.stringify(this.newTemplate))).write();
                console.log(this.newTemplate);
                //清空变量
                this.ruleFormAddTemplate.name = "", this.imageBase64 = "";
                this.imgHash = "";
                this.newTemplate = "";
                this.tempTemplate = [];
                this.selectlabels = "";
                this.dialogVisibleAddTemplate = false;
                this.getdirectory();
                this.notesBytargeId(this.db.get("models").find({id: "mb"}).value());//刷新列表页
            }, //修改模板
            editTemplate() {
                if (this.selectlabels.indexOf("mb") == -1) {
                    this.selectlabels.push("mb");//必须增加模板分类
                }
                try {
                    this.db.get("templates").remove({id: this.editobject.id}).write();
                    this.editobject.modelsId = this.selectlabels;
                    this.db.get("templates").push(this.$JSON5.parse(this.$JSON5.stringify(this.editobject))).write();
                    this.db.set('version', new Date().valueOf()).write();
                    this.dialogVisibleTemplateEdit = false
                    this.$message.success(this.$t('main.successfullyModified'));
                    this.projectEvent = this.editobject;
                    this.editobject = "";
                    this.imageBase64 = "";
                    this.selectlabels = "", this.getdirectory();
                    this.notesBytargeId(this.db.get("models").find({id: "mb"}).value());//刷新列表页
                } catch (e) {
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
                console.log(itemArray);
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
                var setting = this.db.get("settings").value();
                this.systemlock = setting.systemlock;
                if (this.systemlock) {
                    this.locktimedisabled = false;
                } else {
                    this.locktimedisabled = true;
                }
                this.locktime = setting.locktime;//自动锁定时间
                this.language = setting.language;//语言选择
                this.showPassword = setting.showPassword;//是否显示密码
                this.savePassword = setting.savePassword;
            },
            //保存设置
            savesettings() {
                try {
                    this.db.get("settings").set("systemlock", this.systemlock).write();
                    this.db.get("settings").set("locktime", this.locktime).write();
                    this.db.get("settings").set("showPassword", this.showPassword).write();
                    this.db.get("settings").set("savePassword", this.savePassword).write();
                    this.db.get("settings").set("language", this.language).write();
                    this.$message.success(this.$t('main.settingSavedSuccessfully'));
                    this.dialogVisibleSetting = false;
                } catch (e) {
                    this.$message.error(this.$t('main.settingSaveFailed'));
                }
            },
            //搜索框
            search(temp){
                this.projects = [];
                let projectArray = [];
                let templateArray = [];
                let tempProjects = [];
                let tempTemplates = [];
                //project
                if (this.delobj.id != "mb") {
                    projectArray = this.db.get("project").value();
                    for (var projectIndex in projectArray) {
                        if (projectArray[projectIndex].name.indexOf(temp) != -1) {
                            tempProjects.push(projectArray[projectIndex]);
                        }
                    }
                    this.projects = tempProjects;
                } else {
                    //template
                    templateArray = this.db.get("templates").value();
                    for (var templateIndex in templateArray) {
                        if (templateArray[templateIndex].name.indexOf(temp) != -1) {
                            tempTemplates.push(templateArray[templateIndex]);
                        }
                        this.projects = tempTemplates;
                    }
                }
            }, //图片处理(增加模板)
            handleAvatarSuccessAdd(res, file) {
                let temp = this;
                var reader = new FileReader();
                var base64 = "";
                reader.readAsDataURL(file.raw);
                reader.onload = async function (e) {
                    temp.imageBase64 = this.result;
                    console.log(temp.imageBase64);
                }
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
            }, //图片处理（增加项目）
            handleAvatarSuccessAddPro(res, file){
                let temp = this;
                var reader = new FileReader();
                var base64 = "";
                reader.readAsDataURL(file.raw);
                reader.onload = async function (e) {
                    temp.imageBase64 = this.result;
                    temp.templateEvent.tempBase64 = this.result;
                }
            }, //图片大小验证
            beforeAvatarUpload(file) {
                let types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png', 'image/svg'];
                const isImage = types.includes(file.type);
                const isLt200K = file.size / 1024 / 1024 / 1024 < 200;
                if (!isImage) {
                    this.$message.error('上传头像图片只能是 JPG ,GIF,BMP,PNG,SVG 格式!');
                }
                if (!isLt200K) {
                    this.$message.error('上传头像图片大小不能超过 200KB!');
                }
                return isImage && isLt200K;
            },
            favorite(obj){
                if (obj.isDel) {
                    return false;
                }
                console.log(obj);
                console.log("收藏");
                obj.modelsId.push("scj");
                if (obj.modelsId.indexOf("wbj") != -1) {//有未标记项，删除
                    obj.modelsId = obj.modelsId.filter(function (item) {
                        return item !== "wbj"
                    })
                }
                this.db.set('version', new Date().valueOf()).write();
                this.getdirectory();
                this.notesBytargeId(this.db.get("models").find({id: this.directoryClickId}).value());//刷新列表页
            },
            unfavorite(obj){
                if (obj.isDel) {
                    return false;
                }
                console.log("取消收藏");
                //删除指定项
                obj.modelsId = obj.modelsId.filter(function (item) {
                    return item !== "scj"
                })
                if (obj.modelsId.length == 1 && obj.modelsId.indexOf("sy") != -1) {
                    obj.modelsId.push("wbj");//只有所有项，增加未标记项
                }
                this.db.set('version', new Date().valueOf()).write()
                this.getdirectory();
                this.notesBytargeId(this.db.get("models").find({id: this.directoryClickId}).value());//刷新列表页
            },
            passwordGenerator() {
                this.dialogVisiblePasswordGenerator = true;
            },
            //国际化(整体配置)
            changeLang(lan) {
                if (lan === "中文") {
                    this.$i18n.locale = 'zh-CN';
                } else if(lan === "English"){
                    this.$i18n.locale = 'en-US';
                }
                this.getdirectory();
                //国际化设置菜单中 保存用户和密码下来框
                this.savePasswords=[{value: 'ask', label: this.$t('main.ask')}, {value: 'off', label: this.$t('main.shutDown')}, {value: 'automatically', label: this.$t('main.autofill')}];
                 localStorage.setItem('lang', this.$i18n.locale);

            },
            //国际化（目录）
            international(name){
                var directory ={"allProjects":this.$t('main.allProjects'),"favorites":this.$t('main.favorites'),"password":this.$t('main.password'),
                         "template":this.$t('main.template'),"unmarked":this.$t('main.unmarked'),"trash":this.$t('main.trash')};
                 for(var index in directory){
                    if(name==index){
                        name = directory[index];
                    }
                 }
                return name;
            },
            //恢复
            recover(){
                if(this.projectEvent.type=="project"){
                   this.db.get("project").find({id: this.projectEvent.id}).set("isDel", false).write();
                }else if(this.projectEvent.type=="template"){
                   this.db.get("templates").find({id: this.projectEvent.id}).set("isDel", false).write();
                }
              this.dialogRecover = false;
              this.getdirectory();
            },

            //清空垃圾箱
            clearTrash(){
                let delTemplate = this.db.get("templates").filter({isDel: true}).value();
                for(var index in delTemplate){
                    this.db.get("templates").remove({id: delTemplate[index].id}).write();
                }
                let delProject = this.db.get("project").filter({isDel: true}).value();
                for(var index in delProject){
                    this.db.get("project").remove({id: delProject[index].id}).write();
                }
                this.dialogclearTrash= false;
                this.getdirectory();
            }
        }
    }
</script>
<style>
    @import './css/base.css';
    @import './css/sy.css';
</style>
