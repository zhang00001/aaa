<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="部门名称" prop="deptName">
      <el-input v-model="dataForm.deptName" placeholder="部门名称"></el-input>
    </el-form-item>
    <el-form-item label="上一级" prop="parentId">
      <el-input v-model="dataForm.parentId" placeholder="上一级"></el-input>
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
          deptName: '',
          parentId: '',
          // createTime: '',
          // createId: '',
          // updateTime: '',
          // updateId: ''
        },
        dataRule: {
          deptName: [
            { required: true, message: '部门名称不能为空', trigger: 'blur' }
          ],
          parentId: [
            { required: true, message: '上一级不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/sly/dept/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.deptName = data.dept.deptName
                this.dataForm.parentId = data.dept.parentId
                // this.dataForm.createTime = data.dept.createTime
                // this.dataForm.createId = data.dept.createId
                // this.dataForm.updateTime = data.dept.updateTime
                // this.dataForm.updateId = data.dept.updateId
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
              url: this.$http.adornUrl(`/sly/dept/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'deptName': this.dataForm.deptName,
                'parentId': this.dataForm.parentId,
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
