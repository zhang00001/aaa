<template>
<div>

    <el-tree :data="menuList" :props="menuListTreeProps" node-key="id" ref="Tree"
     @current-change="menuListTreeCurrentChangeHandle" :default-expand-all="false" 
     :default-expanded-keys="treeExpandData" :current-node-key="0"
      :highlight-current="true"  :expand-on-click-node="false">
    </el-tree>

</div>
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
            treeExpandData: [], //自己定义的用于接收tree树id的数组
            menuListTreeProps: {
                label: 'name',
                children: 'children'
            },
            selectTree: {},
            provincialCenterId: '',
            visible: false,
             
        };
    },
    created() {
        this.getMenus()
    },

    methods: {
        cancel() {
            Object.assign(this.$data, this.$options.data())
        },
   
        // 菜单树选中
        menuListTreeCurrentChangeHandle(data, node) {
            this.selectTree = data
            this.$emit('emitTree', this.selectTree)

        },
        // 菜单树设置当前选中节点
        menuListTreeSetCurrentNode(id, name) {
            this.$nextTick(() => {
                this.$refs.Tree.setCurrentKey(id)
                this.selectTree = {
                    id: id,
                    name: name
                }
            })

          
        },
        getRoleTreeRootNode(provincialCenterId) {
            this.treeExpandData.push(provincialCenterId)
        },
        async getMenus(id, name) {
            this.visible = true
            let res = await commentService.menuSelect() //获取接口返回的菜单
            if (res && res.data.code == 0) {

                this.menuList = treeDataTranslate(res.data.menuList, 'id')  //做格式转换
                this.provincialCenterId = this.menuList[0].id //默认展开第一个节点
             
                this.$emit('emitTree',this.menuList[0])   //向子组件反射数据
                this.getRoleTreeRootNode(this.provincialCenterId)  //默认展开的节点
                if (!!id && !!name) {
                    this.menuListTreeSetCurrentNode(id, name)  //菜单树设置当前选中节点
                }
            }else{
                this.$message.error(res.data.msg)
            }

        }
    }
}
</script>

<style lang='scss' scoped>

</style>
