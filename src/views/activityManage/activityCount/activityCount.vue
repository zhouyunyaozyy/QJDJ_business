<template>
  <div class='activityCount'>
    <div :class="className" :id="id" :style="{height:height,width:width, display: 'inline-block'}"></div>
    <div style="width: 30%;display: inline-block;float: right; ">
      <el-form ref="form" :model="form" label-width="120px" label-position="right">
        <el-form-item label="累计分享数">
          <span>{{form.total_share_number}}</span>
        </el-form-item>
        <el-form-item label="页面打开数">
          <span>{{form.total_open_page}}</span>
        </el-form-item>
        <el-form-item label="参与人数">
          <span>{{form.total_participate_number}}</span>
        </el-form-item>
        <el-form-item label="分享转化率">
          <span>{{form.share_rate}}%</span>
        </el-form-item>
        <el-form-item label="平均成功转化率">
          <span>{{form.share_success_rate}}%</span>
        </el-form-item>
      </el-form>
    </div>
    <el-table
    :data="tableData"
    style="width: 100%" border>
      <el-table-column
        label="活动分享统计">
        <el-table-column
          prop="user_id"
          label="用户id"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="share_time"
          label="分享时间"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span>{{$formatTime(scope.row.share_time)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="share_number"
          label="分享次数"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="open_page"
          label="页面打开数"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="share_success"
          label="参与人数"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="share_golden"
          label="累计金贝数"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="su_conversion_rate"
          label="分享成功转化率"
          min-width="120" align='center'>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination
    layout="prev, pager, next"
    :total="total" :page-size="20" @current-change="handleCurrentChange"
      :current-page.sync="start">
  </el-pagination>
  </div>
  
</template>

<script>
import echarts from 'echarts'
import resize from './resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '70%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
      form: {
        total_share_number: '',
        total_open_page: '',
        total_participate_number: '',
        share_rate: '',
        share_success_rate: '',
      },
      shareLineData: [],
      joinLineData: [],
      xData: [],
      
      tableData: [],
      start: 1,
      total: 0,
    }
  },
  created () {
    this.getTableData()
    this.$axios({
      type: 'post',
      url: '/active/overallCount',
      data: {start_time: 1533052800, end_time: 1536163200},
      fuc: (res) => {
//        if (res.code )
        console.log(res.data.share_data)
        
        this.form = res.data.share_data
        
//        参与人数数据重组
        let arr = []
        for (let val of res.data.participate_number_data) {
          this.xData.push(val.participate_number_time)
          arr.push(val.participate_number)
        }
        this.joinLineData = arr
//        分享数数据重组
        let arr2 = []
        for (let val of res.data.share_number_data) {
          arr2.push(val.share_number)
        }
        this.shareLineData = arr2
        console.log(this.joinLineData, this.shareLineData)
        this.initChart()
      }
    })
  },
  mounted() {
//    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getTableData () {
      this.$axios({
        type: 'post',
        url: '/active/activeShareCount',
        data: {page: this.start, page_size: 20},
        fuc: (res) => {
          this.tableData = res.data.data
          this.total = res.data.total
        }
      })
    },
    handleCurrentChange (val) {
      this.start = val 
      this.getTableData()
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      
      var joinLineData = this.joinLineData
      var shareLineData = this.shareLineData
      var xData = this.xData

      console.log(joinLineData, shareLineData)
      
      this.chart.setOption({
        backgroundColor: '#394056',
        title: {
          top: 20,
          text: '活动整体分享统计',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#F1F1F3'
          },
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          top: 20,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: ['分享数', '参与人数'],
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
          }
        },
        grid: {
          top: 100,
          left: '3%',
          right: '4%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          data: xData
//          data: ['13:00', '13:05', '13:10', '13:15', '13:20', '13:25', '13:30', '13:35', '13:40', '13:45', '13:50', '13:55']
        }],
        yAxis: [{
          type: 'value',
          name: '(人次)',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14
            }
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: [{
          name: '分享数',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(137, 189, 27, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(137, 189, 27, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(137,189,27)',
              borderColor: 'rgba(137,189,2,0.27)',
              borderWidth: 12

            }
          },
          data: shareLineData
        }, {
          name: '参与人数',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(0, 136, 212, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(0, 136, 212, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(0,136,212)',
              borderColor: 'rgba(0,136,212,0.2)',
              borderWidth: 12

            }
          },
          data: joinLineData
        }
//        }, {
//          name: 'CUCC',
//          type: 'line',
//          smooth: true,
//          symbol: 'circle',
//          symbolSize: 5,
//          showSymbol: false,
//          lineStyle: {
//            normal: {
//              width: 1
//            }
//          },
//          areaStyle: {
//            normal: {
//              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
//                offset: 0,
//                color: 'rgba(219, 50, 51, 0.3)'
//              }, {
//                offset: 0.8,
//                color: 'rgba(219, 50, 51, 0)'
//              }], false),
//              shadowColor: 'rgba(0, 0, 0, 0.1)',
//              shadowBlur: 10
//            }
//          },
//          itemStyle: {
//            normal: {
//              color: 'rgb(219,50,51)',
//              borderColor: 'rgba(219,50,51,0.2)',
//              borderWidth: 12
//            }
//          },
//          data: [220, 182, 125, 145, 122, 191, 134, 150, 120, 110, 165, 122]
//        }]
        ]
      })
    }
  }
}
</script>

<style scoped="true">
  .activityCount{
    margin: 10px 20px 20px;
    overflow: hidden;
  }
  
</style>