<template>
<div class="col-sm-12 col-lg-12 main" id="rrapp" v-cloak>
    <el-row :gutter="20">
        <el-col :span="6">
            <div class="row no-padding panel-blue">
                <div class="col-sm-3 col-lg-5 widget-left">

                    <!-- <i class='el-icon-s-custom glyphicon'></i> -->
                    <img :src="require('@/assets/img/content.png')" />
                    <div class="text-muted me-text">今日新增内容数</div>
                </div>
                <div class="col-sm-9 col-lg-7 widget-right flex-y-center">
                    <div>
                        <div class="large">{{homeData.contentToday}}</div>
                        <div class="text-muted me-text" style="font-size:15px">累计:{{homeData.contentAll}}</div>
                    </div>
                </div>
            </div>
        </el-col>
        <el-col :span="6">
            <div class="row no-padding panel-red ">
                <div class="col-sm-3 col-lg-5 widget-left">
                    <img :src="require('@/assets/img/product.png')" />
                    <!-- <i class='el-icon-s-custom glyphicon'></i> -->
                    <!-- <em class="glyphicon glyphicon-comment glyphicon-l"></em> -->
                    <div class="text-muted me-text">今日新增产品数</div>
                </div>
                <div class="col-sm-9 col-lg-7 widget-right flex-y-center">
                    <div>
                        <div class="large">{{homeData.productToday}}</div>
                        <div class="text-muted me-text" style="font-size:15px">累计: {{homeData.productAll}}</div>
                    </div>
                </div>
            </div>
        </el-col>

        <el-col :span="6">
            <div class="row no-padding panel-teal">
                <div class="col-sm-3 col-lg-5 widget-left">
                    <!-- <i class='el-icon-s-custom glyphicon'></i> -->
                    <img :src="require('@/assets/img/message.png')" />
                    <!-- <em class="glyphicon glyphicon-book glyphicon-l"></em> -->
                    <div class="text-muted me-text">今日留言数</div>
                </div>
                <div class="col-sm-9 col-lg-7 widget-right flex-y-center">
                    <div>
                        <div class="large">{{homeData.leaveMessageAdd}}</div>
                        <div class="text-muted me-text" style="font-size:15px">累计已处理数: {{homeData.leaveMessageDone}}</div>
                    </div>
                </div>
            </div>
        </el-col>
        <el-col :span="6">
            <div class="row no-padding panel-orange">
                <div class="col-sm-3 col-lg-5 widget-left">
                    <!-- <i class='el-icon-s-custom glyphicon'></i> -->
                    <img :src="require('@/assets/img/pv.png')" />
                    <!-- <em class="glyphicon glyphicon-home glyphicon-l"></em> -->
                    <div class="text-muted me-text">今日新增访问数</div>
                </div>
                <div class="col-sm-9 col-lg-7 widget-right flex-y-center">
                    <div>
                        <div class="large">{{homeData.pvNum}}</div>
                        <div class="text-muted me-text" style="font-size:15px">累计:{{homeData.pvAll}}</div>
                    </div>
                </div>
            </div>
        </el-col>
    </el-row>

    <el-row class='echartBox'>
        <el-col :span="12" class='box'>

            <chart ref="chart" :options="option" :auto-resize="true"></chart>

        </el-col>
        <el-col :span="11" :offset="1" class='box'>

            <chart ref="chart2" :options="option2" :auto-resize="true"></chart>

        </el-col>
    </el-row>

</div>
</template>

