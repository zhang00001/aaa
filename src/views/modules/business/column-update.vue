<template>
<el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible" @close='close' width='1200px'>

    <el-form ref="dataForm" :rules="dataRule" :model="dataForm" label-width="207px" @keyup.enter.native="dataFormSubmit()">
        <p class="p-title">基本信息</p>
        <el-row>
            <el-col :span="24" :offset="0">
                <el-form-item label="栏目类型" prop="type">
                    <el-radio-group v-model="dataForm.type" :min="0" :max="1" style="display: inline-block">
                        <el-radio v-for="item in dict.columnType" :label="item.itemCode" :key="item.itemName">{{item.itemName}}</el-radio>
                    </el-radio-group>
                    <el-tooltip class="item" effect="dark" placement="right" style="margin-left: 10px">
                        <div slot="content">
                            目录:&nbsp;&nbsp;&nbsp;无页面跳转的栏目，以出现在导航部位的栏目为主
                            <br>
                            页面:&nbsp;&nbsp;&nbsp;有页面跳转的栏目，以出现在导航部位的栏目为主
                            <br>
                            页面子栏目:&nbsp;&nbsp;&nbsp;出现在页面具体内容中的栏目，不再出现在导航部位，多用于3级及以上菜单
                        </div>
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" :offset="0">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="dataForm.name" placeholder="名称"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="10" :offset="2">
                <el-form-item label="上级栏目">
                    <el-input v-model="dataForm.parentName" @focus="selectMenu(dataForm.parentId,dataForm.parentName)"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" :offset="0">
                <el-form-item label="栏目模板" prop="model">
                    <el-radio-group v-model="dataForm.model" :min="0" :max="1">
                        <el-radio v-for="item in dict.columnModel" :label="item.itemCode" :key="item.itemName">{{item.itemName}}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" :offset="0">
                <el-form-item label="栏目所处导航位置" prop="location">
                    <el-select v-model="dataForm.location" placeholder="请选择">
                        <el-option v-for="item in dict.columnLocation" :key="item.itemName" :label="item.itemName" :value="item.itemCode">
                        </el-option>
                    </el-select>
                    <el-tooltip class="item" effect="dark" placement="right" style="margin-left: 10px">
                        <div slot="content">
                            顶部导航:&nbsp;&nbsp;&nbsp;只出现在顶部导航栏目中，以目录和页面两种类型的栏目居多
                            <br>
                            底部导航:&nbsp;&nbsp;&nbsp;只出现在底部导航栏目中，以目录和页面两种类型的栏目居多
                            <br>
                            全导航:&nbsp;&nbsp;&nbsp;同时出现在顶部导航与底部导航栏目中，以目录和页面两种类型的栏目居多
                            <br>
                            无导航:&nbsp;&nbsp;&nbsp;不出现在导航部位,以页面子栏目类型的栏目居多
                        </div>
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </el-form-item>
            </el-col>
            <el-col :span="10" :offset="2">
                <el-form-item label="跳转链接">
                    <el-input v-model="dataForm.linkUrl" placeholder="跳转链接"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="8" :offset="0">
                <el-form-item label="是否启用" prop="isUsed">
                    <el-radio-group v-model="dataForm.isUsed">

                        <el-radio v-for="item in dict.yesno" :label="item.itemCode" :key="item.itemName">{{item.itemName}}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="8" :offset="0">
                <el-form-item label="排序号" prop="sortNo">
                    <el-input-number v-model="dataForm.sortNo" placeholder="排序号" :min='0' :max='100000'></el-input-number>
                </el-form-item>
            </el-col>
        </el-row>

        <!-- <el-row>
            <el-col :span="9" :offset="0">
                <el-form-item label="seo_title">
                    <el-input type="textarea" rows="6" placeholder="请输入内容" resize="none" maxlength="30" show-word-limit v-model="dataForm.seoTitle">
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="9">
                <el-form-item label="seo_keywords">
                    <el-input type="textarea" rows="6" placeholder="请输入内容" resize="none" maxlength="200" show-word-limit v-model="dataForm.seoKeywords">
                    </el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="16" :offset="0">
                <el-form-item label="seo_description">
                    <el-input type="textarea" rows="6" placeholder="请输入内容" resize="none" maxlength="200" show-word-limit v-model="dataForm.seoDescription">
                    </el-input>
                </el-form-item>
            </el-col>
        </el-row> -->

        <p class="p-title" v-show="dataForm.model == '02'">额外信息</p>

        <div v-show="dataForm.model == '02'">

            <el-row>
                <el-col :span="12" :offset="0">
                    <el-form-item label="栏目关系">

                        <el-select v-model="model2.columnConnectKey" placeholder="栏目关系">
                            <el-option v-for="item in dict.homeColumns" :key="item.itemName" :label="item.itemName" :value="item.itemCode">
                            </el-option>
                        </el-select>
                        <!-- <el-input   placeholder="栏目关系"  v-model="dataForm.columnConnectKey"  maxlength="50">
                    </el-input> -->
                    </el-form-item>

                </el-col>
            </el-row>

        </div>

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
import uploadImg from '@/components/my-components/uploadImg.vue'
export default {
    components: {
        vueTree,

        uploadImg
    },
    data() {

        return {
            showTree: false,
            visible: false,
            showImagesVisible: false,

            dataForm: {
                parentName: null,
                parentId: 0,
                mouldAddress: null,
                mouldName: null,
                isUsed: '0',
                type: [],
                model: [],
                name: "",
                location: "",
                columnAttrs: [],
                linkUrl: "",
                isUsed: "",
                sortNo: "",
                // seoTitle: "",
                // seoKeywords: "",
                // seoDescription: "",
                choose: "",

            },
            dict: {
                yesno: null,
                columnLocation: null,
                columnModel: null,
                columnType: null,
                columnTag: null,
                homeColumns: null
            },

            showImagesVisible: false,
            fileList: [],
            model2: {
                columnConnectKey: null,
            },
            dataRule: {

                type: [{

                    required: true,
                    message: '请至少选择一个栏目类型',
                    trigger: 'change'
                }],
                name: [{
                    required: true,
                    message: '必填项不能为空',
                    trigger: 'change'
                }],
                model: [{

                    required: true,
                    message: '请至少选择一个模板类型',
                    trigger: 'change'
                }],
                location: [{
                    required: true,
                    message: '必填项不能为空',
                    trigger: 'change'
                }],
                isUsed: [{
                    required: true,
                    message: '必填项不能为空',
                    trigger: 'change'
                }],
                sortNo: [{
                        required: true,
                        message: '必填项不能为空',
                        trigger: 'change'
                    },

                ]
            }
        }
    },
    methods: {
        getimgs(e, number) {
            switch (number) {

            }

        },

        emitTree(tree) {

            this.dataForm.parentName = tree.name
            this.dataForm.parentId = tree.id
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

        async init(row) {
            let res1 = await sysService.getColumnLocation()
            if (res1 && res1.data.code == 0) {
                this.dict.columnLocation = res1.data.dictList

            }
            let res2 = await sysService.getColumnModel()
            if (res2 && res2.data.code == 0) {
                this.dict.columnModel = res2.data.dictList

            }
            let res3 = await sysService.getYesno()
            if (res3 && res3.data.code == 0) {
                this.dict.yesno = res3.data.dictList
            }
            let res4 = await sysService.getColumnType()
            if (res4 && res4.data.code == 0) {
                this.dict.columnType = res4.data.dictList
            }
            let res5 = await sysService.getColumnTag()

            if (res5 && res5.data.code == 0) {
                this.dict.columnTag = res5.data.dictList
            }
            let res6 = await sysService.getHomeColumn()
            if (res6 && res6.data.code == 0) {
                this.dict.homeColumns = res6.data.dictList
            }
            this.visible = true

            this.$nextTick(async () => {

                this.$refs['dataForm'].resetFields();

                if (!!row) {

                    let res = await sysService.columnInfo(row.id)

                    if (res && res.data.code == 0) {
                        this.dataForm = res.data.column

                        this.dataForm.parentId = row.parentId ? row.parentId : 0
                        this.dataForm.parentName = row.parentName ? row.parentName : '顶级菜单'
                        if (this.dataForm.model == '02') {
                            for (let i = 0; i < this.dataForm.columnAttrs.length; i++) {
                                if (this.dataForm.columnAttrs[i].attrName == 'columnConnectKey') {
                                    this.model2.columnConnectKey = this.dataForm.columnAttrs[i].attrValue

                                }
                            }
                        }

                    }

                } else {

                    Object.assign(this.$data.dataForm, this.$options.data().dataForm)
                    this.dataForm.parentId = 0,
                        this.dataForm.parentName = "顶级菜单"
                }

            })
        },
        //关闭弹窗
        close() {
            Object.assign(this.$data, this.$options.data())
        },
        // 表单提交
        dataFormSubmit() {

            if (this.dataForm.model == '02') {
                this.dataForm.columnAttrs = [{
                    columnId: this.dataForm.id,
                    attrName: 'columnConnectKey',
                    attrValue: this.model2.columnConnectKey
                }, ]
            }
            this.$refs['dataForm'].validate(async (valid) => {
                if (valid) {
                    let data
                    if (!!this.dataForm.id) {

                        data = await sysService.columnUpdate(this.dataForm)
                    } else {

                        data = await sysService.columnSave(this.dataForm)
                    }

                    if (data && data.data.code === 0) {
                        this.$message.success("操作成功")
                        Object.assign(this.$data, this.$options.data())
                        this.$emit('refreshDataList')

                    } else {
                        this.$message.error(data.msg)
                    }

                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.img-ul-div {
    width: 480px;
    margin: 0;
    padding: 0;

    img {
        width: 100%;
    }
}
</style>
