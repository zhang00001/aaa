<template>
<el-dialog :title="!dataForm.guid ? '新增' : '修改'" append-to-body :close-on-click-modal="false"  @close='close' :visible.sync="visible">

    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px"  >
        <div>
            <div class="title">基本信息</div>
            <el-form-item label="名称" prop="itemName">
                <el-input v-model="dataForm.itemName" maxlength="50" placeholder="名称"></el-input>
            </el-form-item>
            <el-form-item label="唯一识别码" prop="itemCode">
                <el-input v-model="dataForm.itemCode" maxlength="50" placeholder="唯一识别码"></el-input>
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
            <el-form-item label="参数说明" prop="attribute4">
                <el-input v-model="dataForm.attribute4" maxlength="200" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
        </div>
        <div>
            <div class="title">可选信息</div>
            <el-form-item label="值上限" prop="attribute1">
                <el-input-number v-model="dataForm.attribute1" placeholder="值上限" :min='0' :max='100000'></el-input-number>
            </el-form-item>
            <el-form-item label="值下限" prop="attribute2">
                <el-input-number v-model="dataForm.attribute2" placeholder="值下限" :min='0' :max='100000'></el-input-number>
            </el-form-item>
            <el-form-item label="选中时的图片" prop="attribute3">
     <upload-img @getImg="getimgs" :type="1" :imgData ="dataForm.attribute3"></upload-img>
       
                
                  

            </el-form-item>
        </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>

</el-dialog>
</template>

<script>
import sysService from "../../../api/sysService"

import uploadImg from'@/components/my-components/uploadImg.vue'
export default {
    components: {
      uploadImg
    },
    data() {
        return {
            visible: false,
            dataForm: {
                itemName: "",
                itemCode: "",
                status: '1',
                sortNo: "",
                attribute4: "",
                attribute1: "",
                attribute2: "",
                attribute3: "",

            },
            showImagesVisible: false,
            dataRule: {
                itemName: [{
                    required: true,
                    message: '名称不能为空',
                    trigger: 'blur'
                }],
                itemCode: [{
                    required: true,
                    message: '唯一识别码不能为空',
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
        getimgs(e){
                this.dataForm.attribute3 = e
        },
        
        close(){
           Object.assign(this.$data, this.$options.data())
     
        },
        init(row,guid) {
 
            this.dataForm.sguid = guid
            this.visible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields()
               !!row ? (this.dataForm = {
                    itemName: row.itemName,
                itemCode: row.itemCode,
                status: row.status,
                sortNo: row.sortNo,
                attribute4: row.attribute4,
                attribute1: row.attribute1,
                attribute2: row.attribute2,
                attribute3: row.attribute3,
                guid: row.guid,
                sguid:row.sguid

                  

                }) : Object.assign(this.$data.dataForm, this.$options.data().dataForm)
         
            })
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataForm'].validate(async (valid) => {
                if (valid) {

                    let data
                    if (!!this.dataForm.guid) {

                        data = await sysService.bizlibraryUpdate(this.dataForm)
                    } else {

                        data = await sysService.bizlibrarySave(this.dataForm)
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
