<template>
  <div calss="upload">
    <Modal v-model="state" title="上传结算单" @on-ok="ok" @on-cancel="cancel">
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
          <Botton @click="show" Icon type="md-add" />
        </i-col>
      </Row>
    </Modal>
    <Modal v-model="state2" title="上传附件">
      <div>
        <Upload
          ref="upload"
          :show-upload-list="false"
          :default-file-list="defaultList"
          :on-success="handleSuccess"
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
      <div solt="footer">
        <Botton @click="confirm">确认</Botton>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      defaultList: [],
      imgName: '',
      visible: false,
      uploadList: [],
      state: false, //Todo 这里之后要根据业务逻辑改
      state2: false,
      listNumber: '',
      description: ''
    }
  },
  methods: {
    ok() {
      //Todo这里写确认结算单的方法
    },
    cancel() {
      //Todo这里写取消结算单的方法
    },
    show() {
      this.state2 = true
    },
    confirm() {
      //Todo 这里写 返回工单详情页 并更新信息的方法
    },
    handleView(name) {
      this.imgName = name
      this.visible = true
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },
    handleSuccess(res, file) {
      file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar' //Todo 这里改成自己的接口
      file.name = '7eb99afb9d5f317c912f08b5212fd69a'
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
    handleBeforeUpload() {
      const check = this.uploadList.length < 10
      if (!check) {
        this.$Notice.warning({
          title: '只能上传10张图片'
        })
      }
      return check
    }
  },
  mounted() {
    this.uploadList = this.$refs.upload.fileList
  }
}
</script>
