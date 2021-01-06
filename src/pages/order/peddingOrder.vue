<template>
  <!-- 待办工单页面 -->
  <div class="fusion-manage">
    <!-- <Layout style="height:73px">
            <Header :style="{height:'100%'}">
                <above/>
            </Header>
            <Layout style="position:absolute;top: 73px;bottom: 0px;left: 0px;right: 0px;">
                <Sider hide-trigger :style="{background: '#fff',maxWidth:'320px',minWidth:'320px'}">
                    <menuCheck v-show="role===1"/>
                    <menuRequire v-show="role===2"/>
                    <menuAccept v-show="role===3"/>
                </Sider> -->
    <div class="fusion-header serve">
      <!-- <Row>
                        <Col span="3">工单管理>全部工单</Col>
                    </Row> -->
      <!-- <Card dis-hover style="height:100%"> -->
      <Row class="check-condition clearfix">
        <Form>
          <FormItem label="" class="mgr" :label-width="10">
            <Input v-model="form.keyWord" placeholder="工单编号/工单标题搜索" />
          </FormItem>
          <FormItem label="发布时间" class="mgr" :label-width="80" style="width: 32%;">
            <DatePicker
              style="width: 46%"
              type="datetime"
              placeholder="请选择开始时间"
              v-model="startTime"
              format="yyyy-MM-dd HH:mm"
            />
            -
            <DatePicker
              style="width: 46%"
              type="datetime"
              placeholder="请选择结束时间"
              v-model="finishTime"
              format="yyyy-MM-dd HH:mm"
            />
          </FormItem>
          <FormItem label="工单状态" class="mgr" :label-width="80">
            <Select v-model="form.searchStatus" placeholder="选择工单状态">
              <Option :value="0">全部</Option>
              <Option :value="1">待办</Option>
              <Option :value="2">已办</Option>
              <Option :value="3">超时</Option>
            </Select>
          </FormItem>
          <div class="btns">
            <Button @click="check" class="search">查询</Button>
            <!-- <Button @click="demo" class="search">试用跳转</Button> -->
          </div>
        </Form>
        <!-- <Col span="10">
                                <Input v-model="form.keyWord" Icon type="ios-search" placeholder="工单编号/工单标题搜索"/>
                            </Col>
                            <Col span="10">
                                <span>发布时间:</span>
                                <DatePicker type="datetime" placeholder="请选择开始时间" v-model="startTime" format="yyyy-MM-dd HH:mm"/>
                                <DatePicker type="datetime" placeholder="请选择结束时间" v-model="finishTime" format="yyyy-MM-dd HH:mm"/>
                            </Col>
                            <Col span="4">
                                <Button @click="check">查询</Button>
                            </Col> -->
      </Row>
      <!-- <Row>
                            <Col span="2">
                                <Select v-model="form.searchStatus" placeholder="选择工单状态" style="width:200px">
                                    <Option :value="0">全部</Option>
                                    <Option :value="1">待办</Option>
                                    <Option :value="2">已办</Option>
                                    <Option :value="3">超时</Option>
                                </Select>
                            </Col>
                            <Col span="2" offset="18">
                                <Button type="text" @click="del">
                                    <Icon type="ios-trash-outline" size="24"/>
                                </Button>
                            </Col>
                            <Col span="2">
                                <Button type="text"  @click="downLoad"/>
                                    <Icon type="ios-download-outline" size="24"/>
                                </Button>
                            </Col>
                        </Row> -->

      <!-- </Card> -->
    </div>
    <div class="policy-table">
      <div class="btns">
        <Button @click="downLoad" class="search">导出</Button>
        <Button @click="del" class="reset">删除</Button>
      </div>
      <Table
        :data="data"
        :columns="columns"
        highlight-row
        @on-select="handleSelect"
        @on-select-all="handleSelectAll"
        @on-select-all-cancel="handleCancelSelectAll"
        @on-select-cancel="handleCancel"
        @on-current-change="goto"
        ref="selection"
      ></Table>
      <pagination
        @on-page-size-change="pageSizeChange"
        @on-change="pageChange"
        :total="total"
        :page-size="pagesize"
        :current="page"
        show-sizer
        show-elevator
      />
    </div>
    <!-- </Layout>
        </Layout> -->
  </div>
</template>

