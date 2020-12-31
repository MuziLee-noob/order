<template>
  <!-- 工单详情页面 处理支撑接口人确认结束之前的工单详情 -->
  <div class="companyOperate">
    <!-- <Layout>
      <Header>
        <above />
      </Header>
      <Layout style="position:absolute;top: 64px;bottom: 0px;left: 0px;right: 0px;">
        <Sider hide-trigger :style="{ background: '#fff', maxWidth: '320px', minWidth: '320px' }"> -->
    <!-- 根据roll显示页边栏 1需求 2审核 3支撑 -->
    <!-- <menuRequire v-if="roll === 1" />
          <menuCheck v-if="roll === 2" />
          <menuAccept v-if="roll === 3" />
        </Sider> -->
    <Content style="background:#fff;">
      <!-- <Card> -->
      <div
        @click="back()"
        style="text-align:right;padding:10px 20px;font-size: 18px;color: #999;cursor:pointer;"
      >
        X
      </div>
      <Row class="detailsHead">
        <span class="detailsTab">工单状态:{{ state }}</span>
        <span class="detailsTab">需求发起人:{{ aquireName }}</span>
        <span class="detailsTab">审核人:{{ checkName }}</span>
        <!-- <i-col span="6">工单状态:{{ state }}</i-col>
          <i-col span="6">需求发起人:{{ aquireName }}</i-col>
          <i-col span="6">审核人:{{ checkName }}</i-col>
          <i-col>
            <Button @click="back()">关闭</Button>
          </i-col> -->
      </Row>
      <!-- <Divider /> -->
      <div class="title">
        <span class="title-">湖北武汉移动政企信息化IT技术支撑服务项目</span>
        <i-col span="4">
          <Button :disabled="isModify" @click="modify()" v-if="roll === 2">修改</Button>
          <Button disabled v-if="roll === 2">打分</Button>
          <Button :disabled="isCheck" @click="check()" v-if="roll === 1">审核</Button>
          <Button disabled v-if="roll === 1">结算</Button>
          <Button @click="accept()" v-if="roll === 3">受理</Button>
          <Button @click="cooperate()" v-if="roll === 3">需协作</Button>
          <Button disabled v-if="roll === 3">结算</Button>
          <Button @click="finish()" v-if="roll === 3">确认完成</Button>
        </i-col>
      </div>
      <!-- <Divider /> -->
      <div class="formDetails">
        <Row class="formRow">
          <i-col span="12">需求发起人：{{ aquireName }}</i-col>
          <i-col span="12">手机号：{{ phoneNumber }}</i-col>
        </Row>
        <Row class="formRow">
          <i-col span="12">工单编号：{{ listNumber }}</i-col>
          <i-col span="12">创建时间：{{ setupTime }}</i-col>
        </Row>
        <Row class="formRow">
          <i-col span="12">需求开始时间：{{ beginDate }}</i-col>
          <i-col span="12">需求结束时间：{{ endDate }}</i-col>
        </Row>
        <Row class="formRow">
          <i-col span="12">所在区域：{{ area }}</i-col>
          <i-col span="12">项目预估金额：{{ cost }}</i-col>
        </Row>
        <Row class="formRow">
          <span>需求内容描述：</span>
          <ul>
            {{
              description
            }}
          </ul>
        </Row>
        <Row class="formRow">
          <i-col span="24">
            <span>附件:</span>
            <ul>
              <li v-for="(item, index) in filesName" :key="index">
                <a @click="down(index)">{{ item }}</a>
              </li>
            </ul>
          </i-col>
        </Row>
        <Row class="formRow">
          <i-col span="24">审核意见:{{ opinion }}</i-col>
        </Row>
        <!-- <div class="left">工单编号：{{ listNumber }}</div>
        <div class="right">创建时间：{{ setupTime }}</div>
        <div class="left">需求开始时间：{{ beginDate }}</div>
        <div class="right">需求结束时间：{{ endDate }}</div>
        <div class="left">所在区域：{{ area }}</div>
        <div class="right">项目预估金额：{{ cost }}</div>
        <div class="des">需求内容描述:</div>
        <div class="card">
          <Card dis-hover>
            <div>{{ description }}</div>
          </Card>
        </div> -->
        <!-- <div class="attach">
          附件:
          <ul>
            <li v-for="(item, index) in files" :key="index">
              <a @click="down(index)">{{ item }}</a>
            </li>
          </ul>
        </div> -->
        <!--Todo 这里写下载附件的方法-->
        <!-- <div class="check">审核意见:{{ opinion }}</div> -->
      </div>
      <!-- </Card> -->
    </Content>
    <!-- </Layout>
    </Layout> -->
    <check ref="check" :checkFlag="checkFlag" :data="data" @disable="change($event)" />
    <accept ref="accept" :acceptFlag="acceptFlag" :data="data" @disable1="change1($event)" />
    <cooperate :cooperateFlag="cooperateFlag" @disable2="change2($event)" />
  </div>
</template>