<script>
import sysService from "../../api/sysService"
export default {

    data() {
        return {
            a: '-',
            b: '-',
            c: '-',
            d: '-',
            aAll: '-',
            bAll: '-',
            cAll: '-',
            dAll: '-',
            build: {},
            house: {},
            server: {},
            year: 0,
            groupReferer: [],
            groupEngine: [],
            refererList: [],
            engineList: [],
            hourPv: [],
            hourIp: [],
            homeData: {
                contentToday: 0,
                contentAll: 0,
                productToday: 0,
                productAll: 0,
                leaveMessageAdd: 0,
                leaveMessageDone: 0,
                pvNum: 0,
                pvAll: 0,

            },
            option: {
                title: {
                    text: '趋势分析'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['pv统计', 'ip统计']
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {
                            show: true
                        },

                        magicType: {
                            show: true,
                            type: ['line', 'bar']
                        },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                calculable: true,
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    data: ['00:00-00:59', '01:00-1:59', '02:00-02:59', '03:00-03:59', '04:00-04:59',
                        '05:00-05:59', '06:00-06:59', '07:00-07:59', '08:00-08:59', '09:00-09:59',
                        '10:00-10:59', '11:59-11:59', '12:00-12:59', '13:00-13:59', '14:00-14:59',
                        '15:00-15:59', '16:00-16:59', '17:00-17:59', '18:00-18:59',
                        '19:00-19:59', '20:00-20:59', '21:00-21:59', '22:00-22:59', '23:00-23:59'
                    ]
                }],
                yAxis: [{
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} 人'
                    }
                }],
                series: [{
                        name: 'pv统计',
                        type: 'line',
                        data: [0], // this.hourPv,
                        markPoint: {
                            data: [{
                                    type: 'max',
                                    name: '最大值'
                                },
                                {
                                    type: 'min',
                                    name: '最小值'
                                }
                            ]
                        },
                        markLine: {
                            data: [{
                                type: 'average',
                                name: '平均值'
                            }]
                        }
                    },
                    {
                        name: 'ip统计',
                        type: 'line',
                        data: [0], //this.hourIp,
                        markPoint: {
                            data: [{
                                    type: 'max',
                                    name: '最大值'
                                },
                                {
                                    type: 'min',
                                    name: '最小值'
                                }
                            ]
                        },
                        markLine: {
                            data: [{
                                type: 'average',
                                name: '平均值'
                            }]
                        }
                    }
                ]
            },

            option2: {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data: [0], //this.refererList
                },
                series: [{
                        name: '访问来源',
                        type: 'pie',
                        selectedMode: 'single',
                        radius: [0, '30%'],
                        center: ["60%", '50%'],
                        label: {
                            normal: {
                                position: 'inner'
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [0], //this.groupEngine
                    },
                    {
                        name: '浏览器内核',
                        type: 'pie',
                        radius: ['40%', '55%'],
                        center: ["60%", '50%'],
                        label: {
                            normal: {
                                formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                                backgroundColor: '#eee',
                                borderColor: '#aaa',
                                borderWidth: 1,
                                borderRadius: 4,
                                // shadowBlur:3,
                                // shadowOffsetX: 2,
                                // shadowOffsetY: 2,
                                // shadowColor: '#999',
                                // padding: [0, 7],
                                rich: {
                                    a: {
                                        color: '#999',
                                        lineHeight: 22,
                                        align: 'center'
                                    },
                                    // abg: {
                                    //     backgroundColor: '#333',
                                    //     width: '100%',
                                    //     align: 'right',
                                    //     height: 22,
                                    //     borderRadius: [4, 4, 0, 0]
                                    // },
                                    hr: {
                                        borderColor: '#aaa',
                                        width: '100%',
                                        borderWidth: 0.5,
                                        height: 0
                                    },
                                    b: {
                                        fontSize: 16,
                                        lineHeight: 33
                                    },
                                    per: {
                                        color: '#eee',
                                        backgroundColor: '#334455',
                                        padding: [2, 4],
                                        borderRadius: 2
                                    }
                                }
                            }
                        },
                        data: [0] //this.groupReferer
                    }
                ]
            }
        }
    },
    created() {
        this.getTop();

    },
    methods: {

        async getTop() {

            let res = await sysService.blankList()

            if (res && res.data.code == 0) {
                this.homeData = res.data.data
                this.a = res.data.data.contentToday;
                this.b = res.data.data.pvNum;
                this.c = res.data.data.applyNum;
                this.d = res.data.data.leaveMessageAll;
                this.aAll = res.data.data.contentAll;
                this.bAll = res.data.data.pvAll;
                this.cAll = res.data.data.applyAll;
                this.dAll = res.data.data.leaveMessageNum;

                this.groupReferer = res.data.data.groupReferer;
                this.groupEngine = res.data.data.groupEngine;
                // this.engineList = res.data.data.engineList;
                this.refererList = res.data.data.refererList;
                this.hourIp = res.data.data.hourIp;
                this.hourPv = res.data.data.hourPv;
                this.option.series[0].data = this.hourPv
                this.option.series[1].data = this.hourIp
                this.option2.legend.data = this.refererList
                this.option2.series[0].data = this.groupEngine
                this.option2.series[1].data = this.groupReferer

            } else {
                this.$message.error(res.data.msg)
            }

        },

    }

}
</script>

<style lang="scss" scoped>
.large {
    margin-bottom: 10px;
}

.mod-home {
    line-height: 1.5;
}

.widget-left {
    height: 100px;
    padding-top: 15px;
    text-align: center;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;

}

.panel-blue .widget-left {
    background: #30a5ff;
    color: #fff;
}

.panel-orange .widget-left {
    background: #ffb53e;
    color: #fff;
}

.panel-teal .widget-left {
    background: #1ebfae;
    color: #fff;
}

.panel-red .widget-left {
    background: #f9243f;
    color: #fff;
}

.no-padding {
    display: flex;
    align-items: center;
    width: 368px;
    height: 100px;
    background: #fff;

    img {
        width: 40px;
        margin-bottom: 10px;
    }
}

.widget-left {
    width: 150px;
}

.glyphicon {
    position: relative;
    top: 1px;
    display: inline-block;
    width: 42px;
    height: 42px;
    font-family: 'Glyphicons Halflings';
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
}

.widget-right {
    width: 170px;
    padding: 20px;
}

.main {
    background: #f5f5f5;
    padding: 20px;
}

.echartBox {
    margin-top: 40px;

    .box {
        background: #fff;
        padding: 20px;
    }
}
</style>
