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
              @on-ok="confirms()"
              id="date"
              placement="bottom-end"
              separator="~"
              type="daterange"
              v-model="userdate"
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
          <div class="btns">
            <Button @click="userList(1)" class="search">导出数据</Button>
          </div>
        </Form>
      </Row>
    </div>
    <div class="policy-table">
      <div id="main" style="width:1520px; height:450px"></div>
    </div>
    <div class="policy-table" style="margin-top: 10px;">
      <Table :columns="orderColums" :data="orderData" stripe show-summary></Table>
      <!-- <pagination
        :page-size="size"
        :show-info="true"
        :currentPage="current"
        :total="userTotal"
        @on-change="userList"
        @on-page-size-change="userSize"
      /> -->
    </div>
  </div>
</template>
<style lang="less" scoped></style>
<script>
import { orderStatics } from '../../../api/login'
import { dateFormat } from '../../../libs/tools'
import echarts from 'echarts'
let that = null
export default {
  name: 'Echarts',
  data() {
    return {
      userdate: [],
      activityIndex: 1,
      day: 'month',
      options: {
        disabledDate(userdate) {
          return userdate && userdate.valueOf() >= new Date()
        }
      },
      userTotal: 0,
      size: 10,
      current: 1,
      orderColums: [
        {
          title: '日期',
          key: '时间',
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
      orderData: []
    }
  },
  mounted() {
    this.userdate = [this.prevMonth, this.today]
    this.getOrderList()
    window.onresize = () => {
      if (!this.timer) {
        this.timer = true
        setTimeout(() => {
          this.timer = false
          that.getEcharts.resize()
        }, 600)
      }
    }
  },
  created() {
    // this.getEcharts()
    this.getToday()
    // this.getOrderList(1)
  },
  methods: {
    getClass(i) {
      return {
        active: i === this.activityIndex
      }
    },
    getClassHandler(i) {
      this.activityIndex = i
      this.userdate = []
      this.userdate[0] = ''
      this.userdate[1] = ''
      if (this.activityIndex === 1) {
        this.day = 'month'
      } else if (this.activityIndex === 2) {
        this.day = 'week'
      } else if (this.activityIndex === 3) {
        this.day = 'month'
      } else {
        this.day = 'quarter'
      }
      this.getOrderList()
    },
    confirms() {
      this.day = ''
      this.activityIndex = 0
      this.getOrderList()
    },
    // 获取列表数据
    getOrderList() {
      // if (current) this.current = current
      if (typeof this.userdate[0] === 'object') {
        this.userdate[0] = dateFormat('YYYY-mm-dd', this.userdate[0])
      }
      if (typeof this.userdate[1] === 'object') {
        this.userdate[1] = dateFormat('YYYY-mm-dd', this.userdate[1])
      }
      let params = {
        startTime: this.userdate[0],
        endTime: this.userdate[1],
        day: this.day
      }
      orderStatics(params).then(res => {
        if (res.state === 1) {
          this.orderData = res.data
          this.time = []
          this.all = []
          this.pendding = []
          this.finish = []
          this.overTime = []
          if (this.orderData.length > 0) {
            this.orderData.forEach((item, index) => {
              this.time.push(item.时间)
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
      this.userdate = [this.prevMonth, this.today]
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
    },
    // // 获取用户角色
    // initSearch() {
    //   let params = {
    //     dictCode: 'zy_enterprise_role'
    //   }
    //   commenSelect(params).then(res => {
    //     if (res.status === 0) {
    //       this.userSelect = res.results
    //     }
    //   })
    // },
    userSize: function(limit) {
      this.size = limit
      this.getOrderList(1)
    }
  }
}
</script>
