<template>
<el-dialog :close-on-click-modal="false" :visible.sync="visible" top="5vh" append-to-body max-height="668px" width="50%">

    <el-row class="tac" :gutter="20" style="height:666px">
        <el-col :span="5" class="of-hide">
            <div>
                <el-menu default-active="-1" @select="groupClick" class="el-menu-vertical-demo">
                    <el-menu-item index="-1">
                        <span class="menu-span-location">全部</span>
                    </el-menu-item>
                    <el-menu-item index="0">
                        <span class="menu-span-location">未分组</span>
                    </el-menu-item>
                    <div style="height:555px" class=" of-auto">
                        <el-menu-item v-for="item in groupList" :key="item.id" :index="item.id+''">

                            <i class="el-icon-edit font14" @click.stop="addGroup(item.id,item.name)" v-if="isAuth('componet:imagegroup:update')"></i>

                            <span class="menu-span-location">{{item.name}}</span>

                            <i class="el-icon-delete font14" @click.stop="delGroup(item.id)" v-if="isAuth('componet:imagegroup:delete')"></i>

                        </el-menu-item>
                    </div>
                </el-menu>
            </div>
            <el-menu text-color="#409EFF" @select="addGroup" class="el-menu-vertical-demo">

                <el-menu-item v-if="isAuth('componet:imagegroup:save')">
                    <template>
                        <el-button type="text">新增分组</el-button>
                    </template>
                </el-menu-item>

            </el-menu>
        </el-col>
        <el-col :span="19" class="h-100 of-hide">
            <div>
                <el-container>
                    <el-header>
                        <el-row style="    display: flex;align-items: center;">
                            <el-col :span="8">

                                <el-dropdown trigger="click" @command="updateImage" v-if="isAuth('componet:imagedepository:updategroup')">
                                    <el-button size="medium" type="primary">
                                        移动至<i class="iconfont icon-jiantou2" style="margin-left: 5px"></i>
                                    </el-button>
                                    <el-dropdown-menu style="max-height: 50vh;overflow: auto">
                                        <el-dropdown-item v-for="item in groupList" :key="item.id" :command="item.id">{{item.name}}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>

                                <el-button type="danger" plain size="medium" @click="delImage" v-if="isAuth('componet:imagedepository:delete')">删除</el-button>

                            </el-col>
                            <el-col :span="10" :offset="0">
                                <div>
                                    <span style="margin-right:10px;">是否开启上传水印:</span>
                                    <el-switch v-model="selectValue" @change='changeSwitch'> </el-switch>
                                    <el-popover placement="bottom" v-model="visibleProp">
                                        <el-radio-group v-model="selectLogoType">
                                            <el-radio :label="dict.itemCode" v-for="dict of radioGroup" :key="dict.id">{{dict.itemName}}</el-radio>

                                        </el-radio-group>
                                        <div style="text-align: center; margin: 0;margin-top:20px">
                                            <el-button size="mini" type="text" @click="celLogoType">取消</el-button>
                                            <el-button type="primary" size="mini" @click="saveLogoType">确定</el-button>
                                        </div>
                                        <span style="margin-left:10px;" slot="reference">更多配置</span>

                                    </el-popover>
                                </div>
                            </el-col>
                            <el-col :span="2" :offset="2">

                                <el-upload class="upload-demo" action="" :http-request="uploadFile" :show-file-list="false" accept="image/*" :multiple="true">
                                    <el-button size="medium" plain type="primary">上传<i class="iconfont icon-shangchuan" style="margin-left: 5px"></i></el-button>
                                </el-upload>

                            </el-col>

                        </el-row>
                    </el-header>
                    <el-main>
                        <div style="height: 69vh;overflow: auto;">
                            <ul class="img-ul">
                                <li v-for="(item,index) in imageList" :key="item.id" @click="chooseUl(item,item.imgPath,index)">
                                    <div class="img-div"><img :src="item.imgPath"></div>
                                    <div class="title" @click.stop="changeInput(item)" @mouseleave.stop="blurInput(item)">
                                        <el-input v-if='item.show' type="text" class="modify-name" v-model="item.nickName" @change="submitInput($event,item,index)" />
                                        <span v-else>{{item.nickName}}</span>
                                    </div>
                                    <div :class="item.checked==true?'mask':'mask-hidden'">

                                        <img :src="chooseImg">
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </el-main>

                </el-container>
            </div>
        </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="cancel">取消</el-button>
        <el-button type="primary" size="medium" @click="submit">确认</el-button>
    </span>

</el-dialog>
</template>

