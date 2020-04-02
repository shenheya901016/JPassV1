<template>
	<!--密码生成器-->
	<el-dialog title="密码生成器" :visible.sync="dialogVisiblePasswordGenerator" width="40%" :close-on-click-modal="false"
	 :close-on-press-escape="false" :show-close="true" @closed="clearPass">
		<el-input v-model="crypt" readonly></el-input>
		<el-progress :show-text="false" :stroke-width="5" :percentage="percentage" :status="status" style="margin-top: 1%;" ></el-progress>
		<div style="display: block;height:3vh;">{{ level }}</div>
		<el-slider :step="1" :max="20" show-stops v-model="value2"></el-slider>
		<el-radio-group v-model="radio">
			<el-radio :label="1">便于记忆</el-radio>
			<el-radio :label="2">仅字母和数字</el-radio>
			<el-radio :label="3">完全随机</el-radio>
			<el-radio :label="4">仅允许数字</el-radio>
		</el-radio-group>
		<br />
		<el-button style="margin-top: 5%" size="small" type="primary" @click="getPassword()">
			{{ $t("main.okFormat") }}
		</el-button>
		<el-button size="small" @click="dialogVisiblePasswordGenerator = false">{{ $t("main.cancelFormat") }}
		</el-button>
	</el-dialog>
</template>

<script>
	export default {
		props:["dialogopen","dialogclose"],
		data() {	
			return {
				//密码生成器
				dialogVisiblePasswordGenerator:false, // 密码生成器弹出框	
				crypt: "",
				level: "",
				radio: 3,
				value2: 0, //系统设置配置项
				//进度条值
				percentage: 0,
				status: "exception",
			}
		},
		methods: {
			//关闭密码器清除相关数据
			clearPass() {
				this.value2 = 0;
				this.level = "";
				this.crypt = "";
				this.$emit("dialogPasswordGeneratorclose",false);
			},
			//获取密码
			getPassword() {
				this.$emit("transpassword",this.crypt);	
			}
		},
		watch: {  //密码生成器自动生成
		    'value2': function(){
		        this.crypt = this.$createPassword.genCrypt(this.radio, this.value2);
		        this.level = this.$createPassword.cryptLevel(this.crypt);
		        if (this.level.indexOf("世纪") !== -1) {
		            this.percentage = 100;
					this.status="success"
		        } else if (this.level.indexOf("年") !== -1) {
		            this.percentage = 80;
		            this.status="success"
		        } else if (this.level.indexOf("月") !== -1) {
		            this.status="success"
					this.percentage = 60;
		        } else if (this.level.indexOf("周") !== -1) {
		            this.percentage = 40;
		            this.status="warning"
		        } else if (this.level.indexOf("天") !== -1 ||this.level.indexOf("分") !== -1 || this.level.indexOf("秒") !== -1) {
		            this.percentage = 20;
		            this.status="exception"
		        } else if(this.level.indexOf("瞬间") !== -1 && this.value2!=""){
		            this.percentage =10;
		            this.status="exception"
		        }else{
		            this.percentage =0;
					this.status="exception"
		            this.level="";
		        }
		    },
			dialogopen: function(data){ 
				this.dialogVisiblePasswordGenerator=data
			},
			dialogclose:function(data){
				if(data){
					this.dialogVisiblePasswordGenerator=false
					this.$emit("recoverdialogtag",false);

				}
			}
		},

	};
</script>


<style>

</style>
