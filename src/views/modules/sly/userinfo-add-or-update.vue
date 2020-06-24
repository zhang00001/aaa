<template>
<el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="140px">
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
        <el-form-item label="登录账号" prop="account">
            <el-input v-model="dataForm.account" placeholder="登录账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="dataForm.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item label="盐" prop="salt">
            <el-input v-model="dataForm.salt" placeholder="盐"></el-input>
        </el-form-item>
        <el-form-item label="账号状态" prop="status">
            <el-input v-model="dataForm.status" placeholder="账号状态"></el-input>
        </el-form-item>
        <el-form-item label="是否是信息管理员" prop="isAdmin">
            <el-radio-group v-model="dataForm.isAdmin">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>

            </el-radio-group>

            <!-- <el-input v-model="dataForm.isAdmin" placeholder="是否是信息管理员: 0 否  1  是"></el-input> -->
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
            <el-input v-model="dataForm.userName" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
            <el-input v-model="dataForm.birthday" placeholder="生日"></el-input>
        </el-form-item>
        <el-form-item label="照片" prop="photo">
            <el-input v-model="dataForm.photo" placeholder="照片"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
            <el-input v-model="dataForm.deptId" placeholder="所属部门"></el-input>
        </el-form-item>
        <el-form-item label="部门层级树" prop="deptPath">
            <el-input v-model="dataForm.deptPath" placeholder="部门层级树"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="jobId">
            <el-input v-model="dataForm.jobId" placeholder="职位"></el-input>
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
    data() {
        return {
            visible: false,
            dataForm: {
                id: 0,
                // createTime: '',
                // createId: '',
                // updateTime: '',
                // updateId: '',
                account: '',
                password: '',
                salt: '',
                status: '',
                isAdmin: 0,
                userName: '',
                birthday: '',
                photo: '',
                deptId: '',
                deptPath: '',
                jobId: ''
            },
            dataRule: {
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
                // ],
                account: [{
                    required: true,
                    message: '登录账号不能为空',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '密码不能为空',
                    trigger: 'blur'
                }],
                salt: [{
                    required: true,
                    message: '盐不能为空',
                    trigger: 'blur'
                }],
                status: [{
                    required: true,
                    message: '账号状态不能为空',
                    trigger: 'blur'
                }],
                isAdmin: [{
                    required: true,
                    message: '是否是信息管理员不能为空',
                    trigger: 'change'
                }],
                userName: [{
                    required: true,
                    message: '姓名不能为空',
                    trigger: 'blur'
                }],
                birthday: [{
                    required: true,
                    message: '生日不能为空',
                    trigger: 'blur'
                }],
                photo: [{
                    required: true,
                    message: '照片不能为空',
                    trigger: 'blur'
                }],
                deptId: [{
                    required: true,
                    message: '所属部门不能为空',
                    trigger: 'blur'
                }],
                deptPath: [{
                    required: true,
                    message: '部门层级树不能为空',
                    trigger: 'blur'
                }],
                jobId: [{
                    required: true,
                    message: '职位不能为空',
                    trigger: 'blur'
                }]
            }
        }
    },
    methods: {
        init(id) {
            this.dataForm.id = id || 0
            this.visible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields()
                if (this.dataForm.id) {
                    this.$http({
                        url: this.$http.adornUrl(`/sly/userinfo/info/${this.dataForm.id}`),
                        method: 'get',
                        params: this.$http.adornParams()
                    }).then(({
                        data
                    }) => {
                        if (data && data.code === 0) {
                            // this.dataForm.createTime = data.userInfo.createTime
                            // this.dataForm.createId = data.userInfo.createId
                            // this.dataForm.updateTime = data.userInfo.updateTime
                            // this.dataForm.updateId = data.userInfo.updateId
                            this.dataForm.account = data.userInfo.account
                            this.dataForm.password = data.userInfo.password
                            this.dataForm.salt = data.userInfo.salt
                            this.dataForm.status = data.userInfo.status
                            this.dataForm.isAdmin = data.userInfo.isAdmin
                            this.dataForm.userName = data.userInfo.userName
                            this.dataForm.birthday = data.userInfo.birthday
                            this.dataForm.photo = data.userInfo.photo
                            this.dataForm.deptId = data.userInfo.deptId
                            this.dataForm.deptPath = data.userInfo.deptPath
                            this.dataForm.jobId = data.userInfo.jobId
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
                        url: this.$http.adornUrl(`/sly/userinfo/${!this.dataForm.id ? 'save' : 'update'}`),
                        method: 'post',
                        data: this.$http.adornData({
                            'id': this.dataForm.id || undefined,
                            // 'createTime': this.dataForm.createTime,
                            // 'createId': this.dataForm.createId,
                            // 'updateTime': this.dataForm.updateTime,
                            // 'updateId': this.dataForm.updateId,
                            'account': this.dataForm.account,
                            'password': this.dataForm.password,
                            'salt': this.dataForm.salt,
                            'status': this.dataForm.status,
                            'isAdmin': this.dataForm.isAdmin,
                            'userName': this.dataForm.userName,
                            'birthday': this.dataForm.birthday,
                            'photo': this.dataForm.photo,
                            'deptId': this.dataForm.deptId,
                            'deptPath': this.dataForm.deptPath,
                            'jobId': this.dataForm.jobId
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