<script>
import commentService from "../api/commentService"
import axios from "axios";
import chooseImg from "@/assets/img/chose.png"
import sysService from "./../api/sysService"
export default {
    data() {
        return {
            visible: false,
            url: 'file/upload/depository/',
            group: -1,
            groupList: [],
            imageList: [],
            choose: [],
            token: "",
            selectNumber: '',
            chooseImg: chooseImg,
            nickName: "",
            selectIndex: 0,
            imageListOld: [],
            selectValue: true,
            visibleProp: false,
            radioGroup: [],
            selectLogoType: null,
            configData: null,
            selectGroup: 0
        };
    },
    async created() {

        this.token = JSON.parse(sessionStorage.getItem("token"))

        this.getConfigPainter()
        this.reloadGroup();
        this.reloadImage(-1);

    },
    mounted() {},
    watch: {},
    methods: {
        async getConfigPainter() {
            let res = await sysService.configPainter()

            if (res && res.data.code == 0) {
                this.configData = res.data.config
                this.configData.type == '1' ? this.selectValue = true : this.selectValue = false

            } else {
                this.$message.error(res.data.msg)
            }
            let res1 = await sysService.getNetLogo()
            if (res1 && res1.data.code == 0) {

                this.radioGroup = res1.data.dictList
                this.selectLogoType = this.configData.currentLogo
            }
        },
        celLogoType() {
            this.selectLogoType = this.configData.currentLogo
            this.visibleProp = false
        },
        async saveLogoType() {
            let res = await sysService.configPainterSave({
                type: this.configData.type,
                logoParam: this.configData.logoParam,
                currentLogo: this.selectLogoType
            })
            if (res && res.data.code == 0) {
                this.$message.success('操作成功')
                this.visibleProp = false
            } else {
                this.$message.error(res.data.msg)

            }

        },
        async changeSwitch(e) {
            this.selectValue = e
            let res = await sysService.configPainterSave({
                type: this.selectValue ? '1' : '0',
                logoParam: this.configData.logoParam,
                currentLogo: this.configData.currentLogo,
            })
            if (res && res.data.code == 0) {
                this.$message.success('操作成功')
            } else {
                this.$message.error(res.data.msg)
                this.selectValue = !e
            }

        },
        uploadFile(file) {
            this.formDate = new FormData();

            let config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "token": JSON.parse(sessionStorage.getItem("token"))
                }
            };
            this.formDate.append("file", file.file);

            this.uploadLoding = true
            axios.post(`${this.appConfig.SERVER_URL}/componet/imagedepository/upload/${this.group<1?0:this.group}`, this.formDate, config)
                .then(res => {
                    this.uploadLoding = false

                    if (res.data.code == 0) {

                        this.imageList = [...[res.data.data], ...this.imageList]

                        this.$message.success('上传成功');

                    } else {
                        this.$message.error('上传失败');

                    }

                })
                .catch(res => {
                    this.uploadLoding = false
                });
        },
        isBlank(value) {
            if (value === 0) {
                return false;
            }
            return !value || !/\S/.test(value)
        },
        //   
        init(type) {
            this.selectNumber = type
            // this.selectIndex = index
            this.visible = true
            this.getConfigPainter()
            this.reloadGroup();
            this.reloadImage(-1);

        },
        groupClick(index) {
            this.group = index;
            this.choose = [];

            this.selectGroup = Number(index)
            this.reloadImage(this.group);
        },
        async reloadGroup() {

            let res = await commentService.imagegroupList({})

            if (res && res.data.code == 0) {
                this.groupList = res.data.data;
            }

        },
        /**新增、修改图片组*/
        addGroup(i, n) {
            let _this = this;
            _this.$prompt('请输入分组名称', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,
                inputValue: n ? n : "",
                inputValidator: function (value) {
                    if (_this.isBlank(value) || value.length > 12) {
                        return false;
                    }
                },
                inputErrorMessage: '名称不能为空且长度需小于13位'
            }).then(async (_ref) => {

                let value = _ref.value;
                let res
                !!i ?
                    res = await commentService.imagegroupUpdate({
                        'name': value,
                        'id': i,
                    }) :
                    res = await commentService.imagegroupSave({
                        'name': value
                    })

                if (res && res.data.code == 0) {
                    if (!!i) {

                        for (let j = 0; j < _this.groupList.length; j++) {
                            let _value = _this.groupList[j];
                            if (_value.id == i) {
                                Object.assign(_this.groupList[j], res.data.data)
                                break;
                            }
                        }

                    } else {
                        _this.groupList.push(res.data.data);
                    }

                    this.$message.success(!!i ? '修改成功' : "添加成功");
                } else {
                    this.$message.error(
                        r.datra.msg
                    );
                }

            }).catch((e) => {});
        },
        /**删除图片组 */
        delGroup(i) {
            let _this = this;
            _this.$confirm('此操作将永久删除该分组, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async (_ref) => {

                let r = await commentService.imagegroupDel(i)

                if (r.data.code == 0) {
                    for (let j = 0; j < this.groupList.length; j++) {
                        let _value = this.groupList[j];
                        if (_value.id == i) {
                            this.groupList.splice(j, 1);
                            break;
                        }
                    }
                    if (this.group == i) {
                        this.group = 0;
                    }
                    _this.$message.success('删除成功!');
                } else {
                    _this.$message.error(r.data.msg);
                }

            }).catch(() => {
                this.$message.info('已取消删除');
            });
        },
        async reloadImage(i) {
            let res = await commentService.imagedepositoryList(i)

            if (res.data.code == 0) {
                this.imageList = res.data.data
            } else {
                this.$message.error(res.data.msg);
            }

        },
        //移动图片组
        async updateImage(command) {

            let _this = this;
            if (this.choose.length == 0) {
                this.$message.warning('未选择图片');
            } else {

                let res = await commentService.imagedepositoryUpdate(command, this.choose.map(val => val.id))

                if (res.data.code == 0) {
                    for (let j = this.imageList.length - 1; j >= 0; j--) {
                        let _value = this.imageList[j];
                        for (let k = 0; k < this.choose.length; k++) {
                            let _ref = this.choose[k];
                            if (_value.id == _ref.id) {
                                this.imageList.splice(j, 1);
                                break;
                            }
                        }
                    }
                    this.choose = [];

                    this.$message.success('操作成功!');
                } else {
                    this.$message.error(res.data.msg);
                }

            }
        },
        //删除图片
        async delImage() {

            if (this.choose.length == 0) {
                this.$message.warning('未选择图片');
            } else {

                let res = await commentService.imagedepositoryDel(this.choose.map(val => val.id))

                if (res.data.code == 0) {

                    let imgs = this.imageList
                    imgs.forEach((val, index) => {
                        this.choose.forEach(item => {
                            if (item.id == val.id) {
                                imgs.splice(index, 1)
                                Object.assign(imgs.splice(index, 1), this.$data.imageList)
                            }
                        })
                    })
                  
                    this.$message.success('操作成功');
                } else {
                    this.$message.error(res.data.msg);
                }

            }
        },
        cancel() {
            //取消
            this.visible = false

        },
        submit() {
            if (this.choose.length == 0) {
                this.$message.warning('未选择图片');
            } else {
                if (this.selectNumber > 1) {
                    this.$emit('emitImgs', this.choose.map(val => val.imgPath))
                } else {
                    this.$emit('emitImgs', this.choose[this.choose.length - 1].imgPath)
                }
                Object.assign(this.$data, this.$options.data())
            }
        },
        chooseUl(item, p, index) {
            !item.checked ? item.checked = !item.checked : item.checked = false
            this.choose = this.imageList.filter(val => val.checked == true)

            this.$forceUpdate()

        },
        changeInput(item) {

            item.show = true

            this.$forceUpdate()

        },
        blurInput(item) {

            item.show = false

            this.$forceUpdate()
        },
        async submitInput(e, item, index) {

            let res = await commentService.imagedepositoryUpdateOne({
                id: item.id,
                name: this.imageList[index].nickName
            })
            if (res.data.code == 0) {
                this.imageList[index].nickName = item.nickName;
                this.$message.success('修改图片名称成功');
            } else {
                this.$message.error(res.data.msg);
            }

        }
    }
}
</script>

