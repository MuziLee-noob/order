<template>
  <div class="cooperate">
    <Modal v-model="cooperateFlag1" @on-cancel="cancel">
      <p slot="header">协作处理</p>
      <div>工单编号{{ listNumber }}</div>
      <Row type="flex" align="middle">
        <i-col span="8">支撑人员:</i-col>
        <i-col span="16">
          <Select v-model="supportPerson" placeholder="请选择支撑协作人">
            <Option
              v-for="item in peopleList"
              :value="item.value"
              :key="item.value"
              @on-change="enable"
            >
              {{ item.label }}
            </Option>
          </Select>
        </i-col>
      </Row>
      <div slot="footer">
        <Button @click="confirm" disabled="ableFlag">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  props: {
    cooperateFlag: Boolean
  },
  data() {
    return {
      cooperateFlag1: false,
      listNumber: '', //工单编号
      supportPerson: '', //支撑接口人
      peopleList: [], //选择协作人的列表
      ableFlag: true //确认按钮是否可用
    }
  },
  watch: {
    cooperateFlag() {
      this.cooperateFlag1 = this.cooperateFlag
    }
  },
  methods: {
    enable() {
      //使确认按钮变为可用
      this.ableFlag = false
    },
    confirm() {
      this.confirmFlag = false
      this.cooperateFlag1 = false
      this.$emit('disable2', this.cooperateFlag1)
      //Todo 这里写传值的方法
    },
    cancel() {
      this.cooperateFlag1 = false
      this.$emit('disable2', this.cooperateFlag1)
    }
  }
}
</script>
