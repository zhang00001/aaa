<template>
<div class="mod-config">
    <el-form :inline="true">

        <el-form-item>

            <el-button type="primary" @click="addOrUpdateHandle()" v-if="isAuth('sly:column:save')">新增</el-button>

        </el-form-item>
    </el-form>
    <el-table :data="dataList" row-key="id" :tree-props="{children: 'children'}" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
 

        <el-table-column prop="name" header-align="left" align="left" label="栏目名称" width="250px">
        </el-table-column>
        <el-table-column prop="parentName" header-align="center" align="center" label="上级栏目">
            <template slot-scope="scope">
                {{scope.row.parentName?scope.row.parentName:'顶级菜单'}}

            </template>

        </el-table-column>
        <el-table-column prop="location" header-align="center" align="center" label="所处位置">
            <template slot-scope="scope">
                {{scope.row.location | filterDict(dict.columnLocation)}}

            </template>

        </el-table-column>
        <el-table-column prop="model" header-align="center" align="center" label="模板">
            <template slot-scope="scope">
                {{scope.row.model| filterDict(dict.columnModel)}}
            </template>


        </el-table-column>
        <el-table-column prop="type" header-align="center" align="center" label="类型">
            <template slot-scope="scope">
                {{scope.row.type|filterDict(dict.columnType) }}
            </template>
        </el-table-column>
        <el-table-column prop="isUsed" header-align="center" align="center" label="是否启用">
            <template slot-scope="scope">
                 <el-tag v-if='scope.row.isUsed==0'>否</el-tag>
                        <el-tag type="success" v-if='scope.row.isUsed==1'>是</el-tag>
             
            </template>
        </el-table-column>
        <el-table-column prop="sortNo" header-align="center" align="center" label="排序号">

        </el-table-column>
        <el-table-column prop="id" header-align="center" align="center" label="栏目ID">

        </el-table-column>
        <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)" v-if="isAuth('sly:column:update')">修改</el-button>
                <el-button type="text" size="small" @click="deleteHandle(scope.row.id)" v-if="isAuth('sly:column:delete')">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
  
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

</div>
</template>

<script>
import AddOrUpdate from './column-update'

import sysService from "../../../api/sysService"
import commentService from '../../../api/commentService'
import {
    treeDataTranslate
} from '@/utils'
export default {
    data() {
        return {
            that: this,
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            dataListSelections: [],
            addOrUpdateVisible: false,
            columnOptions: [],
            showChild: false,
            cascader: [],
            dict: {
                yesno: null,
                columnLocation:null,
                columnModel: null,
                columnType: null,
                columnTag: null,
            },
        }
    },
    components: {
        AddOrUpdate

    },
    created() {
        this.getDict()

    },
    mounted() {
        this.getDataList()
    },

    filters: {
        filterDict(value, dict) {
 
            return dict?dict.filter(val => val.itemCode == value)[0].itemName:""

        },

    },

    methods: {
        async getDict() {
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

        },
        // 获取数据列表
        async getDataList() {
            this.dataListLoading = true

            let {
                data
            } = await sysService.columnList({

                order: 'asc',

                page: this.pageIndex,
                limit: this.pageSize,

            })

            if (data) {

                this.dataList = treeDataTranslate(data, 'id')

                if (this.dataList.length == 0 && this.pageIndex > 1) {
                    this.pageIndex--
                    this.getDataList()
                }
            } else {
                this.dataList = []
                this.totalPage = 0
            }
            this.dataListLoading = false

        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val
            this.pageIndex = 1
            this.getDataList()
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageIndex = val
            this.getDataList()
        },
        // 多选
        selectionChangeHandle(val) {
            this.dataListSelections = val
        },
        // 新增 / 修改
        addOrUpdateHandle(row) {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {

                this.$refs.addOrUpdate.init(row)
            })
        },
        // 删除
        deleteHandle(id) {
            var ids = id ? [id] : this.dataListSelections.map(item => {
                return item.id
            })
            this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let {
                    data
                } = await sysService.columnDel(ids)

                if (data && data.code === 0) {
                    this.$message('操作成功')
                    this.getDataList()

                } else {
                    this.$message.error(data.msg)
                }
            })
        }
    }
}
</script>
