<template>
  <!--支付-->
  <el-container class="container">
    <a href="#">
      <img
        src="../../img/logo.png"
        alt=""
        style="width:150px;margin-top: -1vw; margin-bottom: 1vw;"
      />
    </a>
    <el-main class="main">
      <ul>
        <li
          v-for="(paytemplate, index) in data"
          :data-index="index"
          :key="index"
          @click="boxclick(paytemplate, $event)"
          :class="[index == current ? 'focus' : 'unfocus']"
        >
          <div class="paybox">
            <div class="payboxmain">
              <div class="money">
                <div class="payboxtitle">{{ paytemplate.name }}</div>
                <span>{{ paytemplate.pay }}</span
                >元
                <div class="daycost">
                  ≈{{
                    parseFloat(paytemplate.pay / paytemplate.day).toFixed(2)
                  }}元/天
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div class="content">{{ content }}</div>
    </el-main>
    <el-footer>
      <div class="paybtn">
        <div class="paytrue"><span>实际支付:</span>{{ pay }}元</div>
        <el-button
          class=""
          type="danger"
          size="small"
          @click="doPay"
          :disabled="ispay"
          >立即付款</el-button
        >
      </div>
    </el-footer>
  </el-container>
</template>
<script>
const request = require("request");
const util = require("util");
let baserpcurl = "http://47.103.65.5:9527/";
//判断是否为开发者模式
if (process.env.NODE_ENV === "development") {
  baserpcurl = "http://localhost:8080/alipay";
}

export default {
  props: ["dialogopen", "dialogclose"],
  data() {
    return {
      current: -1,
      content: "",
      pay: 0, //默认支付
      ispay: true, //支付按钮默认为disabled
      data: [
        {
          key: "fdbce150-fec4-11e9-bd33-854c67bf088b",
          name: "体验卡",
          pay: 0,
          day: "15",
          content: "体验15天"
        },
        {
          key: "fdbce150-fec4-11e9-bd35-854c67bf388b",
          name: "季卡",
          pay: 0.01,
          day: "90",
          content: "季卡 90天"
        },
        {
          key: "fdbce150-fec4-11e9-bd38-854c67bf388b",
          name: "年卡",
          pay: 0.02,
          day: "365",
          content: "年卡 365天"
        }
      ]
    };
  },
  async mounted() {
    let user = this.$JSON5.parse(localStorage.getItem("userkeyObj"));
    const getPromise = util.promisify(request.get);
    let url =
      "https://stats.jccdex.cn/sum/jpassword/get_charge_list/:uuid?w=" +
      user.address +
      "&t=1";
    let result = await getPromise(url);
    let msg = this.$JSON5.parse(result.body);
    console.log(msg.data);
    if (msg.data.list.length > 0) {
      this.data.splice(0, 1);
    }
  },
  methods: {
    //关闭支付框触发
    clearPay() {
      this.$emit("dialogPayGeneratorclose", false);
      this.ispay = true;
    },
    boxclick(paytemplate, event) {
      let target = event.currentTarget;
      let index = Number(target.getAttribute("data-index"));
      this.current = index;
      this.content = paytemplate.content;
      this.pay = paytemplate.pay;
      this.ispay = false;
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
      request.post(options, function(error, response, body) {
        if (_this.pay === 0) {
          if (response.body === "TRADE_SUCCESS") {
            _this.$router.push("/jpass/main");
          } else {
            _this.$message.error("充值失败！");
          }
        } else {
          let form = response.body.split("#")[0];
          out_trade_no = response.body.split("#")[1];
          const target = "target='_blank' ";
          let newFrom = form.slice(0, 6) + target + form.slice(6);
          const div = document.createElement("div");
          div.id = "alipay";
          div.innerHTML = newFrom;
          document.body.appendChild(div);
          document.querySelector("#alipay").children[0].submit();
          document.body.removeChild(div);
          _this.query(out_trade_no);
        }
      });
    },
    query(out_trade_no) {
      let status;
      let options = {
        url: baserpcurl + "query",
        form: {
          out_trade_no: out_trade_no
        } 
      };
      let _this = this;
      request.post(options, function(error, response, body) {
        status = response.body;
        if (status === "TRADE_SUCCESS") {
          _this.$message({
            message: "恭喜你，充值成功！",
            type: "success"
          });
          _this.$router.push("/jpass/main");
        } else {
          setTimeout(function() {
            let _out_trade_no = out_trade_no;
            _this.query(_out_trade_no);
          }, 5000);
        }
      });
    }
  },
  watch: {}
};
</script>
<style scoped>
.main {
  /* border: 1px solid red; */
  border-radius: 10px;
  box-shadow: 0 0 7px 1px #c5c5c5;
}

ul {
  /* border: 1px solid blueviolet; */
  display: table;
  margin: 0 auto;
  position: absolute;
  left: 17%;
  top: 30%;
}
.container {
  width: 50vw;
  margin: auto;
  height: 80vh;
  position: absolute;
  top: 10%;
  left: 25%;
}

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
  color: #f04f28;
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
  position: absolute;
  right: 10%;
  bottom: 15%;
}

.paytrue {
  color: #f04f28;
  font-size: 20px;
  font-weight: bold;
  width: 10vw;
}

.paytrue > span {
  color: #5c6b7a;
  font-size: 12px;
}

.content {
  width: 15vw;
  height: 12vh;
  text-align: left;
  font-size: 14px;
  font-weight: bold;
  color: #f04f28;
  position: absolute;
  top: 65%;
  left: 20%;
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
  color: #ff0000;
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
