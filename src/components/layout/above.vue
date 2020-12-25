<template>
  <div class="above">
    <Row>
      <i-col span="15">
        <img src="" />
        {{ msg }}
      </i-col>
      <i-col span="3">
        <Icon type="ios-notifications" size="20" />
        <Button type="text" @click="toInformation" ghost>消息管理</Button>
      </i-col>
      <i-col span="3">
        <Icon type="ios-settings-outline" size="20" />
        <Button type="text" @click="toPersonalSettings" ghost>个人设置</Button>
      </i-col>
      <i-col span="3">
        <Icon type="md-log-out" size="20" />
        <Button type="text" @click="lognOut = true" ghost>退出登录</Button>
      </i-col>
    </Row>
    <Modal v-model="lognOut" title="退出确认" @on-ok="ok">
      <p>确认要退出登录吗？</p>
    </Modal>
  </div>
</template>

<script>
//要传两个值 当前的用户和消息数量
export default {
  data() {
    return {
      msg: '',
      lognOut: false
    }
  },
  methods: {
    ok() {
      this.$router.push('/login')
    },
    toPersonalSettings() {
      this.$router.push('/personalSettings')
    },
    toInformation() {
      this.$router.push('/information')
    }
  }
}
</script>

<style lang="less" scoped>
.above {
  width: 100%;
}
</style>
