<template>
  <div class="contentData">
    <Tabs @on-click="handleClick">
      <TabPane label="用户策略" name="first" v-if="user">
        <user :userData="userData" />
      </TabPane>
      <TabPane label="应用策略" name="second" v-if="apply">
        <apply :applyData="applyData" />
      </TabPane>
      <TabPane label="API策略" name="third" v-if="api">
        <api :apiData="apiData" />
      </TabPane>
      <TabPane label="设备策略" name="thour" v-if="device">
        <device :deviceData="deviceData" />
      </TabPane>
      <TabPane label="高级配置" name="five" v-if="high">
        <high :highData="highData" />
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import user from './user'
import apply from './apply'
import api from './api'
import device from './device'
import high from './high'

export default {
  components: {
    user,
    apply,
    api,
    device,
    high
  },
  data() {
    return {
      user: false,
      apply: false,
      api: false,
      device: false,
      high: false,
      userData: [],
      applyData: [],
      apiData: [],
      deviceData: [],
      highData: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      let limits = JSON.parse(localStorage.getItem('btnLimit'))
      if (limits) {
        limits.forEach((data, ind) => {
          if (data.name === this.$route.name) {
            data.children.forEach((val, i) => {
              if (val.menuCode === 'DEPLOY_USER') {
                this.user = true
                this.userData = val.children
              } else if (val.menuCode === 'DEPLOY_APP') {
                this.apply = true
                this.applyData = val.children
              } else if (val.menuCode === 'DEPLOY_API') {
                this.api = true
                this.apiData = val.children
              } else if (val.menuCode === 'DEPLOY_DEVICE') {
                this.device = true
                this.deviceData = val.children
              } else if (val.menuCode === 'DEPLOY_CONFIG') {
                this.high = true
                this.highData = val.children
              }
            })
          }
        })
      }
    },
    handleClick(tab, event) {
      // 点击切换分页
    }
  }
}
</script>
<style lang="less" scope>
.ivu-tabs-bar {
  height: 48px;
  background: #f5f5f5;
  border-bottom: 1px solid #dcdee2;
  border-top: 1px solid #dcdee2;
  margin-bottom: 16px;
  padding-left: 48px;
}

.ivu-tabs-nav .ivu-tabs-tab {
  padding: 14px 16px;
}

.ivu-tabs-ink-bar {
  height: 4px;
}
</style>
