<template>
<el-dialog :close-on-click-modal="false" :visible.sync="visible" append-to-body width="1000px">

    <el-tree :data="menuList" :props="menuListTreeProps" node-key="id" ref="menuListTree" @current-change="menuListTreeCurrentChangeHandle" :default-expand-all="true" :highlight-current="true" :expand-on-click-node="false">
    </el-tree>
    <span slot="footer" class="dialog-footer">

        <el-button size="medium" @click="cancel">取消</el-button>
        <el-button type="primary" size="medium" @click="submit">确认</el-button>

    </span>
</el-dialog>
</template>

<script>
import commentService from "../api/commentService"
import {
    treeDataTranslate
} from '@/utils'
export default {
    components: {

    },
    data() {
        return {
            menuList: [],
            menuListTreeProps: {
                label: 'deptName',
                children: 'children'
            },
            selectTree: {},
            visible: false,
            parentId: ''
        };
    },
    created() {

    },

    methods: {
        cancel() {
            Object.assign(this.$data, this.$options.data())
        },
        submit() {

            if (!!this.selectTree.id||this.selectTree.id==0) {

             
                    this.$emit('emitTree', this.selectTree)
                    this.visible = false
            

            } else {
                this.$message.warning('暂未选中菜单')
            }

        },
        // 菜单树选中
        menuListTreeCurrentChangeHandle(data, node) {
            this.selectTree = data

        },
        // 菜单树设置当前选中节点
        menuListTreeSetCurrentNode(id, name) {
 
            this.$nextTick(() => {

                this.$refs.menuListTree.setCurrentKey(id)
                this.selectTree = {
                    id: id,
                    name: name
                }
            })

        },
        async getMenus(id, name) {
  
            !!id ? this.parentId = id : ''

            this.visible = true
            let res = await commentService.policedept()
            if (res && res.data.code == 0) {
                
                let treeList=[...res.data.page,{deptName: "顶级部门",
                    id: 0,
                    parentId: -1,}]
this.menuList = treeDataTranslate(treeList,'id')
                // this.menuList = treeDataTranslate(!!id||id===0 ? treeList.filter(val => val.parentId < id) : treeList, 'id')
                // this.menuList = this.setDisadle(this.parentId, this.menuList)

                // let parentId = this.parentId
                // this.menuList.forEach(val => {

                //     if (val.id >= parentId) {
                //         val.disabled = true
                //         if (val.children) {
                //             val.children.forEach(item => item.disabled = true)
                //         }

                //     }
                // })

                if ((!!id && !!name) || (id == 0 && !!name)) {
                    this.menuListTreeSetCurrentNode(id, name)
                }
            } else {
                this.$message.error(res.data.msg)
            }

        },
        // setDisadle(id, tree) {

        //     let arr = []
        //     if (tree) {
        //         for (var i = 0; i < tree.length; i++) {
        //             console.log(tree[i], id)
        //             if (tree[i].id<= id) {

        //                 tree[i].disabled = true
        //                 if (tree[i].children) {
        //                     let treeChild=tree[i].children
        //                     this.setDisadle(id,treeChild )
        //                 }

        //             }
        //             arr.push(tree[i])
        //         }
        //     }

        //   return arr
        // }
    }
}
</script>

<style lang='scss' scoped>

</style>
