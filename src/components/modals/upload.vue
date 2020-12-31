<template>
<!-- 支撑接口人上传支撑记录 -->
  <div calss="upload">
    <Modal v-model="uploadFlag" title="上传结算单" @on-ok="ok" @on-cancel="cancel">
      <div>工单编号：{{ listNumber }}</div>
      <Row>
        <i-col span="8">备注说明：</i-col>
        <i-col span="16">
          <Input type="textarea" v-model="description" />
        </i-col>
      </Row>
      <Row>
        <i-col span="6">上传附件：</i-col>
        <i-col class="uploadList" v-for="item in uploadList" :key="item.url">
          <template v-if="item.url !== ''">
            <img :src="item.url" @click.native="handleView(item.name)" />
          </template>
        </i-col>
        <i-col>
          <Button @click="show" Icon type="md-add" />
        </i-col>
      </Row>
    </Modal>
    <Modal v-model="state2" title="上传附件">
      <div>
        <Upload
          ref="upload"
          :show-upload-list="false"
          :default-file-list="defaultList"
          :format="['jpg', 'jpeg', 'png']"
          :max-size="51200"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :before-upload="handleBeforeUpload"
          multiple
          type="drag"
          action="//jsonplaceholder.typicode.com/posts/"
        >
          <div>添加文件</div>
        </Upload>
      </div>
      <div v-for="item in uploadList" :key="item.url">
        <span>{{ item.name }}</span>
        <span @click="handleRemove(item)">删除</span>
      </div>
      <div slot="footer">
        <Button @click="confirm" type="primary">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from '../../api/axios'
export default {
  props: {
    uploadFlag: Boolean,
    data: {}
  },
  data() {
    return {
      formData: new FormData(),
      defaultList: [],
      imgName: '',
      visible: false,
      uploadList: [],
      state2: false,
      listNumber: '',
      description: ''
    }
  },
  methods: {
    getData() {
      this.listNumber = this.data.orderCode
    },
    ok() {
      //Todo这里写确认结算单的方法
      this.formData.append('nodeFlag', 6)
      this.formData.append('orderCode', this.data.orderCode)
      this.formData.append('uuid', this.data.uuid)
      this.formData.append('supportUuid', this.data.supportUuid)
      this.formData.append('payoff.proposalMessage', this.description)
      axios
        .axios({
          method: 'post',
          url: 'api/workflow/handleWorkflowFiles',
          data: this.formData,
          headers: {
            token: localStorage.getItem('token')
          }
        })
        .then(data => {
          console.log(data)
          this.$router.push('/pedding')
        })
    },
    cancel() {
      //Todo这里写取消结算单的方法
    },
    show() {
      this.state2 = true
    },
    confirm() {
      //Todo 这里写 返回工单详情页 并更新信息的方法
      for (var i = 0; i < this.uploadList.length; i++) {
        this.formData.append('files', this.uploadList[i])
      }
      this.state2 = false
    },
    handleView(name) {
      this.imgName = name
      this.visible = true
    },
    handleRemove(file) {
      const fileList = this.uploadList
      this.uploadList.splice(fileList.indexOf(file), 1)
    },
    handleFormatError() {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '请选择 jpg/png/jpeg.'
      })
    },
    handleMaxSize() {
      this.$Notice.warning({
        desc: '文件大小不超过50M'
      })
    },
    handleBeforeUpload(file) {
      const check = this.uploadList.length < 10
      let that = this
      if (!check) {
        this.$Notice.warning({
          title: '只能上传10张图片'
        })
      }
      that.uploadList.push(file)
      console.log(that.uploadList)
      return false
    }
  }
}
</script>
