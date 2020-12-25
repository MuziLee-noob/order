<template>
  <div class="check">
    <Modal
      v-model="checkFlag1"
      title="审核意见"
      @on-ok="send"
      @on-cancel="reject"
      ok-text="派单"
      cancel-text="驳回"
    >
      <!-- ToDo这个对话框的取消要改点叉不触发传值 -->
      <p>工单编号：{{ listNumber }}</p>
      <Input v-model="checkView" type="textarea" :rows="4" />
    </Modal>
    <Modal v-model="confirmFlag">
      <p slot="header">进行派单</p>
      <div>工单编号{{ listNumber }}</div>
      <Row type="flex" align="middle">
        <i-col span="8">请选择支撑接口人:</i-col>
        <i-col span="16">
          <Select
            v-model="supportPerson"
            placeholder="请选择支撑接口人"
            @on-change="
              v => {
                enable(v, 'type')
              }
            "
            :label-in-value="true"
          >
            <Option v-for="item in people" :value="item.value" :key="item.label">
              {{ item.label }}
            </Option>
          </Select>
        </i-col>
      </Row>
      <div slot="footer">
        <Button @click="confirm" :disabled="ableFlag">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import moment from 'moment'
import axios from '../../api/axios'
export default {
  props: {
    checkFlag: Boolean,
    data: {}
  },
  data() {
    return {
      uuid: '',
      userUuid: '',
      supportPersonName: '',
      orderName: '',
      createUuid: '', //创建人的uuid
      supportUuid: '', //接口支撑人的uuid
      checkFlag1: false,
      checkView: '', //审核意见 需要传值
      confirmFlag: false, //控制进行派单对话框的出现
      supportPerson: '', //这是选择的支撑接口人 需要传值
      ableFlag: true, //控制进行派单对话框的确认按钮
      listNumber: '', //工单编号，需要传进来的值
      peopleList: [], //这个数组是支撑接口人名单 需要传进来的值
      people: ''
    }
  },
  created() {
    this.getData()
  },
  watch: {
    checkFlag() {
      this.checkFlag1 = this.checkFlag
    }
  },
  methods: {
    getData() {
      this.uuid = this.data.uuid
      this.listNumber = this.data.orderCode
      this.createUuid = this.data.createUuid
      this.startTime = this.data.startTimeStr
      this.finishTime = this.data.finishTimeStr
      this.startTime = moment(this.startTime).format('yyyy-MM-DD  HH:mm:ss')
      this.finishTime = moment(this.finishTime).format('yyyy-MM-DD  HH:mm:ss')
      console.log(this.data)
      console.log(this.uuid, this.listNumber)
      axios
        .axios({
          method: 'get',
          url: 'userinfo/getAllSupport'
        })
        .then(data => {
          console.log(data)
          this.people = data.data.data
          for (var i = 0; i < this.people.length; i++) {
            this.people[i].value = this.people[i].uuid
            this.people[i].label = this.people[i].userName
          }
          console.log(this.people)
        })
    },
    send() {
      this.confirmFlag = true
      this.checkFlag1 = false
      this.$emit('disable', this.checkFlag1)
    },
    reject() {
      //Todo 这里写驳回的方法
      this.$Message.info('Clicked cancel')
      axios
        .axios({
          method: 'post',
          url: '/workflow/handleWorkflow',
          data: {
            uuid: this.data.uuid,
            orderCode: this.data.orderCode,
            nodeFlag: 7,
            proposalContent: this.checkView,
            createUuid: this.createUuid
          }
        })
        .then(data => {
          console.log(data)
        })
      this.checkFlag1 = false
    },
    enable(value) {
      console.log(value)
      console.log(this.supportPerson)
      this.supportPersonName = value.label
      this.ableFlag = false
    },
    confirm() {
      //Todo 这里写确认派单的方法
      axios
        .axios({
          method: 'post',
          url: '/workflow/handleWorkflow',
          data: {
            uuid: this.uuid,
            orderCode: this.listNumber,
            nodeFlag: 2,
            proposalContent: this.checkView,
            supportUuid: this.supportPerson,
            supportName: this.supportPersonName,
            startTime: this.startTime,
            finishTime: this.finishTime
          }
        })
        .then(data => {
          console.log(data)
        })
    }
  }
}
</script>
