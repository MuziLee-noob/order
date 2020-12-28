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
              @on-ok="userList(1)"
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
          <FormItem label="武汉市" class="mgr">
            <Select>
              <Option v-for="item in arealist" :value="item.value" :key="item.value">
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
      <Table :columns="areaColums" :data="areaData" stripe></Table>
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
// import { userPolicyList, commenSelect } from '../../../../api/policy/policy'
// import { dateFormat } from '../../../../libs/tools'
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
          title: '全部',
          key: 'eventName',
          tooltip: true
        },
        {
          title: '汉江区',
          key: 'ip',
          tooltip: true
        },
        {
          title: '江岸区',
          key: 'userAccount',
          tooltip: true
        },
        {
          title: '硚口区',
          key: 'ip',
          tooltip: true
        },
        {
          title: '汉阳区',
          key: 'userAccount',
          tooltip: true
        },
        {
          title: '武昌区',
          key: 'userAccount',
          tooltip: true
        },
        {
          title: '青山区',
          key: 'ip',
          tooltip: true
        },
        {
          title: '洪山区',
          key: 'userAccount',
          tooltip: true
        },
        {
          title: '东西湖区',
          key: 'userAccount',
          tooltip: true
        },
        {
          title: '蔡甸区',
          key: 'ip',
          tooltip: true
        },
        {
          title: '江夏区',
          key: 'userAccount',
          tooltip: true
        },
        {
          title: '黄陂区',
          key: 'ip',
          tooltip: true
        },
        {
          title: '新洲区',
          key: 'userAccount',
          tooltip: true
        }
      ],
      areaData: []
    }
  },
  mounted() {
    this.date = [this.prevMonth, this.today]
    this.getEcharts()
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
    this.getEcharts()
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
      if (this.activityIndex === 1) {
        // this.yesToday()
      } else if (this.activityIndex === 2) {
        // this.monthList()
      } else {
        // this.totalList()
      }
    },
    getEcharts() {
      var myChart = echarts.init(document.getElementById('main'))
      myChart.setOption({
        color: ['#2db7f5', '#FA7D00', '#00CD70', '#F3C500'],
        legend: {},
        tooltip: {},
        dataset: {
          source: [
            ['product', '工单总数', '待办', '已办', '超时'],
            ['2012', 41.1, 30.4, 65.1, 53.3],
            ['2013', 86.5, 92.1, 85.7, 83.1],
            ['2014', 24.1, 67.2, 79.5, 86.4],
            ['2015', 24.1, 67.2, 79.5, 86.4]
          ]
        },
        xAxis: { type: 'category' },
        yAxis: {},
        grid: {
          height: 300
        },
        series: [
          { type: 'bar', barWidth: '20' },
          { type: 'bar', barWidth: '20' },
          { type: 'bar', barWidth: '20' },
          { type: 'bar', barWidth: '20' }
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
    // 获取列表
    // userList: function(current) {
    //   if (current) this.current = current
    //   if (typeof this.userdate[0] === 'object') {
    //     this.userdate[0] = dateFormat('YYYY-mm-dd', this.userdate[0])
    //   }
    //   if (typeof this.userdate[1] === 'object') {
    //     this.userdate[1] = dateFormat('YYYY-mm-dd', this.userdate[1])
    //   }
    //   if (this.coAddressPcdCode === undefined) {
    //     this.coAddressPcdCode = ''
    //   }
    //   if (this.coAddressPcdName === undefined || this.coAddressPcdName === '请选择') {
    //     this.coAddressPcdName = ''
    //   }
    //   let params = {
    //     eventStartTime: this.userdate[0],
    //     eventEndTime: this.userdate[1],
    //     userAccount: this.userAccount,
    //     userName: this.userName,
    //     userRole: this.userRole,
    //     coName: this.coName,
    //     coAddressPcdCode: this.coAddressPcdCode,
    //     coAddressPcdName: this.coAddressPcdName,
    //     ip: this.ip,
    //     size: this.size,
    //     current: this.current
    //   }
    //   userPolicyList(params).then(res => {
    //     if (res.status === 0) {
    //       this.datauser = res.results.records
    //       this.userTotal = res.results.total
    //     }
    //   })
    // },
    userSize: function(limit) {
      this.size = limit
      this.current = 1
      this.userList()
    },
    userCurrent: function(limit) {
      this.current = limit
      this.userList()
    },
    reset: function() {
      this.userdate = [this.prevMonth, this.today]
      this.userAccount = ''
      this.userName = ''
      this.coName = ''
      this.coAddressPcdCode = ''
      this.coAddressPcdName = ''
      this.placeholders.province = '请选择'
      this.userRole = ''
      this.ip = ''
      this.userList(1)
    }
  }
}
</script>
