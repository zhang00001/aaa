<template>
<div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label='图片所属位置'>
            <el-input v-model="parentName" maxlength="50" placeholder="图片所属位置" @focus="selectMenu(location,parentName)"></el-input>
        </el-form-item>

        <el-form-item>
            <el-button   @click="search()">搜索</el-button>
            <el-button @click="reset">清空</el-button>
            <el-button type="primary" @click="addOrUpdateHandle()" v-if="isAuth('componet:picture:save')">新增</el-button>
        </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">

        <el-table-column prop="id" header-align="center" align="center" width="80" label="图片ID">
        </el-table-column>
        <el-table-column prop="parentName" header-align="center" align="center" label="图片所属位置">
        </el-table-column>
        <el-table-column prop="type" header-align="center" align="center" label="Banner类型">

            <template slot-scope="scope">
                <el-tag v-if='scope.row.type==1'>图片</el-tag>
                <el-tag v-if='scope.row.type==2' type="success">视频</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="remark" header-align="center" align="center" label="信息备注">
            <template slot-scope="scope">
                <div v-html="scope.row.remark"></div>
            </template>
        </el-table-column>
        <el-table-column prop="isUsed" header-align="center" align="center" label="是否启用">
            <template slot-scope="scope">
                <el-tag v-if='scope.row.isUsed==0'>否</el-tag>
                <el-tag v-if='scope.row.isUsed==1' type="success">是</el-tag>
            </template>

        </el-table-column>
        <el-table-column prop="sortNo" header-align="center" align="center" label="排序号">
        </el-table-column>

        <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)" v-if="isAuth('componet:picture:update')">修改</el-button>
                <el-button type="text" size="small" @click="deleteHandle(scope.row.id)" v-if="isAuth('componet:picture:delete')">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->


    <AddOrUpdate v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></AddOrUpdate>
    <vueTree ref='vueTree' v-if='showTree' @emitTree='emitTree'></vueTree>
</div>
</template>

<script>
import AddOrUpdate from './picture-update'
import fileDepository from '../../../components/my-components/fileDepository.vue'
import vueTree from "@/components/vueTree"
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

            showChild: false,
            v: false,
            location: "",
            parentName: "",
            showTree: false,
        }
    },
    components: {
        AddOrUpdate,
        fileDepository,
        vueTree

    },
    created() {

        this.getDataList()
    },
    methods: {
        reset() {
            this.location = "",
                this.parentName = ""
                this.pageIndex = 1
                  this.getDataList()
        },
        search() {
            this.pageIndex = 1
            this.getDataList()
        },
        selectMenu(id, name) {
            this.showTree = true
            this.$nextTick(() => {
                this.$refs['vueTree'].getMenus(id, name);

            })
        },
        emitTree(tree) {
 
            this.parentName = tree.name
            this.location = tree.id
            this.$nextTick(() => {
                this.showTree = false
                this.$refs['dataForm'].clearValidate();
            })
        },
        // 获取数据列表
        async getDataList() {
            this.dataListLoading = true
            let {
                data
            } = await sysService.pictureList({

                order: 'asc',

                page: this.pageIndex,
                limit: this.pageSize,
                queryParam: encodeURIComponent(JSON.stringify({
                    location: this.location
                }))
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
                } = await sysService.pictureDel(ids)

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
