<template>
<div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <!-- <el-form-item>
            <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
        </el-form-item> -->
        <el-form-item>
            <!-- <el-button @click="getDataList()">查询</el-button> -->
            <el-button v-if="isAuth('sly:policedept:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
            <!-- <el-button v-if="isAuth('sly:policedept:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
        </el-form-item>
    </el-form>
    <el-table :data="dataList" v-if="dataList.length" :default-expand-all='true' border row-key="id" :tree-props="{children: 'children'}" v-loading="dataListLoading" style="width: 100%;">
        <!-- <el-table-column type="selection" header-align="center" align="center" width="50">
        </el-table-column> -->
        <!-- <el-table-column prop="id" header-align="center" align="center" label="Id">
        </el-table-column> -->
        <el-table-column prop="deptName" header-align="center" align="center" label="部门名称">
        </el-table-column>
        <el-table-column prop="pname" header-align="center" align="center" label="上一级">
            <template slot-scope="scope">
                {{scope.row.pname||'顶级部门'}}
            </template>
        </el-table-column>

        <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                <el-button type="text" size="small" @click="deleteHandle(scope.row.id,scope.row.deptName)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination> -->
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
     <el-dialog title="是否确定删除？请选择当前组织机构下警员需要移动到的部门" :visible.sync="dialogTableVisible">
        <!-- <el-table ref="multipleTable" :data="gridData" @selection-change="handleSelectionChange" v-if="gridData.length" :default-expand-all='true' border row-key="id" :tree-props="{children: 'children'}">
            <el-table-column type="selection" header-align="center" align="center" width="50">
            </el-table-column>
            <el-table-column property="deptName" label="部门名称"></el-table-column>

        </el-table> -->
           <depTreeModel2  ref='vueTree'   @emitTree='emitTree' />
 

        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogTableVisible = false">取 消</el-button>
            <el-button type="primary" @click=" deleteSave">确 定</el-button>
        </div>
    </el-dialog>

</div>
</template>

<script>
import AddOrUpdate from './policedept-add-or-update'
import depTreeModel2 from  "@/components/depTreeModel2"
import {
    treeDataTranslate
} from '@/utils'
export default {
    data() {
        return {
            dialogTableVisible: false,
            dataForm: {
                key: ''
            },
            gridData: [],
            isExpand: true,
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            dataListSelections: [],
            addOrUpdateVisible: false,
            depData: [],
            selectId: '', //当前选择的部门
            policeDepts: {
              deptName:"",
              id:""
            }, //移动的部门
            multipleSelection: []
        }
    },
    components: {
        AddOrUpdate,
        depTreeModel2
    },
    activated() {
        this.getDataList()
    },
    watch: {

    },
    
    methods: {
      emitTree(tree) {

            this.policeDepts.deptName = tree.deptName
            this.policeDepts.id = tree.id
            this.$nextTick(() => {
              
                this.$refs['dataForm'].clearValidate();
            })

        },
        // handleSelectionChange(val) {

        //     if (val.length >= 2) {
        //         let arrays = val.splice(0, val.length - 1)
        //         arrays.forEach(row => {
        //             this.$refs.multipleTable.toggleRowSelection(row); //除了当前点击的，其他的全部取消选中
        //         })
        //     }
        //     this.multipleSelection = val;

        // },
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true
            this.$http({
                url: this.$http.adornUrl('/sly/policedept/list'),
                method: 'get',
                params: this.$http.adornParams({
                    'page': this.pageIndex,
                    'limit': this.pageSize,
                    'key': this.dataForm.key
                })
            }).then(({
                data
            }) => {
                if (data && data.code === 0) {
                    this.depData = JSON.parse(JSON.stringify(data.page))

                    this.dataList = treeDataTranslate(data.page, 'id')
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
        deleteHandle(id,name) {
          this.dialogTableVisible = true

            this.selectId = id
            this.$nextTick(() => {
                this.$refs['vueTree'].getMenus(id, name);

            })
     

           
            // this.gridData = treeDataTranslate(this.depData.filter(val => val.id != id), 'id')

        },
        deleteSave() {
 
 
            if (!!this.$refs['vueTree'].selectTree.id) {
                this.$confirm(`是否确定删除？并移动当前组织下的警员到所选择的部门?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/sly/policedept/delete'),
                        method: 'delete',
                        data: {
                            deptId: this.selectId,
                            policeDeptId: this.$refs['vueTree'].selectTree.id
                        }
                    }).then(({
                        data
                    }) => {
                        if (data && data.code === 0) {
                           this.dialogTableVisible=false
                            this.$message.success('操作成功')
                              this.getDataList()
                             
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                })
            } else {
                this.$message.warning('请选择需要移动到的部门')
            }

        }
    }
}
</script>
