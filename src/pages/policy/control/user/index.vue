<style lang="less" scoped>
@import '../index.less';
</style>
<template>
  <div class="fusion-manage">
    <div class="fusion-header serve">
      <Row class="check-condition clearfix">
        <Form :label-width="80">
          <FormItem label="所属企业" class="mgr">
            <Input placeholder="请输入" v-model="coName" />
          </FormItem>
          <FormItem label="IP地址">
            <Input placeholder="请输入" v-model="ip" />
          </FormItem>
          <div class="btns">
            <Button @click="userList(1)" class="search">筛选</Button>
          </div>
        </Form>
      </Row>
    </div>
    <div class="policy-table">
      <div class="btns">
        <Button @click="userList(1)" class="search">下载</Button>
        <Button @click="reset(1)" class="reset">删除</Button>
      </div>
      <Table :columns="columnsuser" :data="datauser" stripe></Table>
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
import { userPolicyList, commenSelect } from '../../../../api/policy/policy'
import { dateFormat } from '../../../../libs/tools'

export default {
  data() {
    return {
      userdate: [],
      userTotal: 0,
      eventStartTime: '',
      eventEndTime: '',
      province: '',
      userAccount: '',
      userName: '',
      coName: '',
      coAddressPcdCode: '',
      coAddressPcdName: '',
      userRole: '',
      ip: '',
      size: 10,
      current: 1,
      userSelect: [
        {
          itemCode: 'app',
          itemName: '是否是应用服务商'
        },
        {
          itemCode: 'device',
          itemName: '是否是设备服务商'
        },
        {
          itemCode: 'service',
          itemName: '是否是服务提供商'
        }
      ],
      options: {
        disabledDate(date) {
          return date && date.valueOf() >= new Date()
        }
      },
      placeholders: {
        province: '请选择'
      },
      cityList: [],
      columnsuser: [
        {
          title: '事件名称',
          key: 'eventName',
          tooltip: true
        },
        {
          title: 'IP地址',
          key: 'ip',
          tooltip: true
        },
        {
          title: '用户账户',
          key: 'userAccount',
          tooltip: true
        },
        {
          title: '用户角色',
          key: 'typeStr',
          tooltip: true
        },
        {
          title: '所属企业',
          key: 'coName',
          tooltip: true
        },
        {
          title: '所在地区',
          key: 'coAddressStr',
          tooltip: true
        },
        {
          title: '发生时间',
          key: 'eventTime',
          width: 170
        }
      ],
      datauser: []
    }
  },
  mounted() {
    this.userdate = [this.prevMonth, this.today]
  },
  created() {
    this.getToday()
    this.getPrevMonth()
    // this.initSearch()
    this.userList(1, '', '')
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
    sel(data) {
      this.coAddressPcdCode = data.province.code
      this.coAddressPcdName = data.province.value
      this.placeholders.province = data.province.value
      this.userList(1) //使用value值
    },
    // 获取用户角色
    initSearch() {
      let params = {
        dictCode: 'zy_enterprise_role'
      }
      commenSelect(params).then(res => {
        if (res.status === 0) {
          this.userSelect = res.results
        }
      })
    },
    // 获取列表
    userList: function(current) {
      if (current) this.current = current
      if (typeof this.userdate[0] === 'object') {
        this.userdate[0] = dateFormat('YYYY-mm-dd', this.userdate[0])
      }
      if (typeof this.userdate[1] === 'object') {
        this.userdate[1] = dateFormat('YYYY-mm-dd', this.userdate[1])
      }
      if (this.coAddressPcdCode === undefined) {
        this.coAddressPcdCode = ''
      }
      if (this.coAddressPcdName === undefined || this.coAddressPcdName === '请选择') {
        this.coAddressPcdName = ''
      }
      let params = {
        eventStartTime: this.userdate[0],
        eventEndTime: this.userdate[1],
        userAccount: this.userAccount,
        userName: this.userName,
        userRole: this.userRole,
        coName: this.coName,
        coAddressPcdCode: this.coAddressPcdCode,
        coAddressPcdName: this.coAddressPcdName,
        ip: this.ip,
        size: this.size,
        current: this.current
      }
      userPolicyList(params).then(res => {
        if (res.status === 0) {
          this.datauser = res.results.records
          this.userTotal = res.results.total
        }
      })
    },
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
