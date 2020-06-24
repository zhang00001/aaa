<template>
  <el-dialog
    title="在线文件视频库"
    :visible.sync="dialogVisible"
    top="1vh"
    width="60%"
    append-to-body>
    <div class="mod-oss">
      <el-form :inline="true" :model="dataForm">
        <el-form-item>
          <el-button type="primary" v-if="isAuth('sys:oss:upload')" @click="uploadHandle()">上传文件</el-button>
          <el-button type="danger" v-if="isAuth('sys:oss:delete')" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        @selection-change="selectionChangeHandle"
        style="width: 100%;">
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="id"
          header-align="center"
          align="center"
          width="80"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          width="150"
          label="文件名称">
        </el-table-column>
        <el-table-column
          prop="url"
          header-align="center"
          align="center"
          label="URL地址">
        </el-table-column>
        <el-table-column
          prop="createDate"
          header-align="center"
          align="center"
          width="180"
          label="创建时间">
        </el-table-column>
        <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="150"
          label="操作">
          <template slot-scope="scope">

            <Popover btnName="修改" :id="scope.row.id" @submitHandle="updateHandle" v-if="isAuth('sys:oss:update')"></Popover>
            <el-button type="text" size="small" @click="chooseHandle(scope.row.url)">确定选择</el-button>
            <el-button type="text" size="small" v-if="isAuth('sys:oss:delete')" @click="deleteHandle(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>

      <!-- 弹窗, 上传文件 -->
      <upload v-if="uploadVisible" ref="upload" @refreshDataList="getDataList"></upload>
    </div>

  </el-dialog>
</template>

<script>
  import Upload from './oss-upload.vue'
  import Popover from './popover.vue'
  export default {
    name: 'fileDepositoryOnline',
    data () {
      return {
        dataForm: {},
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        configVisible: false,
        uploadVisible: false,
        oss:{},
        dialogVisible: false
      }
    },
    components: {
      Upload,
      Popover
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.oss={}
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/oss/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 上传文件
      uploadHandle () {
        this.uploadVisible = true
        this.$nextTick(() => {
          this.$refs.upload.init()
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/oss/delete'),
            method: 'delete',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
      //修改文件名字
      updateHandle (e){
        this.oss.id = e.id;
        this.oss.name = e.name;
        this.$http({
          url: this.$http.adornUrl('/sys/oss/update'),
          method: 'put',
          data: this.$http.adornParams(this.oss,false)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
          this.currentIndex = null;
        })
      },
      //选择文件地址
      chooseHandle (url){
        this.dialogVisible = false;
        this.$nextTick(() => {
          this.$emit('onlineHandle',url);
        })
      },
      //初始化
      init(){
        this.pageIndex = 1;
        this.pageSize = 10;
        this.dialogVisible = true;
        this.getDataList();
      }
    }
  }
</script>
