<template>
     <el-dialog title="" :visible.sync="dialogVisibleSetting" width="50%" :show-close="true" style="text-align: left" :before-close="handleClose">
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
</template>
<script>
export default {
       props:["settingDialogOpen",""],
       	data() {
			return {
                 dialogVisibleSetting: false,//设置弹出框

			}
        },

        methods:{
           


        },

        watch:{
             settingDialogOpen:function(data){
                   this.dialogVisibleSetting=data;
            },
            

        }

     
}
</script>