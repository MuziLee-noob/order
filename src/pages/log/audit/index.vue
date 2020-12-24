<style lang="less" scoped>
@import './index.less';
</style>
<template>
  <div class="fusion-manage">
    <div class="middle audit"></div>
    <div class="fusion-header serve">
      <Row class="check-condition clearfix">
        <Form :label-width="80">
          <FormItem label="时间范围" class="mgr">
            <DatePicker
              :options="options"
              :clearable="false"
              confirm
              id="date"
              placement="bottom-end"
              separator="~"
              @on-ok="logList(1)"
              type="daterange"
              v-model="date"
            ></DatePicker>
          </FormItem>
          <FormItem label="es索引" class="mgr">
            <Input placeholder="请输入" v-model="esIndex" />
          </FormItem>
          <FormItem label="主机IP" class="mgr">
            <Input placeholder="请输入" v-model="ip" />
          </FormItem>
          <FormItem label="日志内容">
            <Input placeholder="请输入" v-model="logDetail" />
          </FormItem>
          <div class="btns">
            <Button class="search apply" @click="logList(1)">查询</Button>
            <Button class="reset" @click="reset">重置</Button>
            <span class="refurbish iconfont icon-refresh" @click="logList(1)"></span>
          </div>
        </Form>
      </Row>
    </div>
    <div class="middle"></div>
    <div class="policy-table">
      <Table :columns="columnlog" :data="dataLog" stripe>
        <!-- <template slot-scope="{ row }" slot="operate">
          <span
            class="new-color"
            style="margin-right: 20px"
            @click="addEditModel('管理', row.opId, '2')"
          >
            管理
          </span>
          <span
            class="new-color"
            style="margin-right: 20px"
            v-if="row.status === '1'"
            @click="swithClick(row.opId, '0')"
          >
            启用
          </span>
          <span
            class="new-color"
            style="margin-right: 20px"
            v-if="row.status === '0'"
            @click="isDelete(row.opId, '1')"
          >
            禁用
          </span>
          <span class="new-color" @click="isDelete(row.opId, '删除')">删除</span>
        </template> -->
      </Table>
      <pagination
        :page-size="size"
        :currentPage="current"
        :show-info="true"
        :total="logTotal"
        @on-change="logList"
        @on-page-size-change="logSize"
      />
    </div>
  </div>
</template>
<script>
import { logList } from '../../../api/log/log'
import { dateFormat } from '../../../libs/tools'

export default {
  data() {
    return {
      date: [],
      esIndex: '',
      ip: '',
      logDetail: '',
      logTotal: 0,
      size: 10,
      current: 1,
      options: {
        disabledDate(date) {
          return date && date.valueOf() >= new Date()
        }
      },
      cityList: [],
      columnlog: [
        {
          title: '应用名称',
          key: 'appName',
          tooltip: true
        },
        {
          title: '应用厂商',
          key: 'companyName',
          tooltip: true
        },
        {
          title: '访问接口',
          key: 'path',
          tooltip: true
        },
        {
          title: '日志时间',
          key: 'logTime',
          width: 170
        },
        {
          type: 'html',
          title: '日志详细内容',
          key: 'logDetail',
          tooltip: true
        }
      ],
      dataLog: []
    }
  },
  mounted() {
    this.date = [this.prevMonth, this.today]
  },
  created() {
    this.getToday()
    this.logList()
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
      this.date = [this.prevMonth, this.today]
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
    // 创建和管理弹框
    addEditModel(title) {
      this.userModel = true
      this.userTitle = title
    },
    handleReset(name) {
      this.userModel = false
    },
    // 获取列表
    logList: function(current) {
      if (current) this.current = current
      if (typeof this.date[0] === 'object') {
        this.date[0] = dateFormat('YYYY-mm-dd', this.date[0])
      }
      if (typeof this.date[1] === 'object') {
        this.date[1] = dateFormat('YYYY-mm-dd', this.date[1])
      }
      let params = {
        startTime: this.date[0],
        endTime: this.date[1],
        logDetail: this.logDetail,
        esIndex: this.esIndex,
        ip: this.ip,
        size: this.size,
        current: this.current
      }
      logList(params).then(res => {
        if (res.status === 0) {
          const data = res.results.records
          data.forEach(item => {
            const desc = 'upstream connect finished'
            const name = `${item.path}<br>${desc}<br>${item.logTime}`
            item.appName = item.appName || '云南智慧工建'
            item.logDetail = item.logDetail || name
            item.companyName = item.companyName || '中国移动通信集团云南有限公司'
          })
          this.dataLog = data
          this.logTotal = res.results.total
        }
      })
    },
    logSize: function(limit) {
      this.size = limit
      this.current = 1
      this.logList()
    },
    logCurrent: function(limit) {
      this.current = limit
      this.logList()
    },
    reset: function() {
      this.date = [this.prevMonth, this.today]
      this.logDetail = ''
      this.ip = ''
      this.esIndex = ''
      this.logList()
    }
  }
}
</script>
