<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="职位名称" prop="jobName">
      <el-input v-model="dataForm.jobName" placeholder="职位名称"></el-input>
    </el-form-item>
    <!-- <el-form-item label="创建时间" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
    </el-form-item>
    <el-form-item label="创建人" prop="createId">
      <el-input v-model="dataForm.createId" placeholder="创建人"></el-input>
    </el-form-item>
    <el-form-item label="修改时间" prop="updateTime">
      <el-input v-model="dataForm.updateTime" placeholder="修改时间"></el-input>
    </el-form-item>
    <el-form-item label="修改人" prop="updateId">
      <el-input v-model="dataForm.updateId" placeholder="修改人"></el-input>
    </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          jobName: '',
          createTime: '',
          createId: '',
          updateTime: '',
          updateId: ''
        },
        dataRule: {
          jobName: [
            { required: true, message: '职位名称不能为空', trigger: 'blur' }
          ],
          // createTime: [
          //   { required: true, message: '创建时间不能为空', trigger: 'blur' }
          // ],
          // createId: [
          //   { required: true, message: '创建人不能为空', trigger: 'blur' }
          // ],
          // updateTime: [
          //   { required: true, message: '修改时间不能为空', trigger: 'blur' }
          // ],
          // updateId: [
          //   { required: true, message: '修改人不能为空', trigger: 'blur' }
          // ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sly/job/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.jobName = data.job.jobName
                // this.dataForm.createTime = data.job.createTime
                // this.dataForm.createId = data.job.createId
                // this.dataForm.updateTime = data.job.updateTime
                // this.dataForm.updateId = data.job.updateId
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sly/job/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'jobName': this.dataForm.jobName,
                // 'createTime': this.dataForm.createTime,
                // 'createId': this.dataForm.createId,
                // 'updateTime': this.dataForm.updateTime,
                // 'updateId': this.dataForm.updateId
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
