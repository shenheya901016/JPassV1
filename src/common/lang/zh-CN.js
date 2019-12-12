import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

export default {
    login: {
        title: "登录Jpass",
        selectuser: "请选择登录用户",
        name: "用户名称",
        nametitle: "请选择登录用户，如果下拉框无数据，请先注册用户或导入已有钱包",
        password: "用户密码",
        login: "登录",
        register: "注册",
        importwallet: "导入钱包",
        importmode: "导入方式选择",
        importkey: "密钥导入",
        importkeystory: "key文件导入",
        importmnemonic: "助记词导入",
        namevalidation: "请选择登录用户，如果下拉框无数据，请先注册用户或导入已有钱包！",
        pwdvalidaion: "请输入用户密码",
        pwdlengthvalidaion: "长度在 4 到 20 个字符",
        pwderror: "密码有误，请重新输入！",
        loginerror: "用户不存在，请重新输入！",
    },
    register: {
        title: "用户注册",
        name: "用户名称",
        password: "用户密码",
        duplicatePassword: "密码重复",
        register: "注册",
        cancel:"取消",
        repassword: "请再次输入密码！",
        samepwd: "两次输入密码不一致！",
        uservalidaion: "用户名重复，请重新输入！",
        ruleuser: "请输入用户名称！",
        ruleuserLength: "长度在 3 到 20 个字符！",

        pleaseEnterUserPassword: "请输入用户密码",
        lengthCharacters: "长度在 4 到 20 个字符",
        pleaseEnterUserPasswordAgain: "请再次输入用户密码",
        no: "无",
        walletGenerationFailed: "钱包生成失败！",
        keystoreGenerationFailed: "keystore生成失败！",
        localStorageFailed: "本地存储失败！"
    },
    registersuccess: {
        title: '&#12288;恭喜您，钱包注册成功,请您用<span style="color: red">钱包地址</span>到井通官网激活钱包！<p style="color: red;font-size: 15px">注:请您及时抄录并妥善保存好以下信息，这是找回您钱包的必要资料，请不要外泄!</p>',
        mnemonic: "助记词:",
        walletAddress: "钱包地址:",
        secret: "私钥:",
        keystoreFile: "keystore文件:",
        exportKeystoreFile: "keystore导出",
        login:"登录",
    },
    mnemonicimport: {
        importmnemonic: "助记词导入",
        enterMnemonic: "输入助记词",
        newUserName: "新用户名称",
        newPassword: "新密码",
        duplicatePassword: "密码重复",
        importWallet: "导入钱包",
        importSuccessfully: "钱包导入成功，keystore 文件已经更新，请及时下载并妥善保管！",
        keystoreExport: "keystore导出",
        userNameDuplicate: "用户名重复，请重新输入",
        enterPasswordAgain: "请再次输入密码",
        inputPasswordsError: "两次输入密码不一致",
        PleaseEnter12Mnemonics: "请输入12位助记词",
        inputUserName: "请输入用户名称",
        lengthBetween3and20Characters: "长度在 3 到 20 个字符",
        inputPassword: "请输入用户密码",
        lengthBetween4and20Characters: "长度在 4 到 20 个字符",
        pleaseEnterUserPasswordAgain: "请再次输入用户密码",
        mnemonicError: "助记词错误，请重新输入！",
        keystoreGeneratedError: "keystore 生成出错！",
        localStorageFailed: "本地存储失败！",
        cancel:"取消",
    },
    main: {
        newFolder: "新建文件夹",
        newTemplate: "新建模板",
        newProject: "新建项目",
        delete: "删除",
        synchronize: "同步",
        locking: "锁定",
        folder: "文件夹",
        pleaseEnterWhatYouWantToSearch: "请输入要搜索的内容...",
        name: "名称",
        modify: "修改",
        passwordUnlock: "密码解锁",
        loginPassword: "登录密码",
        unlock: "解锁",
        addDirectory: "增加文件夹",
        ok: "确定",
        cancel: "取消",
        prompt: "提示",
        doYouWantToDeleteTheFolder: "是否删除文件夹？",
        okFormat: "确 定",
        cancelFormat: "取 消",
        doYouWantToDeleteTheProject: "是否删除项目？",
        doYouWantToDeleteTheTemplate: "是否删除模板？",
        selectTemplate: "选择模板",
        addItem: "新增项目",
        chooseCategory: "选择分类",
        addOtherItems: "添加其他项",
        additionalItem: "新增项",
        modifyTheProject: "修改项目",
        submit: "提交",
        systemSettings: "系统设置",
        timedLock: "定时锁定",
        idleTime: "闲置时间",
        language: "语言",
        languageSelection: "语言选择",
        passwordService: "密码服务",
        showPassword: "显示密码",
        newUserAndPasswordAreAutomaticallySaved: "新用户和密码自动保存",
        pleaseChoose: "请选择",
        save: "保存",
        addTemplate: "增加模板",
        templateName: "模板名称",
        modifyTemplate: "修改模板",
        ask: "询问",
        shutDown: "关闭",
        autofill: "自动填充",
        pleaseChooseTheType: "请选择类型！",
        pleaseEnterAName: "请输入名称",
        theLengthIsBetween1And10Characters: "长度在 1 到10 个字符",
        thePasswordIsIncorrectPleaseReEnter: "密码有误，请重新输入！",
        unlockedSuccessfully: "解锁成功！",
        theInputIsIncorrectPleaseConfirmItAndSubmitItAgain: "输入有误，请确认无误后再提交!",
        allProjects: "所有项目",
        favorites: "收藏夹",
        password: "密码",
        template: "模板",
        unmarked: "未标记",
        trash:"垃圾桶",
        familyAccount: "家人账号",
        privateAccount: "私人账号",
        note: "注意",
        pleaseGoToTheOfficialWebsiteToActivateYourWallet: "请先去官网激活您的钱包！",
        weak: "弱",
        mid: "中",
        strong: "强",
        pleaseChooseATemplate: "请选择模板！",
        successfullyModified: "修改成功！",
        failToEdit: "修改失败！",
        settingSavedSuccessfully: "设置保存成功！",
        settingSaveFailed: "设置保存失败！",
        PasswordGenerator:"密码生成器",
        fields:"字段",
        recover:"还原",
        recovertitle:"是否要恢复删除的文件?",
        cleartrash:"清空垃圾桶",
        clearTashTitle:"是否清空垃圾桶",
        selectSymbol:"选择标识",
        selectColor:"选择颜色",
        userIcon:"用户图标",
        color:"颜色",
        symbol:"标识",
        synchronizationInfo:"系统检测到你上次同步操作不在本机中操作，为保证数据完整性，请先确保上次操作数据已经成功同步，请慎重选择同步方式！",
        localToIpfs:"本地同步到ipfs",
        ipfsToLocal:"ipfs同步到本地"
    },
    lock: {
        unlockJpass: "解锁jpass",
        loginPassword: "登录密码",
        unlock: "解锁",
        thePasswordIsIncorrectPleaseReEnter: "密码有误，请重新输入！",
        unlockedSuccessfully: "解锁成功！"
    },
    keystoreImport: {
        importKeystoreWallet: "keystore导入钱包",
        keystoreFile: "keystore文件",
        uploadKeystore: "上传keystore",
        oldLoginPassword: "旧登录密码",
        pleaseEnterTheOldLoginPassword: "请输入旧的登录密码",
        newUserName: "新用户名称",
        newUsernameWillReplaceTheOldUsername: "新用户名将代替旧用户名",
        newLoginPassword: "新登录密码",
        newPasswordWillReplaceTheOldPassword: "新密码将代替旧密码",
        passwordRepetition: "密码重复",
        importWallet: "导入钱包",
        walletImportedSuccessfully: "钱包导入成功，keystore 文件已经更新，请及时下载并妥善保管！",
        keystoreExport: "keystore导出",
        userNameIsDuplicatePleaseEnter: "用户名重复，请重新输入",
        pleaseEnterYourPasswordAgain: "请再次输入密码",
        twoPasswordsAreInconsistent: "两次输入密码不一致!",
        pleaseEnterANewUsername: "请输入新用户名",
        pleaseEnterYourPassword: "请输入密码",
        pleaseEnterAUserPassword: "请输入用户密码",
        theLengthIsBetween4And20Characters: "长度在 4 到 20 个字符",
        pleaseEnterTheUserPasswordAgain: "请再次输入用户密码",
        theCurrentLimitSelects1FileThisTimeSelectedFiles: "当前限制上传 1个文件",
        importedKeystoryFilePFailed: "keystory 文件未导入或文件解析失败，请重新输入！",
        theKeystoryFileOrPasswordIsIncorrectPleaseEnter: "keystory 文件或密码有误，请重新输入！",
        newKeystoreGeneratedError: "新keystore 生成错误！",
        localStorageFailed: "本地存储失败！",
        cancel:"取消",
        login:"直接登录"

    },
    keyImport: {
        walletKeyImport: "钱包密钥导入",
        walletKey: "钱包密钥",
        newUserName: "新用户名称",
        newPassword: "新密码",
        passwordRepetition: "密码重复",
        importWallet: "导入钱包",
        walletImportedSuccessfully: "钱包导入成功，keystore 文件已经更新，请及时下载并妥善保管！",
        keystoreExport: "keystore导出",
        pleaseEnterYourPasswordAgain: "请再次输入密码",
        TwoPasswordsAreInconsistent: "两次输入密码不一致!",
        userNameIsDuplicatePleaseEnter: "用户名重复，请重新输入",
        pleaseEnterTheWalletKey: "请输入钱包密钥",
        pleaseEnterAUserName: "请输入用户名称",
        theLengthIsBetween3And20Characters: "长度在 3 到 20 个字符",
        pleaseEnterAUserPassword: "请输入用户密码",
        lengthIsBetween4And20Characters: "长度在 4 到 20 个字符",
        pleaseEnterTheUserPasswordAgain: "请再次输入用户密码",
        keyIsWrongPleaseEnter: "密钥错误，请重新输入！",
        localStorageFailed: "本地存储失败！",
        cancel:"取消"
    },
    myInfo: {
        name: "用户名",
        walletAddress: "钱包地址",
        keystoreFile: "keystore文件:",
        exportKeystoreFile: "keystore导出",
    },
    ...zhLocale
};