<style lang="scss" scoped>
/dee/ .el-dialog__body {
    overflow-y: scroll;
}

.h-100 {
    height: 100%;
}

.of-auto {
    overflow: auto;
}

.of-hide {
    overflow: hidden;
}

.font14 {
    font-size: 14px;
}

.menu-span-location {
    margin-left: 10px;
}

.img-ul li {
    width: 21%;
    padding: 1.8% 1.5%;
    margin: 1% 1.5%;
    display: inline-block;
    border: 1px solid rgba(0, 0, 0, 0.05);
    cursor: pointer;
    position: relative;
    transition: all .5s;
    border-radius: 8px;
}

.mask-hidden {
    display: none;
}

.mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.img-ul li:hover {
    border: 1px solid deepskyblue;
    border-radius: 8px;
}

.img-ul li .title {
    font-size: 12px;
    text-align: center;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-top: 6px;
}

.img-div {
    width: 100%;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #333;
}

.img-div img {
    max-width: 100%;
    max-height: 100%;
}

.el-menu-item {
    transition: all .4s;
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 0 !important;
}

.el-menu-item i {
    display: none;
    cursor: pointer;
}

.el-menu-item i:last-child {
    position: absolute;
    right: 21px;
}

.el-menu-item:hover i {
    display: inline-table;
}

.el-menu-item:hover {
    .menu-span-location {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100px;
    }
}

ul.el-menu {
    overflow: auto;
}

.modify-name {
    background: white;
    text-align: center;
    transition: all .5s;
    border: 1px solid rgba(0, 0, 0, 0);
    padding: 4px 0;
    border-radius: 3px;
    padding: 0;

    /deep/ .el-input__inner {
        height: 20px;
    }
}

.modify-name:hover {
    border: 1px solid rgba(0, 0, 0, 0.15);
}

.modify-name-border {
    border: 1px solid rgba(0, 0, 0, 0.15);
}
</style>
