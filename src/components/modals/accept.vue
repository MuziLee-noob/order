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
        <i-col span="16">
          <input type="file" @change="upload($event)" id="files" multiple="multiple" />
        </i-col>
      </Row>
    </Modal>
  </div>
</template>

<script>
import axios from '../../api/axios'
export default {
  props: {
    acceptFlag: Boolean,
    data: {}
  },
  data() {
    return {
      formData: new FormData(),
      acceptFlag1: false,
      listNumber: '', //工单编号
      supportPerson: '', //支撑接口人姓名
      phoneNumber: '', //支撑接口人电话
      description: '', //支撑内容描述
      orderUuid: '', //工单uuid
      files: '' //工单文件
    }
  },
  created() {
    this.getData()
  },
  watch: {
    acceptFlag() {
      this.acceptFlag1 = this.acceptFlag
    }
  },
  methods: {
    getData() {
      this.orderUuid = this.data.uuid
      this.listNumber = this.data.ordreCode
      console.log(this.orderUuid)
    },
    upload(e) {
      var that = this
      for (var i = 0; i < e.target.files.length; i++) {
        that.formData.append('files', e.target.files[i])
      }
    },
    ok() {
      this.formData.append('supportName', this.supportPerson)
      this.formData.append('orderUuid', this.orderUuid)
      this.formData.append('conment', this.description)
      this.formData.append('phone', this.phoneNumber)
      axios
        .axios({
          method: 'post',
          url: '/api/workflow/support',
          headers: {
            token: localStorage.getItem('token')
          },
          data: this.formData
        })
        .then(data => {
          console.log(data)
          this.acceptFlag1 = false
          this.$emit('disable1', this.acceptFlag1)
        })
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
