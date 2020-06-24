<template>
<div class="panel panel-default">
    <el-card class="box-card">
        <div slot="header" class="clearfix">

            <el-button @click="update" v-if="!showInfo">修改数据</el-button>
        </div>
        <div class="text item">
            <div class="form-box">
                <el-form ref="form" :model="dataForm" label-width="207px">
                    <el-collapse v-model="activeNames">

                        <el-collapse-item name="1">
                            <template slot="title">
                                <p class="p-title"><i class="iconfont icon-changtiao p_color"></i>&nbsp;网站基础配置信息</p>
                            </template>

                            <el-row>
                                <el-col :span="8" :offset="0">
                                    <el-form-item label="顶部导航LOGO">
                                        <upload-img @getImg="getimgs($event,1)" :type="1" :imgData="dataForm.logoTop" :isShow='!showInfo'></upload-img>

                                    </el-form-item>
                                </el-col>

                            </el-row>
                            <el-row>
                                <el-col :span="12" :offset="0">
                                    <el-form-item label="网站标题">
                                        <el-input v-model="dataForm.netTitle" placeholder="网站标题" :disabled="!showInfo"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>

                            <el-row>
                                <el-col :span="12" :offset="0">
                                    <el-form-item label="电话">
                                        <el-input v-model="dataForm.contact" placeholder="电话" :disabled="!showInfo"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>

                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="联系地址">
                                        <el-input v-model="dataForm.address" placeholder="联系地址" :disabled="!showInfo"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12" :offset="0">
                                    <el-form-item label="版权">
                                        <el-input v-model="dataForm.copyright" placeholder="版权" :disabled="!showInfo"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12" :offset="0">
                                    <el-form-item label="旧版入口链接">
                                        <el-input v-model="dataForm.oldEnter" placeholder="旧版入口链接" :disabled="!showInfo"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>

                        </el-collapse-item>

                    </el-collapse>
                    <el-row>
                        <el-col :span="24">
                            <div class="form-btn-submit" v-if="showInfo">
                                <el-button type="primary" @click="saveOrUpdate">确定</el-button>
                                <el-button @click="reload">取消</el-button>
                            </div>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>

    </el-card>

</div>
</template>

<script>
import ImageWall from "@/components/imageWall"
import vueEdit from "@/components/vueEdit"
import axios from "axios";

import sysService from "../../../api/sysService"
import fileDepository from "@/components/my-components/fileDepository"
import uploadImg from '@/components/my-components/uploadImg.vue'
export default {
    components: {

        vueEdit,
        fileDepository,

        uploadImg
    },
    data() {
        return {
            showList: false,
            showInfo: false,
            updateUrl: "file/upload",
            fileList: [],
            activeNames: ['1', '2', '3', '4', '5', '6', '7'],
            title: null,
            jpgrid: {},

            sysset: {},
            dict: {},
            config: {},
            dataForm: {

            },
            showImagesVisible: false,
            sysset: "",

      
          

        };

    },
    async created() {

        this.getInfo();
    },

    methods: {
        getimgs(e, number) {

            switch (number) {
                case 1:
                    this.dataForm.logoTop = e
                    break

            }

        },

        async saveOrUpdate() {

            let res = !!this.sysset ?
                await sysService.configUpdate({
                    id: this.sysset,
                    ...this.dataForm
                }) :
                await sysService.configSave(this.dataForm)

            if (res.data.code === 0) {
                this.$message.success('操作成功!');
                this.showInfo = false
                this.reload();
            } else {
                this.$message.error(res.data.msg);
            }
        },

        async getInfo() {
            let res = await sysService.configInfo()
            if (res && res.data.code == 0) {
                this.$nextTick(() => {
                    this.dataForm = res.data.config
                    this.sysset = res.data.id

                })

            }

        },

        reload(event) {
            Object.assign(this.$data, this.$options.data())

            this.getInfo();

        },
        update(event) {

            this.$nextTick(() => {
                this.showInfo = true;
            })

        },

    }
}
</script>

<style lang="scss" scoped>
.form-box /deep/ .el-collapse-item__header {
    display: flex;
    align-items: center;
}

.content {
    border: 1px solid #92929229;
    padding: 20px;
}

/deep/ .el-card__header {
    background-color: rgb(245, 245, 245);
}

.img-ul-div {
    display: flex;
    padding: 0;
    position: relative;
    margin-top: 10px;

    i {
        position: absolute;
        top: -8px;
        right: -8px;
        font-size: 16px;
        cursor: pointer;
        z-index: 999;
    }
}

.layui-upload-list {
    height: 150px;
    width: 300px;

    img {
        width: 100%;
    }
}

.quill-editor {
    width: 750px;

    // overflow-y: scroll;

    /deep/ .ql-container {
        height: 400px;
    }
}

.mapContant {
    width: 716px;
    height: 356px;
    position: relative;
}

.iconAdd {
    font-size: 30px;
}

.boxFuture {
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    margin: 20px 0;

    .boxFutureLeft {
        width: 65%;
    }

    .boxFutureRight {}
}

.form-btn-submit {
    float: right;
    margin-top: 20px;
}
</style>
