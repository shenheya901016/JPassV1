import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

export default {
   login: {
        title: "登录Jpass",
        selectuser: "请选择登录用户",
        name:"用户名称",
        nametitle:"请选择登录用户，如果下拉框无数据，请先注册用户或导入已有钱包",
        password:"用户密码",
        login:"登录",
        register:"注册",
        importwallet:"导入钱包",
        importmode:"导入方式选择",
        importkey:"密钥导入",
        importkeystory:"key文件导入",
        importmnemonic:"助记词导入",
        namevalidation:"请选择登录用户，如果下拉框无数据，请先注册用户或导入已有钱包！",
        pwdvalidaion:"请输入用户密码",
        pwdlengthvalidaion:"长度在 4 到 20 个字符",
        pwderror:"密码有误，请重新输入！",
        loginerror:"用户不存在，请重新输入！",
       },
    register:{
        title: "用户注册",
        name:"用户名称",
        password:"用户密码",
        repassword:"密码重复",
        register:"注册",
        repassword:"请再次输入密码！",
        samepwd:"两次输入密码不一致！",
        uservalidaion:"用户名重复，请重新输入！",
        ruleuser:"请输入用户名称！",
        ruleuserLength:"长度在 3 到 20 个字符！",

    },
    ...zhLocale
};
