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
          <!-- <div class="year">
            <RadioGroup v-model="state" @on-change="change(state)" style="margin-top: -26px;">
              <Radio label="inside">
                <span>对内</span>
              </Radio>
              <Radio label="outside">
                <span>对外</span>
              </Radio>
            </RadioGroup>
          </div> -->
          <div class="btns">
            <Button @click="userList(1)" class="search">导出数据</Button>
          </div>
        </Form>
      </Row>
    </div>
    <Tabs type="card" :animated="false" style="margin: 0 20px;" @on-click="tabs">
      <TabPane label="打分统计" name="degree">
        <div class="policy-table" style="margin: 0;">
          <div id="main" style="width:1720px; height:450px;padding-top:30px;"></div>
          <Table :columns="degreeColums" :data="degreeData" stripe></Table>
        </div>
      </TabPane>
      <TabPane label="对内打分" name="inDegree">
        <div class="policy-table" style="margin: 0;">
          <Form>
            <FormItem label="" class="mgr">
              <Select class="degreeSelect">
                <Option v-for="item in arealist" :value="item.value" :key="item.value">
                  {{ item.lable }}
                </Option>
              </Select>
            </FormItem>
          </Form>
          <div id="inside" style="width:1720px; height:450px"></div>
          <Table :columns="inDegreeColums" :data="inDegreeData" stripe></Table>
        </div>
      </TabPane>
      <TabPane label="对外打分" name="outDegree">
        <div class="policy-table" style="margin: 0;">
          <Form>
            <FormItem label="" class="mgr">
              <Select class="degreeSelect">
                <Option v-for="item in arealist" :value="item.value" :key="item.value">
                  {{ item.lable }}
                </Option>
              </Select>
            </FormItem>
          </Form>
          <div id="outside" style="width:1720px; height:450px"></div>
          <Table :columns="outDegreeColums" :data="outDegreeData" stripe show-summary></Table>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>
<style lang="less" scoped></style>
<script>
import { outStatics, allStatics } from '../../../api/login'
import { dateFormat } from '../../../libs/tools'
import echarts from 'echarts'
let that = null
export default {
  name: 'Echarts',
  data() {
    return {
      date: [],
      activityIndex: 1,
      day: '',
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
      // 打分统计
      degreeColums: [
        {
          title: '日期',
          key: 'date',
          tooltip: true
        },
        {
          title: '90（含）-100',
          key: 'nintytohundred',
          tooltip: true
        },
        {
          title: '80（含）-90（不含）',
          key: 'eightytoninty',
          tooltip: true
        },
        {
          title: '70（含）-80（不含）',
          key: 'seventyoeighty',
          tooltip: true
        },
        {
          title: '70及以下',
          key: 'behindseventy',
          tooltip: true
        }
      ],
      degreeData: [],
      // 对内打分统计
      inDegreeColums: [
        {
          title: '日期',
          key: 'eventName',
          tooltip: true
        },
        {
          title: '90（含）-100',
          key: 'ip',
          tooltip: true
        },
        {
          title: '80（含）-90（不含）',
          key: 'userAccount',
          tooltip: true
        },
        {
          title: '70（含）-80（不含）',
          key: 'ip',
          tooltip: true
        },
        {
          title: '70及以下',
          key: 'userAccount',
          tooltip: true
        }
      ],
      inDegreeData: [],
      // 对外打分
      outDegreeColums: [
        {
          title: '支撑单位',
          key: 'eventName',
          tooltip: true
        },
        {
          title: '全部',
          key: 'ip',
          tooltip: true
        },
        {
          title: '集成',
          key: 'userAccount',
          tooltip: true
        },
        {
          title: '研究院',
          key: 'ip',
          tooltip: true
        },
        {
          title: '其他',
          key: 'userAccount',
          tooltip: true
        }
      ],
      outDegreeData: []
    }
  },
  mounted() {
    this.date = [this.prevMonth, this.today]
    // this.getEchars()
    this.getAllList()
  },
  created() {
    this.getToday()
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
    tabs(name) {
      if (name === 'degree') {
        // this.getEchars()
        this.getAllList()
      } else if (name === 'inDegree') {
        this.getIncharts()
      } else {
        this.getOutCharts()
        // this.getOutList()
      }
    },
    // 获取列表数据
    getAllList() {
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
      allStatics(params).then(res => {
        if (res.state === 1) {
          this.degreeData = res.data
          this.time = []
          this.bai = []
          this.jiu = []
          this.ba = []
          this.qi = []
          this.overTime = []
          if (this.outDegreeData.length > 0) {
            this.orderData.forEach((item, index) => {
              this.time.push(item.date)
              this.bai.push(item.nintytohundred)
              this.jiu.push(item.eightytoninty)
              this.ba.push(item.seventyoeighty)
              this.qi.push(item.behindseventy)
              this.getEchars()
            })
          } else {
            this.time.push('')
            this.bai.push(0)
            this.jiu.push(0)
            this.ba.push(0)
            this.qi.push(0)
            this.getEchars()
          }
          // console.log(this.orderData)
        } else {
          this.time.push('')
          this.bai.push(0)
          this.jiu.push(0)
          this.ba.push(0)
          this.qi.push(0)
          this.getEchars()
        }
      })
    },
    // 打分echarts
    getEchars() {
      var myChart = echarts.init(document.getElementById('main'))
      myChart.setOption({
        color: ['#20A0FF', '#FA7D00', '#00CD70', '#F3C500'],
        legend: {},
        tooltip: {},
        xAxis: [{ type: 'category', data: this.time }],
        yAxis: {},
        grid: {
          height: 300
        },
        series: [
          {
            name: '90（含）-100',
            type: 'bar',
            barWidth: '20',
            data: this.bai
          },
          {
            name: '80（含）-90（不含）',
            type: 'bar',
            barWidth: '20',
            data: this.jiu
          },
          {
            name: '70（含）-80（不含）',
            type: 'bar',
            barWidth: '20',
            data: this.ba
          },
          {
            name: '70及以下',
            type: 'bar',
            barWidth: '20',
            data: this.qi
          }
        ]
      })
    },
    // 对内打分
    getIncharts() {
      var insideMyChart = echarts.init(document.getElementById('inside'))
      insideMyChart.setOption({
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
    // 对外打分
    getOutCharts() {
      var outsideMyChart = echarts.init(document.getElementById('outside'))
      outsideMyChart.setOption({
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
    //获取当天的时间
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
<style lang="less" scoped>
/deep/ .ivu-tabs-bar {
  margin-bottom: 0;
  border-bottom: 0;
}
/deep/ .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
  border: none;
}
.degreeSelect {
  margin-top: 20px;
  width: 12%;
  margin-left: 14px;
}
</style>