<script>
import moment from 'moment'
import axios from '../../api/axios'
// import above from '../components/layout/above'
// import menuCheck from '../components/layout/menuCheck.vue';
// import menuRequire from '../components/layout/menuRequire.vue';
// import menuAccept from '../components/layout/menuAccept.vue';
const uniqBy = require('lodash/uniqBy')
const remove = require('lodash/remove')
const differenceBy = require('lodash/differenceBy')
export default {
  components: {
    // menuCheck,
    // above,
    // menuRequire,
    // menuAccept
  },
  data() {
    return {
      data: [],
      startTime: '',
      finishTime: '',
      role: this.$store.state.role, //判断当前的角色显示对应页边栏1审核2需求3支撑
      listState: '', //左上角的工单状态
      form: {
        //搜索栏和工单状态的下拉菜单
        keyWord: '',
        searchStates: ''
      },
      page: 1,
      pageSize: 10,
      total: 0,
      selected: [], //这个是所有已选项的数组
      curPageSelected: [], //这个是当页已选的数组
      columns: [
        //Todo 这里的key写成和后台一样的
        {
          type: 'selection',
          align: 'center'
        },
        {
          title: '工单编号',
          key: 'orderCode'
        },
        {
          title: '状态',
          key: 'stateTemp',
          render: (h, params) => {
            return h(
              'span',
              {
                style: {
                  color: params.row.stateTemp == '超时' ? '#ff9900' : '#2d2d2d'
                }
              },
              params.row.stateTemp
            )
          }
        },
        {
          title: '工单标题',
          key: 'orderName'
        },
        {
          title: '发布时间',
          key: 'orderCreateTime',
          render: (h, params) => {
            let createTimeStr = moment(params.row.orderCreateTime).format('yyyy-MM-DD HH:mm')
            return h('span', createTimeStr)
          }
        },
        {
          title: '发起人',
          key: 'createName'
        },
        {
          title: '审核人',
          key: 'auditorName'
        },
        {
          title: '支撑接口人',
          key: 'supportName'
        },
        {
          title: '审核意见',
          key: 'proposalContent'
        }
      ]
    }
  },
  mounted() {
    this.getData(1)
    console.log(this.role)
  },
  methods: {
    goto(data) {
      console.log(data)
      var uuid = data.orderUuid
      var nodeFlag = data.nodeState
      if (nodeFlag == 1 || nodeFlag == 2 || nodeFlag == 7) {
        console.log(uuid)
        this.$router.push({
          path: '/details',
          query: { uuid: uuid }
        })
      } else {
        this.$router.push({
          path: '/detailsDone',
          query: { uuid: uuid }
        })
      }
    },
    // demo() {
    //   this.$router.push({
    //     path: '/details',
    //     query: { uuid: '111' }
    //   })
    // },
    getData(page) {
      var startTime = moment(this.startTime).format('yyyy/MM/DD HH:mm')
      var endTime = moment(this.finishTime).format('yyyy/MM/DD HH:mm')
      if (this.startTime === '') {
        startTime = ''
      }
      if (this.finishTime === '') {
        endTime = ''
      }
      axios
        .axios({
          method: 'post',
          url: '/api/task/todoList',
          data: {
            pageSize: this.pageSize,
            currentPage: page,
            condition: {
              orderName: this.form.keyWord,
              startTime: startTime,
              endTime: endTime,
              state: this.form.searchStates
            }
          },
          headers: { token: localStorage.getItem('token') }
        })
        .then(data => {
          this.total = data.data.total
          this.data = data.data.data
          console.log(data)
        })
    },
    check() {
      this.getData(1)
      this.page = 1
    },
    del() {
      //Todo删除已选项
    },
    downLoad() {
      //Todo下载已选项
      let a = document.createElement('a')
      a.href = `http://api.dispatch-32102.p.onecode.ict.cmcc/api/task/exportRecord?userUuid=${this.$store.state.userUuid}`
      a.click()
      /*axios
        .axios({
          method: 'get',
          url: '/api/task/exportRecord',
          params: {
            userUuid: this.$store.state.userUuid
          },
          headers: { token: localStorage.getItem('token') },
          responseType: 'blob'
        })
        .then(res => {
          const { data, headers } = res
          const fileName = headers['content-disposition'].replace(/w+;filename=(.*)/, '$1')
          const blob = new Blob([data], { type: headers['content-type'] })
          let dom = document.createElement('a')
          let url = window.URL.createObjectURL(blob)
          dom.href = url
          dom.download = decodeURI(fileName)
          dom.style.display = 'none'
          document.body.appendChild(dom)
          dom.click()
          dom.parentNode.removeChild(dom)
          window.URL.revokeObjectURL(url)
        })
        .catch(err => {})*/
    },
    pageChange(page) {
      this.page = page
      this.getData(page)
      console.log(this.page)
    },
    handleCancel(selection, row) {
      //从已选项中去除取消项
    },
    handleSelect(selection, row) {
      //选中一项的方法
    },
    handleSelectAll(selection) {
      //全选的方法
    },
    handleCancelSelectAll() {
      //取消全选的方法
    }
  }
}
</script>
