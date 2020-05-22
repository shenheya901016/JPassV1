<template>
 <!--支付-->
       <el-dialog  :visible.sync="dialogVisiblePay" @closed="clearPay">
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
                                                <span>{{paytemplate.pay}}</span>元<div class="daycost">≈{{parseFloat(paytemplate.pay/paytemplate.day).toFixed(2)}}¥/天</div></div>  
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div class="content">{{content}}</div>
                        </el-main>
                        <el-footer >
                            <div class="paybtn">
                               <div class="paytrue"><span>实际支付:</span>{{pay}}元</div>
                               <el-button class=""  type="danger" size="small" >立即付款</el-button>
                            </div>
                        </el-footer>
                    </el-container>
        </el-dialog> 
</template>
<script>
export default {
        props:["dialogopen","dialogclose"],
        data() {	
			return {
                dialogVisiblePay:false, // 支付弹出框	
                  current:-1,
                  content:'',
                  pay:0,//默认支付


                  paytemplate: {
                    "paytemplateItems": [{
                        "key": "fdbce150-fec4-11e9-bd33-854c67bf088b",
                        "name": "月卡",
                        "pay": "30",
                        "day": "31",
                        "content":"月卡 30天"
                    }, {
                        "key": "fdbce150-fec4-11e9-bd35-854c67bf388b",
                        "name": "季卡",
                        "pay": "45",
                        "day": "90",
                        "content":"季卡 90天"
                    },
                    {
                        "key": "fdbce150-fec4-11e9-bd38-854c67bf388b",
                        "name": "年卡",
                        "pay": "100",
                        "day": "365",
                        "content":"年卡 365天"
                    }]
                },
			}
        },
        methods:{
            //关闭支付框触发
            clearPay(){
               this.$emit("dialogPayGeneratorclose",false);
            },

            boxclick(paytemplate, event) {
                var target = event.currentTarget;              
                var index = Number(target.getAttribute("data-index"));
                this.current = index;
                this.content=paytemplate.content;
                this.pay=paytemplate.pay;
            }
        },
        watch: {  
			dialogopen: function(data){ 
				this.dialogVisiblePay=data
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

    @import "/views/jpass/css/base.css";
    @import "/views/jpass/css/css/sy.css";

  .paybox {
      height:23vh;
      width:10vw;
      display:inline-block;  
      margin-right: 3vw;
  }

  .payboxtitle{
     text-align: center;
     color:hsl(199, 100%, 50%);
     font-weight:bold;
     width: 10vw;
     margin-bottom: 2vh;
     font-size: 20px;
  }

  .payboxmain{
      height: 24vh;
      width: 10vw;
      display: table;
      border-radius:5%;
     /* margin-top:1vh; */
  }

  .money >span{
      color:#F04F28;
      font-size: 27px;
      font-weight: bold;
  }

   .money{
      display: table-cell;
      vertical-align: middle;
      font-weight: bold;
  }

   .time{
      font-size: 15px;
      font-weight: bold;
 
  }

  .paybtn {
      float: right;
      margin-top: 2%;
  }

  .paytrue{
       color:#F04F28;
       font-size: 20px;
       font-weight: bold;
  }

  .paytrue >span{
      color: #5C6B7A;
      font-size: 12px;
  }

  .content{
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
  
  .el-header{
      color:hsl(199, 100%, 50%);
      text-align: center;
      font-size: 20px;
  }

  .el-button{
      margin-top: 1vh;
  }

  .daycost{
       margin-top: 1vh;
       color: #FF0000;
  }
  
 
  ul{
      margin-left: 3vw;
      
  }
  ul>li{
      float: left;
      width: 21vh;
      border-radius: 5%;
      margin-right: 3vw;
      border:1px solid rgb(124, 123, 123);
  }

  .focus{
      border: 1px solid red;
  }



  

</style>