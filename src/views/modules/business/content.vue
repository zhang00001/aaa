<template>
<div class="mod-config">
    <el-row>
        <el-col :span="5">
            <vueTreeLeft @emitTree='emitTree'></vueTreeLeft>
        </el-col>
        <el-col :span="18" :offset="1">
            <el-form :inline="true" @keyup.enter.native="getDataList()">

                <el-form-item>

                    <el-button type="primary" @click="addOrUpdateHandle()" v-if="isAuth('sly:content:save')">新增</el-button>
                    <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0" v-if="isAuth('sly:content:delete')">批量删除</el-button>

                </el-form-item>
            </el-form>
            <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
                <el-table-column type="selection" header-align="center" align="center" width="50">
                </el-table-column>

                <el-table-column prop="id" header-align="center" align="center" label="id">
                </el-table-column>
                <el-table-column prop="columnName" header-align="center" align="center" label="所属栏目">
                </el-table-column>
                <el-table-column prop="type" header-align="center" align="center" label="数据类型">
                    <template slot-scope="scope">
                        {{scope.row.type|filterDict(dict.contentType) }}
                    </template>
                </el-table-column>
                <el-table-column prop="title" header-align="center" align="center" label="标题">

                </el-table-column>
                <el-table-column prop="publishTime" header-align="center" align="center" label="发布日期">

                </el-table-column>
                <el-table-column prop="clickNum" header-align="center" align="center" label="点击数">

                </el-table-column>
                <el-table-column prop="auditStatus" header-align="center" align="center" label="审核状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.auditStatus==0">待审核</el-tag>
                        <el-tag type="success" v-if="scope.row.auditStatus==1">审核通过</el-tag>
                        <el-tag type="danger" v-if="scope.row.auditStatus==2">审核未通过</el-tag>
                    </template>
                </el-table-column>

         

                <!-- <el-table-column prop="isUsed" header-align="center" align="center" label="是否启用">
                    <template slot-scope="scope">
                            <el-tag v-if='scope.row.isUsed==0'>否</el-tag>
                        <el-tag type="success" v-if='scope.row.isUsed==1'>是</el-tag>

                    </template>
                </el-table-column>
                <el-table-column prop="isRecommend" header-align="center" align="center" label="是否推荐">
                    <template slot-scope="scope">
                            <el-tag v-if='scope.row.isRecommend==0'>否</el-tag>
                        <el-tag type="success" v-if='scope.row.isRecommend==1'>是</el-tag>

                    </template>
                </el-table-column> -->
                <el-table-column prop="sortNo" header-align="center" align="center" label="排序号">
                </el-table-column>

                <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="addOrUpdateHandle(pids,scope.row)" v-if="isAuth('sly:content:update')">修改</el-button>
                        <el-button type="text" size="small" @click="deleteHandle(scope.row.id)" v-if="isAuth('sly:content:delete')">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>

        </el-col>
    </el-row>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

</div>
</template>

<script>
import AddOrUpdate from './content-update'
import vueTreeLeft from "@/components/vueTreeLeft"
import sysService from "../../../api/sysService"
import commentService from '../../../api/commentService'
export default {
    data() {
        return {

            pids: {},

            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            dataListSelections: [],
            addOrUpdateVisible: false,
            dict: {
                yearSelect: null,
                matchType: null,
                yesno: null,
                ueditorType: null,
                contentType: null,
            }

        }
    },
    components: {
        AddOrUpdate,
        vueTreeLeft
    },
    filters: {
        filterDict(value, dict) {

            return dict ? dict.filter(val => val.itemCode == value)[0].itemName : ""

        },

    },
    created() {
        this.getDict()
        this.getDataList()
    },
    methods: {
        emitTree(tree) {
            this.pids = tree
            this.getDataList()
        },

        async getDict() {
            let res1 = await sysService.getYearSelect()
            if (res1 && res1.data.code == 0) {
                this.dict.yearSelect = res1.data.dictList

            }
            let res2 = await sysService.getMatchType()
            if (res2 && res2.data.code == 0) {
                this.dict.matchType = res2.data.dictList

            }
            let res3 = await sysService.getYesno()
            if (res3 && res3.data.code == 0) {
                this.dict.yesno = res3.data.dictList
            }
            let res4 = await sysService.getUeditorType()
            if (res4 && res4.data.code == 0) {
                this.dict.ueditorType = res4.data.dictList
            }
            let res5 = await sysService.getContentType()

            if (res5 && res5.data.code == 0) {
                this.dict.contentType = res5.data.dictList
            }

        },

        // 获取数据列表
        async getDataList() {
            this.dataListLoading = true

            let {
                data
            } = await sysService.contentList({

                order: 'asc',

                page: this.pageIndex,
                limit: this.pageSize,
                pid: this.pids.id
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
        addOrUpdateHandle(pids, row) {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(this.pids, row)
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
                } = await sysService.contentDel(ids)

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
