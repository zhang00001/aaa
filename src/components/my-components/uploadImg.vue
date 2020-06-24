<template>
<div>
    <el-button v-show='showBtn' class="btn" type="primary" @click="selectImg(type)">上传图片</el-button>
    <div v-if="type ==1&&imgValue">
        <div class="img-div">
            <img :src="imgValue" alt="">
            <i class="el-icon-circle-close" @click="delImg"></i>
        </div>
    </div>

    <div v-if="type>1&&imgValue&&imgValue.length" class="flex_wrap">
        <div class="img-div" v-for="(item,i) in imgValue" :key="item.id">
            <img :src="item" alt="">
            <i class="el-icon-circle-close" @click="delImg(i)"></i>
        </div>
    </div>

    <image-wall v-if="showImagesVisible" :type="type" ref="showImages" @emitImgs='emitImgs'></image-wall>
</div>
</template>

<script>
import ImageWall from "@/components/imageWall.vue"
export default {
    name: 'uploadImg',
    components: {
        ImageWall,
    },
    props: {
        type: {
            type: Number
        },
        imgData: {
            type: [Array, String]
        },
        isShow: {
            type: Boolean
        }
    },

    data() {
        return {
            showImagesVisible: false,
            imgValue: null,
            visible: true,
            showBtn: true,
        }
    },
    created() {
		this.imgValue = this.imgData
	 
        this.showBtn = this.isShow?!this.isShow:true

    },
    watch: {
        isShow(newValue) {
            this.$nextTick(() => {
                this.showBtn = !newValue
            })

        },
        //监听属性图片数据的变化
        imgData(n, o) {
     
            if (n) {
                if (this.type == 1) {
                    this.imgValue = n;
                    console.log(this.imgValue)
                } else {
                    if (this.imgValue == null) {
                        this.imgValue = [];
                    }
                    if (this.imgValue == null) {
                        this.imgValue = [];
                    }
                    if (n instanceof Array) {
                        this.imgValue = n;
                    } else {
                        this.imgValue.push(n);
                    }
                }

            } else {
                this.imgValue = null;
            }

        }
    },
    methods: {
        delImg(i) {
            if (this.type == 1) {
                //单图删除处理
                this.imgValue = '';
            } else {
                //多图删除处理
                this.imgValue.splice(i, 1);
            }
            this.backData();
        },
        //选择上传图片
        selectImg(type) {
            this.showImagesVisible = true
            this.$nextTick(() => {
                this.$refs.showImages.init(type)
            })
        },
        //回调图片数据
        emitImgs(images) {
            if (images) {
                if (this.type == 1) {
                    this.imgValue = images
                } else {
                    if (this.imgValue == null) {
                        this.imgValue = [];
                    }
                    if (this.imgValue == null) {
                        this.imgValue = [];
                    }
                    this.imgValue = [...this.imgValue, ...images];
                }
                this.backData()
            }
        },
        //回调图片数据
        backData() {
            this.$emit('getImg', this.imgValue);
        }
    }

}
</script>

<style scoped>
.btn {
    margin-bottom: 15px;
}

.img-div {
    position: relative;
    display: inline-block;
    background-color: #f1f1f1;
    height: 100px;
    min-width: 5px;
    border: 1px solid #f1f1f1;
    margin-right: 10px;
}

.img-div>i {
    position: absolute;
    right: -8px;
    top: -8px;
    color: #CCCCCC;
    font-size: 16px;
    cursor: pointer;
    display: none;
    transition: all .3s;
}

.img-div:hover i {
    display: inherit;
}

.img-div>img {
    height: 100%;
    display: flex;
}

.flex_wrap {
    /* 转为弹性盒模型并自动换行*/
    display: flex;
    flex-wrap: wrap;
}
</style>
