<template>
  <div class="contentData">
    <Tabs @on-click="handleClick">
      <TabPane label="用户策略" name="first" v-if="user">
        <user />
      </TabPane>
      <TabPane label="应用策略" name="third" v-if="apply">
        <apply />
      </TabPane>
      <TabPane label="API策略" name="thour" v-if="api">
        <api />
      </TabPane>
      <!-- <TabPane label="设备策略" name="segven">
        <device />
      </TabPane> -->
    </Tabs>
  </div>
</template>
<script>
import user from './user'
import apply from './apply'
import api from './api'
// import device from './device'

export default {
  components: {
    user,
    apply,
    api
  },
  data() {
    return {
      user: false,
      apply: false,
      api: false
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
              if (val.menuCode === 'CONTROL_USER') {
                this.user = true
              } else if (val.menuCode === 'CONTROL_APP') {
                this.apply = true
              } else if (val.menuCode === 'CONTROL_API') {
                this.api = true
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
