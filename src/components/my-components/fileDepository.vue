<template>
	<div style="display: flex;width: 80%;">
		<el-input v-model="url" style="80%" readonly></el-input>
		<el-button size="small" @click="chooseFile(1)" style="margin-left: 0.625rem;">在线选择</el-button>
		<el-button size="small" @click="chooseFile(2)">站内选择</el-button>

		<fileDepositoryOnline v-if="onlineVisible" ref="fileDepositoryOnline" @onlineHandle="chooseHandle"></fileDepositoryOnline>
		<fileDepositoryFtp :visible="ftpVisible" @dialogClose="dialogClose" @chooseFile="chooseUrl" ></fileDepositoryFtp>
	</div>
</template>

<script>
	import fileDepositoryOnline from './fileDepository-online.vue'
	import fileDepositoryFtp from './fileDepository-ftp.vue'
	//import stationSelection from './stationSelection.vue'
	export default {
		name: 'fileDepository',
		data() {
			return {
				onlineVisible: false,
				ftpVisible: false,
				url: null,
			}
		},
		components: {
			fileDepositoryOnline,
			fileDepositoryFtp
		},
		props:['videoUrl'],
		watch:{
			videoUrl(newValue,oldValue){
				this.url=newValue
			}
		},
		created(){
			this.url=this.videoUrl
		},
		methods: {
			chooseFile(i) {
				if (i == 1) {
					this.onlineVisible = true;
					this.$nextTick(() => {
						this.$refs.fileDepositoryOnline.init();
					})
				} else {
					this.ftpVisible = true;
				}
			},
			//在线库选择文件地址
			chooseHandle(e) {
				this.url = e;
        this.$emit('getFileUrl', this.url);
			},
			//初始化
			init() {
				this.url = null;
			},
			//ftp库选择文件地址
			chooseUrl(e){
				this.url = e;
        this.$emit('getFileUrl', this.url);
			},
			dialogClose(e){
				this.ftpVisible =e
			}
		}
	}
</script>
