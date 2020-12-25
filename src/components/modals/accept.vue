<template>
  <div class="accept">
    <Modal v-model="acceptFlag1" title="填写工作量" @on-ok="ok" @on-cancel="cancel">
      <Row type="flex" align="middle">工单编号{{ listNumber }}</Row>
      <Row type="flex" align="middle">
        <i-col span="8">支撑人</i-col>
        <i-col span="16">
          <Input v-model="supportPerson" placeholder="请填写支撑人姓名" />
        </i-col>
      </Row>
      <Row type="flex" align="middle">
        <i-col span="8">联系方式</i-col>
        <i-col span="16">
          <Input v-model="phoneNumber" placeholder="请填写联系方式" />
        </i-col>
      </Row>
      <Row type="flex" align="top">
        <i-col span="8">工作内容描述</i-col>
        <i-col span="16">
          <Input v-model="description" type="textarea" :row="6" />
        </i-col>
      </Row>
      <Row type="flex" align="middle">
        <i-col span="8">上传附件</i-col>
        <i-col span="16"></i-col>
        <!--Todo 这里实现一个上传功能-->
      </Row>
    </Modal>
  </div>
</template>

<script>
export default {
  props: {
    acceptFlag: Boolean
  },
  data() {
    return {
      acceptFlag1: false,
      listNumber: '',
      supportPerson: '',
      phoneNumber: '',
      description: ''
    }
  },
  watch: {
    acceptFlag() {
      this.acceptFlag1 = this.acceptFlag
    }
  },
  methods: {
    ok() {
      this.acceptFlag1 = false
      this.$emit('disable1', this.acceptFlag1)
      //Todo 这里写点击确认的方法 路由转到工单详情，同时更新信息
    },
    cancel() {
      //Todo 这里写点击取消的方法 关闭对话框
      this.acceptFlag1 = false
      this.$emit('disable1', this.acceptFlag1)
    }
  }
}
</script>
