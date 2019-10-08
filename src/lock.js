/**
 * Created by Administrator on 2019-10-8.
 */

var JPasslock = {
    mouse1:'',//记录鼠标坐标
    mouse2:'',
    eventID:'',

    mousePos: (e)=> {
        var x, y;
        var e = e || window.event;
        return {
            x: e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
            y: e.clientY + document.body.scrollTop + document.documentElement.scrollTop
        };
    },

    GetXYPosition: (e)=> {
        JPasslock.mouse2 = JPasslock.mousePos(e).x + ',' +JPasslock.mousePos(e).y;//这里是把title修改成为鼠标的横纵坐标

    },

    timeout: 5 * 1000,//设定超时时间，单位毫秒
    currentSecond: 0,

    CheckTime: ()=> {
        console.log(JPasslock.mouse1);
        console.log(JPasslock.mouse2);
        if (JPasslock.mouse1 ==JPasslock.mouse2) {
            JPasslock.currentSecond =JPasslock.currentSecond + 1000;
            if (JPasslock.currentSecond > JPasslock.timeout) {
                clearInterval(this.eventID);
                //console.log("你已经超过3分钟没有操作，页面自动跳转至首页");

                 window.location.href = "http://www.baidu.com";
            }
        } else {
            currentSecond = 0;
            JPasslock.mouse1 =JPasslock.mouse2;
        }
    },
    StartPoint: ()=> {
        this.mouse1 = "";
        this.mouse2 = "";
        this.eventID = setInterval(JPasslock.CheckTime, 1000);
    }
};
module.exports = JPasslock;









