<template>
<el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
        <el-form-item label="选择警员" prop="userId">
            <el-select v-model="dataForm.userId" filterable remote reserve-keyword placeholder="请输入" :remote-method="remoteMethod" :loading="loading">
                <el-option v-for="item in options" :key="item.id" :label="item.userName" :value="item.id">
                </el-option>
            </el-select>

            <!-- <el-input v-model="dataForm.userId" placeholder="普通用户"></el-input> -->
        </el-form-item>
        <!-- <el-form-item label="名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="名称"></el-input>
    </el-form-item> -->
        <el-form-item label="警员照片" prop="photo">
            <upload-img @getImg="getimgs" :type="1" :imgData="dataForm.photo"></upload-img>

            <!-- <el-input v-model="dataForm.photo" placeholder="照片"></el-input> -->
        </el-form-item>
        <!-- <el-form-item label="职位" prop="policePosition">
      <el-input v-model="dataForm.policePosition" placeholder="职位"></el-input>
    </el-form-item> -->
        <el-form-item label="描述" prop="describe">
            <el-input v-model="dataForm.describe" type="textarea" :rows="2" placeholder="描述" maxlength="200"></el-input>
        </el-form-item>
        <el-form-item label="排序号" prop="sortNo">
            <el-input-number v-model="dataForm.sortNo" :min="1" :max="10000" label="排序号"></el-input-number>

        </el-form-item>
        <!-- <el-form-item label="创建时间" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
    </el-form-item>
    <el-form-item label="创建人" prop="createId">
      <el-input v-model="dataForm.createId" placeholder="创建人"></el-input>
    </el-form-item>
    <el-form-item label="修改时间" prop="updateTime">
      <el-input v-model="dataForm.updateTime" placeholder="修改时间"></el-input>
    </el-form-item>
    <el-form-item label="修改人" prop="updateId">
      <el-input v-model="dataForm.updateId" placeholder="修改人"></el-input>
    </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
</el-dialog>
</template>

<script>
import uploadImg from '@/components/my-components/uploadImg.vue'
export default {
    components: {

        uploadImg,

    },
    data() {
        return {
            options: [],

            list: [],
            loading: false,

            visible: false,
            userData: {
                userId: "",
                name: ""
            },
            dataForm: {
                id: 0,
                userId: '',
                // name: '',
                photo: '',
                // policePosition: '',
                describe: '',
                sortNo: '',
                // createTime: '',
                // createId: '',
                // updateTime: '',
                // updateId: ''
            },
            dataRule: {
                userId: [{
                    required: true,
                    message: '普通用户不能为空',
                    trigger: 'blur'
                }],
                name: [{
                    required: true,
                    message: '名称不能为空',
                    trigger: 'blur'
                }],
                photo: [{
                    required: true,
                    message: '照片不能为空',
                    trigger: 'blur'
                }],
                policePosition: [{
                    required: true,
                    message: '职位不能为空',
                    trigger: 'blur'
                }],
                describe: [{
                    required: true,
                    message: '描述不能为空',
                    trigger: 'blur'
                }],
                sortNo: [{
                    required: true,
                    message: '排序号不能为空',
                    trigger: 'blur'
                }],
                // createTime: [
                //   { required: true, message: '创建时间不能为空', trigger: 'blur' }
                // ],
                // createId: [
                //   { required: true, message: '创建人不能为空', trigger: 'blur' }
                // ],
                // updateTime: [
                //   { required: true, message: '修改时间不能为空', trigger: 'blur' }
                // ],
                // updateId: [
                //   { required: true, message: '修改人不能为空', trigger: 'blur' }
                // ]
            }
        }
    },
    mounted() {

    },
    methods: {
        remoteMethod(query) {
            if (query !== '') {
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    this.options = [];
                    this.$http({
                        url: this.$http.adornUrl(`/sly/policestar/police`),
                        method: 'get',
                        params: this.$http.adornParams({
                            name: query
                        })
                    }).then(({
                        data
                    }) => {

                        if (data && data.code === 0) {

                            this.options = data.page

                        }
                    })
                }, 200);

            } else {
                this.options = [];
            }
        },
        getimgs(e) {
            this.dataForm.photo = e
        },
        init(id) {
            this.dataForm.id = id || 0
            this.visible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields()
                if (this.dataForm.id) {
                    this.$http({
                        url: this.$http.adornUrl(`/sly/policestar/info/${this.dataForm.id}`),
                        method: 'get',
                        params: this.$http.adornParams()
                    }).then(({
                        data
                    }) => {
                        if (data && data.code === 0) {
                           this.options.push({
                                id: data.policeStar.userId,

                                userName: data.policeStar.name
                            })
                    
                            this.dataForm.userId = data.policeStar.userId
                            this.dataForm.name = data.policeStar.name

                            this.dataForm.photo = data.policeStar.photo
                            // this.dataForm.policePosition = data.policeStar.policePosition
                            this.dataForm.describe = data.policeStar.describe
                            this.dataForm.sortNo = data.policeStar.sortNo
                           

                        }
                    })
                }
            })
        },
        // 表单提交
        dataFormSubmit() {

            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`/sly/policestar/${!this.dataForm.id ? 'save' : 'update'}`),
                        method: !this.dataForm.id ? 'post' : 'put',
                        data: this.$http.adornData({
                            'id': this.dataForm.id || undefined,
                            'userId': this.dataForm.userId,
                            'name': this.dataForm.name,
                            'photo': this.dataForm.photo,
                            // 'policePosition': this.dataForm.policePosition,
                            'describe': this.dataForm.describe,
                            'sortNo': this.dataForm.sortNo,

                        })
                    }).then(({
                        data
                    }) => {
                        if (data && data.code === 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.visible = false
                                    this.$emit('refreshDataList')
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
