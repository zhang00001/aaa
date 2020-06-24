<template>
<div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
            <el-input v-model="dataForm.paramKey" placeholder="字典名称/字典代码" clearable></el-input>
        </el-form-item>
        <el-form-item>
            <el-button @click="search()">查询</el-button>
            <el-button @click="reset">重置</el-button>
            <el-button type="primary" @click="addOrUpdateHandle()"  v-if="isAuth('sys:bizcatelog:save')">新增</el-button>
            <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0" v-if="isAuth('sys:bizcatelog:delete')">批量删除</el-button>
            <el-button @click="getDataSuboption()" :disabled="dataListSelections.length <= 0"   v-if="isAuth('sys:bizcatelog:list')">数据子项</el-button>
        </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50">
        </el-table-column>
        <el-table-column prop="guid" header-align="center" align="center" width="80" label="ID">
        </el-table-column>
        <el-table-column prop="codeName" header-align="center" align="center" label="字典名称">
        </el-table-column>
        <el-table-column prop="code" header-align="center" align="center" label="字典代码">
        </el-table-column>
        <el-table-column prop="status" header-align="center" align="center" label="是否有效">
            <template slot-scope="scope">
                <el-tag v-if='scope.row.status==0'>否</el-tag>
                <el-tag v-if='scope.row.status==1' type="success">是</el-tag>
            </template>

        </el-table-column>
        <el-table-column prop="sortNo" header-align="center" align="center" label="排序号">
        </el-table-column>
        <el-table-column prop="describe1" header-align="center" align="center" label="备注">
        </el-table-column>
        <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)" v-if="isAuth('sys:bizcatelog:update')">修改</el-button>
                <el-button type="text" size="small" @click="deleteHandle(scope.row.guid)" v-if="isAuth('sys:bizcatelog:delete')">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

    <configChild v-if="showChild" ref="configChild"></configChild>
</div>
</template>

<script>
import AddOrUpdate from './config-add-or-update'

import configChild from "./config-child"
import sysService from "../../../api/sysService"
import commentService from '../../../api/commentService'
export default {
    data() {
        return {
            dataForm: {
                paramKey: ''
            },
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            dataListSelections: [],
            addOrUpdateVisible: false,

            showChild: false
        }
    },
    components: {
        AddOrUpdate,

        configChild
    },
    activated() {
        this.getDataList()
    },
    methods: {
        search(){
     this.pageIndex = 1
            this.getDataList()
        },
        // 重置搜索条件
        reset() {
            this.dataForm.paramKey = '',
                this.pageIndex = 1
            this.getDataList()
        },
        //数据子选项
        getDataSuboption() {
        
            if (this.dataListSelections.length > 1) {
                this.$message.error('只能选择一条记录')
                return
           }

            this.showChild = true
            this.$nextTick(() => {
                this.$refs.configChild.init(this.dataListSelections.map(val => val.guid)[0])
            })
        },

        // 获取数据列表
        async getDataList() {
            this.dataListLoading = true

            let {
                data
            } = await sysService.bizcatelog({

                order: 'asc',

                page: this.pageIndex,
                limit: this.pageSize,
                input: this.dataForm.paramKey
            })

            if (data && data.code === 0) {

                this.dataList = data.page.list

                this.totalPage = data.page.totalCount

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
        deleteHandle(guid) {
            var guids = guid ? [guid] : this.dataListSelections.map(item => {
                return item.guid
            })
            this.$confirm(`确定对[id=${guids.join(',')}]进行[${guid ? '删除' : '批量删除'}]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let {
                    data
                } = await sysService.bizcatelogDel(guids)

                if (data && data.code === 0) {
                    this.$message({
                        message: '操作成功',
                        type: 'success',
                        duration: 1500,
                        onClose: () => {
                            this.getDataList()
                        }
                    })
                } else {
                    this.$message.error(data.msg)
                }
            })
        }
    }
}
</script>
