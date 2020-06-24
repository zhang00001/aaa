<template>
<div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
            <el-input v-model="dataForm.input" placeholder="姓名/手机号/警号"></el-input>
        </el-form-item>
        <el-form-item>
            <el-select v-model="dataForm.sex" placeholder="性别">
                <el-option label="男" value="男">
                </el-option>
                <el-option label="女" value="女">
                </el-option>
            </el-select>

        </el-form-item>
        <el-form-item>
            <el-input v-model="deptName" placeholder="所属部门" @focus="selectMenu()"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button @click="search()">查询</el-button>
            <el-button @click="clear()">清空</el-button>
            <el-button v-if="isAuth('sly:policeinfo:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
            <el-button v-if="isAuth('sly:policeinfo:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
        </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50">
        </el-table-column>
        <el-table-column prop="id" header-align="center" align="center" label="id">
        </el-table-column>

        <el-table-column prop="userName" header-align="center" align="center" label="姓名">
        </el-table-column>

        <el-table-column prop="phone" header-align="center" align="center" label="手机号">
        </el-table-column>
        <el-table-column prop="sex" header-align="center" align="center" label="性别">
        </el-table-column>
        <el-table-column prop="idCard" header-align="center" align="center" label="身份证号码">
        </el-table-column>

        <!-- <el-table-column prop="policeNo" header-align="center" align="center" label="警号">
        </el-table-column> -->
        <!-- <el-table-column prop="deptId" header-align="center" align="center" label="所属部门"> -->
        <!-- </el-table-column> -->
        <!-- <el-table-column prop="deptPath" header-align="center" align="center" label="部门层级树">
        </el-table-column> -->
        <el-table-column prop="policePosition" header-align="center" align="center" label="职位">
        </el-table-column>
        <el-table-column prop="deptName" header-align="center" align="center" label="所属组织机构">
        </el-table-column>
        <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
                <!-- <el-button type="text" size="small"  >设置警星</el-button> -->
            </template>
        </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

    <depTreeModel ref='vueTree' v-if='showTree' @emitTree='emitTree' />
</div>
</template>

<script>
import AddOrUpdate from './policeinfo-add-or-update'
import depTreeModel from "@/components/depTreeModel"
export default {
    data() {
        return {
            dataForm: {
                input: '',
                sex: "",
                deptId: ""
            },
            deptName: "",
            showTree: false,
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            dataListSelections: [],
            addOrUpdateVisible: false
        }
    },
    components: {
        AddOrUpdate,
        depTreeModel
    },
    activated() {
        this.getDataList()
    },
    methods: {
        search() {
            this.pageIndex = 1
            this.getDataList()
        },
        clear() {
            Object.assign(this.$data.dataForm, this.$options.data().dataForm)
            this.deptName = ''
            this.pageIndex = 1
            this.getDataList()
        },
        selectMenu() {

            this.showTree = true
            this.$nextTick(() => {
                this.$refs['vueTree'].getMenus();

            })
        },
        emitTree(tree) {

            this.deptName = tree.deptName
            this.dataForm.deptId = tree.id
            this.$nextTick(() => {
                this.showTree = false
                this.$refs['dataForm'].clearValidate();
            })

        },
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true
            this.$http({
                url: this.$http.adornUrl('/sly/policeinfo/list'),
                method: 'get',
                params: this.$http.adornParams({
                    'page': this.pageIndex,
                    'limit': this.pageSize,
                    queryParam: encodeURIComponent(JSON.stringify(this.dataForm))
                })
            }).then(({
                data
            }) => {
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
            })
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
        addOrUpdateHandle(id) {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id)
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
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/sly/policeinfo/delete'),
                    method: 'delete',
                    data: this.$http.adornData(ids, false)
                }).then(({
                    data
                }) => {
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
            })
        }
    }
}
</script>
