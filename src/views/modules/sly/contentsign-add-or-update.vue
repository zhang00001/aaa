<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="签收时间" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="签收时间"></el-input>
    </el-form-item>
    <el-form-item label="创建人-关联sys_user表" prop="createId">
      <el-input v-model="dataForm.createId" placeholder="创建人-关联sys_user表"></el-input>
    </el-form-item>
    <el-form-item label="签收内容id" prop="contentId">
      <el-input v-model="dataForm.contentId" placeholder="签收内容id"></el-input>
    </el-form-item>
    <el-form-item label="签收部门id" prop="deptId">
      <el-input v-model="dataForm.deptId" placeholder="签收部门id"></el-input>
    </el-form-item>
    <el-form-item label="部门名称" prop="deptName">
      <el-input v-model="dataForm.deptName" placeholder="部门名称"></el-input>
    </el-form-item>
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
          createTime: '',
          createId: '',
          contentId: '',
          deptId: '',
          deptName: ''
        },
        dataRule: {
          createTime: [
            { required: true, message: '签收时间不能为空', trigger: 'blur' }
          ],
          createId: [
            { required: true, message: '创建人-关联sys_user表不能为空', trigger: 'blur' }
          ],
          contentId: [
            { required: true, message: '签收内容id不能为空', trigger: 'blur' }
          ],
          deptId: [
            { required: true, message: '签收部门id不能为空', trigger: 'blur' }
          ],
          deptName: [
            { required: true, message: '部门名称不能为空', trigger: 'blur' }
          ]
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
              url: this.$http.adornUrl(`/sly/contentsign/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.createTime = data.contentSign.createTime
                this.dataForm.createId = data.contentSign.createId
                this.dataForm.contentId = data.contentSign.contentId
                this.dataForm.deptId = data.contentSign.deptId
                this.dataForm.deptName = data.contentSign.deptName
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
              url: this.$http.adornUrl(`/sly/contentsign/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'createTime': this.dataForm.createTime,
                'createId': this.dataForm.createId,
                'contentId': this.dataForm.contentId,
                'deptId': this.dataForm.deptId,
                'deptName': this.dataForm.deptName
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
