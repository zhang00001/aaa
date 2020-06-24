<template>
<div class="mod-oss">
    <el-collapse v-model="activeNames">

        <el-collapse-item name="1">
            <template slot="title">
                <p class="p-title"><i class="iconfont icon-changtiao p_color"></i>&nbsp;云存储配置</p>
            </template>

            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
                <el-form-item size="mini" label="存储类型">
                    <el-radio-group v-model="dataForm.type">
                        <el-radio :label="1">本地上传</el-radio>
                        <el-radio :label="2">阿里云</el-radio>
                        <!-- <el-radio :label="3">腾讯云</el-radio> -->
                        <el-radio :label="4">Minio</el-radio>
                    </el-radio-group>
                </el-form-item>
                <template v-if="dataForm.type === 1">
                    <el-form-item size="mini" label="本地系统类型">
                        <el-radio-group v-model="dataForm.localVersion">
                            <el-radio :label="1">windows</el-radio>
                            <el-radio :label="2">linux</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="文件目录">
                        <el-input v-model="dataForm.localPath" placeholder="本地文件在服务器上目录文件夹"></el-input>
                    </el-form-item>
                    <el-form-item label="路径前缀">
                        <el-input v-model="dataForm.localPrefix" placeholder="上传后路径url前缀"></el-input>
                    </el-form-item>
                </template>
                <template v-else-if="dataForm.type === 2">
                    <el-form-item label="域名">
                        <el-input v-model="dataForm.aliyunDomain" placeholder="阿里云绑定的域名"></el-input>
                    </el-form-item>
                    <el-form-item label="路径前缀">
                        <el-input v-model="dataForm.aliyunPrefix" placeholder="不设置默认为空"></el-input>
                    </el-form-item>
                    <el-form-item label="EndPoint">
                        <el-input v-model="dataForm.aliyunEndPoint" placeholder="阿里云EndPoint"></el-input>
                    </el-form-item>
                    <el-form-item label="AccessKeyId">
                        <el-input v-model="dataForm.aliyunAccessKeyId" placeholder="阿里云AccessKeyId"></el-input>
                    </el-form-item>
                    <el-form-item label="AccessKeySecret">
                        <el-input v-model="dataForm.aliyunAccessKeySecret" placeholder="阿里云AccessKeySecret"></el-input>
                    </el-form-item>
                    <el-form-item label="BucketName">
                        <el-input v-model="dataForm.aliyunBucketName" placeholder="阿里云BucketName"></el-input>
                    </el-form-item>
                </template>

                <template v-else-if="dataForm.type === 4">
                    <el-form-item label="域名">
                        <el-input v-model="dataForm.minioDomain" placeholder="minio绑定的域名"></el-input>
                    </el-form-item>
                    <el-form-item label="AccessKey">
                        <el-input v-model="dataForm.minioAccessKey" placeholder="minio的AccessKey"></el-input>
                    </el-form-item>
                    <el-form-item label="AccessSecret">
                        <el-input v-model="dataForm.minioAccessSecret" placeholder="minio的AccessSecret"></el-input>
                    </el-form-item>
                    <el-form-item label="BucketName">
                        <el-input v-model="dataForm.minioBucketName" placeholder="minio的BucketName"></el-input>
                    </el-form-item>
                </template>
                <el-form-item>
                    <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
                </el-form-item>
            </el-form>

        </el-collapse-item>
        <el-collapse-item name="2">
            <template slot="title">
                <p class="p-title"><i class="iconfont icon-changtiao p_color"></i>&nbsp;水印配置</p>

            </template>
            <div>
                <el-form :model="dataForm2" :rules="dataRule2" ref="dataForm2" label-width="120px">

                    <el-row>
                        <el-col :span="24" :offset="0" v-for="(dict,index) in dictImgs" :key="dict.id">
                            <el-form-item :label="dict.itemName">

                                <uploadImg @getImg="getimgsDict($event, index)" :type="1" :imgData="dict.imgs"></uploadImg>

                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="submitLogo()">保存</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-collapse-item>
    </el-collapse>
</div>
</template>

<script>
import sysService from "../../../api/sysService"
import uploadImg from '@/components/my-components/uploadImg.vue'
export default {
    components: {
        uploadImg
    },
    data() {
        return {
            dataForm: {},
            dataRule: {},
            dataForm2: {},
            dataRule2: {},
            activeNames: ['1', '2'],

            dictImgs: [],
            configData: null
        }
    },
    async created() {
        let res1 = await sysService.getNetLogo()
        if (res1 && res1.data.code == 0) {

            res1.data.dictList.forEach(val => {
                this.dictImgs.push({
                    itemCode: val.itemCode,
                    itemName: val.itemName,
                    imgs: ''
                })
            })

        }
        this.init()
    },
    activated() {

    },
    methods: {
        getimgsDict(e, number) {
            this.dictImgs[number].imgs = e
        },
        async init() {
            this.$http({
                url: this.$http.adornUrl('/sys/oss/config'),
                method: 'get',
                params: this.$http.adornParams()
            }).then(({
                data
            }) => {
                this.dataForm = data && data.code === 0 ? data.config : []
            })
            let res = await sysService.configPainter()

            if (res && res.data.code == 0) {
                this.configData = res.data.config
                this.dictImgs.forEach(val => {
                    let img = JSON.parse(this.configData.logoParam)[val.itemCode]

                    val.imgs = img

                })

            } else {
                this.$message.error(res.data.msg)
            }
        },
        //第二个保存
        async submitLogo() {
            let obj = new Object();
            this.dictImgs.forEach((val, index) => {
                obj[val.itemCode] = val.imgs;
            })

            let res = await sysService.configPainterSave({
                type: this.configData.type,
                logoParam: JSON.stringify(obj),
                currentLogo: this.configData.currentLogo,
            })
            if (res && res.data.code == 0) {
                this.configData = res.data.config
                this.$message.success("操作成功")
            } else {
                this.$message.error(res.data.msg)
            }
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl('/sys/oss/saveConfig'),
                        method: 'post',
                        data: this.$http.adornData(this.dataForm)
                    }).then(({
                        data
                    }) => {
                        if (data && data.code === 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.init();
                                }
                            })
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.form-box /deep/ .el-collapse-item__header {
    display: flex;
    align-items: center;
}
</style>
