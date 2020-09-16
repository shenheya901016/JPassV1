let JSON5 = require("json5");
import VueI18n from "vue-i18n";
import Vue from 'vue'
Vue.use(VueI18n)
//实例化vue-i18n
const i18n = new VueI18n({
    // 从本地存储中取，如果没有默认为中文，
    // 这样可以解决切换语言后，没记住选择的语言，刷新页面后还是默认的语言
    locale: localStorage.getItem("lang") || "zh-CN",
    messages: {
        "zh-CN": require("@/common/lang/zh-CN").default, // 中文语言包
        "en-US": require("@/common/lang/en-US").default // 英文语言包
    }
});
const mainPage = {
    state: {
        loginObj: JSON5.parse(sessionStorage.getItem("userkeyObj")),
        db: "",
        localdb: "",
        systemlock: "",
        locktimedisabled: "",
        locktime: "",
        language: "",
        showPassword: "",
        savePassword: "",
        auto_update: "",
        showTrash: false,//是否显示清空垃圾桶图标
        DDirectory: "",
        labels: "",
        DProject: "",
        DSpecial: "",
        projects: [],
        Dname: "",//国际化临时目录名称
        projectEvent: "",
        directoryClickId: "sy",
        myInfoKey: "",
        username: "",
        vip: "",
        package_version: "0.0.0",
        autoStartFlag: localStorage.getItem("autoStartFlag"), //开机自启状态
        lockFlag: localStorage.getItem("lockFlag"), //锁定状态
        delobj: "",
        isDisabled: "",
        currentProject: -1, //大于li 总数量，如果初始为""，默认选择第0个元素
        currentSpecial: -1, //大于li 总数量，如果初始为""，默认选择第0个元素
        currentDirectory: -1,
        currentNote: -1,
        currentTemplate: -1,
        selectlabels: "",
        checkedArray: [],
    },

    mutations: {
        //密码显示控制
        changePass (state, e) {
            if (
                e.currentTarget.previousElementSibling.getAttribute("type") ==
                "password"
            ) {
                e.currentTarget.previousElementSibling.setAttribute("type", "text");
            } else {
                e.currentTarget.previousElementSibling.setAttribute("type", "password");
            }
        },

        //启动初始化设置参数
        updatesetting (state) {
            let setting = state.db.get("settings").value();
            state.systemlock = setting.systemlock;
            state.locktimedisabled = !this.systemlock;
            state.locktime = setting.locktime; //自动锁定时间
            state.language = setting.language; //语言选择
            state.showPassword = setting.showPassword; //是否显示密码
            state.savePassword = setting.savePassword;
            state.auto_update = setting.auto_update;
            state.locktimedisabled = setting.locktimedisabled;
        },

        //国际化（目录）
        international (state, name) {
            let directory = {
                allProjects: i18n.t("main.allProjects"),
                favorites: i18n.t("main.favorites"),
                password: i18n.t("main.password"),
                template: i18n.t("main.template"),
                unmarked: i18n.t("main.unmarked"),
                trash: i18n.t("main.trash"),
                weakpassword: i18n.t("main.weakpassword")
            };
            for (let index in directory) {
                if (name == index) {
                    name = directory[index];
                }
            }
            state.Dname = name;
        },


        //排序
        sort (state) {
            //let regExpAZ  = new RegExp("[A-Za-z]+");
            //let regExpZH = new RegExp("[\u4E00-\u9FA5]+");
            //let regExp09 = new RegExp("[0-9]+");
            //文件夹排序
            let data = state.DDirectory.directory;
            let topArray = [];
            let indexArray = [];
            for (let index in data) {
                if (data[index].top != false) {
                    topArray.push(data[index]);
                } else {
                    indexArray.push(data[index]);
                }
            }
            topArray.sort((a, b) => a.index - b.index); //a~z 排序
            indexArray.sort((a, b) => a.name.localeCompare(b.name)); //a~z 排序
            topArray.push(...indexArray); //a.push(...b);
            state.DDirectory.directory = topArray;

            //项目排序
            let project = state.projects;
            project.sort((a, b) => a.name.localeCompare(b.name)); //a~z 排序
            state.projects = project;
        },
    },

    actions: {
        //刷新页面
        async getdirectory (context) {
            let secret = context.state.loginObj.secret;
            let alldata = context.state.db.get("models").value();// 获取所有分类
            let allProjects = context.state.db.get("project").value();
            let templates = context.state.db.get("templates").value();
            let projectstring = ""
            let directoryString = ""
            let specialString = ""
            let jsonSpecicalString = ""
            let jsonProjectstring = ""
            let jsonDirectoryString = ""
            let labelsString = ""
            let jsonLabelsString = ""
            //设置每一项数量
            for (let modelkey in alldata) {
                let count = 0
                if (alldata[modelkey].id != "mb" && alldata[modelkey].id != "ljt") {
                    for (let projectkey in allProjects) {
                        let project = allProjects[projectkey];
                        let types = project.modelsId;
                        if (types.indexOf(alldata[modelkey].id) != -1 && project.isDel != true) {
                            count++;
                        }
                    }
                } else if (alldata[modelkey].id == "mb") {
                    count = context.state.db.get("templates").filter({ isDel: false }).size().value();
                } else if (alldata[modelkey].id == "ljt") {
                    count = context.state.db.get("templates").filter({ isDel: true }).size().value() + context.state.db.get("project").filter({ isDel: true }).size().value();
                    if (count > 0) {
                        context.state.showTrash = true;//是否显示清空垃圾桶图标
                    } else {
                        context.state.showTrash = false;//是否显示清空垃圾桶图标
                    }
                }
                alldata[modelkey].count = count;
            }
            //分组
            for (let key in alldata) {
                let object = alldata[key];
                if (object.modelsType == "project") {
                    if (object.id == "sy" || object.id == "scj") {
                        projectstring = projectstring + JSON5.stringify(object) + ",";
                    } else {
                        specialString = specialString + JSON5.stringify(object) + ",";
                    }
                }
                if (object.modelsType == "directory") {
                    directoryString = directoryString + JSON5.stringify(object) + ",";
                }
                if (object.id != "sy" && object.id != "wbj" && object.id != "mb" && object.id != "ljt" && object.id != "scj" && object.id != "weakPwd") {
                    labelsString = labelsString + JSON5.stringify(object) + ",";
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
            context.state.DDirectory = JSON5.parse(jsonDirectoryString);
            //分类下拉框国际化
            let jsonlebals = JSON5.parse(jsonLabelsString).labels;
            for (let obj in jsonlebals) {
                context.commit('international', jsonlebals[obj].name);
                jsonlebals[obj].name = context.state.Dname;
            }
            context.state.labels = { labels: jsonlebals }
            //目录国际化
            let jsonProjects = JSON5.parse(jsonProjectstring).project;
            for (let obj in jsonProjects) {
                context.commit('international', jsonProjects[obj].name);
                jsonProjects[obj].name = context.state.Dname;
            }
            context.state.DProject = { project: jsonProjects };
            //special 国际化
            let jsonSpecial = JSON5.parse(jsonSpecicalString).special;
            for (let obj in jsonSpecial) {
                context.commit('international', jsonSpecial[obj].name);
                jsonSpecial[obj].name = context.state.Dname;
            }
            context.state.DSpecial = { special: jsonSpecial };
            //类型名称国际化
            for (let index in allProjects) {
                let newArray = new Array();
                for (let indexMode in allProjects[index].modelsId) {
                    let modelId = allProjects[index].modelsId[indexMode];
                    let model = context.state.db.get("models").find({ id: modelId }).value();
                    if (model != undefined && model.id != "sy") {
                        context.commit('international', model.name);
                        newArray.push(context.state.Dname);//项目分类国际化
                    }
                }
                allProjects[index].modelsName = newArray.toString();
            }
            let projectArray = context.state.db.get("project").filter({ isDel: false }).value();
            projectArray = JSON5.parse(JSON5.stringify(projectArray));

            for (let index in templates) {
                let newArray = new Array();
                //插入类别名称
                for (let indexMode in templates[index].modelsId) {
                    let modelId = templates[index].modelsId[indexMode];
                    let model = context.state.db.get("models").find({ id: modelId }).value();
                    if (model.id != "sy") {
                        context.commit('international', model.name)
                        newArray.push(context.state.Dname);
                    }
                }
                templates[index].modelsName = newArray.toString();
            }

            //图片载入
            for (let index in projectArray) {
                if (projectArray[index].imgtype == "url") {
                    projectArray[index].tempBase64 = projectArray[index].imgurl;
                } else if (projectArray[index].imgtype == "base64") {
                    if (projectArray[index].imgHash != "") {
                        let img = context.state.localdb.get("img").find({ id: projectArray[index].imgHash }).value();
                        if (img != undefined) {
                            projectArray[index].tempBase64 = img.value;
                        } else {
                            //取ipfs值
                            let result = await this.$myIpfs.Ipfs.read(secret, projectArray[index].imgHash, context.state.loginObj.address);
                            projectArray[index].tempBase64 = result;
                            //缓存到本地localdb库
                            img = { "id": projectArray[index].imgHash, "value": result };
                            context.state.localdb.get("img").push(img).write();
                        }
                    } else {
                        projectArray[index].tempBase64 = "";
                    }
                }
            }
            context.state.projects = projectArray;
            //更新排序
            context.commit('sort');
        },

        //单独刷新左侧菜单
        getDirectoryLeft (context) {
            let alldata = context.state.db.get("models").value(); // 获取所有分类
            let allProjects = context.state.db.get("project").value();
            let projectstring = "";
            let directoryString = "";
            let specialString = "";
            let jsonSpecicalString = "";
            let jsonProjectstring = "";
            let jsonDirectoryString = "";
            //设置每一项数量
            for (let modelkey in alldata) {
                let count = 0;
                if (alldata[modelkey].id != "mb" && alldata[modelkey].id != "ljt") {
                    for (let projectkey in allProjects) {
                        let project = allProjects[projectkey];
                        let types = project.modelsId;
                        if (
                            types.indexOf(alldata[modelkey].id) != -1 &&
                            project.isDel != true
                        ) {
                            count++;
                        }
                    }
                } else if (alldata[modelkey].id == "mb") {
                    count = context.state.db.get("templates").filter({ isDel: false }).size().value();
                } else if (alldata[modelkey].id == "ljt") {
                    count = context.state.db.get("templates").filter({ isDel: true }).size().value() + context.state.db.get("project").filter({ isDel: true }).size().value();
                    if (count > 0) {
                        context.state.showTrash = true; //是否显示清空垃圾桶图标
                    } else {
                        context.state.showTrash = false; //是否显示清空垃圾桶图标
                    }
                }
                alldata[modelkey].count = count;
            }
            //分组
            for (let key in alldata) {
                let object = alldata[key];
                if (object.modelsType == "project") {
                    if (object.id == "sy" || object.id == "scj") {
                        projectstring = projectstring + JSON5.stringify(object) + ",";
                    } else {
                        specialString = specialString + JSON5.stringify(object) + ",";
                    }
                }
                if (object.modelsType == "directory") {
                    directoryString = directoryString + JSON5.stringify(object) + ",";
                }
            }
            projectstring = projectstring.substring(0, projectstring.length - 1);
            jsonProjectstring = "{project:[" + projectstring + "]}";
            directoryString = directoryString.substring(0, directoryString.length - 1);
            jsonDirectoryString = "{directory:[" + directoryString + "]}";
            specialString = specialString.substring(0, specialString.length - 1);
            jsonSpecicalString = "{special:[" + specialString + "]}";

            //文件夹
            context.state.DDirectory = JSON5.parse(jsonDirectoryString);
            //目录国际化
            let jsonProjects = JSON5.parse(jsonProjectstring).project;
            for (let obj in jsonProjects) {
                context.commit('international', jsonlebals[obj].name);
                jsonProjects[obj].name = context.state.Dname;
            }
            this.DProject = { project: jsonProjects };
            //special 国际化
            let jsonSpecial = this.$JSON5.parse(jsonSpecicalString).special;
            for (let obj in jsonSpecial) {
                context.commit('international', jsonSpecial[obj].name);
                jsonSpecial[obj].name = context.state.Dname;
            }
            this.DSpecial = { special: jsonSpecial };
            //更新排序
            context.commit('sort');
        },


        //点击目录生成projects列表
        async notesBytargeId (context, obj) {
            let secret = context.state.loginObj.secret;
            let id = obj.id;
            let projectArray = new Array();
            if (obj.id != "mb" && obj.id != "ljt") {
                let projects = context.state.db.get("project").value();
                projects = JSON5.parse(JSON5.stringify(projects));
                for (let key in projects) {
                    let models = projects[key].modelsId;
                    if (models.indexOf(id) != -1 && projects[key].isDel != true) {
                        projectArray.push(projects[key]);
                    }
                }
                //图片载入
                for (let index in projectArray) {
                    if (projectArray[index].imgtype == "url") {
                        projectArray[index].tempBase64 = projectArray[index].imgurl;
                    } else if (projectArray[index].imgtype == "base64") {
                        if (projectArray[index].imgHash != "") {
                            let img = context.state.localdb.get("img").find({ id: projectArray[index].imgHash }).value();
                            if (img != undefined) {
                                projectArray[index].tempBase64 = img.value;
                            } else {
                                //取ipfs值
                                let result = await this.$myIpfs.Ipfs.read(secret, projectArray[index].imgHash, context.state.loginObj.address);
                                projectArray[index].tempBase64 = result;
                                //缓存到本地localdb库
                                img = { id: projectArray[index].imgHash, value: result };
                                context.state.localdb.get("img").push(img).write();
                            }
                        } else {
                            projectArray[index].tempBase64 = "";
                        }
                    }
                }
            } else if (obj.id == "mb") {
                let projects = context.state.db.get("templates").filter({ isDel: false }).value();
                projects = JSON5.parse(JSON5.stringify(projects));
                for (let index in projects) {
                    let newArray = new Array();
                    //插入类别名称
                    for (let indexMode in projects[index].modelsId) {
                        let modelId = projects[index].modelsId[indexMode];
                        let model = context.state.db.get("models").find({ id: modelId }).value();
                        if (model.id != "sy") {
                            context.commit('international', model.name)
                            newArray.push(context.state.Dname);
                        }
                    }
                    projects[index].modelsName = newArray.toString();
                }
                projectArray = projects;
                //图片载入
                for (let index in projectArray) {
                    if (projectArray[index].imgtype == "url") {
                        projectArray[index].tempBase64 = projectArray[index].imgurl;
                    } else if (projectArray[index].imgtype == "base64") {
                        if (projectArray[index].imgHash != "") {
                            let img = context.state.localdb.get("img").find({ id: projectArray[index].imgHash }).value();
                            if (img != undefined) {
                                projectArray[index].tempBase64 = img.value;
                            } else {
                                //取ipfs值
                                let result = await this.$myIpfs.Ipfs.read(secret, projectArray[index].imgHash, context.state.loginObj.address);
                                projectArray[index].tempBase64 = result;
                                //缓存到本地localdb库
                                img = { id: projectArray[index].imgHash, value: result };
                                context.state.localdb.get("img").push(img).write();
                            }
                        } else {
                            projectArray[index].tempBase64 = "";
                        }
                    }
                }
            } else if (obj.id == "ljt") {
                //模板类别名称国际化
                let delTemplate = context.state.db.get("templates").filter({ isDel: true }).value();
                delTemplate = JSON5.parse(JSON5.stringify(delTemplate));
                for (let index in delTemplate) {
                    let newArray = new Array();
                    //插入类别名称
                    for (let indexMode in delTemplate[index].modelsId) {
                        let modelId = delTemplate[index].modelsId[indexMode];
                        let model = context.state.db.get("models").find({ id: modelId }).value();
                        if (model.id != "sy") {
                            context.commit('international', model.name)
                            newArray.push(context.state.Dname);
                        }
                    }
                    delTemplate[index].modelsName = newArray.toString();
                }
                let delProject = context.state.db.get("project").filter({ isDel: true }).value();
                projectArray = delTemplate.concat(delProject);
                //图片载入
                for (let index in projectArray) {
                    if (projectArray[index].imgtype == "url") {
                        projectArray[index].tempBase64 = projectArray[index].imgurl;
                    } else if (projectArray[index].imgtype == "base64") {
                        if (projectArray[index].imgHash != "") {
                            let img = context.state.localdb.get("img").find({ id: projectArray[index].imgHash }).value();
                            if (img != undefined) {
                                projectArray[index].tempBase64 = img.value;
                            } else {
                                //取ipfs值
                                let result = await this.$myIpfs.Ipfs.read(secret, projectArray[index].imgHash, context.state.loginObj.address);
                                projectArray[index].tempBase64 = result;
                                //缓存到本地localdb库
                                img = { id: projectArray[index].imgHash, value: result };
                                context.state.localdb.get("img").push(img).write();
                            }
                        } else {
                            projectArray[index].tempBase64 = "";
                        }
                    }
                }
            }
            projectArray.sort((a, b) => a.name - b.name); //a~z 排序
            context.state.projects = projectArray;
            if (context.state.projects.length == 0) {
                context.state.projectEvent = "";
            }
        },

        //国际化(整体配置)
        changeLang (context, lan) {
            console.log(lan);
            if (lan === "中文") {
                window.vue.$i18n.locale = 'zh-CN';
                i18n.locale = 'zh-CN';
            } else if (lan === "English") {
                i18n.locale = 'en-US';
                window.vue.$i18n.locale = 'en-US';
            }
            context.commit("changeLan", lan);
            context.dispatch('getdirectory');

        },
    }

};
export default mainPage;

