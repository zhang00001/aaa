<template>
<el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">

        <el-form-item label="姓名" prop="userName">
            <el-input v-model="dataForm.userName"  maxlength="20" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
            <el-date-picker v-model="dataForm.birthday"  value-format='yyyy-MM-dd' type="date" placeholder="生日">
            </el-date-picker>

            <!-- <el-input v-model="dataForm.birthday" placeholder="生日"></el-input> -->
        </el-form-item>
        <el-form-item label="手机号" prop="phone" >
            <el-input v-model="dataForm.phone"  maxlength="11" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
            <el-select v-model="dataForm.sex" placeholder="性别" clearable>
                <el-option label="男" value="男">
                </el-option>
                <el-option label="女" value="女">
                </el-option>
            </el-select>

        </el-form-item>
        <el-form-item label="身份证号码" prop="idCard">
            <el-input v-model="dataForm.idCard"  maxlength="18" placeholder="身份证号码"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="entryTime">
            <el-date-picker v-model="dataForm.entryTime"   value-format='yyyy-MM-dd'  type="date" placeholder="入职时间">
            </el-date-picker>

        </el-form-item>
        <el-form-item label="警号" prop="policeNo">
            <el-input v-model="dataForm.policeNo"  maxlength="20" placeholder="警号"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="parentName">


            <el-input v-model="dataForm.parentName"   @focus="selectMenu(dataForm.deptId,dataForm.parentName)" placeholder="所属部门"></el-input>
        </el-form-item>
        <!-- <el-form-item label="部门层级树" prop="deptPath">
            <el-input v-model="dataForm.deptPath" placeholder="部门层级树"></el-input>
        </el-form-item> -->
        <el-form-item label="职位" prop="policePosition">
            <el-input v-model="dataForm.policePosition" placeholder="职位"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
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
    data() {
      var validatePhone= (rule, value, callback) => {
            if (!/^(13[0-9]|14[4579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[189])\d{8}$/.test(value)) {
                callback(new Error('手机号格式不正确'))
            } else {
                callback()
            }
        }
         var validateIdCard= (rule, value, callback) => {
            if (!/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(value)) {
                callback(new Error('身份证号格式不正确'))
            } else {
                callback()
            }
        }
        return {showTree: false,
            visible: false,
            dataForm: {
                id: 0,
              
                userName: '',
                birthday: '',
                phone: '',
                sex: '',
                idCard: '',
                entryTime: '',
                policeNo: '',
                deptId: '',
                deptPath: '',
                policePosition: '',
                parentName:""
            },
            dataRule: {

                userName: [{
                    required: true,
                    message: '姓名不能为空',
                    trigger: 'blur'
                }],
                birthday: [{
                    required: true,
                    message: '生日不能为空',
                    trigger: 'change'
                }],
                phone: [{
                    required: true,
                    message: '手机号不能为空',
                    trigger: 'blur'
                }, {
                    validator:validatePhone,
                    trigger: 'blur',
                 
                }],
                sex: [{
                    required: true,
                    message: '性别不能为空',
                    trigger: 'change'
                }],
                idCard: [{
                        required: true,
                        message: '身份证号码不能为空',
                        trigger: 'blur'
                    },
                    {
                        validator: validateIdCard,
                        trigger: 'blur',
                      
                    }
                ],
                entryTime: [{
                    required: true,
                    message: '入职时间不能为空',
                    trigger: 'change'
                }],
                policeNo: [{
                    required: true,
                    message: '警号不能为空',
                    trigger: 'blur'
                }],
                parentName: [{
                    required: true,
                    message: '所属部门不能为空',
                    trigger: 'blur'
                }],
                deptPath: [{
                    required: true,
                    message: '部门层级树不能为空',
                    trigger: 'blur'
                }],
                policePosition: [{
                    required: true,
                    message: '职位不能为空',
                    trigger: 'blur'
                }]
            }
        }
    },
    methods: {
       selectMenu(id, name) {

            this.showTree = true
            this.$nextTick(() => {
                this.$refs['vueTree'].getMenus(id, name);

            })
        },
        emitTree(tree) {

            this.dataForm.parentName = tree.deptName
            this.dataForm.deptId = tree.id
            this.$nextTick(() => {
                this.showTree = false
                this.$refs['dataForm'].clearValidate();
            })

        },
        init(id) {

            this.dataForm.id = id || 0
            this.visible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields()
                if (this.dataForm.id) {
                    this.$http({
                        url: this.$http.adornUrl(`/sly/policeinfo/info/${this.dataForm.id}`),
                        method: 'get',
                        params: this.$http.adornParams()
                    }).then(({
                        data
                    }) => {
                        if (data && data.code === 0) {
         
                            this.dataForm.userName = data.policeInfo.userName
                            this.dataForm.birthday = data.policeInfo.birthday
                            this.dataForm.phone = data.policeInfo.phone
                            this.dataForm.sex = data.policeInfo.sex
                            this.dataForm.idCard = data.policeInfo.idCard
                            this.dataForm.entryTime = data.policeInfo.entryTime
                            this.dataForm.policeNo = data.policeInfo.policeNo
                            this.dataForm.deptId = data.policeInfo.deptId
                            this.dataForm.parentName= data.policeInfo.deptName
                            // this.dataForm.deptPath = data.policeInfo.deptPath
                            this.dataForm.policePosition = data.policeInfo.policePosition
                        }
                    })
                }
            })
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`/sly/policeinfo/${!this.dataForm.id ? 'save' : 'update'}`),
                        method: !this.dataForm.id?'post':'put',
                        data: this.$http.adornData({
                            'id': this.dataForm.id || undefined,
                            
                            'userName': this.dataForm.userName,
                            'birthday': this.dataForm.birthday,
                            'phone': this.dataForm.phone,
                            'sex': this.dataForm.sex,
                            'idCard': this.dataForm.idCard,
                            'entryTime': this.dataForm.entryTime,
                            'policeNo': this.dataForm.policeNo,
                            'deptId': this.dataForm.deptId,
                            // 'deptPath': this.dataForm.deptPath,
                            'policePosition': this.dataForm.policePosition
                        })
                    }).then(({
                        data
                    }) => {
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
