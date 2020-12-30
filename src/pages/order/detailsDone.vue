<template>
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
          <Button disabled v-if="roll === 2">修改</Button>
          <Button @click="point()" v-if="roll === 2">打分</Button>
          <Button :disabled="isCheck" @click="check()" v-if="roll === 1">审核</Button>
          <Button :disabled="isSettle2" @click="settle2()" v-if="roll === 1">结算</Button>
          <Button disabled v-if="roll === 3">受理</Button>
          <Button disabled v-if="roll === 3">需协作</Button>
          <Button @click="settle3()" v-if="roll === 3">结算</Button>
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
              <li v-for="(item, index) in files" :key="index">
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
    <point ref="point" :pointFlag="pointFlag" :orderData="data" @disable="change($event)" />
    <!-- <settle :state1="state1" :state2="state2" />
    <upload /> -->
  </div>
</template>

<script>
import axios from '../../api/axios'
// import above from '../components/layout/above'
// import menuCheck from '../components/layout/menuCheck'
// import menuRequire from '../components/layout/menuRequire.vue'
// import menuAccept from '../components/layout/menuAccept.vue'
// import settle from '../../components/modals/settle.vue'
import point from '../../components/modals/point.vue'
// import Upload from '../../components/modals/upload.vue'
export default {
  components: {
    // menuAccept,
    // menuRequire,
    // menuCheck,
    // settle,
    point
    // Upload
    // above
  },
  created() {
    this.getdata()
  },
  methods: {
    down(id) {
      let a = document.createElement('a')
      a.href = this.files[id]
      a.click()
    },
    getdata() {
      this.uuid = this.$route.query.uuid
      console.log(this.uuid)
      axios
        .axios({
          method: 'get',
          url: 'order/orderDetail',
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
          this.state =
            data.data.data.orderState == '1'
              ? '待办'
              : data.data.data.orderState == '2'
              ? '已办'
              : '超时'
          this.files = data.data.data.requireFile
          this.files = this.files.substring(1, this.files.length - 1)
          this.files = this.files.split(',')
          //console.log(this.files)
          //console.log(data)
        })
    },
    change(flag) {
      this.pointFlag = flag
    },
    point() {
      this.pointFlag = true
      //this.$refs.point.getData()
    }
  },
  data() {
    return {
      pointFlag: false,
      state1: false,
      state2: false,
      data: '',
      checkFlag: false,
      cooperateFlag: false,
      acceptFlag: false,
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
