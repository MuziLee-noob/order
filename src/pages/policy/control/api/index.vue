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
              @on-ok="apiList(1)"
              confirm
              id="date"
              placement="bottom-end"
              separator="~"
              type="daterange"
              v-model="userdate"
            ></DatePicker>
          </FormItem>
          <FormItem label="服务类型" class="mgr">
            <Input placeholder="请输入" v-model="serviceType" />
          </FormItem>
          <FormItem label="组名称" class="mgr">
            <Input placeholder="请输入" v-model="apiGroupName" />
          </FormItem>
          <FormItem label="组ID" class="mgr">
            <Input placeholder="请输入" v-model="apiGroupId" />
          </FormItem>
          <FormItem label="服务状态" class="mgr">
            <Select v-model="serviceStatus" clearable>
              <Option :key="item.value" :value="item.value" v-for="item in cityList">
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="IP地址" class="mgr">
            <Input placeholder="请输入" v-model="apiIp" />
          </FormItem>
          <FormItem label="端口号">
            <Input placeholder="请输入" v-model="apiPort" />
          </FormItem>
          <div class="btns">
            <Button @click="apiList(1)" class="search">查询</Button>
            <Button @click="reset" class="reset">重置</Button>
            <span class="refurbish iconfont icon-refresh" @click="apiList"></span>
          </div>
        </Form>
      </Row>
    </div>
    <div class="middle"></div>
    <div class="policy-table">
      <Table :columns="columnsapi" :data="datapi" stripe></Table>
      <pagination
        :page-size="size"
        :show-info="true"
        :currentPage="current"
        :total="apiTotal"
        @on-change="apiList"
        @on-page-size-change="apiSize"
      />
    </div>
  </div>
</template>
<script>
import { apiPolicyList } from '../../../../api/policy/policy'
import { dateFormat } from '../../../../libs/tools'

export default {
  data() {
    return {
      userdate: [],
      apiGroupId: '',
      apiGroupName: '',
      apiIp: '',
      apiPort: '',
      current: 1,
      size: 10,
      apiTotal: 0,
      eventEndTime: '',
      eventStartTime: '',
      serviceStatus: '',
      serviceType: '',
      options: {
        disabledDate(date) {
          return date && date.valueOf() >= new Date()
        }
      },
      cityList: [
        {
          value: '0',
          label: '正常'
        },
        {
          value: '1',
          label: '异常'
        }
      ],
      columnsapi: [
        {
          title: '事件名称',
          key: 'eventName',
          tooltip: true
        },
        {
          title: 'IP地址',
          key: 'apiIp',
          tooltip: true
        },
        {
          title: '端口号',
          key: 'apiPort',
          tooltip: true
        },
        {
          title: 'API组ID',
          key: 'apiGroupId',
          tooltip: true
        },
        {
          title: 'API组名称',
          key: 'apiGroupName',
          tooltip: true
        },
        {
          title: '服务类型',
          key: 'serviceType',
          tooltip: true
        },
        {
          title: '服务状态',
          key: 'serviceStatus',
          tooltip: true
        },
        {
          title: '发生时间',
          key: 'eventTime',
          width: 170
        }
      ],
      datapi: []
    }
  },
  mounted() {
    this.userdate = [this.prevMonth, this.today]
  },
  created() {
    this.getToday()
    this.apiList()
  },
  methods: {
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
    // 获取列表
    apiList: function(current) {
      if (current) this.current = current
      if (typeof this.userdate[0] === 'object') {
        this.userdate[0] = dateFormat('YYYY-mm-dd', this.userdate[0])
      }
      if (typeof this.userdate[1] === 'object') {
        this.userdate[1] = dateFormat('YYYY-mm-dd', this.userdate[1])
      }
      let params = {
        eventStartTime: this.userdate[0],
        eventEndTime: this.userdate[1],
        apiGroupId: this.apiGroupId,
        apiGroupName: this.apiGroupName,
        apiIp: this.apiIp,
        apiPort: this.apiPort,
        serviceStatus: this.serviceStatus,
        serviceType: this.serviceType,
        ip: this.ip,
        size: this.size,
        current: this.current
      }
      apiPolicyList(params).then(res => {
        if (res.status === 0) {
          this.datapi = res.results.records
          this.apiTotal = res.results.total
          res.results.records.forEach((data, index) => {
            if (data.serviceStatus === '1') {
              data.serviceStatus = '异常'
            } else if (data.serviceStatus === '0') {
              data.serviceStatus = '正常'
            }
          })
        }
      })
    },
    apiSize: function(limit) {
      this.size = limit
      this.current = 1
      this.apiList()
    },
    apiCurrent: function(limit) {
      this.current = limit
      this.apiList()
    },
    reset: function() {
      this.userdate = [this.prevMonth, this.today]
      this.apiGroupId = ''
      this.apiGroupName = ''
      this.apiIp = ''
      this.apiPort = ''
      this.serviceStatus = ''
      this.serviceType = ''
      this.apiList(1)
    }
  }
}
</script>
