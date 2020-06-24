<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"  :before-close="cancel">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="部门名称" prop="deptName">
      <el-input v-model="dataForm.deptName" placeholder="部门名称"></el-input>
    </el-form-item>
    <el-form-item label="上一级" prop="parentName">
      <el-input v-model="dataForm.parentName"   @focus="selectMenu(dataForm.parentId,dataForm.parentName)" placeholder="上一级"></el-input>
    </el-form-item>
  
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <depTreeModel  ref='vueTree' v-if='showTree' @emitTree='emitTree' />
  </el-dialog>
</template>

<script>
import depTreeModel from  "@/components/depTreeModel"
  export default {
     components: {
        depTreeModel
    },
    data () {
      return {showTree: false,
        visible: false,
        dataForm: {
          id: 0,
          deptName: '',
          parentId: '',
      parentName:""
        },
        dataRule: {
          deptName: [
            { required: true, message: '部门名称不能为空', trigger: 'blur' }
          ],
          parentName: [
            { required: true, message: '上一级不能为空', trigger: 'blur' }
          ],
        
        }
      }
    },
    methods: {
       cancel() {
            Object.assign(this.$data, this.$options.data())
        },
          selectMenu(id, name) {

            this.showTree = true
            this.$nextTick(() => {
                this.$refs['vueTree'].getMenus(id, name);

            })
        },
        emitTree(tree) {

            this.dataForm.parentName = tree.deptName
            this.dataForm.parentId = tree.id
            this.$nextTick(() => {
                this.showTree = false
                this.$refs['dataForm'].clearValidate();
            })

        },
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sly/policedept/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.deptName = data.policeDept.deptName
                this.dataForm.parentId = data.policeDept.parentId
            
             this.dataForm.parentName=!!data.policeDept.pname?data.policeDept.pname:'顶级部门'
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
              url: this.$http.adornUrl(`/sly/policedept/${!this.dataForm.id ? 'save' : 'update'}`),
              method: !this.dataForm.id ?'post':'put',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'deptName': this.dataForm.deptName,
                'parentId': this.dataForm.parentId,
         
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
