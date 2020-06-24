<template>
<el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible" @close='close'>

    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="140px">
        <el-form-item label="所属导航栏目" prop="parentName">
            <el-input v-model="dataForm.parentName" maxlength="50" placeholder="所属导航栏目" @focus="selectMenu(dataForm.columnId,dataForm.parentName)"></el-input>
        </el-form-item>

        <el-form-item label="热门搜索关键字" prop="keyWord">
            <el-input v-model="dataForm.keyWord" maxlength="50" placeholder="热门搜索关键字"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="isUsed">
 <el-radio-group v-model="dataForm.isUsed">
            <el-radio  v-for="item in dict.yesno" :label="item.itemCode" :key="item.itemName">{{item.itemName}}</el-radio>
 </el-radio-group>
        </el-form-item>
  <el-form-item label="跳转链接" prop="linkUrl">
          <el-input v-model="dataForm.linkUrl" maxlength="50" placeholder="跳转链接"></el-input>
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
import ImageWall from "@/components/imageWall"
import vueTree from "@/components/vueTree"
import axios from "axios";
export default {
    components: {
        vueTree,
        ImageWall
    },
    data() {
        return {
            showTree: false,
            visible: false,
            dataForm: {
                columnId: '',
                keyWord: "",
                parentName: "",
                sortNo: 0,
                isUsed: "",
                linkUrl:""
            },
            showImagesVisible: false,
            fileList: [],
            dataRule: {

                sortNo: [{
                    required: true,
                    message: '排序不能为空',
                    trigger: 'blur'
                }],
                isUsed: [{
                    required: true,
                    message: '是否启用不能为空',
                    trigger: 'change'
                }],
            },
            dict: {
                yesno: [],
            }
        }
    },
    methods: {

        emitTree(tree) {

            this.dataForm.parentName = tree.name
            this.dataForm.columnId = tree.id
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

        init(tree, row) {

            this.visible = true
            this.$nextTick(async () => {

                this.$refs['dataForm'].resetFields();
                let data = await sysService.getYesno()
                if (data && data.data.code == 0) {
                    this.dict.yesno = data.data.dictList
                }
                if (!!row) {
                    this.dataForm.columnId = row.columnId,
                        this.dataForm.parentName = row.parentName
                    this.dataForm.id = row.id,
                        this.dataForm.keyWord = row.keyWord
                    this.dataForm.sortNo = row.sortNo
                    this.dataForm.linkUrl=row.linkUrl
                    this.dataForm.isUsed = row.isUsed.toString()
                } else {
                    if (!!tree) {
                        this.dataForm.columnId = tree.id,
                            this.dataForm.parentName = tree.name
                    } else {
                        Object.assign(this.$data.dataForm, this.$options.data().dataForm)

                    }
                }

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
                    if (!!this.dataForm.id) {

                        data = await sysService.keysearchUpdate(this.dataForm)
                    } else {

                        data = await sysService.keysearchSave(this.dataForm)
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
