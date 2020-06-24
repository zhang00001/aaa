<template>
  <el-popover placement="bottom" width="250" v-model="visible" @hide="hide">
    <el-input v-model="name" placeholder="请输入文件新名称" @blur="change"></el-input>
    <p class="tip" v-show="tip_show">请填写后再提交</p>
    <div style="text-align: right; margin-top: 5px;">
      <el-button size="mini" type="text" @click="visible = false">取消</el-button>
      <el-button type="primary" size="mini" @click="updateHandle()">确定</el-button>
    </div>
    <el-button slot="reference" type="text" size="small" @click="visible = true">{{btnName}}</el-button>
  </el-popover>
</template>

<script>
  export default {
    name: 'popoverBtn',
    props: {
      btnName: {
        type: String,
        default: '按钮'
      },
      id:{
        type: Number,
        default:null
      }
    },
    data() {
      return {
        name: null,
        visible: false,
        tip_show: false,
      }
    },
    methods: {
      //初始化组件
      hide(){
        this.name = null;
        this.tip_show = false;
      },
      updateHandle() {
        if (this.name || this.name === 0){
          this.$emit('submitHandle',{id:this.id,name:this.name});
          this.visible = false;
        } else {
          this.tip_show = true;
        }
      },
      change() {
        if (this.name || this.name === 0) {
          this.tip_show = false;
        } else {
          this.tip_show = true;
        }
      }
    }
  }
</script>

<style>
  .tip {
    font-size: 13px;
    color: #ef3615;
    padding: 0;
    margin: 0;
    margin-top: 3px;
  }
</style>
