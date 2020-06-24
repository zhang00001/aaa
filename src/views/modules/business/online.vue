<template>
<div class="mod-config">
    <el-form :inline="true" :model="queryParam" @keyup.enter.native="getDataList()">

        <el-form-item label='是否回复'>
            <el-select v-model="queryParam.select" placeholder="请选择" clearable>
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label='提交时间'>
            <el-date-picker v-model="queryParam.time" type="datetimerange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" >
            </el-date-picker>
        </el-form-item>
        <el-form-item>
            <el-button @click="search()">搜索</el-button>
            <el-button @click="reset">清空</el-button>

            <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0" v-if="isAuth('sly:onlinemessage:delete')">批量删除</el-button>
        </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50">
        </el-table-column>
        <el-table-column prop="name" header-align="center" align="center" width="80" label="姓名">
        </el-table-column>

        <el-table-column prop="phone" header-align="center" align="center" label="手机号">

        </el-table-column>
        <el-table-column prop="email" header-align="center" align="center" label="邮箱">
        </el-table-column>
        <el-table-column prop="message" header-align="center" align="center" label="留言">
        </el-table-column>
        <el-table-column prop="isContact" header-align="center" align="center" label="是否回复">
            <template slot-scope="scope">
                <el-tag v-if='scope.row.isContact==0'>否</el-tag>
                <el-tag v-if='scope.row.isContact==1' type="success">是</el-tag>
            </template>

        </el-table-column>
        <el-table-column prop="createTime" header-align="center" align="center" label="提交时间">
        </el-table-column>
        <el-table-column prop="adminName" header-align="center" align="center" label="处理人">
        </el-table-column>
        <el-table-column fixed="right" header-align="center" align="center" width="250" label="操作">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="changeStatus(scope.row)"  v-if="isAuth('sly:onlinemessage:update')&&scope.row.isContact==0" >修改状态</el-button>
                <el-button type="text" size="small" @click="detail(scope.row)"  v-if="isAuth('sly:onlinemessage:info')">查看</el-button>
                <el-button type="text" size="small" @click="deleteHandle(scope.row.id)"  v-if="isAuth('sly:onlinemessage:delete')">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <el-dialog title="详情" :close-on-click-modal="false" :visible.sync="visible">

        <el-form :model="dataForm"  ref="dataForm" label-width="140px">
            <el-form-item label="姓名" prop="name">
                <span>{{dataForm.name}}</span>
            </el-form-item>

            <el-form-item label="手机号" prop="phone">
                <span>{{dataForm.phone}}</span>

            </el-form-item>

            <el-form-item label="邮箱" prop="email">
                <span>{{dataForm.email}}</span>

            </el-form-item>
            <el-form-item label="留言" prop="message">
                <span>{{dataForm.message}}</span>

            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">返回</el-button>

        </span>

    </el-dialog>

</div>
</template>

<script>
 

import sysService from "../../../api/sysService"
import commentService from '../../../api/commentService'
export default {
    data() {
        return {

            queryParam: {
                select: "",
                time: []
            },
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            dataListSelections: [],
            addOrUpdateVisible: false,
            visible: false,
            showChild: false,
            dataForm: {}
        }
    },
    components: {

    },
    created() {
        this.getDataList()
    },
    methods: {
        search(){
            this.pageIndex=1
this.getDataList()
        },
        detail(row) {
            this.visible = true
            this.dataForm = row
        },
        reset() {
           this.queryParam={
                select: "",
                time: []
            },
                this.pageIndex = 1
            this.getDataList()
        },
        changeStatus(row) {

            this.$confirm('此留言是否已经回复?一旦修改，不可操作!', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let res = await sysService.onlinemessageUpdate({
                    id: row.id,
                    isContact: 1,
                    name:row.name,
                    message:row.message
                })

                if (res && res.data.code == 0) {
                    this.$message.success("修改成功")
                    this.getDataList()
                } else {
                    this.$message.error(res.data.msg)
                }
            }).catch(() => {

            });
        },

        // 获取数据列表
        async getDataList() {
            this.dataListLoading = true

            let {
                data
            } = await sysService.onlinemessageList({

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
                } = await sysService.onlinemessageDel(ids)

                if (data && data.code === 0) {
                    this.$message.success('操作成功')

                    this.getDataList()

                } else {
                    this.$message.error(data.msg)
                }
            })
        }
    }
}
</script>
