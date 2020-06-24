<template>
<div class="mod-config">
    <el-form :inline="true" :model="queryParam" @keyup.enter.native="getDataList()">

        <el-form-item label='类型'>
            <el-select v-model="queryParam.type" placeholder="请选择" clearable>
                <el-option label="合作伙伴" value="1"></el-option>
                <el-option label="荣誉证书" value="2"></el-option>
                <el-option label="资质证书" value="3"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item>
            <el-button @click="search()">搜索</el-button>
            <el-button @click="reset">清空</el-button>

            <el-button type="primary" @click="addOrUpdateHandle()" v-if="isAuth('sly:ph:delete')">新增</el-button>
            <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0" v-if="isAuth('sly:ph:delete')">批量删除</el-button>
        </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50">
        </el-table-column>
        <el-table-column prop="altName" header-align="center" align="center" width="300" label="图片名称">
        </el-table-column>

        <el-table-column prop="imgUrl" header-align="center" align="center" label="图片">

            <template slot-scope="scope">
                <img :src="scope.row.imgUrl" style="width:150px;" />

            </template>
        </el-table-column>
        <el-table-column prop="sortNo" header-align="center" align="center" label="排序号">
        </el-table-column>
        <el-table-column prop="isUsed" header-align="center" align="center" label="是否启用">
            <template slot-scope="scope">
                <el-tag v-if='scope.row.isUsed==0'>否</el-tag>
                <el-tag v-if='scope.row.isUsed==1' type="success">是</el-tag>
            </template>

        </el-table-column>

        <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)" v-if="isAuth('sly:ph:update')">修改</el-button>
                <el-button type="text" size="small" @click="deleteHandle(scope.row.id)" v-if="isAuth('sly:ph:delete')">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->

    <AddOrUpdate v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></AddOrUpdate>
</div>
</template>

<script>
import AddOrUpdate from './partnership-update'

import sysService from "../../../api/sysService"
import commentService from '../../../api/commentService'
export default {
    data() {
        return {

            queryParam: {
                type: ""
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

    },
    created() {
        this.getDataList()
    },
    methods: {
        search() {
            this.pageIndex = 1
            this.getDataList()
        },
        reset() {
            this.queryParam.type = '',
                this.pageIndex = 1
            this.getDataList()
        },
        // 获取数据列表
        async getDataList() {
            this.dataListLoading = true

            let {
                data
            } = await sysService.phList({

                order: 'asc',

                page: this.pageIndex,
                limit: this.pageSize,
                queryParam: encodeURIComponent(JSON.stringify(this.queryParam))
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
                } = await sysService.phDel(ids)

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
