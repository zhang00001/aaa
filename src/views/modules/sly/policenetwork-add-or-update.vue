<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="导航类型" prop="type">
      <el-radio-group v-model="dataForm.type">
    <el-radio :label="1">全国</el-radio>
    <el-radio :label="2">全省</el-radio>
    <el-radio :label="3">全市</el-radio>
  </el-radio-group>


     </el-form-item>
    <el-form-item label="标题" prop="title">
      <el-input v-model="dataForm.title" placeholder="标题"></el-input>
    </el-form-item>
    <el-form-item label="跳转链接" prop="linkUrl">
      <el-input v-model="dataForm.linkUrl" placeholder="跳转链接"></el-input>
    </el-form-item>
    <el-form-item label="排序号" prop="sortNo">
      <el-input v-model="dataForm.sortNo" placeholder="排序号"></el-input>
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
          type: '',
          title: '',
          linkUrl: '',
          sortNo: '',
     
        },
        dataRule: {
          type: [
            { required: true, message: '导航类型不能为空', trigger: 'change' }
          ],
          title: [
            { required: true, message: '标题不能为空', trigger: 'blur' }
          ],
          linkUrl: [
            { required: true, message: '跳转链接不能为空', trigger: 'blur' }
          ],
          sortNo: [
            { required: true, message: '排序号不能为空', trigger: 'blur' }
          ],
          
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
              url: this.$http.adornUrl(`/sly/policenetwork/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.type = data.policeNetwork.type
                this.dataForm.title = data.policeNetwork.title
                this.dataForm.linkUrl = data.policeNetwork.linkUrl
                this.dataForm.sortNo = data.policeNetwork.sortNo
      
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
              url: this.$http.adornUrl(`/sly/policenetwork/${!this.dataForm.id ? 'save' : 'update'}`),
              method: !this.dataForm.id ?'post':'put',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'type': this.dataForm.type,
                'title': this.dataForm.title,
                'linkUrl': this.dataForm.linkUrl,
                'sortNo': this.dataForm.sortNo,
        
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
