<template>
<el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
        <el-form-item label="登录帐号" prop="userName">
            <el-input v-model="dataForm.userName" placeholder="登录帐号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.id }">
            <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }">
            <el-input v-model="dataForm.comfirmPassword" type="password" placeholder="确认密码"></el-input>
        </el-form-item>
        <el-form-item label="账号类型" prop="accountType">
            <el-radio-group v-model="dataForm.accountType">
                <el-radio :label="0">后端账号</el-radio>
                <el-radio :label="1">前端账号</el-radio>
                <el-radio :label="2">前后端均可</el-radio>
            </el-radio-group>

        </el-form-item>

        <el-form-item label="账号名称" prop="accountName">
            <el-input v-model="dataForm.accountName" placeholder="账号名称"></el-input>
        </el-form-item>
        <el-form-item label="所属组织机构" prop="deptId">
            <el-input v-model="dataForm.deptId" placeholder="所属组织机构"></el-input>
        </el-form-item>

        <el-form-item label="角色" size="mini" prop="roleIdList">
            <el-checkbox-group v-model="dataForm.roleIdList">
                <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="状态" size="mini" prop="status">
            <el-radio-group v-model="dataForm.status">
                <el-radio :label="0">禁用</el-radio>
                <el-radio :label="1">正常</el-radio>
            </el-radio-group>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
</el-dialog>
</template>

<script>
import {
    isEmail,
    isMobile
} from '@/utils/validate'
export default {
    data() {
        var validatePassword = (rule, value, callback) => {
            if (!this.dataForm.id && !/\S/.test(value)) {
                callback(new Error('密码不能为空'))
            } else {
                callback()
            }
        }
        var validateComfirmPassword = (rule, value, callback) => {
            if (!this.dataForm.id && !/\S/.test(value)) {
                callback(new Error('确认密码不能为空'))
            } else if (this.dataForm.password !== value) {
                callback(new Error('确认密码与密码输入不一致'))
            } else {
                callback()
            }
        }

        return {
            visible: false,
            roleList: [],
            dataForm: {
                id: 0,
                userName: '',
                password: '',
                comfirmPassword: '',
                salt: '',
                email: '',
                mobile: '',
                roleIdList: [],
                status: 1,
                accountType: "",
                accountName: "",
                deptId: ""
            },
            dataRule: {
                userName: [{
                    required: true,
                    message: '用户名不能为空',
                    trigger: 'blur'
                }],
                password: [{
                    validator: validatePassword,
                    trigger: 'blur'
                }],
                comfirmPassword: [{
                    validator: validateComfirmPassword,
                    trigger: 'blur'
                }],
                accountType: [{
                    required: true,
                    message: '账号类型不能为空',
                    trigger: 'change'
                }],

                accountName: [{
                    required: true,
                    message: '账号名称不能为空',
                    trigger: 'blur'
                }]
            }
        }
    },
    methods: {
        init(id) {
            this.dataForm.id = id || 0
            this.$http({
                url: this.$http.adornUrl('/sys/role/select'),
                method: 'get',
                params: this.$http.adornParams()
            }).then(({
                data
            }) => {
                this.roleList = data && data.code === 0 ? data.list : []
            }).then(() => {
                this.visible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                })
            }).then(() => {
                if (this.dataForm.id) {
                    this.$http({
                        url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
                        method: 'get',
                        params: this.$http.adornParams()
                    }).then(({
                        data
                    }) => {
                        if (data && data.code === 0) {
                            this.dataForm.userName = data.user.username
                            this.dataForm.salt = data.user.salt

                            this.dataForm.roleIdList = data.user.roleIdList
                            this.dataForm.status = data.user.status
                            this.dataForm.deptId = data.user.deptId
                            this.dataForm.accountName = data.user.accountName
                            this.dataForm.accountType = data.user.accountType.toString()
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
                        url: this.$http.adornUrl(`/sys/user/${!this.dataForm.id ? 'save' : 'update'}`),
                        method: !!this.dataForm.id ? "put" : 'post',
                        data: this.$http.adornData({
                            'userId': this.dataForm.id || undefined,
                            'username': this.dataForm.userName,
                            'password': this.dataForm.password,
                            'salt': this.dataForm.salt,

                            'status': this.dataForm.status,
                            'roleIdList': this.dataForm.roleIdList,
                            accountType: this.dataForm.accountType,
                            accountName: this.dataForm.accountName,
                            deptId: this.dataForm.deptId
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
