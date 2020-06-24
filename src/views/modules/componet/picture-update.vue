<template>
<el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible" @close='close'>

    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="140px">
        <el-form-item label="Banner位置所属" prop="parentName">
            <el-input v-model="dataForm.parentName" maxlength="50" placeholder="Banner位置所属" @focus="selectMenu(dataForm.location,dataForm.parentName)"></el-input>
        </el-form-item>
        <el-form-item label="Banner类型" prop="type">
            <el-radio-group v-model="dataForm.type">
                <el-radio :label="1">图片</el-radio>
                <el-radio :label="2">视频</el-radio>
            </el-radio-group>

        </el-form-item>
        <el-form-item v-if='dataForm.type==2' label="视频" prop="videoUrl">
            <fileDepository ref='fileDepository' @getFileUrl='getFileUrl' :videoUrl='dataForm.videoUrl'></fileDepository>

        </el-form-item>

        <el-form-item  :label="dataForm.type==2?'视频封面':'Banner图片'" prop="imgUrl">
           <upload-img @getImg="getimgs" :type="1" :imgData ="dataForm.imgUrl"></upload-img>
        </el-form-item>

        <el-form-item label="跳转路径" prop="linkUrl">
            <el-input v-model="dataForm.linkUrl" maxlength="50" placeholder="跳转路径"></el-input>
        </el-form-item>

        <el-form-item label="信息备注" prop="remark">
            <el-input v-model="dataForm.remark" maxlength="200" type="textarea" placeholder="信息备注"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="isUsed">
            <el-radio-group v-model="dataForm.isUsed">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
            </el-radio-group>

        </el-form-item>
        <el-form-item label="排序号" prop="sortNo">
            <el-input-number v-model="dataForm.sortNo" placeholder="排序号" :min='0' :max='100000'></el-input-number>
        </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <vueTree ref='vueTree' v-if='showTree' @emitTree='emitTree'></vueTree>
</el-dialog>
</template>

<script>
import sysService from "../../../api/sysService"
import vueTree from "@/components/vueTree"
import axios from "axios";
import fileDepository from "@/components/my-components/fileDepository"
import uploadImg from'@/components/my-components/uploadImg.vue'
export default {
    components: {
        vueTree,
		uploadImg,
        fileDepository
    },
    data() {
        return {
            showTree: false,
            visible: false,
            dataForm: {
                parentName: "",
                type: 1,
                videoUrl: "",
                linkUrl: "",
                imgUrl: "",
                location: "",
                remark: "",
                isUsed: 1,
                sortNo: "",
            },
            showImagesVisible: false,
            fileList: [],
            dataRule: {
                parentName: [{
                    required: true,
                    message: 'Banner位置所属不能为空',
                    trigger: 'blur'
                }],
                type: [{
                    required: true,
                    message: 'Banner类型不能为空',
                    trigger: 'blur'
                }],
                isUsed: [{
                    required: true,
                    message: '是否启用不能为空',
                    trigger: 'change'
                }],
                status: [{
                    required: true,
                    message: '是否有效不能为空',
                    trigger: 'change'
                }]
            },
			imgData:null
        }
    },
    methods: {
		getimgs(e){
			this.dataForm.imgUrl = e
		},

        getFileUrl(url) {
            this.dataForm.videoUrl = url
        },

        emitTree(tree) {
            this.dataForm.parentName = tree.name
            this.dataForm.location = tree.id
            this.$nextTick(() => {
                this.showTree = false
                this.$refs['dataForm'].clearValidate();
            })
        },
        selectMenu(id, name) {
            this.showTree = true
            this.$nextTick(() => {
                this.$refs['vueTree'].getMenus(id, name);

            })
        },
     

        init(row) {
            this.visible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields();

                !!row ? (this.dataForm = row,this.dataForm.type=Number(row.type),this.dataForm.isUsed=Number(row.isUsed)) : Object.assign(this.$data.dataForm, this.$options.data().dataForm)

            })
        },
        //关闭弹窗
        close() {
            Object.assign(this.$data, this.$options.data())
			// this.dataForm={};
        },
        // 表单提交
        dataFormSubmit() {
            if(this.dataForm.type=='1'){
                this.dataForm.videoUrl=''
            }
            debugger
            this.$refs['dataForm'].validate(async (valid) => {
                if (valid) {
                    let data
                    if (!!this.dataForm.id) {

                        data = await sysService.pictureUpdate(this.dataForm)
                    } else {

                        data = await sysService.pictureSave(this.dataForm)
                    }
                    if (data && data.data.code === 0) {
                        this.$message.success("操作成功")
                        Object.assign(this.$data, this.$options.data())
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
