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
              @on-ok="getOrderList(1)"
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
      <Table :columns="orderColums" :data="orderData" stripe></Table>
      <pagination
        :page-size="size"
        :show-info="true"
        :currentPage="current"
        :total="userTotal"
        @on-change="userList"
        @on-page-size-change="userSize"
      />
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
      orderColums: [
        {
          title: '日期',
          key: 'eventName',
          tooltip: true
        },
        {
          title: '工单总数',
          key: 'ip',
          tooltip: true
        },
        {
          title: '待办',
          key: 'userAccount',
          tooltip: true
        },
        {
          title: '已办',
          key: 'ip',
          tooltip: true
        },
        {
          title: '超时',
          key: 'userAccount',
          tooltip: true
        }
      ],
      orderData: []
    }
  },
  mounted() {
    this.userdate = [this.prevMonth, this.today]
    this.getEcharts()
    // window.onresize = () => {
    //   if (!this.timer) {
    //     this.timer = true
    //     setTimeout(() => {
    //       this.timer = false
    //       that.myChart.resize()
    //     }, 600)
    //   }
    // }
  },
  created() {
    this.getEcharts()
    this.getToday()
    this.getOrderList(1)
  },
  methods: {
    getClass(i) {
      return {
        active: i === this.activityIndex
      }
    },
    getClassHandler(i) {
      this.activityIndex = i
      if (this.activityIndex === 1) {
        this.day = 'month'
      } else if (this.activityIndex === 2) {
        this.day = 'week'
      } else if (this.activityIndex === 3) {
        this.day = 'month'
      } else {
        this.day = 'quarter'
      }
    },
    // 获取列表数据
    getOrderList(current) {
      if (current) this.current = current
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
        // size: this.size,
        // current: this.current
      }
      orderStatics(params).then(res => {
        if (res.state === '1') {
          this.orderData = res.data
          // this.userTotal = res.results.total
        }
      })
    },

    getEcharts() {
      var myChart = echarts.init(document.getElementById('main'))
      myChart.setOption({
        color: ['#2db7f5', '#FA7D00', '#00CD70', '#F3C500'],
        legend: {},
        tooltip: {},
        xAxis: [{ type: 'category', data: ['2012', '2013', '2014', '2015', '2016'] }],
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
            data: [320, 332, 301, 334, 390]
          },
          {
            name: '待办',
            type: 'bar',
            barWidth: '20',
            data: [220, 182, 191, 234, 290]
          },
          {
            name: '已办',
            type: 'bar',
            barWidth: '20',
            data: [150, 232, 201, 154, 190]
          },
          {
            name: '超时',
            type: 'bar',
            barWidth: '20',
            data: [98, 77, 101, 99, 40]
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
