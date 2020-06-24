<template>
<el-dialog :title="!dataForm.id ? '新增' : '修改'" append-to-body :close-on-click-modal="false" @close='close' :visible.sync="visible">

    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
        <div>

            <el-form-item label="所属产品类目" prop="columnId">
                <el-cascader :show-all-levels="false" v-model="columnId" :options="columnOptions" clearable></el-cascader>
            </el-form-item>
            <el-form-item label="产品标题" prop="title">
                <el-input v-model="dataForm.title" maxlength="50" placeholder="产品标题"></el-input>
            </el-form-item>
            <el-form-item label="购买链接" prop="buyLink">
                <el-input v-model="dataForm.buyLink" maxlength="50" placeholder="购买链接"></el-input>
            </el-form-item>
            <el-form-item label="产品图片" prop="attribute3">
                <upload-img @getImg="getimgs" :type="100" :imgData="dataForm.productImgs"></upload-img>

  
            </el-form-item>

            <el-form-item label="产品简介" prop="abstractTxt">
                <vueEdit class='quill-editor' ref="editor" :content='dataForm.abstractTxt' />

            </el-form-item>
            <el-form-item label="排序号" prop="sortNo">
                <el-input-number v-model="dataForm.sortNo" placeholder="排序号" :min='0' :max='100000'></el-input-number>
            </el-form-item>
            <el-form-item label="是否启用" prop="isUsed">
 <el-radio-group v-model="dataForm.isUsed">
                <el-radio  v-for="item in dict.yesno" :label="item.itemCode" :key="item.itemName">{{item.itemName}}</el-radio>
 </el-radio-group>
            </el-form-item>
            <el-form-item label="功能介绍" prop="introduction">
                <vueEdit class='quill-editor' ref="editor2" :content='dataForm.introduction' />
            </el-form-item>
            <el-form-item label="应用场景" prop="application">
                <vueEdit class='quill-editor' ref="editor3" :content='dataForm.application' />
            </el-form-item>
            <el-form-item label="联系购买" prop="contactBuy">
                <vueEdit class='quill-editor' ref="editor4" :content='dataForm.contactBuy' />
            </el-form-item>

        </div>
        <div>

        </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <ImageWall v-if="showImagesVisible" ref="showImages" @emitImgs='emitImgs'> </ImageWall>
</el-dialog>
</template>

<script>
import vueEdit from "@/components/vueEdit"
import sysService from "../../../api/sysService"
import ImageWall from "@/components/imageWall"
import uploadImg from '@/components/my-components/uploadImg.vue'
export default {
    components: {
        ImageWall,
        vueEdit,
        uploadImg
    },
    data() {
        return {
            visible: false,
            columnOptions: [],
            dataForm: {
                abstractTxt: '',
                application: '',
                buyLink: '',
                columnId: null,
                contactBuy: '',
                introduction: '',
                productImgs: [],
                sortNo: 0,
                title: '',
                isUsed: ""
            },
            columnId: [],
            showImagesVisible: false,
            dataRule: {

                title: [{
                    required: true,
                    message: '标题不能为空',
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
                    trigger: 'change'
                }],
            },
            dict: {
                yesno: null
            }
        }
    },

    methods: {
        getimgs(e) {

            this.dataForm.productImgs = e

        },
        async getColumn() {
            let res = await sysService.columnProduct()
            if (res && res.data.code == 0) {
                return res.data.data
            }
        },
        emitImgs(images, index) {
            this.dataForm.productImgs = images
        },
        selectImg(number) {
            this.showImagesVisible = true
            this.$nextTick(() => {
                this.$refs.showImages.init(number)
            })
        },
        close() {
            Object.assign(this.$data, this.$options.data())

        },
        async init(row) {

            this.columnOptions = await this.getColumn()
            this.visible = true

            this.$nextTick(async () => {
                this.$refs['dataForm'].resetFields();
                let data = await sysService.getYesno()
                if (data && data.data.code == 0) {
                    this.dict.yesno = data.data.dictList
                }

                if (!!row) {
                    let res = await sysService.productInfo(row.id)
                    if (res && res.data.code == 0) {
                        this.dataForm = {
                            id: res.data.product.id,
                            abstractTxt: res.data.product.abstractTxt,
                            application: res.data.product.application,
                            buyLink: res.data.product.buyLink,
                            columnId: res.data.product.columnId,
                            contactBuy: res.data.product.contactBuy,
                            introduction: res.data.product.introduction,
                            productImgs: res.data.product.productImgs,
                            sortNo: res.data.product.sortNo,
                            title: res.data.product.title,
                            isUsed: res.data.product.isUsed

                        }

                        this.columnId = [res.data.product.parentId, res.data.product.columnId]
                    }

                } else {
                    Object.assign(this.$data.dataForm, this.$options.data().dataForm)
                }



            })
        },

        // 表单提交
        dataFormSubmit() {
            this.dataForm.columnId = !!this.columnId ? this.columnId[1] : ''
            this.dataForm.abstractTxt = this.$refs.editor.ue.getContent().replace("<p>", "").replace("</p>", "").trim();
            this.dataForm.introduction = this.$refs.editor2.ue.getContent().replace("<p>", "").replace("</p>", "").trim();
            this.dataForm.application = this.$refs.editor3.ue.getContent().replace("<p>", "").replace("</p>", "").trim();
            this.dataForm.contactBuy = this.$refs.editor4.ue.getContent().replace("<p>", "").replace("</p>", "").trim();
            this.dataForm.thumbnail = !!this.dataForm.productImgs ? this.dataForm.productImgs[0] : ''
            this.$refs['dataForm'].validate(async (valid) => {
                if (valid) {

                    let data
                    if (!!this.dataForm.id) {

                        data = await sysService.productUpdate(this.dataForm)
                    } else {

                        data = await sysService.productSave(this.dataForm)
                    }

                    if (data && data.data.code === 0) {
                        this.$message.success('操作成功', )
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
