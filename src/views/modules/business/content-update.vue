<template>
<el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible" @close='close' width='1200px'>

    <el-form ref="dataForm" :rules="dataRule" :model="dataForm" label-width="207px" @keyup.enter.native="dataFormSubmit()">

        <p class="p-title">基本信息</p>
        <el-row>
            <el-col :span="12" :offset="0">
                <el-form-item label="所属栏目">
                    <el-input v-model="dataForm.parentName" @focus="selectMenu(dataForm.columnId,dataForm.parentName)"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="18" :offset="0">
                <el-form-item label="数据类型" prop="type">

                    <el-radio-group v-model="dataForm.type" :min="0" :max="1">
                        <el-radio v-for="item in dict.contentType" :label="item.itemCode" :key="item.itemName">{{item.itemName}}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" :offset="0">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="dataForm.title" placeholder="标题"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <!-- <el-row>
            <el-col :span="12" :offset="0">
                <el-form-item label="概要/备注">
                    <el-input type="textarea" rows="6" placeholder="请输入内容" resize="none" maxlength="150" show-word-limit v-model="dataForm.abstractText">
                    </el-input>
                </el-form-item>
            </el-col>
        </el-row> -->
        <div v-show="dataForm.type == '01' || dataForm.type == '02'||dataForm.type == '05'">
            <el-row>
                <el-col :span="18" :offset="0">
                    <el-form-item label="【富文本】内容值类型" prop="contentType">
                        <el-radio v-model="dataForm.contentType" v-for="item in dict.ueditorType" :label="item.itemCode" :key="item.itemName">{{item.itemName}}</el-radio>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="18" :offset="0">
                    <el-form-item label="内容">
                        <div style="line-height: 0">

                            <vueEdit class='quill-editor' ref="editor" :content='dataForm.content' />

                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </div>
        <div v-show="dataForm.type == '03'">
            <el-row>
                <el-col :span="18" :offset="0">
                    <el-form-item label="文件视频">
                        <fileDepository ref='fileDepository' @getFileUrl='getFileUrl' :videoUrl='dataForm.content'></fileDepository>

                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" :offset="0">
                    <el-form-item label="视频封面">
                        <upload-img @getImg="getimgs($event,3)" :type="1" :imgData="content3"></upload-img>

                    </el-form-item>
                </el-col>
            </el-row>
        </div>
        <div v-show="dataForm.type == '04'">

            <el-row>
                <el-col :span="12" :offset="0">
                    <el-form-item label=链接地址>
                        <el-input v-model="dataForm.title" placeholder="链接地址"></el-input>

                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" :offset="0">
                    <el-form-item label=链接图标>
                        <upload-img @getImg="getimgs($event,4)" :type="1" :imgData="content4"></upload-img>

                    </el-form-item>
                </el-col>
            </el-row>
        </div>

        <el-row>
            <el-col :span="8" :offset="0">
                <el-form-item label="发布日期" prop="publishTime">
                    <el-date-picker v-model="dataForm.publishTime" type="date" placeholder="选择发布日期" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
            </el-col>
        </el-row>
        <!-- <el-row>
            <el-col :span="8" :offset="0">
                <el-form-item label="是否启用" prop="isUsed">
                    <el-radio-group v-model="dataForm.isUsed">
                        <el-radio v-for="item in dict.yesno" :label="item.itemCode" :key="item.itemName">{{item.itemName}}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
                <el-form-item label="是否推荐" prop="isRecommend">
                    <el-radio v-model="dataForm.isRecommend" v-for="item in dict.yesno" :label="item.itemCode" :key="item.itemName">{{item.itemName}}</el-radio>
                </el-form-item>
            </el-col>
        </el-row> -->
        <el-row>
            <el-col :span="8" :offset="0">
                <el-form-item label="排序号" prop="sortNo">
                    <el-input-number v-model="dataForm.sortNo" placeholder="排序号" :min='0' :max='100000'></el-input-number>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row v-if="dataForm.id">
            <el-col :span="8" :offset="0">
                <el-form-item label="审核状态" prop="auditStatus">

                    <el-tag v-if="dataForm.auditStatus==0">待审核</el-tag>
                    <el-tag type="success" v-if="dataForm.auditStatus==1">审核通过</el-tag>
                    <el-tag type="danger" v-if="dataForm.auditStatus==2">审核未通过</el-tag>

                </el-form-item>
            </el-col>
        </el-row>
        <!-- <el-row>
            <el-col :span="8" :offset="0">
                <el-form-item label="是否开启独立页" prop="hasSeo">
                    <el-radio v-model="dataForm.hasSeo" v-for="item in dict.yesno" :label="item.itemCode" :key="item.itemName">{{item.itemName}}</el-radio>
                </el-form-item>
            </el-col>
        </el-row> -->
        <!-- <el-row v-show="dataForm.hasSeo=='1'">
            <el-col :span="9" :offset="0">
                <el-form-item label="seo_title">
                    <el-input type="textarea" rows="6" placeholder="请输入内容" resize="none" maxlength="30" show-word-limit v-model="dataForm.seoTitle">
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="9">
                <el-form-item label="seo_keywords">
                    <el-input type="textarea" rows="6" placeholder="请输入内容" resize="none" maxlength="200" show-word-limit v-model="dataForm.seoKeywords">
                    </el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row v-show="dataForm.hasSeo=='1'">
            <el-col :span="16" :offset="0">
                <el-form-item label="seo_description">
                    <el-input type="textarea" rows="6" placeholder="请输入内容" resize="none" maxlength="200" show-word-limit v-model="dataForm.seoDescription">
                    </el-input>
                </el-form-item>
            </el-col>
        </el-row> -->

        <p class="p-title" v-if="dataForm.type == '01'||dataForm.type == '02'||dataForm.type == '05'">额外信息</p>
        <div v-if="dataForm.type == '01'">
            <el-row>
                <el-col :span="12" :offset="0">
                    <el-form-item label="缩略图">
                        <upload-img @getImg="getimgs($event,1)" :type="1" :imgData="content1"></upload-img>

                    </el-form-item>
                </el-col>
            </el-row>
        </div>
        <!--资讯-->
        <div v-if="dataForm.type == '02'">
            <el-row>
                <el-col :span="8" :offset="0">
                    <el-form-item label="作者">
                        <el-input v-model="model1.author" placeholder="作者"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8" :offset="0">
                    <el-form-item label="来源">
                        <el-input v-model="model1.source" placeholder="来源"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" :offset="0">
                    <el-form-item label="缩略图">
                        <upload-img @getImg="getimgs($event,2)" :type="1" :imgData="content2"></upload-img>

                    </el-form-item>
                </el-col>
            </el-row>
        </div>
        <div v-if="dataForm.type == '05'">
            <el-row>
                <el-col :span="8" :offset="0">
                    <el-form-item label="签收对象">
                        <el-radio-group v-model="model1.source">
                            <el-radio :label="3">部门</el-radio>
                            <el-radio :label="6">人员</el-radio>

                        </el-radio-group>

                    </el-form-item>
                </el-col>

            </el-row>
            <el-row>
                <el-col :span="18" :offset="0">
                    <el-form-item label="选择签收对象">
                        <tree-transfer :title="title" :from_data='fromData' :to_data='toData' :defaultProps="{label:'label'}" @addBtn='add' @removeBtn='remove' :mode='mode' height='540px' filter openAll>
                        </tree-transfer>
                    </el-form-item>
                </el-col>
            </el-row>

        </div>

        <!--项目案例-->
        <!-- <div v-if="dataForm.type == '04'">
            <el-row>
                <el-col :span="12" :offset="0">
                    <el-form-item label="缩略图">
                        <upload-img @getImg="getimgs($event,4)" :type="1" :imgData="content4"></upload-img>

                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10" :offset="0">
                    <el-form-item label="所属年份">
                        <el-select v-model="model2.yearSelect" placeholder="请选择">
                            <el-option v-for="item in dict.yearSelect" :label="item.itemName" :key="item.itemName" :value="item.itemCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10" :offset="0">
                    <el-form-item label="赛事规模">
                        <el-select v-model="model2.matchType" placeholder="请选择">
                            <el-option v-for="item in dict.matchType" :label="item.itemName" :key="item.itemName" :value="item.itemCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" :offset="0" v-for="(dict,index) in dictImgs" :key="dict.id">
                    <el-form-item :label="dict.itemName">

                        <upload-img @getImg="getimgsDict($event, index)" :type="100" :imgData="dict.imgs"></upload-img>

                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="24" :offset="0">
                    <el-form-item label="首页推荐图片">
                        <upload-img @getImg="getimgs($event,8)" :type="100" :imgData="content8"></upload-img>

                    </el-form-item>
                </el-col>
            </el-row>

        </div> -->

    </el-form>

    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <vueTree ref='vueTree' v-if='showTree' @emitTree='emitTree'></vueTree>

