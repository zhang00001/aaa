<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="创建时间" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
    </el-form-item>
    <el-form-item label="创建人-关联sys_user表" prop="createId">
      <el-input v-model="dataForm.createId" placeholder="创建人-关联sys_user表"></el-input>
    </el-form-item>
    <el-form-item label="姓名" prop="name">
      <el-input v-model="dataForm.name" placeholder="姓名"></el-input>
    </el-form-item>
    <el-form-item label="手机号" prop="phone">
      <el-input v-model="dataForm.phone" placeholder="手机号"></el-input>
    </el-form-item>
    <el-form-item label="上报类型" prop="dataType">
      <el-input v-model="dataForm.dataType" placeholder="上报类型"></el-input>
    </el-form-item>
    <el-form-item label="标题" prop="dataTitle">
      <el-input v-model="dataForm.dataTitle" placeholder="标题"></el-input>
    </el-form-item>
    <el-form-item label="内容" prop="dateContent">
      <el-input v-model="dataForm.dateContent" placeholder="内容"></el-input>
    </el-form-item>
    <el-form-item label="上报部门id" prop="deptId">
      <el-input v-model="dataForm.deptId" placeholder="上报部门id"></el-input>
    </el-form-item>
    <el-form-item label="上报部门名称" prop="deptName">
      <el-input v-model="dataForm.deptName" placeholder="上报部门名称"></el-input>
    </el-form-item>
    <el-form-item label="部门树" prop="deptPath">
      <el-input v-model="dataForm.deptPath" placeholder="部门树"></el-input>
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
          name: '',
          phone: '',
          dataType: '',
          dataTitle: '',
          dateContent: '',
          deptId: '',
          deptName: '',
          deptPath: ''
        },
        dataRule: {
          createTime: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ],
          createId: [
            { required: true, message: '创建人-关联sys_user表不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '手机号不能为空', trigger: 'blur' }
          ],
          dataType: [
            { required: true, message: '上报类型不能为空', trigger: 'blur' }
          ],
          dataTitle: [
            { required: true, message: '标题不能为空', trigger: 'blur' }
          ],
          dateContent: [
            { required: true, message: '内容不能为空', trigger: 'blur' }
          ],
          deptId: [
            { required: true, message: '上报部门id不能为空', trigger: 'blur' }
          ],
          deptName: [
            { required: true, message: '上报部门名称不能为空', trigger: 'blur' }
          ],
          deptPath: [
            { required: true, message: '部门树不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/sly/policereport/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.createTime = data.policeReport.createTime
                this.dataForm.createId = data.policeReport.createId
                this.dataForm.name = data.policeReport.name
                this.dataForm.phone = data.policeReport.phone
                this.dataForm.dataType = data.policeReport.dataType
                this.dataForm.dataTitle = data.policeReport.dataTitle
                this.dataForm.dateContent = data.policeReport.dateContent
                this.dataForm.deptId = data.policeReport.deptId
                this.dataForm.deptName = data.policeReport.deptName
                this.dataForm.deptPath = data.policeReport.deptPath
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
              url: this.$http.adornUrl(`/sly/policereport/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'createTime': this.dataForm.createTime,
                'createId': this.dataForm.createId,
                'name': this.dataForm.name,
                'phone': this.dataForm.phone,
                'dataType': this.dataForm.dataType,
                'dataTitle': this.dataForm.dataTitle,
                'dateContent': this.dataForm.dateContent,
                'deptId': this.dataForm.deptId,
                'deptName': this.dataForm.deptName,
                'deptPath': this.dataForm.deptPath
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
