<template>
<div class="mod-demo-ueditor">


    
<script :id="ueId" class="ueditor-box" type="text/plain" style="width: 100%; height: 260px;"></script>

 
</div>
</template>

<script>
  import ueditor from 'ueditor'
  export default {
    data () {
      return {
        ue: null,
        ueId: `J_ueditorBox_${new Date().getTime()}`,
        ueContent: '',
        dialogVisible: false,
          instance: null,
      }
    },
    mounted () {
         const _this = this;
      ueditor.delEditor(this.ueId);

      this.ue = ueditor.getEditor(this.ueId, {
        // serverUrl: '', // 服务器统一请求接口路径
        zIndex: 3000
      })

    },
    watch:{
        content(val, oldVal) {

          setTimeout(()=>{
          this.ue.ready(() => {
                  this.ue.setContent(!!val?val:"")
                })
          },200)

          }
    },
    props:[ 'content'],
    methods: {
      getContent () {
        this.dialogVisible = true
        this.ue.ready(() => {
          this.ueContent = this.ue.getContent()
        })
      }
    }
  }
</script>

<style lang="scss">
.mod-demo-ueditor {
    position: relative;
    z-index: 510;

    >.el-alert {
        margin-bottom: 10px;
    }

    /deep/ .edui-default .edui-toolbar {
        line-height: 20px;
    }
}
</style>