</el-dialog>
</template>

<script>
import sysService from "../../../api/sysService"

import vueTree from "@/components/vueTree"
import vueEdit from "@/components/vueEdit"
import axios from "axios";
import fileDepository from "@/components/my-components/fileDepository"
import uploadImg from '@/components/my-components/uploadImg.vue'
import {
    isBlank
} from '@/utils/validate'
// https://github.com/hql7/tree-transfer
import treeTransfer from 'el-tree-transfer'
export default {
    components: {
        vueTree,

        vueEdit,
        fileDepository,
        uploadImg,
        treeTransfer
    },
    data() {

        return {
            showTree: false,
            visible: false,
            showImagesVisible: false,

            dataForm: {
                // isUsed: '0',
                // isRecommend: '0',
                contentAttrs: [],
                contentImgs: [],
                contentTags: [],
                type: [],
                contentType: '01',
                title: "",
                // abstractText: "",
                publishTime: '',
                // hasSeo: "0",
                // seoTitle: "",
                // seoKeywords: "",
                // seoDescription: "",
                sortNo: 0,
                content: "",
                auditStatus: 0, //0 是待审核 1审核通过 2审核未通过
            },
            dict: {
                yearSelect: null,
                matchType: null,
                yesno: null,
                ueditorType: null,
                contentType: null,
                projectCase: null
            },
            model1: {
                author: null,
                source: null
            },
            model2: {},
            model3: {
                suffix: null
            },
            showImagesVisible: false,
            fileList: [],
            dataRule: {

                type: [{
                    required: true,
                    message: '请至少选择一个数据类型',
                    trigger: 'change'
                }],
                title: [{
                    required: true,
                    message: '必填项不能为空',
                    trigger: 'change'
                }],
                publishTime: [{
                    type: 'string',
                    required: true,
                    message: '请选择日期',
                    trigger: 'change'
                }],
                // isUsed: [{
                //     required: true,
                //     message: '必填项不能为空',
                //     trigger: 'change'
                // }],
                // isRecommend: [{
                //     required: true,
                //     message: '必填项不能为空',
                //     trigger: 'change'
                // }],
                sortNo: [{
                        required: true,
                        message: '必填项不能为空',
                        trigger: 'blur'
                    },

                ],

            },
            content1: "", //图文详情略缩图
            content2: "", //资讯信息略缩图
            content3: "", //文件视频封面
            content4: "", //项目案例缩略图
            content5: [], //项目案例精彩瞬间
            content6: [], //项目案例赛事概况
            content7: [], //项目案例场地设备
            content8: [], //项目案例首页推荐图片
            dictImgs: [],
            mode: "transfer", // transfer addressList
            fromData: [{
                id: "1",
                pid: 0,
                label: "一级 1",
                children: [{
                        id: "1-1",
                        pid: "1",
                        label: "二级 1-1",
                        disabled: true,
                        children: []
                    },
                    {
                        id: "1-2",
                        pid: "1",
                        label: "二级 1-2",
                        children: [{
                                id: "1-2-1",
                                pid: "1-2",
                                children: [],
                                label: "二级 1-2-1"
                            },
                            {
                                id: "1-2-2",
                                pid: "1-2",
                                children: [],
                                label: "二级 1-2-2"
                            }
                        ]
                    }
                ]
            }, ],
            toData: [],
            title: ['请选择', '已选择']
        }
    },

    methods: {

        // 切换模式 现有树形穿梭框模式transfer 和通讯录模式addressList
        changeMode() {
            if (this.mode == "transfer") {
                this.mode = "addressList";
            } else {
                this.mode = "transfer";
            }
        },
        // 监听穿梭框组件添加
        add(fromData, toData, obj) {
            // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
            // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
            console.log("fromData:", fromData);
            console.log("toData:", toData);
            console.log("obj:", obj);
        },
        // 监听穿梭框组件移除
        remove(fromData, toData, obj) {
            // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
            // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
            console.log("fromData:", fromData);
            console.log("toData:", toData);
            console.log("obj:", obj);
        },

        getimgsDict(e, number) {
            this.dictImgs[number].imgs = e
        },
        getimgs(e, number) {
            switch (number) {
                case 1:
                    this.content1 = e
                    break
                case 2:
                    this.content2 = e
                    break
                case 3:
                    this.content3 = e
                    break
                case 4:
                    this.content4 = e
                    break
                case 5:
                    this.content5 = e
                    break
                case 6:
                    this.content6 = e
                    break
                case 7:
                    this.content7 = e
                    break
                case 8:
                    this.content8 = e

            }

        },
        getFileUrl(url) {
            this.dataForm.content = url
        },

        emitTree(tree) {

            this.dataForm.parentName = tree.name
            this.dataForm.columnId = tree.id
            this.$nextTick(() => {
                this.showTree = false
                this.$refs['dataForm'].clearValidate();
            })

        },
        selectMenu(id, name) {

            this.showTree = true
            this.$nextTick(() => {
                this.$refs['vueTree'].getMenus(id, name);

            })
        },

        async init(tree, row) {
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
            let res6 = await sysService.getProjectCase()
            if (res6 && res6.data.code == 0) {
                this.dict.projectCase = res6.data.dictList
                this.dict.projectCase.forEach(val => {
                    this.dictImgs.push({
                        itemCode: val.itemCode,
                        itemName: val.itemName,
                        imgs: []
                    })
                })

            }
            this.visible = true
            this.$nextTick(async () => {

                this.$refs['dataForm'].resetFields();

                if (!!row) {
                    let res = await sysService.contentInfo(row.id)

                    if (res && res.data.code == 0) {
                        this.dataForm = res.data.content
                        // this.dataForm.hasSeo = res.data.content.hasSeo.toString()
                        this.dataForm.parentName = res.data.content.columnName;
                        // if (!!this.dataForm.abstractText) {
                        //     this.dataForm.abstractText = this.dataForm.abstractText.replace(/<br\/>/g, '\n').replace(/&nbsp;/g, ' ');
                        // }
                        if (this.dataForm.type) {

                            if (this.dataForm.type == '01') {
                                this.content1 = this.dataForm.contentImgs[0].imgPath;

                            } else if (this.dataForm.type == '02') {
                                this.model1 = {
                                    author: null,
                                    source: null
                                };

                                let attrs = this.dataForm.contentAttrs;
                                for (let i = 0; i < attrs.length; i++) {
                                    if (attrs[i].attrName == 'articleAuthor') {
                                        this.model1.author = attrs[i].attrValue;
                                    } else if (attrs[i].attrName == 'articleSource') {
                                        this.model1.source = attrs[i].attrValue;
                                    }
                                }

                                this.content2 = this.dataForm.contentImgs[0].imgPath;

                            } else if (this.dataForm.type == '03') {
                                let attrs = this.dataForm.contentAttrs;
                                for (let i = 0; i < attrs.length; i++) {
                                    if (attrs[i].attrName == 'fileSuffix') {
                                        this.model3.suffix = attrs[i].attrValue;
                                    }
                                }
                                this.content3 = res.data.content.videoThumnail
                            } else if (this.dataForm.type == '04') {
                                this.model2 = {};
                                let attrs = this.dataForm.contentAttrs;
                                for (let i = 0; i < attrs.length; i++) {
                                    if (attrs[i].attrName == 'caseYear') {
                                        this.model2.yearSelect = attrs[i].attrValue;
                                    } else if (attrs[i].attrName == 'caseMatch') {
                                        this.model2.matchType = attrs[i].attrValue;
                                    }
                                }
                                let imgs = this.dataForm.contentImgs
                                this.dictImgs = []
                                this.dict.projectCase.forEach(item => {

                                    this.dictImgs.push({
                                        itemCode: item.itemCode,
                                        itemName: item.itemName,
                                        imgs: imgs.filter(val => val.imgType == item.itemCode).map(val => val.imgPath)
                                    })

                                })

                                setTimeout(f => {
                                    for (let i = 0; i < imgs.length; i++) {

                                        if (imgs[i].imgType == 'thumbnail') {

                                            this.content4 = imgs[i].imgPath

                                        } else

                                        if (imgs[i].imgType == 'caseIndex') {

                                            this.content8.push(imgs[i].imgPath)
                                            console.log(this.content8)
                                        }

                                    }
                                });
                            }
                        }

                    }

                } else {

                    if (!!tree) {
                        this.dataForm.columnId = tree.id,
                            this.dataForm.parentName = tree.name
                    } else {
                        Object.assign(this.$data.dataForm, this.$options.data().dataForm)

                    }
                }

            })
        },
        //关闭弹窗
        close() {
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields();
                Object.assign(this.$data, this.$options.data())
            })

        },
        // 表单提交
        dataFormSubmit() {
            if (this.dataForm.type == '01' || this.dataForm.type == '02' || this.dataForm.type == '04') {
                if (this.dataForm.contentType == '01') {
                    this.dataForm.content = this.$refs.editor.ue.getContent().replace("<p>", "").replace("</p>", "").trim();
                } else if (this.dataForm.contentType == '02') {
                    this.dataForm.content = this.$refs.editor.ue.getContentTxt();
                } else if (this.dataForm.contentType == '03') {
                    this.dataForm.content = this.$refs.editor.ue.getContent().replace("<p>", "").replace("</p>", "").trim();
                } else if (this.dataForm.contentType == '04') {
                    this.dataForm.content = this.$refs.editor.ue.getPlainTxt();
                }
            } else {

                //视频封面
                this.dataForm.videoThumnail = this.content3
            }

            // if (!!this.dataForm.abstractText) {
            //     this.dataForm.abstractText = this.dataForm.abstractText.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')
            // }
            //副属性
            if (this.dataForm.type == '01') {
                //普通图文
                //扩展属性
                this.dataForm.contentAttrs = [];

                //图片属性
                this.dataForm.contentImgs = [{
                    contentId: this.dataForm.id,
                    imgType: 'thumbnail',
                    imgPath: this.content1
                }];
            } else if (this.dataForm.type == '02') {
                //资讯
                //扩展属性
                this.dataForm.contentAttrs = [{
                    contentId: this.dataForm.id,
                    attrName: 'articleAuthor',
                    attrValue: this.model1.author
                }, {
                    contentId: this.dataForm.id,
                    attrName: 'articleSource',
                    attrValue: this.model1.source
                }];

                //图片属性
                this.dataForm.contentImgs = [{
                    contentId: this.dataForm.id,
                    imgType: 'thumbnail',
                    imgPath: this.content2
                }];
            } else if (this.dataForm.type == '03') {
                if (!isBlank(this.model3.suffix)) {
                    this.dataForm.contentAttrs = [{
                        contentId: this.dataForm.id,
                        attrName: 'fileSuffix',
                        attrValue: this.model3.suffix
                    }];
                } else {
                    this.dataForm.contentAttrs = [];
                }
            } else if (this.dataForm.type == '04') {
                //项目案例
                //扩展属性
                this.dataForm.contentAttrs = [{
                    contentId: this.dataForm.id,
                    attrName: 'caseYear',
                    attrValue: this.model2.yearSelect
                }, {
                    contentId: this.dataForm.id,
                    attrName: 'caseMatch',
                    attrValue: this.model2.matchType
                }];

                //图片属性
                this.dataForm.contentImgs = [{
                    contentId: this.dataForm.id,
                    imgType: 'thumbnail',
                    imgPath: this.content4
                }];
                this.dictImgs.forEach(val => {
                    val.imgs.forEach(item => {
                        this.dataForm.contentImgs.push({
                            contentId: this.dataForm.id,
                            imgType: val.itemCode,
                            imgPath: item
                        })
                    })

                })

                if (this.content8.length > 0) {
                    let caseIndex = this.content8.map(v => {
                        return {
                            contentId: this.dataForm.id,
                            imgType: 'caseIndex',
                            imgPath: v.imgPath ? v.imgPath : v
                        };
                    });
                    this.dataForm.contentImgs.push(...caseIndex);
                }

            } else {
                this.dataForm.contentAttrs = [];
                this.dataForm.contentImgs = [];
                this.dataForm.contentTags = [];
            }
            // if (this.dataForm.dataForm == '0') {
            //     this.dataForm.seoTitle = "",
            //         this.dataForm.seoKeywords = "",
            //         this.dataForm.seoDescription = ""
            // }
            this.$refs['dataForm'].validate(async (valid) => {

                if (valid) {
                    let data
                    if (!!this.dataForm.id) {

                        data = await sysService.contentUpdate(this.dataForm)
                    } else {

                        data = await sysService.contentSave(this.dataForm)
                    }

                    if (data && data.data.code === 0) {
                        this.$message.success("操作成功")
                        Object.assign(this.$data, this.$options.data())
                        this.$emit('refreshDataList')

                    } else {
                        this.$message.error(data.data.msg)
                    }

                }
            })
        },

    }
}
</script>

<style lang="scss" scoped>
.img-ul-div {
    width: 780px;
    margin: 0;
    padding: 0;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: inherit;

    display: flex;
    display: -webkit-flex;

    flex-direction: row;
    flex-wrap: wrap;

    img {
        width: 150px;
    }
}

.quill-editor {
    width: 750px;

    // overflow-y: scroll;

    /deep/ .ql-container {
        height: 400px;
    }
}
</style>
