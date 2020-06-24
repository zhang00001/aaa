<template>
<div>

    <el-tree :data="menuList" :props="menuListTreeProps" node-key="id" ref="menuListTree" @current-change="menuListTreeCurrentChangeHandle" :default-expand-all="true" :highlight-current="true" :expand-on-click-node="false">
    </el-tree>
    <!-- <span slot="footer" class="dialog-footer">

        <el-button size="medium" @click="cancel">取消</el-button>
        <el-button type="primary" size="medium" @click="submit">确认</el-button>

    </span> -->
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
            menuListTreeProps: {
                label: 'deptName',
                children: 'children'
            },
            selectTree: {},
            visible: false,
       
        };
    },
    created() {

    },

    methods: {
        cancel() {
            Object.assign(this.$data, this.$options.data())
        },
        submit() {

            if (!!this.selectTree.id || this.selectTree.id == 0) {

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
 

            this.visible = true
            let res = await commentService.policedept()
            if (res && res.data.code == 0) {

                this.menuList = treeDataTranslate(res.data.page, 'id')

            } else {
                this.$message.error(res.data.msg)
            }

        },

    }
}
</script>

<style lang='scss' scoped>

</style>
