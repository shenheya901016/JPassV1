<template>
    <!--支付-->
    <el-dialog :visible.sync="dialogVisiblePay" @closed="clearPay">
        <el-container>
            <el-header>购买JPassword</el-header>
            <el-main>
                <ul>
                    <li v-for="(paytemplate, index) in paytemplate.paytemplateItems"
                        :data-index="index"
                        :key="index"
                        @click="boxclick(paytemplate, $event)"
                        :class="[index == current ? 'focus' : 'unfocus']"
                    >
                        <div class="paybox">
                            <div class="payboxmain">
                                <div class="money">
                                    <div class="payboxtitle">{{paytemplate.name}}</div>
                                    <span>{{paytemplate.pay}}</span>元
                                    <div class="daycost">
                                        ≈{{parseFloat(paytemplate.pay/paytemplate.day).toFixed(2)}}元/天
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="content">{{content}}</div>
            </el-main>
            <el-footer>
                <div class="paybtn">
                    <div class="paytrue"><span>实际支付:</span>{{pay}}元</div>
                    <el-button class="" type="danger" size="small" @click="doPay" :disabled="ispay">立即付款</el-button>
                </div>
            </el-footer>
        </el-container>
    </el-dialog>
</template>
<script>
    const request = require("request");
    let baserpcurl = "http://47.103.65.5:9527/";
    //判断是否为开发者模式
    if (process.env.NODE_ENV === "development") {
        baserpcurl = 'http://localhost:8080/alipay';
    }

    export default {
        props: ["dialogopen", "dialogclose"],
        data() {
            return {
                dialogVisiblePay: false, // 支付弹出框
                current: -1,
                content: '',
                pay: 0,//默认支付
                ispay:true,//支付按钮默认为disabled
                paytemplate: {
                    "paytemplateItems": [{
                        "key": "fdbce150-fec4-11e9-bd33-854c67bf088b",
                        "name": "月卡",
                        "pay": "0.01",
                        "day": "31",
                        "content": "月卡 30天"
                    }, {
                        "key": "fdbce150-fec4-11e9-bd35-854c67bf388b",
                        "name": "季卡",
                        "pay": "49",
                        "day": "90",
                        "content": "季卡 90天"
                    }, {
                        "key": "fdbce150-fec4-11e9-bd38-854c67bf388b",
                        "name": "年卡",
                        "pay": "99",
                        "day": "365",
                        "content": "年卡 365天"
                    }]
                },
            }
        },
        methods: {
            //关闭支付框触发
            clearPay() {
                this.$emit("dialogPayGeneratorclose", false);
                this.ispay=true;
            },
            boxclick(paytemplate, event) {
                let target = event.currentTarget;
                let index = Number(target.getAttribute("data-index"));
                this.current = index;
                this.content = paytemplate.content;
                this.pay = paytemplate.pay;
                this.ispay=false;
            },
            doPay() {
                const loginObj = this.$JSON5.parse(sessionStorage.getItem("userkeyObj"));
                const address = loginObj.address;
                let options = {
                    url: baserpcurl + "pay",
                    form: {
                        price: this.pay,
                        user_wallet_address: address
                    }
                };
                let out_trade_no;
                let _this = this;
                request.post(options, function (error, response, body) {
                    let form = response.body.split("#")[0];
                    out_trade_no = response.body.split("#")[1];
                    const target = "target='_blank' ";
                    let newFrom = form.slice(0, 6) + target + form.slice(6)
                    const div = document.createElement('div')
                    div.id = 'alipay'
                    div.innerHTML = newFrom
                    document.body.appendChild(div)
                    document.querySelector('#alipay').children[0].submit()
                    _this.query(out_trade_no)
                });
            },
            query(out_trade_no) {
                let status;
                let options = {
                    url: baserpcurl + "query",
                    form: {
                        out_trade_no: out_trade_no,
                    }
                };
                let _this = this;
                request.post(options, function (error, response, body) {
                    console.log(response.body)
                    status = response.body;
                    if (status === "TRADE_SUCCESS") {
                        _this.dialogVisiblePay=false;
                        _this.$message({
                            message: '恭喜你，充值成功！',
                            type: 'success'
                        });
                    } else {
                        console.log("充值失败！")
                        setTimeout(function () {
                            let _out_trade_no = out_trade_no;
                            _this.query(_out_trade_no)
                        }, 5000);
                    }
                });
            }
        },
        watch: {
            dialogopen: function (data) {
                this.dialogVisiblePay = data
            },
            // dialogclose:function(data){
            // 	if(data){
            // 		this.dialogVisiblePay=false

            // 	}
            // }
        },
    }

</script>
<style scoped>

    .paybox {
        height: 23vh;
        width: 10vw;
        display: inline-block;
        margin-right: 3vw;
    }

    .payboxtitle {
        text-align: center;
        color: hsl(199, 100%, 50%);
        font-weight: bold;
        width: 10vw;
        margin-bottom: 2vh;
        font-size: 20px;
    }

    .payboxmain {
        height: 24vh;
        width: 10vw;
        display: table;
        border-radius: 5%;
        /* margin-top:1vh; */
    }

    .money > span {
        color: #F04F28;
        font-size: 27px;
        font-weight: bold;
    }

    .money {
        display: table-cell;
        vertical-align: middle;
        font-weight: bold;
    }

    .time {
        font-size: 15px;
        font-weight: bold;

    }

    .paybtn {
        float: right;
        margin-top: 2%;
    }

    .paytrue {
        color: #F04F28;
        font-size: 20px;
        font-weight: bold;
    }

    .paytrue > span {
        color: #5C6B7A;
        font-size: 12px;
    }

    .content {
        float: left;
        margin-top: 9vh;
        margin-left: 3vw;
        width: 15vw;
        height: 12vh;
        text-align: left;
        font-size: 14px;
        font-weight: bold;
        color: #F04F28;
    }

    .el-header {
        color: hsl(199, 100%, 50%);
        text-align: center;
        font-size: 20px;
    }

    .el-button {
        margin-top: 1vh;
    }

    .daycost {
        margin-top: 1vh;
        color: #FF0000;
    }


    ul {
        margin-left: 3vw;

    }

    ul > li {
        float: left;
        width: 21vh;
        border-radius: 5%;
        margin-right: 3vw;
        border: 1px solid rgb(124, 123, 123);
    }

    .focus {
        border: 1px solid red;
    }


</style>