<script>
import axios from '../../api/axios'
import moment from 'moment'
// import above from '../components/layout/above'
// import menuCheck from '../components/layout/menuCheck'
// import menuRequire from '../components/layout/menuRequire.vue'
// import menuAccept from '../components/layout/menuAccept.vue'
import Check from '../../components/modals/check.vue'
import Accept from '../../components/modals/accept.vue'
import Cooperate from '../../components/modals/cooperate.vue'
export default {
  components: {
    // menuAccept,
    // menuRequire,
    // menuCheck,
    Check,
    Accept,
    Cooperate
    // above
  },
  created() {
    this.getdata()
    console.log(this.role)
  },
  methods: {
    down(id) {
      //下载文件
      let a = document.createElement('a')
      a.href = 'http://api.dispatch-32102.p.onecode.ict.cmcc/api/download/' + this.filesUrl[id]
      a.click()
    },
    getdata() {
      var that = this
      this.uuid = this.$route.query.uuid
      console.log(this.uuid)
      axios
        .axios({
          method: 'get',
          url: '/api/order/orderDetail',
          params: {
            orderUuid: this.uuid
          }
        })
        .then(data => {
          console.log(data)
          this.data = data.data.data
          this.aquireName = data.data.data.createName
          this.checkName = data.data.data.auditorName //审核人姓名
          this.phoneNumber = data.data.data.telphone //需求发起人手机号
          this.listNumber = data.data.data.orderCode //工单编号
          this.setupTime = data.data.data.createTimeStr //工单创建时间
          this.beginDate = data.data.data.startTimeStr //开始时间
          this.endDate = data.data.data.finishTimeStr //结束时间
          this.area = data.data.data.region //所在区域
          this.cost = data.data.data.capital //预期花费
          this.description = data.data.data.orderDesr //工单详情
          this.opinion = data.data.data.auditSettContent //审核人意见
          this.supportUuid = data.data.data.supportUuid
          this.createUuid = data.data.data.createUuid
          this.state =
            data.data.data.orderState == '1'
              ? '待办'
              : data.data.data.orderState == '2'
              ? '已办'
              : '超时'
          this.files = data.data.data.requireFile
          this.files = this.files.substring(1, this.files.length - 1)
          this.files = this.files.split(',')
          for (var i = 0; i < this.files.length; i++) {
            for (let j = this.files[i].length; j > -1; j--) {
              if (this.files[i].charAt(j) == '=') {
                that.filesName[i] = that.files[i].slice(0, j)
                that.filesUrl[i] = that.files[i].slice(j + 1, this.files[i].length)
                break
              }
            }
          }
          console.log(this.filesName)
          console.log(this.filesUrl)
          //console.log(data)
        })
    },
    change(flag) {
      this.checkFlag = flag
    },
    change1(flag) {
      this.acceptFlag = flag
    },
    change2(flag) {
      this.cooperateFlag = flag
    },
    back() {
      this.$router.push(-1)
    },
    modify() {
      //修改工单，进入新建工单页面，重新提交
      this.$router.push('/newlist')
    },
    check() {
      //审核工单
      this.checkFlag = true
      this.$refs.check.getData()
    },
    accept() {
      this.acceptFlag = true
      this.$refs.accept.getData()
      //弹出受理对话框
    },
    cooperate() {
      this.cooperateFlag = true
      //弹出需协作对话框
    },
    finish() {
      //确认结束按钮
      var startTime = moment(this.beginDate).format('yyyy-MM-DD HH:mm:ss')
      var finishTime = moment(this.endDate).format('yyyy-MM-DD HH:mm:ss')
      axios
        .axios({
          method: 'post',
          url: 'api/workflow/handleWorkflow',
          data: {
            uuid: this.uuid,
            orderCode: this.listNumber,
            nodeFlag: 3,
            supportUuid: this.supportUuid,
            createUuid: this.createUuid,
            startTime: startTime,
            finishTime: finishTime,
            supportContent: 'this.supportContent'
          }
        })
        .then(data => {
          console.log(data)
          this.$router.push('/pedding')
        })
    }
  },
  data() {
    return {
      filesName: [],
      filesUrl: [],
      data: '',
      checkFlag: false,
      cooperateFlag: false,
      acceptFlag: false,
      supportContent: '', //这个是支撑过程记录，应该要给个页面填一下，我先写死
      createUuid: '',
      supportUuid: '',
      state: '', //工单状态
      aquireName: '', //需求发起人姓名
      checkName: '', //审核人姓名
      phoneNumber: '', //需求发起人手机号
      listNumber: '', //工单编号
      setupTime: '', //工单创建时间
      beginDate: '', //开始时间
      endDate: '', //结束时间
      area: '', //所在区域
      cost: '', //预期花费
      description: '', //工单详情
      opinion: '', //审核人意见
      files: [],
      roll: this.$store.state.role, //角色
      //这组是控制相应的按钮是否可用，true是不可用
      isModify: true, //修改工单
      isCheck: false, //审核
      //Todo 这里写从其它组件穿过来的值。
      uuid: ''
    }
  }
}
</script>

<style lang="less" scoped>
.details {
  .form {
    .left {
      text-align: left;
      width: 30%;
      margin-left: 20%;
      display: inline-block;
    }
    .des {
      float: left;
      text-align: left;
      display: inline-block;
      width: auto;
      vertical-align: top;
      margin-left: 20%;
    }
    .right {
      text-align: left;
      width: 40%;
      margin-left: 10%;
      display: inline-block;
    }
    .card {
      float: left;
      width: 50%;
      word-break: break-all;
      display: inline-block;
    }
    .attach {
      margin-left: 20%;
      width: auto;
      text-align: left;
      clear: left;
    }
    .check {
      clear: left;
      margin-left: 20%;
      width: auto;
      text-align: left;
    }
  }
}
</style>
