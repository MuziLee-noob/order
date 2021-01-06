<style lang="less" scoped>
@import '../index.less';
</style>
<template>
  <div class="fusion-manage">
    <div class="fusion-header serve">
      <Row class="check-condition clearfix">
        <Form :label-width="80">
          <FormItem label="时间范围" class="mgr">
            <DatePicker
              :options="options"
              :clearable="true"
              placeholder="请选择时间范围"
              @on-change="confirms"
              id="date"
              placement="bottom-end"
              separator="~"
              type="daterange"
              v-model="date"
            ></DatePicker>
          </FormItem>
          <div class="year">
            <div class="fault_span" :class="getClass(1)" @click="getClassHandler(1)" key="1">
              近一周
            </div>
            <div class="fault_span" :class="getClass(2)" @click="getClassHandler(2)" key="2">
              近一个月
            </div>
            <div class="fault_span" :class="getClass(3)" @click="getClassHandler(3)" key="3">
              近三个月
            </div>
            <div class="fault_span" :class="getClass(4)" @click="getClassHandler(4)" key="4">
              近一年
            </div>
          </div>
          <FormItem label="武汉市" class="mgr">
            <Select v-model="region" clearable @on-change="getRegionList">
              <Option v-for="item in arealist" :value="item.value" :key="item.value">
                {{ item.lable }}
              </Option>
            </Select>
          </FormItem>
          <div class="btns">
            <Button @click="exportExcel" class="search">导出数据</Button>
          </div>
        </Form>
      </Row>
    </div>
    <div class="policy-table">
      <div id="main" style="width:1720px; height:450px"></div>
    </div>
    <div class="policy-table" style="margin-top: 10px;">
      <Table :columns="areaColums" :data="areaData" stripe show-summary></Table>
    </div>
  </div>
