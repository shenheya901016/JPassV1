<template>
	<!--密码生成器-->
	<el-dialog title="密码生成器" :visible.sync="dialogPasswordGeneratorMain" width="40%" :close-on-click-modal="false"
	 :close-on-press-escape="false" :show-close="true" @closed="clearPass">
		<el-input v-model="crypt" readonly disabled></el-input>
		<el-progress :show-text="false" :stroke-width="5" :percentage="percentage" :status="status" style="margin-top: 1%;" ></el-progress>
		<div style="display: block;height:3vh;">{{ level }}</div>
		<el-radio-group v-model="radio">
			<el-radio :label="1">便于记忆</el-radio>
			<el-radio :label="2">仅字母和数字</el-radio>
			<el-radio :label="3">完全随机</el-radio>
			<el-radio :label="4">仅允许数字</el-radio>
		</el-radio-group>
        <el-slider :step="1" :max="20" show-stops v-model="value2"></el-slider>
	</el-dialog>
</template>

<script>
	export default {
		props:["dialogopenMain","dialogcloseMain"],
		data() {
			return {
				//密码生成器
				dialogPasswordGeneratorMain:false, // 密码生成器弹出框
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
				this.$emit("dialogPasswordGeneratorcloseMain",false);
			},
			//获取密码
		},
		watch: {  //密码生成器自动生成
		    'value2': function(){
		        this.crypt = this.$createPassword.genCrypt(this.radio, this.value2);
		        this.level = this.$createPassword.cryptLevel(this.crypt);
				this.$createPassword.getPercentage(this.crypt);
				this.percentage = this.$createPassword.percentage;
				this.status = this.$createPassword.status;
            },
            'radio': function(){
		        this.crypt = this.$createPassword.genCrypt(this.radio, this.value2);
		        this.level = this.$createPassword.cryptLevel(this.crypt);
				this.$createPassword.getPercentage(this.crypt);
				this.percentage = this.$createPassword.percentage;
				this.status = this.$createPassword.status;
            },
			dialogopenMain: function(data){
				this.dialogPasswordGeneratorMain=data;
			},
			dialogcloseMain:function(data){
				if(data){
					this.dialogPasswordGeneratorMain=false
					this.$emit("recoverdialogtagMain",false);

				}
			}
		},

	};
</script>


<style>

</style>
