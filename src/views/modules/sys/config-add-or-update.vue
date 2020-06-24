<template>
<el-dialog :title="!dataForm.guid ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible" @close='close'>

    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
        <el-form-item label="字典名称" prop="codeName">
            <el-input v-model="dataForm.codeName" maxlength="50" placeholder="字典名称"></el-input>
        </el-form-item>
        <el-form-item label="字典代码" prop="code">
            <el-input v-model="dataForm.code" maxlength="50" placeholder="字典代码"></el-input>
        </el-form-item>
        <el-form-item label="是否有效" prop="status">
            <el-radio-group v-model="dataForm.status">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
            </el-radio-group>

        </el-form-item>
        <el-form-item label="排序号" prop="sortNo">
            <el-input-number v-model="dataForm.sortNo" placeholder="排序号" :min='0' :max='100000'></el-input-number>
        </el-form-item>
        <el-form-item label="备注" prop="describe1">
            <el-input v-model="dataForm.describe1" maxlength="200" type="textarea" placeholder="备注"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
</el-dialog>
</template>

<script>
import sysService from "../../../api/sysService"
export default {
    data() {
        return {
            visible: false,
            dataForm: {

                codeName: "",
                code: "",
                status: '1',
                sortNo: "",
                describe1: ""
            },

            dataRule: {
                codeName: [{
                    required: true,
                    message: '字典名称不能为空',
                    trigger: 'blur'
                }],
                code: [{
                    required: true,
                    message: '字典代码不能为空',
                    trigger: 'blur'
                }],
                sortNo: [{
                    required: true,
                    message: '排序号不能为空',
                    trigger: 'blur'
                }],
                status: [{
                    required: true,
                    message: '是否有效不能为空',
                    trigger: 'blur'
                }]
            }
        }
    },
    methods: {
        init(row) {

            this.visible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields();

                !!row ? (this.dataForm = {
                    codeName: row.codeName,
                    guid: row.guid,
                    code: row.code,
                    status: row.status,
                    sortNo: row.sortNo,
                    describe1: row.describe1

                }) : Object.assign(this.$data.dataForm, this.$options.data().dataForm)
            })
        },
        //关闭弹窗
        close() {
            Object.assign(this.$data, this.$options.data())
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataForm'].validate(async (valid) => {
                if (valid) {
                    let data
                    if (!!this.dataForm.guid) {

                        data = await sysService.bizcatelogUpdate(this.dataForm)
                    } else {

                        data = await sysService.bizcatelogSave(this.dataForm)
                    }

                    if (data && data.data.code === 0) {
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
                        this.$message.error(data.data.msg)
                    }

                }
            })
        }
    }
}
</script>
