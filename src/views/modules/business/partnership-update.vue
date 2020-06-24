<template>
<el-dialog :title="!dataForm.id ? '新增' : '修改'" append-to-body :close-on-click-modal="false" @close='close' :visible.sync="visible">

    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
        <div>

            <el-form-item label="图片名称" prop="altName">
                <el-input v-model="dataForm.altName" maxlength="50" placeholder="图片名称"></el-input>
            </el-form-item>
            <el-form-item label="图片类型" prop="type">
                <el-radio-group v-model="dataForm.type">
                    <el-radio :label="1">合作伙伴</el-radio>
                    <el-radio :label="2">荣誉证书</el-radio>
					<el-radio :label="3">资质证书</el-radio>
                </el-radio-group>

            </el-form-item>

            <el-form-item label="图片地址" prop="imgUrl">
                <upload-img @getImg="getimgs" :type="1" :imgData="dataForm.imgUrl"></upload-img>

      
            </el-form-item>
            <el-form-item label="排序号" prop="sortNo">
                <el-input-number v-model="dataForm.sortNo" placeholder="排序号" :min='0' :max='100000'></el-input-number>
            </el-form-item>
            <el-form-item label="是否启用" prop="isUsed">
                <el-radio-group v-model="dataForm.isUsed">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>

                </el-radio-group>

            </el-form-item>

        </div>
        <div>

        </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  
</el-dialog>
</template>

<script>
import vueEdit from "@/components/vueEdit"
import sysService from "../../../api/sysService"

import uploadImg from '@/components/my-components/uploadImg.vue'
export default {
    components: {

        vueEdit,
        uploadImg
    },
    data() {
        return {
            visible: false,
            columnOptions: [],
            dataForm: {
                altName: "",
                type: 1,
                imgUrl: "",
                sortNo: 0,
                isUsed: 1
            },
            columnId: [],
     
            dataRule: {

                altName: [{
                    required: true,
                    message: '图片名称不能为空',
                    trigger: 'blur'
                }],
                type: [{
                    required: true,
                    message: '图片类型不能为空',
                    trigger: 'blur'
                }],
                sortNo: [{
                    required: true,
                    message: '排序号不能为空',
                    trigger: 'blur'
                }],
                isUsed: [{
                    required: true,
                    message: '是否启用不能为空',
                    trigger: 'blur'
                }],
            }
        }
    },

    methods: {
        getimgs(e) {
            this.dataForm.imgUrl = e
        },
        
        close() {
            Object.assign(this.$data, this.$options.data())

        },
        async init(row) {

            this.visible = true

            this.$nextTick(async () => {
                this.$refs['dataForm'].resetFields();
                if (!!row) {

                    this.dataForm = {
                        id: row.id,
                        altName: row.altName,
                        type: Number(row.type),
                        imgUrl: row.imgUrl,
                        sortNo: row.sortNo,
                        isUsed: Number(row.isUsed)
                    }

                } else {
                    Object.assign(this.$data.dataForm, this.$options.data().dataForm)
                }

               
            })
        },

        // 表单提交
        dataFormSubmit() {
            this.$refs['dataForm'].validate(async (valid) => {
                if (valid) {

                    let data
                    if (!!this.dataForm.id) {

                        data = await sysService.phUpdate(this.dataForm)
                    } else {

                        data = await sysService.phSave(this.dataForm)
                    }

                    if (data && data.data.code === 0) {
                        this.$message.success('操作成功')
                        this.visible = false
                        this.$emit('refreshDataList')

                    } else {
                        this.$message.error(data.data.msg)
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.title {
    line-height: 20px;
    border-bottom: 1px solid #92929229;
    width: 100%;
    margin: 0px 0px 20px 0px;
    font-size: 18px;
    font-weight: 600;
    padding: 0 0 10px 0;
}
</style>
