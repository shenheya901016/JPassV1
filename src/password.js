/**
 * Created by Administrator on 2019-9-24.
 */

  var PWDlength ={
       percentage:0,
       status :"exception",
       CharMode:function (iN) {
        if (iN >= 48 && iN <= 57) //数字
            return 1;
        if (iN >= 65 && iN <= 90) //大写
            return 2;
        if (iN >= 97 && iN <= 122) //小写
            return 4;
        else
            return 8;
    },
    //计算密码模式
    bitTotal:function(num){
        var modes = 0;
        var i="";
        for ( i = 0; i < 4; i++) {
            if (num & 1)
                modes++;
            num >>>= 1;
        }
        return modes;
    },

    //返回强度级别
    checkStrong:function (sPW) {
        if (sPW.length <= 4)
            return 0; //密码太短
        var Modes = 0;
        for (var i = 0; i < sPW.length; i++) {
            //密码模式
            Modes |= this.CharMode(sPW.charCodeAt(i));
        }
        return this.bitTotal(Modes);
    },
    //显示颜色
     pwStrength:function(pwd) {
         // var percentage=30;
        if (pwd == null || pwd == '') {
            this.percentage=0;
        } else {
            var S_level =this.checkStrong(pwd);
            switch (S_level) {
                case 0:
                    this.percentage=25; //密码长度小于;
                    this. status = "exception";
                    break;
                case 1:
                    this.percentage=50;//长度大于四单独类型字符
                    this. status = "exception";
                    break;
                case 2:
                    this.percentage=75;//长度大于四2种类型字符
                    this. status = "warning";
                    break;
                default:
                    this.percentage=100;//长度大于四3种类型字符
                    this.status = "success";
                    break;
            }
        }
        return;
    }
};

module.exports = PWDlength;