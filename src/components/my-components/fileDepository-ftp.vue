<template>
	<el-dialog title="本地文件视频库" top="5vh" append-to-body :visible.sync="visible" width="60%" :close-on-click-modal="false" :before-close="close">
    <div class="clearfix">
      <el-button v-show="root" size="small" icon="el-icon-back" type="primary" @click="back">返回</el-button>
      <div class="fr">当前目录路径: <span v-html="parm.decodeUrl"></span></div>
    </div>

		<el-table :data="tableData" style="width: 100%;height:668px;overflow:auto; margin-top: 10px;" v-loading="loading"
		 border>
			<el-table-column prop="date" label="名称">
				<template slot-scope="scope">
					<div class="file-div" v-if="scope.row.type==1" @click="seach(scope.row.url)">
						<img src="../../assets/img/folder.png" class="img" />
						<span>{{scope.row.name}}</span>
					</div>
					<span v-if="scope.row.type!=1">{{scope.row.name}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="size" label="大小" align="center">
			</el-table-column>
			<el-table-column prop="time" label="修改时间" align="center">
			</el-table-column>
			<el-table-column label="操作" width="115" align="center">
				<template slot-scope="scope">
					<el-button size="small" v-if="scope.row.type!=1" class="btn" type="text" @click="choose(scope.row)">确认选择</el-button>
				</template>
			</el-table-column>
		</el-table>
	</el-dialog>
</template>

<script>
	export default {
		name: 'fileDepositoryFtp',
		props: {
			visible: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				loading: false,
				tableData: [],
				parm: {
					url: '%2F',
          decodeUrl: '/'
				},
				root: false,
			}
		},
		created() {
			this.loadFile();
		},
		methods: {
      //加载文件列表
			loadFile() {
				this.loading = true;
				this.$http({
					url: this.$http.adornUrl('/file/list'),
					method: 'get',
					params: this.parm,
				}).then(({
					data
				}) => {
					if (data && data.code === 0) {
						this.tableData = data.data
						if (this.parm.url == '%2F') {
							this.root = false;
						} else {
							if (data.url == '%2F') {
								this.root = false;
							} else {
								this.root = true;
							}
						}
					} else {
						this.tableData = []
					}
					this.loading = false;
				})
			},
      //进入下一级目录
			seach(url) {
				this.parm.url = url;
        this.parm.decodeUrl = decodeURIComponent(url);
				this.loadFile();
			},
      //选中文件
			choose(row) {
        let url = decodeURIComponent(row.url);

				this.$emit('chooseFile', url);
				this.close();
			},
      //返回上一级目录
			back() {
				if (this.parm.url == '%2F') {
					this.root = false;
					return false;
				}
				this.loading = true;
				this.$http({
					url: this.$http.adornUrl('/file/back'),
					method: 'get',
					params: this.parm,
				}).then(({
					data
				}) => {
					if (data && data.code === 0) {
						this.parm.url = data.url;
						this.loadFile()
					} else {
						if (data.code == 500) {
							this.$message.warning(data.msg);
						}
					}
					this.loading = false;
				})
			},
      //关闭弹窗
			close() {
				this.$emit('dialogClose', false)
			}
		}
	}
</script>

<style scoped>
	.btn {
		font-size: 12px;
	}

	.file-div {
		cursor: pointer;
	}

	.file-div:hover {
		color: #0066CC;
		text-decoration: underline;
	}

	.img {
		width: 16px;
		height: 16px;
	}


  .fr{
    float: right;
  }

  .clearfix:before,
  .clearfix:after {
   content: '';
   display: table;
  }

  .clearfix:after {
   clear: both;
  }
</style>
