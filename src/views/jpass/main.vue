<template>
    <body class="sy" @mousemove="GetXYPosition">
    <!-- 头部 -->
    <header class="header">
        <h1 style="margin-left: 40px;">
            <a href="#">
                <img src="./img/Logo-4.svg" alt="">
            </a>
        </h1>
        <ul class="link">
            <li>
                <el-button @click="addDirectoryOP" style="border:0"><img style="top:-2px;height: 25px;width: 25px;" src="./img/tianjiawenjianjia.svg" alt="">{{$t('main.newFolder')}}
                </el-button>
            </li>
            <li>
                <el-button @click="addTemplate" style="border:0"><img style="top:-2px;height: 20px;width: 20px;" src="./img/moban.svg" alt="">{{$t('main.newTemplate')}}
                </el-button>
            </li>
            <li>
                <el-button @click="selectTemplate" style="border:0"><img style="top:-2px;height: 20px;width: 20px;" src="./img/tianjiaxiangmu.svg" alt="">{{$t('main.newProject')}}
                </el-button>
            </li>

            <li>
                <el-button :disabled="isDisabled" @click="remove()" id="delbtn" style="border:0"><img style="top:-2px;" src="./img/ICON-SC.svg" alt="">{{$t('main.delete')}}
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
            <!--<li>-->
            <!--<el-button @click=""><img style="top:-2px;" src="./img/ICON-SCQ.svg" alt="">初始化钱包</el-button>-->
            <!--</li>-->
        </ul>
        <div class="hr" style="margin-left: 180px;">
            <!--<a href="#" class="mr2w">-->
            <!--<img src="./img/icon_tz.svg" alt="">-->
            <!--</a>-->
            <a href="#" style="margin:0;width: 100px;" class="mr4w" @click="openSetting">
                <img src="./img/icon_sz.svg" alt="">
            </a>
            <div class="touxiang" style="margin:0;">
                <img src="./img/tx.svg" alt="">
                <div>
                    <a href="#">请叫我特仑苏</a>
                    <span>yuansushi@163.com</span>
                </div>
            </div>
            <el-button style="border:0;height: 50px;margin: auto 0" @click="logOut">退出登录</el-button>
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
                    <span>{{project.name}}</span>
                    <i>{{project.count}}</i>
                </li>
            </ul>
            <h3>{{$t('main.folder')}}</h3>
            <ul class="dhwjj" id="DirUL">
                <li v-for="(project,index) in DDirectory.directory" @click="directoryclick(project,$event)"
                    :data-index="index"
                    :class="index == currentDirectory?click:disclick">
                    <span>{{project.name}}</span>
                    <i>{{project.count}}</i>
                </li>
            </ul>
            <!--<a href="#" class="jh" @click="addDirectoryOP">+</a>-->
        </nav>
        <!-- 副导航栏 -->
        <article class="article">
            <input class="ss" type="text" :placeholder="$t('main.pleaseEnterWhatYouWantToSearch')">
            <ul class="list">
                <li v-for="(project,index) in projects" @click="noteslick(project,$event)" :data-index="index"
                    :class="index == currentNote?click:disclick">
                    <img src="./img/list_logo01.png" alt="" width="30" height="30">
                    <div>
                        <h5>{{project.name}}</h5>
                        <span>{{project.name}}</span>
                    </div>
                </li>
            </ul>
        </article>
        <section class="section">
            <el-form :model="ruleFormProjectDetail" ref="ruleFormProjectDetail" label-width="100px" class="demo-ruleForm" label-position="top"
                     style="width:80%;height:95%;margin: auto;text-align: left;margin-top:3%;">
                <el-form-item :label="$t('main.name')" v-if="this.projectEvent!=''"  style="margin-bottom:3px;"  prop="name">
                    <input type="text" v-model="projectEvent.name" readonly/>
                    <hr/>
                </el-form-item>
                <template v-for="(data, index) in this.projectEvent.datas">
                    <el-form-item v-if="data.type==='password' && !showPassword" :label="data.tempkey" :prop="data.tempkey" style="margin-bottom:3px;">
                        <input type="password" v-model="data.val" readonly style="width:90%;color: #606266"/><a href="#" @click="changePass($event)" ><i
                            class="el-icon-view"></i></a>
                        <el-progress id="process" :stroke-width="15" :percentage="data.percentage" :text-inside="true" :status="data.pwdstatus" :format="format" style="width:50%;margin-top: 1%"></el-progress>
                        <hr/>
                    </el-form-item>
                    <el-form-item v-else-if="data.type==='password' && showPassword" :label="data.tempkey" :prop="data.tempkey" style="margin-bottom:3px;">
                        <input type="text" v-model="data.val" readonly style=""/><a href="#" @click="changePass($event)" ><i
                            class="el-icon-view"></i></a>
                        <el-progress id="process" :stroke-width="15" :percentage="data.percentage" :text-inside="true" :status="data.pwdstatus" :format="format" style="width:50%;margin-top: 1%"></el-progress>
                        <hr/>
                    </el-form-item>
                    <el-form-item v-else-if="data.type==='text'" :label="data.tempkey" :prop="data.tempkey" style="margin-bottom:3px;">
                        <input type="text" v-model="data.val" readonly/>
                        <hr/>
                    </el-form-item>
                </template>
                <el-button size="small" v-if="this.projectEvent!=''" @click="editProject()">{{$t('main.modify')}}</el-button>
                <!--<el-button size="small" v-if="this.projectEvent!=''" @click="dialogVisibleAddProject = false">取 消</el-button>-->
            </el-form>
        </section>
        <el-dialog :title="$t('main.passwordUnlock')" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <el-form label-width="100px" class="demo-ruleForm" style="width:80%;">
                <el-form-item :label="$t('main.loginPassword')" prop="password" >
                    <el-input type="password" v-model="password" style="width:90%;"></el-input>
                </el-form-item>
                <el-form-item label="" prop="" style="margin-bottom: 7%;margin-top: 10%">
                    <el-button type="primary" size="small"   @click="unlock()">{{$t('main.unlock')}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog :title="$t('main.addDirectory')" :visible.sync="dialogVisible2" width="30%" :close-on-click-modal="false" :show-close="false">
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="width: 80%;">
                <!--<el-form-item label="类型选择" prop="modelsType">-->
                <!--<el-radio v-model="ruleForm.modelsType" label="project" style="float:left;line-height: inherit">目录</el-radio>-->
                <!--<el-radio v-model="ruleForm.modelsType" label="directory" style="float:left;line-height: inherit">文件夹</el-radio>-->
                <!--</el-form-item>-->
                <el-form-item :label="$t('main.name')" prop="pName" style="">
                    <el-input v-model="ruleForm.pName" style="width:100%;"></el-input>
                </el-form-item>
                <el-form-item label="" prop="" style="margin-top:10%;text-align: center">
                    <el-button type="primary" size="small"  @click="submitForm('ruleForm')">{{$t('main.ok')}}</el-button>
                    <el-button  size="small"  @click="cancel('ruleForm')">{{$t('main.cancel')}}</el-button>
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
        <!--删除项目弹出框-->
        <el-dialog :title="$t('main.prompt')" :visible.sync="dialogVisibledProject" width="30%">
            <span>{{$t('main.doYouWantToDeleteTheProject')}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="removeData()">{{$t('main.okFormat')}}</el-button>
                <el-button size="small" @click="dialogVisibledProject = false">{{$t('main.cancelFormat')}}</el-button>
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
        <el-dialog :title="$t('main.selectTemplate')" :visible.sync="dialogVisibleTemplate" width="30%" height="30%" :close-on-click-modal="false" @open='openDialogTemplate'>
            <ul style="border:1px solid #9E9E9E;padding: 2px;height: 40vh;overflow-y:auto;">
                <li v-for="(project,index) in this.operateTemplates" @click="projectlick(project,$event)" :data-index="index"
                    :class="index == currentTemplate?click:disclick" style="height:5vh;border: 0;text-align: left;">
                        <span style="border: 1px solid #9E9E9E;display:inline-block;height:5vh;width:5vh;margin-left:2px;line-height:5vh;vertical-align:middle;text-align: center">图片</span>
                        <span style="margin-left: 3%;font-size: 15px">{{project.name}}</span>
                </li>
            </ul>
            <el-button style="margin-top: 5%" size="small" type="primary" @click="addproject('ruleFormAddProject')">{{$t('main.okFormat')}}</el-button>
            <el-button size="small" @click="dialogVisibleTemplate = false">{{$t('main.cancelFormat')}}</el-button>
        </el-dialog>
        <!--增加项目弹出框-->
        <el-dialog class="mb" :title="$t('main.addItem')" :visible.sync="dialogVisibleAddProject" width="40%" :close-on-click-modal="false">
            <el-form :model="ruleFormAddProject" ref="ruleFormAddProject" label-width="100px" class="demo-ruleForm"
                     style="width: 80%;margin: auto">
                <el-form-item :label="$t('main.name')" style="width: 90%;margin-bottom: -6%" prop="name">
                    <input type="text" v-model="ruleFormAddProject.name" class="myInput"/>
                </el-form-item>
                <template v-for="(data, index) in this.templateEvent.datas">
                    <el-form-item v-if="data.type==='password' && !showPassword" :label="data.tempkey" :prop="data.tempkey" style="margin-top:10%;width: 90%;margin-bottom: -6%">
                        <input type="password" v-model="data.val" @input="pwdLength(data)" class="myInput"/>
                        <a href="#" @click="changePass($event)"><i class="el-icon-view"></i></a>
                        <a href="#"><i class="el-icon-close" @click="addProjectRemoveItem(data.id)"></i></a>
                        <el-progress id="process" :stroke-width="15" :percentage="data.percentage" :text-inside="true"
                                     :status="data.pwdstatus" :format="format"
                                     style="width:80%;margin-top: 1%"></el-progress>
                    </el-form-item>
                    <el-form-item v-else-if="data.type==='password' && showPassword" :label="data.tempkey" :prop="data.tempkey" style="margin-top:10%;width: 90%;margin-bottom: -6%">
                        <input type="text" v-model="data.val" @input="pwdLength(data)" class="myInput"/>
                        <a href="#" @click="changePass($event)"><i class="el-icon-view"></i></a>
                        <a href="#"><i class="el-icon-close" @click="addProjectRemoveItem(data.id)"></i></a>
                        <el-progress id="process" :stroke-width="15" :percentage="data.percentage" :text-inside="true" :status="data.pwdstatus" :format="format" style="width:80%;margin-top: 1%"></el-progress>
                    </el-form-item>
                    <el-form-item v-else-if="data.type==='text'" :label="data.tempkey" :prop="data.tempkey" style="margin-top:10%;width: 90%;margin-bottom: -6%">
                        <input type="text" v-model="data.val" class="myInput"/>
                        <a href="#"><i class="el-icon-close" @click="addProjectRemoveItem(data.id)"></i></a>
                    </el-form-item>
                </template>
                <el-form-item :label="$t('main.chooseCategory')" style="margin-top:10%;">
                    <el-select v-model="selectlabels" multiple :placeholder="$t('main.pleaseChoose')" style="float: left;width:80%">
                        <el-option v-for="(item,index) in this.labels.labels" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('main.addOtherItems')" style="margin-bottom: 10%;" >
                    <el-dropdown @command="selectFiled" style="float: left">
                        <el-button>
                            {{$t('main.addOtherItems')}}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(item,index) in this.templateItemsTemp.templateItems" :command="item">{{item.key}}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form-item>
                <el-button size="small" type="primary" @click="submitproject()">{{$t('main.okFormat')}}</el-button>
                <el-button size="small" @click="dialogVisibleAddProject = false">{{$t('main.cancelFormat')}}</el-button>
            </el-form>
        </el-dialog>
        <!--增加Items 弹出框-->
        <el-dialog :title="$t('main.additionalItem')" :visible.sync="dialogVisibleItems" width="30%" :close-on-click-modal="false"
                   :close-on-press-escape="false" :show-close="true">
            <el-form label-width="100px" class="demo-ruleForm">
                <el-form-item label="name" prop="name" style="margin-top:10%">
                    <el-input type="text" v-model="filedName" style="width:100%;"></el-input>
                </el-form-item>
                <el-form-item label="" prop="" style="margin-top:10%">
                    <el-button type="primary" size="small" style="width:35%;float:left;" @click="addFiled">{{$t('main.ok')}}
                    </el-button>
                    <el-button type="primary" size="small" style="width:35%;float:left;"
                               @click="dialogVisibleItems=false">{{$t('main.cancel')}}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--修改模板项弹出框-->
        <el-dialog :title="$t('main.additionalItem')" :visible.sync="dialogVisibleItemsEdit" width="30%" :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :show-close="true">
            <el-form label-width="100px" class="demo-ruleForm">
                <el-form-item label="name" prop="name" style="margin-top:10%">
                    <el-input type="text" v-model="filedName" style="width:100%;"></el-input>
                </el-form-item>
                <el-form-item label="" prop="" style="margin-top:10%">
                    <el-button type="primary" size="small" style="width:35%;float:left;" @click="editAddFiled">{{$t('main.ok')}}
                    </el-button>
                    <el-button type="primary" size="small" style="width:35%;float:left;"
                               @click="dialogVisibleItemsEdit=false">{{$t('main.cancel')}}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--增加模板项弹出框-->
        <el-dialog :title="$t('main.additionalItem')" :visible.sync="dialogVisibleAddTempItems" width="30%" :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :show-close="true">
            <el-form label-width="100px" class="demo-ruleForm">
                <el-form-item label="name" prop="name" style="margin-top:10%">
                    <el-input type="text" v-model="filedName" style="width:100%;"></el-input>
                </el-form-item>
                <el-form-item label="" prop="" style="margin-top:10%">
                    <el-button type="primary" size="small" style="width:35%;float:left;" @click="addFiledTemplate">{{$t('main.ok')}}
                    </el-button>
                    <el-button type="primary" size="small" style="width:35%;float:left;" @click="dialogVisibleAddTempItems = false">{{$t('main.cancel')}}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--修改项目-->
        <el-dialog class="mb" title="修改项目" :visible.sync="dialogVisibleEdit" width="40%" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="true">
            <el-form :model="ruleFormProjectEdit" ref="ruleFormProjectEdit" label-width="100px" class="demo-ruleForm" style="width: 80%;margin: auto">
                <el-form-item label="名称"   style="width: 90%;margin-bottom: -6%" prop="name">
                    <input type="text" v-model="editobject.name" class="myInput" />
                </el-form-item>
                <template v-for="(data, index) in this.editobject.datas">
                    <el-form-item v-if="data.type==='password' && !showPassword" :label="data.tempkey" :prop="data.tempkey"  style="margin-top:10%;width: 90%;margin-bottom: -6%">
                        <input type="password" v-model="data.val" @input="pwdLength(data)" class="myInput"/>
                        <a href="#" @click="changePass($event)"><i class="el-icon-view"></i></a>
                        <a href="#"><i class="el-icon-close" @click="editRemoveItem(data.id)"></i></a>
                        <el-progress id="process" :stroke-width="15" :percentage="data.percentage"
                                     :status="data.pwdstatus" :text-inside="true" :format="format"
                                     style="width:80%;margin-top: 1%"></el-progress>
                    </el-form-item>
                    <el-form-item v-if="data.type==='password' && showPassword" :label="data.tempkey" :prop="data.tempkey"   style="margin-top:10%;width: 90%;margin-bottom: -6%" >
                        <input type="text" v-model="data.val" @input="pwdLength(data)" class="myInput"/>
                        <a href="#" @click="changePass($event)"><i class="el-icon-view"></i></a>
                        <a href="#"><i class="el-icon-close" @click="editRemoveItem(data.id)"></i></a>
                        <el-progress id="process" :stroke-width="15" :percentage="data.percentage" :status="data.pwdstatus" :text-inside="true" :format="format" style="width:80%;margin-top: 1%"></el-progress>
                    </el-form-item>
                    <el-form-item v-else-if="data.type==='text'" :label="data.tempkey" :prop="data.tempkey"  style="margin-top:10%;width: 90%;margin-bottom: -6%">
                        <input type="text" v-model="data.val" class="myInput"/>
                        <a href="#"><i class="el-icon-close" @click="editRemoveItem(data.id)"></i></a>
                    </el-form-item>
                </template>
                <el-form-item :label="$t('main.chooseCategory')" style="margin-top:10%;">
                    <el-select v-model="selectlabels" multiple :placeholder="$t('main.pleaseChoose')" style="float: left;width:80%">
                        <el-option v-for="(item,index) in this.labels.labels" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('main.addOtherItems')" style="margin-bottom:10%;">
                    <el-dropdown @command="editSelectFiled" style="float: left">
                        <el-button>
                            {{$t('main.addOtherItems')}}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(item,index) in this.templateItemsTemp.templateItems"
                                              :command="item">{{item.key}}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form-item>
                <el-button size="small" type="primary" @click="editDo">{{$t('main.submit')}}</el-button>
                <el-button size="small" @click="dialogVisibleEdit = false">{{$t('main.cancelFormat')}}</el-button>
            </el-form>
        </el-dialog>
        <!--设置弹出框-->
        <el-dialog title="" :visible.sync="dialogVisibleSetting" width="50%" :show-close="true" style="text-align: left">
            <div style="text-align: center;font-weight:bolder">{{$t('main.systemSettings')}}</div>
            <el-form label-width="100px" style="border: 1px solid #50A4FF">
                <el-form-item prop="">
                    <div style="font-weight:bold">{{$t('main.locking')}}</div>
                    {{$t('main.timedLock')}}
                    <el-switch v-model="systemlock" active-color="#13ce66" inactive-color="#ff4949" @change="locksystem()"></el-switch>
                    <br>
                    {{$t('main.idleTime')}}
                    <el-slider v-model="locktime" :disabled="locktimedisabled"></el-slider>
                </el-form-item>
                <el-form-item prop="">
                    <div style="font-weight:bolder">{{$t('main.language')}}</div>
                    <el-select v-model="language" :placeholder="$t('main.languageSelection')" @change="changeLang">
                        <el-option v-for="item in this.languages" :key="item.value" :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="">
                    <div style="font-weight:bolder">{{$t('main.passwordService')}}</div>
                    {{$t('main.showPassword')}}
                    <el-switch v-model="showPassword" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                    <br>
                    {{$t('main.newUserAndPasswordAreAutomaticallySaved')}}
                    <el-select v-model="savePassword" :placeholder="$t('main.pleaseChoose')">
                        <el-option v-for="item in this.savePasswords" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" prop="" style="margin-top:5%;text-align: center">
                    <el-button type="primary" size="small" style="width:35%;" @click="savesettings">{{$t('main.save')}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--增加模板-->
        <el-dialog class="mb" :title="$t('main.addTemplate')" :visible.sync="dialogVisibleAddTemplate" width="40%" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="true">
            <el-form :model="ruleFormAddTemplate" ref="ruleFormAddTemplate" label-width="100px" class="demo-ruleForm" style="width: 80%;margin: auto">
                <el-form-item :label="$t('main.templateName')" style="width: 90%;margin-bottom: -6%" prop="name">
                    <el-input type="text" v-model="ruleFormAddTemplate.name" style="width:90%;float: left"></el-input>
                </el-form-item>
                <template v-for="(data, index) in this.tempTemplate">
                    <el-form-item v-if="data.type==='password'" :label="data.tempkey" :prop="data.tempkey" style="margin-top:10%;width: 90%;margin-bottom: -6%">
                        <el-input type="password" v-model="data.val" readonly style="width:90%;float: left"></el-input>
                        <a href="#"><i class="el-icon-close"  @click="addTemplageRemoveItem(data.id)" ></i></a>
                    </el-form-item>
                    <el-form-item v-else-if="data.type==='text'" :label="data.tempkey" :prop="data.tempkey" style="margin-top:10%;width: 90%;margin-bottom: -6%">
                        <el-input type="text" v-model="data.val" readonly style="width:90%;float: left"></el-input>
                        <a href="#"><i class="el-icon-close"  @click="addTemplageRemoveItem(data.id)" ></i></a>
                    </el-form-item>
                </template>
                <el-form-item :label="$t('main.addOtherItems')" style="margin-top:10%;margin-bottom: 10%;">
                    <el-dropdown @command="selectFiledTemplate" style="float: left">
                        <el-button>
                            {{$t('main.addOtherItems')}}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(item,index) in this.templateItems.templateItems" :command="item">
                                {{item.key}}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form-item>
                <el-button size="small" type="primary" @click="saveTemplate">提交</el-button>
                <el-button size="small" @click="dialogVisibleAddTemplate = false">取 消</el-button>
            </el-form>
        </el-dialog>
        <!--修改模板弹出框-->
        <el-dialog :title="$t('main.modifyTemplate')" class="mb" :visible.sync="dialogVisibleTemplateEdit" width="40%" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="true">
            <el-form :model="ruleFormTemplateEdit" ref="ruleFormTemplateEdit" label-width="100px" class="demo-ruleForm" style="width: 85%;margin: auto">
                <el-form-item :label="$t('main.name')" style="width: 90%;margin-bottom: -6%" prop="name">
                    <el-input type="text" v-model="editobject.name" style="float: left;width:90%;"></el-input>
                </el-form-item>
                <template v-for="(data, index) in this.editobject.datas">
                    <el-form-item v-if="data.type==='password'" :label="data.tempkey" :prop="data.tempkey" style="margin-top:10%;width: 90%;margin-bottom: -6%">
                        <el-input type="password" v-model="data.val" readonly style="float: left;width:90%;"></el-input>
                        <a href="#"><i class="el-icon-close"  @click="editRemoveItem(data.id)"></i></a>
                    </el-form-item>
                    <el-form-item v-else-if="data.type==='text'" :label="data.tempkey" :prop="data.tempkey" style="margin-top:10%;width: 90%;margin-bottom: -6%">
                        <el-input type="text" v-model="data.val" style="float: left;width:90%;" readonly></el-input>
                        <a href="#"><i class="el-icon-close"  @click="editRemoveItem(data.id)"></i></a>
                    </el-form-item>
                </template>
                <el-form-item :label="$t('main.addOtherItems')" style="margin-top:10%;margin-bottom: 10%;">
                    <el-dropdown @command="editSelectFiled" style="float: left">
                        <el-button>
                            {{$t('main.addOtherItems')}}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(item,index) in this.templateItems.templateItems" :command="item">
                                {{item.key}}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form-item>
                <el-button size="small" type="primary" @click="editTemplate">{{$t('main.submit')}}</el-button>
                <el-button size="small" @click="dialogVisibleTemplateEdit = false">{{$t('main.cancelFormat')}}</el-button>
            </el-form>
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
            this.initialize();
        },
        data() {
            return {
                //系统设置配置项
                systemlock: "",//锁定开关
                locktime:"",//自动锁定时间
                languages: [{value: '中文', label: '中文'}, {value: 'English', label: 'English'}],
                language: '',//语言选择
                showPassword: "",//是否显示密码
                savePassword:"",
                savePasswords: [{value: 'ask', label: this.$t('admin.ask')}, {value: 'off', label: this.$t('admin.shutDown')}, {value: 'automatically', label:this.$t('admin.autofill')}],
                showpassword:"",
                locktimedisabled:"",
                showpass:"",
                //弹出框
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
                projects: '',
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
                newProject: {
                    "id": "",
                    "name": "",
                    "modelsId": "",
                    "type": "project",
                    "datas": "",
                    "imgPaht": "",
                    "dateTime": ""
                },
                newTemplate: {
                    "id": "",
                    "name": "",
                    "modelsId": ["mb"],
                    "type": "template",
                    "datas": []
                },
                templates: {
                    "templates": [
                        {
                            "id": "01",
                            "name": "membership",
                            "modelsId": ["mb"],
                            "type": "template",
                            "datas": [
                                {
                                    "id": "fdbce150-fec4-11e9-bd45-854c67bf088b",
                                    "key": "Number",
                                    "type": "text",
                                    "val": "",
                                    "tempkey": "Number",
                                },
                                {
                                    "id": "fdbce182-fec4-11e9-bd32-854c67bf088b",
                                    "key": "Login",
                                    "type": "text",
                                    "val": "",
                                    "tempkey": "Login",
                                },
                                {
                                    "id": "fdbce150-fob4-11e9-bd32-854c67bf088b",
                                    "key": "Password",
                                    "type": "password",
                                    "val": "",
                                    "tempkey": "Password",
                                    "percentage": 0,
                                    "pwdstatus": "",
                                },
                                {
                                    "id": "fdbce196-fec4-11e9-bd32-854c67bf088b",
                                    "key": "Website",
                                    "type": "text",
                                    "val": "",
                                    "tempkey": "Website"
                                },
                                {
                                    "id": "fdbce150-fec4-11e9-bd32-854c67bf987b",
                                    "key": "Phone",
                                    "type": "text",
                                    "val": "",
                                    "tempkey": "Phone"
                                }
                            ]
                        },
                        {
                            "id": "02",
                            "name": "EmailAccount",
                            "modelsId": ["mb"],
                            "type": "template",
                            "datas": [
                                {
                                    "id": "fdbce183-fec4-11e9-bd32-854c67bf088b",
                                    "key": "Email",
                                    "type": "text",
                                    "val": "",
                                    "tempkey": "Email"
                                },
                                {
                                    "id": "fdbce269-fec4-11e9-bd32-854c67bf088b",
                                    "key": "Password",
                                    "type": "password",
                                    "val": "",
                                    "tempkey": "Password",
                                    "percentage": 0,
                                    "pwdstatus": "",
                                },
                                {
                                    "id": "fffce150-fec4-11e9-bd32-854c67bf088b",
                                    "key": "Website",
                                    "type": "text",
                                    "val": "",
                                    "tempkey": "Website"
                                },
                                {
                                    "id": "fdbce161-fec4-11e9-bd32-854c67bf088b",
                                    "key": "One-time Password",
                                    "type": "text",
                                    "val": "",
                                    "tempkey": "One-time Password"
                                }
                            ]
                        },
                        {
                            "id": "03",
                            "name": "Login/Password",
                            "modelsId": ["mb"],
                            "type": "template",
                            "datas": [
                                {
                                    "id": "fdbce150-fec4-20e9-bd32-854c67bf088b",
                                    "key": "Email",
                                    "type": "text",
                                    "val": "",
                                    "tempkey": "Email"
                                },
                                {
                                    "id": "fdbce150-feb9-11e9-bd32-854c67bf088b",
                                    "key": "Password",
                                    "type": "password",
                                    "val": "",
                                    "tempkey": "Password",
                                    "percentage": 0,
                                    "pwdstatus": "",
                                }
                            ]
                        }
                    ]
                },
                templateItems: {
                    "templateItems": [
                        {
                            "id": "fdbce150-fec4-11e9-bd32-854c67bf088b",
                            "key": "Password",
                            "type": "password",
                            "val": "",
                            "tempkey": "Password",
                            "percentage": 0,
                            "pwdstatus": "",
                        },
                        {
                            "id": "fdbce150-fec4-11e9-bd32-854c67bf388b",
                            "key": "Number",
                            "type": "text",
                            "val": "",
                            "tempkey": "Number"
                        },
                        {
                            "id": "fdbce150-fec4-11e9-bd32-984c67bf088b",
                            "key": "Email",
                            "type": "text",
                            "val": "",
                            "tempkey": "Email"
                        },
                        {
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
                    modelsType: '',
                    pName: '',
                },
                ruleFormAddProject: {
                    name: '',
                    models: ''
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
                    modelsType: [
                        {required: true, message: this.$t('main.pleaseChooseTheType'), trigger: 'blur'},
                    ],
                    pName: [
                        {required: true, message: this.$t('main.pleaseEnterAName'), trigger: 'blur'},
                        {min: 1, max: 10, message: this.$t('main.theLengthIsBetween1And10Characters'), trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            logOut() {
                sessionStorage.removeItem("userkeyObj");
                this.$router.push("/jpass/login");
            },
            //密码显示控制
            changePass(e) {
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
            },
            lock() {
                this.loginObj.lock = true;
                sessionStorage.setItem("userkeyObj", this.$JSON5.stringify(this.loginObj));
                this.dialogVisible = true;
            },
            //获取目录
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
                    if (alldata[modelkey].id != "mb") {
                        for (var projectkey in allProjects) {
                            var project = allProjects[projectkey];
                            var types = project.modelsId;
                            if (types.indexOf(alldata[modelkey].id) != -1) {
                                count++;
                            }
                        }
                    } else {
                        count = this.db.get("templates").size().value();
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
                    if (object.id != "sy" && object.id != "wbj" && object.id != "mb") {
                        labelsString = labelsString + this.$JSON5.stringify(object) + ",";
                    }
                }
                projectstring = projectstring.substring(0, projectstring.length - 1);
                jsonProjectstring = "{project:[" + projectstring + "]}";
                directoryString = directoryString.substring(0, directoryString.length - 1);
                jsonDirectoryString = "{directory:[" + directoryString + "]}";
                labelsString = labelsString.substring(0, labelsString.length - 1);
                jsonLabelsString = "{labels:[" + labelsString + "]}";
                this.DProject = this.$JSON5.parse(jsonProjectstring);
                this.DDirectory = this.$JSON5.parse(jsonDirectoryString);
                this.labels = this.$JSON5.parse(jsonLabelsString);
                this.projects = this.db.get("project").value();
            },
            addDirectoryOP() {
                this.dialogVisible2 = true;
            },
            //提交添加目录
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
            },
            cancel(formName) {
                this.$refs[formName].resetFields();
                this.dialogVisible2 = false;
            },
            //增加文件夹
            addDirectory(formName) {
                let id = this.$Uuidv1();
                let name = this.ruleForm.pName;
                let newModel = '{"id":"' + id + '" ,"name" :"' + name + '","modelsType":"directory","imgPaht":"","type":"model"}';
                this.db.get("models").push(this.$JSON5.parse(newModel)).write();
                this.db.set('version', new Date().valueOf()).write();
                this.dialogVisible2 = false,
                    this.getdirectory();
                this.$refs[formName].resetFields();
            },

            projectclick(note, event) {
                var target = event.currentTarget;
                var index = Number(target.getAttribute("data-index"));
                this.currentProject = index;
                this.currentDirectory = -1;
                this.isDisabled = true;
                this.delobj = note;
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
                this.notesBytargeId(note);
            },
            noteslick(project, event) {
                var target = event.currentTarget;
                var index = Number(target.getAttribute("data-index"));
                this.currentNote = index;
                this.delobj = project;
                this.isDisabled = false;
                this.projectEvent = this.$JSON5.parse(this.$JSON5.stringify(project));
            },
            remove() {
                var type = this.delobj.type;
                var id = this.delobj.id;
                if (type == "model") {
                    this.dialogVisibledDirectory = true;
                } else if (type == "project") {
                    this.dialogVisibledProject = true;
                } else if (type == "template") {
                    this.dialogVisibledTemplate = true;
                }
            },
            //删除数据
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
                    this.db.get("project").remove({id: id}).write();
                    this.db.set('version', new Date().valueOf()).write();
                    this.isDisabled = true;
                    this.dialogVisibledProject = false;
                    this.projectEvent = "";
                    this.getdirectory();
                } else if (type == "template") {
                    this.db.get("templates").remove({id: id}).write();
                    this.db.set('version', new Date().valueOf()).write();
                    //更新template 在project中显示
                    this.projects = this.db.get("templates").value();
                    this.dialogVisibledTemplate = false;
                    this.projectEvent = "";
                    this.getdirectory();
                    this.notesBytargeId(this.db.get("models").find({id: "mb"}).value());

                }
            },
            //点击目录生成projects列表
            notesBytargeId(obj) {
                var id = obj.id;
                var projectArray = new Array();
                if (obj.id != "mb") {
                    var projects = this.db.get("project").value();
                    for (var key in projects) {
                        let models = projects[key].modelsId;
                        if (models.indexOf(id) != -1) {
                            projectArray.push(projects[key]);
                        }
                    }
                } else {
                    var projects = this.db.get("templates").value();
                    for (var key in projects) {
                        projectArray.push(projects[key])
                    }
                }
                this.projects = projectArray;
            },
            //启动加载
            async initialize() {
                let letoperatorJID = this.operatorJID;//运营商钱包地址
                let operatorSecret = this.operatorSecret; //运营商密钥
                var loginObj = this.$JSON5.parse(sessionStorage.getItem("userkeyObj"));
                var address = loginObj.address;
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
                            name: loginObj.name,
                            address: address,
                        }
                        var newdata = this.$JSON5.parse('{"version":"' + newversion + '","profiles":"' + this.$JSON5.stringify(profiles) + '","project":[],"models":[{"id":"sy","name":"'+this.$t('main.allProjects')+'","modelsType":"project","type":"model","imgPaht":""}, {"id":"scj","name":"'+this.$t('main.favorites')+'","modelsType":"project","type":"model","imgPath":""}, {"id":"mm","name":"'+this.$t('main.password')+'","modelsType":"project","type":"model","imgPath":""}, {"id":"mb","name":"'+this.$t('main.template')+'","modelsType":"project","type":"model","imgPath":""}, {"id":"wbj","name":"'+this.$t('main.unmarked')+'","modelsType":"project","type":"model","imgPath":""}, {"id":"06","name":"'+this.$t('main.familyAccount')+'","modelsType":"directory","type":"model","imgPath":""}, {"id":"07","name":"'+this.$t('main.privateAccount')+'","modelsType":"directory","type":"model","imgPath":""}]}');
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
            },
            //手动同步。
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
            },
            // pwdLength(pwd) {
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
            },

            //格式化密码进度条
            format(percentage) {
                if(percentage<=50){
                    return percentage=this.$t('main.weak')
                }else if(percentage==75){
                    return percentage=this.$t('main.mid')
                }else if(percentage==100){
                    return percentage=this.$t('main.strong')
                }
            },
            selectTemplate() {
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
            },

            addproject(formname) {
                if (this.templateEvent == "") {
                    this.$message.error(this.$t('main.pleaseChooseATemplate'));
                    return false;
                } else {
                    this.dialogVisibleTemplate = false;
                    this.dialogVisibleAddProject = true;
                }
            },

            //数据提交
            submitproject() {
                let projectName = this.ruleFormAddProject.name;
                let formData = this.templateEvent;
                var newProject = ""
                if (this.selectlabels.length == 0) {
                    this.selectlabels.push("sy", "wbj");
                } else {
                    this.selectlabels.push("sy");
                }
                this.newProject = {
                    "id": this.$Uuidv1(),
                    "name": projectName,
                    "modelsId": this.selectlabels,
                    "type": "project",
                    "datas": formData.datas,
                    "imgPaht": "",
                    "dateTime": new Date().valueOf()
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
                // console.log(this.db.get("version").value())
            },
            //增加选中项
            selectFiled(command) {
                this.dialogVisibleItems = true;
                this.filed = this.$JSON5.parse(this.$JSON5.stringify(command));
                this.filedName = command.key
            },
            //添加项目，模板增加项
            addFiled() {
                this.dialogVisibleItems = false;
                this.filed.tempkey = this.filedName;
                this.filed.id = this.$Uuidv1();
                this.templateEvent.datas.push(this.filed);
                this.filed = "";
                this.filedName = "";
            },
            //修改选中项
            editSelectFiled(command) {
                this.dialogVisibleItemsEdit = true;
                this.filed = this.$JSON5.parse(this.$JSON5.stringify(command));
                this.filedName = command.key

            },
            //修改项目，模板增加项
            editAddFiled() {
                this.dialogVisibleItemsEdit = false;
                this.filed.tempkey = this.filedName;
                this.filed.id = this.$Uuidv1(),
                this.editobject.datas.push(this.filed);
                this.filedName = "";
                this.filed = "";
            },

            //修改页面
            editProject() {
                this.editobject = this.$JSON5.parse(this.$JSON5.stringify(this.projectEvent));
                if (this.editobject.type == "project") {
                    this.selectlabels = this.editobject.modelsId;
                    this.dialogVisibleEdit = true;
                } else if (this.editobject.type == "template") {
                    this.dialogVisibleTemplateEdit = true;
                }
            },
            //修改project
            editDo() {
                try {
                    this.db.get("project").remove({id: this.editobject.id}).write();
                    this.editobject.modelsId = this.selectlabels;
                    this.db.get("project").push(this.$JSON5.parse(this.$JSON5.stringify(this.editobject))).write();
                    this.db.set('version', new Date().valueOf()).write();
                    this.dialogVisibleEdit = false
                    this.$message.success(this.$t('main.successfullyModified'));
                    this.projectEvent = this.editobject;
                    this.editobject = "";
                } catch (e) {
                    this.$message.error(this.$t('main.failToEdit'));
                }
            },
            openDialogTemplate() {
                this.currentTemplate = -1;
                this.templateEvent = ""
            },
            openSetting() {
                this.dialogVisibleSetting = true;
            },
            //清除数据库数据
            cleardb() {
                this.db.unset("project").write();
                this.db.unset("models").write();
                this.db.unset("version").write();
                this.db.unset("templates").write();
                this.db.unset("profiles").write();
                this.db.unset("settings").write();
            },
            addTemplate() {
                this.dialogVisibleAddTemplate = true;
            },
            selectFiledTemplate(command) {
                this.dialogVisibleAddTempItems = true;
                this.filed = this.$JSON5.parse(this.$JSON5.stringify(command));
                this.filedName = command.key;
            },
            addFiledTemplate() {
                this.dialogVisibleAddTempItems = false;
                this.filed.tempkey = this.filedName;
                this.filed.id = this.$Uuidv1(),
                this.tempTemplate.push(this.filed);
                this.filed = "";
                this.filedName = "";
            },
            //增加模板
            saveTemplate() {
                this.newTemplate = {
                    "id": this.$Uuidv1(),
                    "name": this.ruleFormAddTemplate.name,
                    "modelsId": ["mb"],
                    "type": "template",
                    "datas": this.tempTemplate
                }
                this.db.get("templates").push(this.$JSON5.parse(this.$JSON5.stringify(this.newTemplate))).write();
                this.ruleFormAddTemplate.name = "",
                    this.newTemplate = "",
                    this.tempTemplate = [],
                    this.dialogVisibleAddTemplate = false;
                this.getdirectory();
                this.notesBytargeId(this.db.get("models").find({id: "mb"}).value());//刷新列表页
            },
            //修改模板
            editTemplate() {
                try {
                    this.db.get("templates").remove({id: this.editobject.id}).write();
                    this.db.get("templates").push(this.$JSON5.parse(this.$JSON5.stringify(this.editobject))).write();
                    this.db.set('version', new Date().valueOf()).write();
                    this.dialogVisibleTemplateEdit = false
                    this.$message.success(this.$t('main.successfullyModified'));
                    this.projectEvent = this.editobject;
                    this.editobject = "";
                    this.getdirectory();
                    this.notesBytargeId(this.db.get("models").find({id: "mb"}).value());//刷新列表页
                } catch (e) {
                    this.$message.error(this.$t('main.failToEdit'));
                }
            },
            //删除项(修改模板，项目)
            editRemoveItem(itemsId) {
                let itemArray = this.editobject.datas;
                for (var i = 0; i < itemArray.length; i++) {
                    if (itemArray[i].id === itemsId) {
                        itemArray.splice(i, 1);
                    }
                }
            },
            //删除项(增加模板)
            addTemplageRemoveItem(itemsId) {
                let itemArray = this.tempTemplate;
                console.log(itemArray);
                for (var i = 0; i < itemArray.length; i++) {
                    if (itemArray[i].id === itemsId) {
                        itemArray.splice(i, 1);
                    }
                }
            },
            //删除项(增加项目)
            addProjectRemoveItem(itemsId) {
                let itemArray = this.templateEvent.datas;
                for (var i = 0; i < itemArray.length; i++) {
                    if (itemArray[i].id === itemsId) {
                        itemArray.splice(i, 1);
                    }
                }
            },
            //lock定时器启动
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
            },
            //启动初始化设置参数
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
            //国际化
            changeLang() {
                if (this.$i18n.locale === 'zh-CN') {
                    this.$i18n.locale = 'en-US';
                } else {
                    this.$i18n.locale = 'zh-CN';
                }
                // console.log(this.$JPassUtil.Mnemonic.createMnemonic(12, this.$i18n.locale));
                localStorage.setItem('lang', this.$i18n.locale);
            }

        }
    }

</script>
<style>
    @import './css/base.css';
    @import './css/sy.css';

    .el-dialog {
        border-radius: 10px;
    }

    .myInput {
        width:90%;
        border-radius:4px;
        border: 1px solid #C0C4CC;
        height: 5vh;
        float: left;
    }

    .section .el-form--label-top .el-form-item__label {
        float: none;
        display: inline-block;
        text-align: left;
        padding: 0 0 0 0;
        line-height: 30px;
        font-weight:bold;
    }

    .section .el-form-item__content {
        line-height: 15px;
        position: relative;
        font-size: 14px;
    }
    .section input{
        width:90%;
        color: #606266;
        font-size: 13px;
    }

    .mb .el-form--label-top .el-form-item__label {
        float: none;
        display: inline-block;
        text-align: left;
        padding: 0 0 0 0;
        line-height: 30px;
        font-weight:bold;
    }
    .mb .el-form-item__content {
        position: relative;
        font-size: 14px;
    }


</style>
