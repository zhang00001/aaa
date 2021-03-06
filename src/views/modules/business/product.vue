<template>
<div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label='搜索框'>
            <el-input v-model="dataForm.input" placeholder="产品名称" clearable></el-input>
        </el-form-item>
        <el-form-item label='产品所属类目'>
            <el-cascader :show-all-levels="false" v-model="cascader" :options="columnOptions" clearable></el-cascader>
        </el-form-item>
        <el-form-item>
            <el-button @click="search()">搜索</el-button>
            <el-button @click="reset">清空</el-button>
            <el-button type="primary" @click="addOrUpdateHandle()" v-if="isAuth('sly:product:save')">新增</el-button>
            <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0" v-if="isAuth('sly:product:delete')">批量删除</el-button>

        </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50">
        </el-table-column>

        <el-table-column prop="columnName" header-align="center" align="center" label="所属导航栏目">
        </el-table-column>
        <el-table-column prop="title" header-align="center" align="center" label="产品标题">
        </el-table-column>
        <el-table-column prop="productImgs" header-align="center" align="center" label="略缩图">
            <template slot-scope="scope">

                <img :src="scope.row.thumbnail" alt style="width: 80px" />

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

        <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)" v-if="isAuth('sly:product:update')">修改</el-button>
                <el-button type="text" size="small" @click="deleteHandle(scope.row.id)" v-if="isAuth('sly:product:delete')">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

</div>
</template>

<script>
import AddOrUpdate from './product-update'

import sysService from "../../../api/sysService"
import commentService from '../../../api/commentService'
export default {
    data() {
        return {
            dataForm: {
                input: "",
                cascader: []
            },
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
            }
        }
    },
    components: {
        AddOrUpdate

    },
    created() {
        this.getColumn()

        this.getDataList()
    },
    filters: {
        filterDict(value, dict) {

            return dict ? dict.filter(val => val.itemCode == value)[0].itemName : ""

        },

    },

    methods: {
        search() {
            this.pageIndex = 1
            this.getDataList()
        },
        async getColumn() {
            let res = await sysService.columnProduct()
            if (res && res.data.code == 0) {
                this.columnOptions = res.data.data
            }
            let data = await sysService.getYesno()
            if (data && data.data.code == 0) {
                this.dict.yesno = data.data.dictList
            }
        },
        // 重置搜索条件
        reset() {
            this.dataForm.input = '',
            this.cascader=[]
                this.pageIndex = 1
            this.getDataList()
        },
        //数据子选项
        getDataSuboption() {
            if (this.dataListSelections.length > 1) {
                this.$message.error('只能选择一条记录')
            }

            this.showChild = true
            this.$nextTick(() => {
                this.$refs.configChild.init(this.dataListSelections.map(val => val.guid)[0])
            })
        },

        // 获取数据列表
        async getDataList() {
            this.dataListLoading = true
            this.dataForm.cascader = !!this.cascader ? this.cascader[1] : ''
            let {
                data
            } = await sysService.productList({

                order: 'asc',

                page: this.pageIndex,
                limit: this.pageSize,
                queryParam: encodeURIComponent(JSON.stringify(this.dataForm))
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
                } = await sysService.productDel(ids)

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
