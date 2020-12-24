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
              @on-ok="appList(1)"
              confirm
              id="date"
              placement="bottom-end"
              separator="~"
              type="daterange"
              v-model="userdate"
            ></DatePicker>
          </FormItem>
          <FormItem label="应用ID" class="mgr">
            <Input placeholder="请输入" v-model="appId" />
          </FormItem>
          <FormItem label="应用名称" class="mgr">
            <Input placeholder="请输入" v-model="appName" />
          </FormItem>
          <FormItem label="应用类型" class="mgr">
            <Input placeholder="请输入" v-model="appType" />
          </FormItem>
          <FormItem label="所属企业" class="mgr">
            <Input placeholder="请输入" v-model="coName" />
          </FormItem>
          <div class="btns">
            <Button @click="appList(1)" class="search apply">查询</Button>
            <Button @click="reset" class="reset">重置</Button>
            <span class="refurbish iconfont icon-refresh" @click="appList"></span>
          </div>
        </Form>
      </Row>
    </div>
    <div class="middle"></div>
    <div class="policy-table">
      <Table :columns="columnapply" :data="datapply" stripe></Table>
      <pagination
        :page-size="size"
        :show-info="true"
        :currentPage="current"
        :total="applyTotal"
        @on-change="appList"
        @on-page-size-change="applySize"
      />
    </div>
  </div>
</template>
<script>
import { applyPolicyList } from '../../../../api/policy/policy'
import { dateFormat } from '../../../../libs/tools'

export default {
  data() {
    return {
      userdate: [],
      appId: '',
      appName: '',
      appType: '',
      coName: '',
      current: 1,
      size: 10,
      applyTotal: 0,
      eventStartTime: '',
      eventEndTime: '',
      options: {
        disabledDate(date) {
          return date && date.valueOf() >= new Date()
        }
      },
      cityList: [],
      columnapply: [
        {
          title: '事件名称',
          key: 'eventName',
          tooltip: true
        },
        {
          title: '应用ID',
          key: 'appId',
          tooltip: true
        },
        {
          title: '应用名称',
          key: 'appName',
          tooltip: true
        },
        {
          title: '应用类型',
          key: 'appType',
          tooltip: true
        },
        {
          title: '所属企业',
          key: 'coName',
          tooltip: true
        },
        {
          title: '发生时间',
          key: 'eventTime',
          width: 170
        }
      ],
      datapply: []
    }
  },
  mounted() {
    this.userdate = [this.today, this.today]
  },
  created() {
    this.getToday()
    this.appList()
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
      this.userdate = [this.today, this.today]
    },
    // 获取列表
    appList: function(current) {
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
        appId: this.appId,
        appName: this.appName,
        appType: this.appType,
        coName: this.coName,
        size: this.size,
        current: this.current
      }
      applyPolicyList(params).then(res => {
        if (res.status === 0) {
          this.datapply = res.results.records
          this.applyTotal = res.results.total
        }
      })
    },
    applySize: function(limit) {
      this.size = limit
      this.current = 1
      this.appList()
    },
    applyCurrent: function(limit) {
      this.current = limit
      this.appList()
    },
    reset: function() {
      this.userdate = [this.today, this.today]
      this.appId = ''
      this.appName = ''
      this.coName = ''
      this.appType = ''
      this.appList(1)
    }
  }
}
</script>
