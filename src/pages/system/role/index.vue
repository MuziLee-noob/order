<style lang="less" scoped>
@import '../index.less';
</style>
<template>
  <div class="fusion-manage">
    <div class="fusion-header serve">
      <div class="btnsCreate">
        <Button @click="userList(1)" class="create">新建角色</Button>
      </div>
      <Row class="check-condition clearfix">
        <Form :label-width="10">
          <FormItem label="" class="mgr">
            <Select clearable placeholder="选择角色">
              <Option :key="item.id" :value="item.id" v-for="item in roleArray">
                {{ item.name }}
              </Option>
            </Select>
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
      <Table :columns="roleColums" :data="roleData" stripe></Table>
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
      companySearch: '',
      userTotal: 0,
      size: 10,
      current: 1,
      roleArray: [
        {
          id: '1',
          name: '全部'
        },
        {
          id: '2',
          name: '需求发起人'
        },
        {
          id: '3',
          name: '支撑接口人'
        }
      ],
      roleColums: [
        {
          title: '角色名称',
          key: 'eventName',
          tooltip: true
        },
        {
          title: '状态',
          key: 'ip',
          tooltip: true
        },
        {
          title: '创建时间',
          key: 'userAccount',
          tooltip: true
        },
        {
          title: '操作',
          slot: 'opeare'
        }
      ],
      roleData: []
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
    }
  }
}
</script>
