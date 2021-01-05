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
              :clearable="false"
              confirm
              @on-ok="confirms"
              id="date"
              placement="bottom-end"
              separator="~"
              type="daterange"
              v-model="date"
            ></DatePicker>
          </FormItem>
          <div class="year">
            <div class="fault_span" :class="getClass(1)" @click="getClassHandler(1)" key="1">
              近一个月
            </div>
            <div class="fault_span" :class="getClass(2)" @click="getClassHandler(2)" key="2">
              近一周
            </div>
            <div class="fault_span" :class="getClass(3)" @click="getClassHandler(3)" key="3">
              近三个月
            </div>
            <div class="fault_span" :class="getClass(4)" @click="getClassHandler(4)" key="4">
              近一年
            </div>
          </div>
          <FormItem label="" class="mgr">
            <Select>
              <Option v-for="item in support" :value="item.value" :key="item.value">
                {{ item.lable }}
              </Option>
            </Select>
          </FormItem>
          <div class="btns">
            <Button @click="userList(1)" class="search">导出数据</Button>
          </div>
        </Form>
      </Row>
    </div>
    <div class="policy-table">
      <div id="main" style="width:1720px; height:450px"></div>
    </div>
    <div class="policy-table" style="margin-top: 10px;">
      <Table :columns="supportColums" :data="supportData" stripe show-summary></Table>
    </div>
  </div>
</template>
<style lang="less" scoped></style>
<script>
import { supportStatics } from '../../../api/login'
import { dateFormat } from '../../../libs/tools'
import echarts from 'echarts'
let that = null
export default {
  name: 'Echarts',
  data() {
    return {
      date: [],
      activityIndex: 1,
      options: {
        disabledDate(date) {
          return date && date.valueOf() >= new Date()
        }
      },
      userTotal: 0,
      size: 10,
      current: 1,
      support: [
        {
          value: '全部单位',
          lable: '全部单位'
        },
        {
          value: '集成公司',
          lable: '集成公司'
        },
        {
          value: '研究院',
          lable: '研究院'
        },
        {
          value: '其他',
          lable: '其他'
        }
      ],
      supportColums: [
        {
          title: '支撑单位',
          key: '支撑单位',
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
        // {
        //   title: '全部',
        //   key: 'eventName',
        //   tooltip: true
        // },
        // {
        //   title: '集成',
        //   key: 'userAccount',
        //   tooltip: true
        // },
        // {
        //   title: '研究院',
        //   key: 'ip',
        //   tooltip: true
        // },
        // {
        //   title: '其他',
        //   key: 'userAccount',
        //   tooltip: true
        // }
      ],
      supportData: []
    }
  },
  mounted() {
    this.date = [this.prevMonth, this.today]
    this.getSupportList()
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
    this.getToday()
    // this.userList(1)
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
        this.day = 'month'
      } else if (this.activityIndex === 2) {
        this.day = 'week'
      } else if (this.activityIndex === 3) {
        this.day = 'month'
      } else {
        this.day = 'quarter'
      }
      this.getSupportList()
    },
    confirms() {
      this.day = ''
      this.activityIndex = 0
      this.getSupportList()
    },
    // 获取列表数据
    getSupportList() {
      // if (current) this.current = current
      if (typeof this.date[0] === 'object') {
        this.date[0] = dateFormat('YYYY-mm-dd', this.date[0])
      }
      if (typeof this.date[1] === 'object') {
        this.date[1] = dateFormat('YYYY-mm-dd', this.date[1])
      }
      let params = {
        startTime: this.date[0],
        endTime: this.date[1],
        day: this.day
      }
      supportStatics(params).then(res => {
        if (res.state === 1) {
          this.supportData = res.data
          this.time = []
          this.all = []
          this.pendding = []
          this.finish = []
          this.overTime = []
          if (this.supportData.length > 0) {
            this.supportData.forEach((item, index) => {
              this.time.push(item.支撑单位)
              this.all.push(item.总工单)
              this.pendding.push(item.待办)
              this.finish.push(item.已办)
              this.overTime.push(item.超时)
              this.getEcharts()
            })
          } else {
            this.time.push('')
            this.all.push(0)
            this.pendding.push(0)
            this.finish.push(0)
            this.overTime.push(0)
            this.getEcharts()
          }
          // console.log(this.orderData)
        } else {
          this.time.push('')
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
        xAxis: [{ type: 'category', data: this.time }],
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