</template>
<style lang="less" scoped></style>
<script>
import { regionStatics } from '../../../api/login'
import { dateFormat, urlPrefix } from '../../../libs/tools'
import echarts from 'echarts'
let that = null
export default {
  name: 'Echarts',
  data() {
    return {
      date: [],
      activityIndex: 1,
      day: 'week',
      region: '',
      options: {
        disabledDate(date) {
          return date && date.valueOf() >= new Date()
        }
      },
      arealist: [
        {
          value: '江岸区',
          lable: '江岸区'
        },
        {
          value: '江汉区',
          lable: '江汉区'
        },
        {
          value: '硚口区',
          lable: '硚口区'
        },
        {
          value: '汉阳区',
          lable: '汉阳区'
        },
        {
          value: '武昌区',
          lable: '武昌区'
        },
        {
          value: '青山区',
          lable: '青山区'
        },
        {
          value: '洪山区',
          lable: '洪山区'
        },
        {
          value: '东西湖区',
          lable: '东西湖区'
        },
        {
          value: '汉南区',
          lable: '汉南区'
        },
        {
          value: '蔡甸区',
          lable: '蔡甸区'
        },
        {
          value: '江夏区',
          lable: '江夏区'
        },
        {
          value: '黄陂区',
          lable: '黄陂区'
        },
        {
          value: '新洲区',
          lable: '新洲区'
        }
      ],
      areaColums: [
        {
          title: '工单区域',
          key: '工单区域',
          tooltip: true
        },
        {
          title: '工单总数',
          key: '总工单',
          tooltip: true
        },
        {
          title: '待办',
          key: '待办',
          tooltip: true
        },
        {
          title: '已办',
          key: '已办',
          tooltip: true
        },
        {
          title: '超时',
          key: '超时',
          tooltip: true
        }
      ],
      areaData: []
    }
  },
  mounted() {
    // this.date = [this.prevMonth, this.today]
    // this.getEcharts()
    this.getRegionList()
    this.$nextTick(() => {
      this.getEcharts()
    })
    window.onresize = () => {
      if (!this.timer) {
        this.timer = true
        setTimeout(() => {
          this.timer = false
          that.myChart.resize()
        }, 600)
      }
    }
  },
  created() {
    // this.getEcharts()
    // this.getToday()
  },
  methods: {
    getClass(i) {
      return {
        active: i === this.activityIndex
      }
    },
    getClassHandler(i) {
      this.activityIndex = i
      this.date = []
      this.date[0] = ''
      this.date[1] = ''
      if (this.activityIndex === 1) {
        this.day = 'week'
      } else if (this.activityIndex === 2) {
        this.day = 'month'
      } else if (this.activityIndex === 3) {
        this.day = 'month'
      } else {
        this.day = 'quarter'
      }
      this.getRegionList()
    },
    confirms() {
      this.day = ''
      this.activityIndex = 0
      this.getRegionList()
    },
    // 导出数据
    exportExcel() {
      window.location.href = `${urlPrefix}/api/statistics/exportRegion`
    },
    // 获取列表数据
    getRegionList() {
      if (typeof this.date[0] === 'object') {
        this.date[0] = dateFormat('YYYY-mm-dd', this.date[0])
      }
      if (typeof this.date[1] === 'object') {
        this.date[1] = dateFormat('YYYY-mm-dd', this.date[1])
      }
      let params = {
        startTime: this.date[0],
        endTime: this.date[1],
        day: this.day,
        region: this.region === undefined ? '' : this.region
      }
      regionStatics(params).then(res => {
        if (res.state === 1) {
          this.areaData = res.data
          this.area = []
          this.all = []
          this.pendding = []
          this.finish = []
          this.overTime = []
          if (this.areaData.length > 0) {
            this.areaData.forEach((item, index) => {
              this.area.push(item.工单区域)
              this.all.push(item.总工单)
              this.pendding.push(item.待办)
              this.finish.push(item.已办)
              this.overTime.push(item.超时)
              this.getEcharts()
            })
          } else {
            this.area.push('')
            this.all.push(0)
            this.pendding.push(0)
            this.finish.push(0)
            this.overTime.push(0)
            this.getEcharts()
          }
        } else {
          this.area.push('')
          this.all.push(0)
          this.pendding.push(0)
          this.finish.push(0)
          this.overTime.push(0)
          this.getEcharts()
        }
      })
    },
    getEcharts() {
      var myChart = echarts.init(document.getElementById('main'))
      myChart.setOption({
        color: ['#2db7f5', '#FA7D00', '#00CD70', '#F3C500'],
        legend: {},
        tooltip: {},
        xAxis: [{ type: 'category', data: this.area }],
        yAxis: {},
        grid: {
          height: 300
        },
        series: [
          {
            name: '工单总数',
            type: 'bar',
            barGap: 0,
            barWidth: '20',
            data: this.all
          },
          {
            name: '待办',
            type: 'bar',
            barWidth: '20',
            data: this.pendding
          },
          {
            name: '已办',
            type: 'bar',
            barWidth: '20',
            data: this.finish
          },
          {
            name: '超时',
            type: 'bar',
            barWidth: '20',
            data: this.overTime
          }
        ]
      })
    },
    // 获取当天的时间
    getToday: function() {
      var nowdate = new Date()
      var y = nowdate.getFullYear()
      var m = nowdate.getMonth() + 1
      var d = nowdate.getDate()
      if (m < 10) {
        m = '0' + m
      }
      if (d < 10) {
        d = '0' + d
      }
      this.today = y + '-' + m + '-' + d
      this.getPrevMonth()
      this.date = [this.prevMonth, this.today]
    },
    // 获取前一个月的时间
    getPrevMonth: function() {
      const nowdates = new Date()
      nowdates.setMonth(nowdates.getMonth() - 1)
      var y = nowdates.getFullYear()
      var m = nowdates.getMonth() + 1
      var d = nowdates.getDate()
      if (m < 10) {
        m = '0' + m
      }
      if (d < 10) {
        d = '0' + d
      }
      this.prevMonth = y + '-' + m + '-' + d
    }
  }
}
</script>
