<style lang="less" scoped>
@import '../index.less';
</style>
<template>
  <div class="fusion-manage">
    <div class="fusion-header serve">
      <div class="btnsCreate">
        <Button @click="newUser('新建', '')" class="create">新建用户</Button>
        <Poptip trigger="hover" content="批量导入数据">
          <Button icon="ios-open-outline" class="exportButton" @click="leadIn" />
        </Poptip>
      </div>
      <Row class="check-condition clearfix">
        <Form :label-width="10">
          <FormItem label="" class="mgr">
            <Select v-model="userCompany" placeholder="选择公司" :label-in-value="true" clearable>
              <Option v-for="item in companyList" :value="item.comName" :key="item.uuid">
                {{ item.comName }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="" class="mgr">
            <Select v-model="userState" placeholder="选择角色" clearable>
              <Option v-for="item in roleList" :value="item.roleName" :key="item.uuid">
                {{ item.roleName }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="" class="mgr">
            <Input v-model="companySearch" placeholder="姓名/手机号" clearable />
          </FormItem>
          <div class="btns">
            <Button @click="getData(1)" class="search">查询</Button>
          </div>
        </Form>
      </Row>
    </div>
    <div class="policy-table">
      <!-- <div class="btns">
        <Button @click="userList(1)" class="search">下载</Button>
        <Button @click="reset(1)" class="reset">删除</Button>
      </div>         @on-row-click="goto"-->
      <Table
        :data="data"
        :columns="columns"
        @on-select="select"
        @on-select-cancel="selectCancel"
        @on-select-all="selectAll"
        @on-select-all-cancel="selectAllCancel"
      >
        <template slot-scope="{ row }" slot="action">
          <span class="new-color" @click="isDel(row, '删除')">删除</span>
          <span class="new-color" @click="newUser('修改', row)">修改</span>
          <span class="new-color" @click="isDel(row, '重置')">重置密码</span>
        </template>
      </Table>
      <pagination
        :page-size="size"
        :show-info="true"
        :currentPage="current"
        :total="total"
        @on-change="getData"
        @on-page-size-change="userSize"
      />
    </div>
    <!-- 删除和重置密码弹框 -->
    <Modal id="fusion-del" footer-hide class="pop-up delete" v-model="delModel" width="451">
      <p slot="header">
        <span>提示</span>
      </p>
      <div class="content">
        <span class="close-left" v-if="isDelColse === '重置'">
          确定重置密码？（默认密码为123456）
        </span>
        <span class="close-left" v-if="isDelColse === '删除'">
          此操作将永久删除用户相关数据，是否确认删除？
        </span>
      </div>
      <div class="add-footer">
        <Button @click="delOk" class="fusion-del-ok" type="primary">
          确定
        </Button>
        <Button @click="cancel_del()" class="fusion-del-cancel">
          取消
        </Button>
      </div>
    </Modal>
    <!-- <Modal v-model="delFlag" title="提示" @on-ok="delOk">
      <p>此操作将永久删除用户相关数据，是否确认删除？</p>
    </Modal>
    <Modal v-model="resetFlag" title="提示" @on-ok="resetOk">
      <p>确认重置密码？（默认密码为123456）</p>
    </Modal> -->
  </div>
</template>
<style lang="less" scoped></style>
<script>
import axios from '../../../api/axios'
import qs from 'qs'
import { userList, commanyAll, roleAll, userDelete, resetPassword } from '../../../api/login'
// import { userPolicyList, commenSelect } from '../../../../api/policy/policy'
// import { dateFormat } from '../../../../libs/tools'

export default {
  data() {
    return {
      selected: [], //存放选择到的选项
      uuidList: [],
      total: 0,
      delModel: false,
      isDelColse: '',
      uuid: '',
      userState: '',
      // delFlag: false,
      progressData: [], //调用接口获取数据
      current: 1, //默认为第一页
      size: 10,
      userCompany: '', //用户的公司
      companySearch: '', //搜索公司的字段
      data: [], //后台来的数据
      companyList: [], //下拉菜单公司列表的
      roleList: [],
      columns: [
        //Todo写成和后台一样的
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '登录账号',
          key: 'userAcount'
        },
        {
          title: '用户姓名',
          key: 'userName'
        },
        {
          title: '手机',
          key: 'telphone'
        },
        {
          title: '所属公司',
          key: 'companyName'
        },
        {
          title: '用户角色',
          key: 'roleName'
        },
        {
          title: '注册时间',
          key: 'createTime'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ]
    }
  },
  created() {
    this.getData(1)
    this.getCompany()
    this.getUserRole()
  },
  methods: {
    select(selection, row) {
      console.log(selection, row)
      for (var i = 0; i < selection.length; i++) {
        this.selected[i] = selection[i].uuid
      }
      console.log(this.selected)
    },
    selectCancel(selection, row) {
      console.log(selection, row)
      for (var i = 0; i < selection.length; i++) {
        this.selected[i] = selection[i].uuid
      }
    },
    selectAll(selection) {
      console.log(selection)
      for (var i = 0; i < selection.length; i++) {
        this.selected[i] = selection[i].uuid
      }
    },
    selectAllCancel(selection) {
      console.log(selection)
      for (var i = 0; i < selection.length; i++) {
        this.selected[i] = selection[i].uuid
      }
    },
    getCompany() {
      commanyAll().then(res => {
        this.companyList = res.data
      })
      // axios
      //   .axios({
      //     method: 'get',
      //     url: 'userinfo/getAllCompany'
      //   })
      //   .then(data => {
      //     this.companyList = data.data.data
      //     for (var i = 0; i < this.companyList.length; i++) {
      //       this.companyList[i].value = this.companyList[i].comName
      //       this.companyList[i].label = this.companyList[i].comName
      //     }
      //     console.log(this.companyList)
      //   })
    },
    getUserRole() {
      roleAll().then(res => {
        this.roleList = res.data
      })
    },
    isDel(row, title) {
      this.delModel = true
      this.isDelColse = title
      this.uuid = row.uuid
    },
    delOk() {
      if (this.isDelColse === '删除') {
        var uuidLists = []
        uuidLists.push(this.uuid)
        userDelete(uuidLists).then(res => {
          if (res.state === '1') {
            this.$Message.success(res.message || '删除成功!')
            this.delModel = false
            this.getData(1)
          } else {
            this.$Message.error(res.message || '删除失败!')
          }
        })
      } else {
        resetPassword().then(res => {
          if (res.state === '1') {
            this.$Message.success(res.message || '删除成功!')
            this.delModel = false
            this.getData(1)
          } else {
            this.$Message.error(res.message || '删除失败!')
          }
        })
      }
    },
    delBatchOk() {
      var selected = qs.stringify(this.selected)
      let params = {
        uuidList: selected
      }
      userDelete(params).then(res => {
        if (res.state === '1') {
          this.$Message.success(res.message || '删除成功!')
          this.delModel = false
          this.getData(1)
        } else {
          this.$Message.error(res.message || '删除失败!')
        }
      })
    },
    cancel_del() {
      this.delModel = false
    },
    // del1() {
    //   var selected = qs.stringify(this.selected)
    //   axios
    //     .axios({
    //       method: 'post',
    //       url: 'userinfo/deleteUser',
    //       data: { uuidList: selected }
    //     })
    //     .then(data => {
    //       console.log(data)
    //     })
    // },
    //Todo 这里写弹出确认删除对话框的方法
    // change() {
    //   //Todo 这里写转到修改用户的方法
    // },
    // reset() {
    //   //Todo 这里写弹出确认重置密码对话框的方法
    // },
    // resetOk() {
    //   this.$Modal.success({
    //     title: '提示',
    //     content: '更新成功'
    //   }) //这里是创建一个成功对话框
    //   //Todo 在这里写重置用户密码的方法
    // },
    // search() {
    //   this.getData(1)
    //   this.page = 1
    // },
    leadIn() {
      axios.axios({
        method: 'get',
        url: 'userinfo/companyDownload'
      })
      //Todo批量导入的方法
    },
    newUser(title, data) {
      this.$router.push({ path: '/userAdd', query: { title: title, data: data } })
    },
    getData(current) {
      if (current) this.current = current
      let params = {
        pageSize: this.size,
        currentPage: this.current,
        condition: {
          roleName: this.userState,
          company: this.userCompany,
          key: this.companySearch
        }
      }
      userList(params).then(res => {
        this.total = res.total
        this.data = res.data
      })
      // axios
      //   .axios({
      //     method: 'post',
      //     url: 'userinfo/list',
      //     data: {
      //       pageSize: this.pageSize,
      //       currentPage: page,
      //       condition: {
      //         roleName: this.userState,
      //         company: this.userCompany,
      //         key: this.companySearch
      //       }
      //     },
      //     headers: { token: localStorage.getItem('token') }
      //   })
      //   .then(data => {
      //     this.total = data.data.total
      //     this.data = data.data.data
      //     console.log(data)
      //   })
    },
    // goto(data) {
    //   this.$router.push({
    //     path: '/userOperate',
    //     query: { data: data }
    //   })
    // },
    userSize: function(limit) {
      this.size = limit
      this.current = 1
      this.getData()
    }
  }
}
</script>
