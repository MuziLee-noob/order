<style lang="less" scoped>
@import '../index.less';
</style>
<template>
  <div class="fusion-manage">
    <div class="fusion-header serve">
      <div class="btnsCreate">
        <Button @click="addCompany" class="create">新建公司</Button>
        <Poptip trigger="hover" content="批量导入数据">
          <Button icon="ios-open-outline" class="exportButton" @click="leadIn" />
        </Poptip>
      </div>
      <Row class="check-condition clearfix">
        <Form :label-width="80">
          <FormItem label="公司名称" class="mgr">
            <Input v-model="companySearch" placeholder="公司名称" />
          </FormItem>
          <div class="btns">
            <Button @click="userList(1)" class="search">查询</Button>
          </div>
        </Form>
      </Row>
    </div>
    <div class="policy-table">
      <!-- <div class="btns">
        <Button @click="userList(1)" class="search">下载</Button>
        <Button @click="reset(1)" class="reset">删除</Button>
      </div> -->
      <Table :columns="companyColums" :data="companyData" stripe></Table>
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

export default {
  data() {
    return {
      userdate: [],
      userTotal: 0,
      size: 10,
      current: 1,
      companyColums: [
        {
          title: '公司名称',
          key: 'eventName',
          tooltip: true
        },
        {
          title: '支撑接口人',
          key: 'ip',
          tooltip: true
        },
        {
          title: '状态',
          key: 'userAccount',
          tooltip: true
        },
        {
          title: '操作',
          slot: 'opeare'
        }
      ],
      companyData: []
    }
  },
  created() {
    this.userList(1)
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
    },
    // 新增公司
    addCompany() {
      this.$router.push({ name: 'commanyAdd', query: { id: '1' } })
    }
  }
}
</script>
