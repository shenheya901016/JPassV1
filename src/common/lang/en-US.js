import enLocale from 'element-ui/lib/locale/lang/en'

export default {
    login: {
        title: "Login Jpass",
        selectuser: "Please select login user",
        name: "Username",
        nametitle: "Please select login user. If there is no data in the drop-down box, please register user first or import the existing wallet!",
        password: "Password",
        login: "Login",
        register: "Register",
        importwallet: "Import wallet",
        importmode: "Import mode selection",
        importkey: "Secret import",
        importkeystory: "Keystore  import",
        importmnemonic: "Mnemonic import",
        namevalidation: "Please select login user. If there is no data in the drop-down box, please register user first or import the existing wallet!",
        pwdvalidaion: "Please enter the user password!",
        pwdlengthvalidaion: "The length is between 4 and 20 characters",
        pwderror: "Wrong password, please re-enter!",
        loginerror: "The user does not exist, please re-enter!",
        outline:"The network connection is abnormal. Please check the network!"
    },

    register:{
        title:"Register",
        name:"Name",
        password:"Password",
        duplicatePassword:"RePassword",
        register:"Register",
        cancel:"Cancel",
        repassword:"Please enter your password again！",
        samepwd: "The two passwords do not match！",
        uservalidaion: "The user name is duplicate, please enter it again！",
        ruleuser: "Please enter user name！",
        ruleuserLength: "The length is between 6 and 20 characters！",
        pleaseEnterUserPassword: "Please enter the user password！",
        lengthCharacters: "Length greater than 4 characters！",
        pleaseEnterUserPasswordAgain: "Please enter the user password again！",
        no: "empty",
        walletGenerationFailed: "Wallet generation failure！",
        keystoreGenerationFailed: "keystore generate failure！",
        localStorageFailed: "Local storage failure！"

    },
    registersuccess: {
        title: '&#12288;Congratulations! your wallet has been registered successfully.Please use your<span style="color: red"> wallet Address</span> to jingtong website to activate your wallet!<p style="color: red;font-size: 15px">Attention:Please copy and keep the following information in time. It is necessary to retrieve your wallet.</p>',
        mnemonic: "Mnemonic:",
        walletAddress: "Wallet Address:",

        secret: "Secret:",
        keystoreFile: "Keystore File:",
        exportKeystoreFile: "Keystore Export",
        login:"Return to login page"
    },
    mnemonicimport: {
        importmnemonic: "Mnemonic Import",
        enterMnemonic: "Mnemonic",
        newUserName: "New Name",
        newPassword: "New Password",
        duplicatePassword: "RePassword",
        importWallet: "Wallet Import",
        importSuccessfully: "Wallet imported successfully，The Keystore File has been updated,Please download and keep it properly！",
        keystoreExport: "Keystore Export",
        userNameDuplicate: "The user name is duplicate, please enter it again !",
        enterPasswordAgain: "Please enter your password again!",
        inputPasswordsError: "The two passwords do not match!",
        PleaseEnter12Mnemonics: "Please enter a 12-bit mnemonic!",
        inputUserName: "Please enter user name!",
        lengthBetween3and20Characters: "The length is between 6 and 20 characters!",
        inputPassword: "Please enter the user password!",
        lengthBetween4and20Characters: "The length is between 4 and 20 characters!",
        pleaseEnterUserPasswordAgain: "Please enter the user password again!",
        mnemonicError: "Mnemonic error, please retype it！",
        keystoreGeneratedError: "keystore generate the error！",
        localStorageFailed: "Local storage failure！",
        cancel:"Cancel",
    },
    lock: {
        unlockJpass: "Unlock Jpass",
        loginPassword: "Login Password",
        unlock: "Unlock",
        thePasswordIsIncorrectPleaseReEnter: "The password is wrong, please enter it again！",
        unlockedSuccessfully: "unlocked！"
    },
    keystoreImport: {
        importKeystoreWallet: "Keystore Import",
        keystoreFile: "Keystore File",
        uploadKeystore: " Upload Keystore",
        oldLoginPassword: "Old Password",
        pleaseEnterTheOldLoginPassword: "Please enter your old login password!",
        newUserName: "New Name",
        newUsernameWillReplaceTheOldUsername: "The new username replaces the old username!",
        newLoginPassword: "New Password",
        newPasswordWillReplaceTheOldPassword: "The new password will replace the old one!",
        passwordRepetition: "RePassword",
        importWallet: "Wallet Import",
        walletImportedSuccessfully: "The wallet has been successfully imported and the keystore file has been updated. Please download it in time and keep it safe!",
        keystoreExport: "Keystore Export",
        userNameIsDuplicatePleaseEnter: "The user name is duplicate, please enter it again!",
        pleaseEnterYourPasswordAgain: "Please enter your password again!",
        twoPasswordsAreInconsistent: "The two passwords do not match!",
        pleaseEnterANewUsername: "Please enter a new user name!",
        pleaseEnterYourPassword: " Please enter your password!",
        pleaseEnterAUserPassword: " Please enter your password!",
        theLengthIsBetween4And20Characters: "Length greater than 6 characters!",
        pleaseEnterTheUserPasswordAgain: "Please enter the user password again!",
        theCurrentLimitSelects1FileThisTimeSelectedFiles: "Currently restricted uploading 1 file",
        importedKeystoryFilePFailed: "Keystory File not imported or file parsing failed, please enter again!",
        theKeystoryFileOrPasswordIsIncorrectPleaseEnter: "Keystory Wrong file or password, please enter again!",
        newKeystoreGeneratedError: "Error generating new keystore file!",
        localStorageFailed: "Local storage failure!",
        cancel:"Cancel",
        login:"Return to login page"
    },
    keyImport: {
        walletKeyImport: "Secret Import",
        walletKey: "Secret",
        newUserName: "New Name",
        newPassword: "New Password",
        passwordRepetition: "RePassword",
        importWallet: "Wallet Import",
        walletImportedSuccessfully: "Wallet imported successfully!  The keystore file has been updated，Please download and keep it properly!",
        keystoreExport: "Keystore Export",
        pleaseEnterYourPasswordAgain: "Please enter your password again!",
        TwoPasswordsAreInconsistent: "The two passwords do not match!",
        userNameIsDuplicatePleaseEnter: "The user name is duplicate, please enter it again！",
        pleaseEnterTheWalletKey: "Please enter the wallet secret",
        pleaseEnterAUserName: "Please enter user name!",
        theLengthIsBetween3And20Characters: "The length is between 6 and 20 characters!",
        pleaseEnterAUserPassword: "Please enter the user password!",
        lengthIsBetween4And20Characters: "The length is between 4 and 20 characters!",
        pleaseEnterTheUserPasswordAgain: "Please enter the user password again!",
        keyIsWrongPleaseEnter: "secret error, please retype！",
        localStorageFailed: "Local storage failure!",
        cancel:"Cancel",
    },
    main: {
        newFolder: "New folder",
        newTemplate: "New template",
        selectColorD:"修改颜色",
        newProject: "New project",
        delete: "Delete",
        synchronize: "Synchronize",
        locking: "Lock",
        folder: "Folder",
        pleaseEnterWhatYouWantToSearch: "Search for...",
        name: "Name",
        modify: "Edit",
        passwordUnlock: "Password Unlock",
        loginPassword: "Login Password",
        unlock: "Unlock",
        addDirectory: "Add folder",
        ok: "Confirm",
        cancel: "Cancel",
        prompt: "Prompt",
        doYouWantToDeleteTheFolder: "Do you want to delete folders?",
        okFormat: "Confirm",
        cancelFormat: "Cancel",
        doYouWantToDeleteTheProject: "Do you want to delete Project?",
        doYouWantToDeleteTheTemplate: "Do you want to delete Template",
        selectTemplate: "Option template",
        addItem: "New project",
        chooseCategory: "Choose category",
        addOtherItems: "Add items ",
        additionalItem: "Add item",
        modifyTheProject: "Edit project",
        submit: "Submit",
        systemSettings: "System setting",
        timedLock: "Timing lock",
        idleTime: "Standby time",
        language: "Language",
        languageSelection: "Language selection",
        passwordService: "Password service",
        showPassword: "Show password",
        newUserAndPasswordAreAutomaticallySaved: "New user and password saved automatically",
        pleaseChoose: "Please choose",
        save: "Save",
        addTemplate: "Add template",
        templateName: "Template name",
        modifyTemplate: "Edit template ",
        ask: "Ask",
        shutDown: "Turn off",
        autofill: "Auto fill",
        pleaseChooseTheType: "Please select type!",
        pleaseEnterAName: "Please enter name!",
        theLengthIsBetween1And10Characters: "Length between 1 and 5 characters!",
        thePasswordIsIncorrectPleaseReEnter: "Wrong password, please enter again!",
        unlockedSuccessfully: "Unlocked！",
        theInputIsIncorrectPleaseConfirmItAndSubmitItAgain: "Input error, please confirm correct before submitting!",
        allProjects: " All projects",
        favorites: "Favorite",
        password: "Password",
        template: "Template",
        unmarked: "Unmarked",
        trash:"Trash",
        note: "Attention",
        pleaseGoToTheOfficialWebsiteToActivateYourWallet: "Please go to the official website to activate your wallet first！",
        weak: "Weakness",
        mid: "Medium",
        strong: "Strong",
        pleaseChooseATemplate: "Please select template！",
        successfullyModified: "Edit successfully！",
        failToEdit: "Edit failure！",
        settingSavedSuccessfully: "Settings saved successfully！",
        re_login:"Re-login to implement all configuration updates, do you re-login?",
        suggest:"Suggest",
        login:"re_login",
        settingSaveFailed: "Settings save failed！",
        PasswordGenerator:"Password generator",
        fields:"Fields",
        recover:"Recover",
        recovertitle:"Whether to restore deleted files?",
        clearTashTitle:"Empty the trash?",
        cleartrash:"Empty trash",
        selectSymbol:"Select symbol",
        selectColor:"Select color",
        userIcon:"User Icon",
        color:"Color",
        symbol:"Symbol",
        synchronizationInfo:"The system has detected that your last synchronization operation was not performed in this machine. In order to ensure data integrity, please ensure that the data of the last operation has been successfully synchronized. Please carefully choose the synchronization method!",
        localToIpfs:"Local to ipfs",
        ipfsToLocal:"Ipfs to local",
        userResource:"User resource",
        notvip:"nonmember，please recharge！",
        lineError:"System abnormal, please test whether the network is normal!",
        synchronizationSuccessful:"Data synchronization successful!",
        NonMember:"Non-member, data cannot be synchronized, please recharge!",
        withoutSynchronization:"Local data is the same as IPFS data, no synchronization required!",
        //密码生成器
        passwordGenerator:"Password Generator",
        easyMemorize:"Easy to remember",
        lettersAndNumbers:"Just letters and Numbers",
        completelyRandom:"Completely random",
        numberOnly:"Number only",
        moment:"moments",
        breakTime:"Break Time:",
        seconds:"seconds",
        mintues:"minutes",
        hours:"hours",
        day:"days",
        weeks:"weeks",
        month:"month",
        years:"years", 
        century:"century"  
    },
    myInfo: {
        name: "Name",
        walletAddress: "Wallet Address",
        keystoreFile: "Keystore File:",
        exportKeystoreFile: "Keystore Export",
        vip:"vip",
    },
    selects:{
        password:"Password",
        number:"Number",
        email:"Email",
        address:"Address",
        login:"Login",
        phone:"Phone",
        date:"Date",
        webside:"Webside"
    },
    ...enLocale
};
