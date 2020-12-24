<template>
  <div class="contentData">
    <Tabs @on-click="handleClick">
      <TabPane label="采集策略" name="first">
        <collect />
      </TabPane>
      <TabPane label="删除策略" name="second">
        <cut />
      </TabPane>
      <TabPane label="高级配置" name="third">
        <high />
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import collect from './collect'
import cut from './del'
import high from './high'

export default {
  components: {
    collect,
    cut,
    high
  },
  data() {
    return {
      // collect: false,
      // cut: false,
      // high: false,
      collectData: [],
      cutData: [],
      highData: []
    }
  },
  mounted() {
    // this.init()
  },
  methods: {
    // init() {
    //   let limits = JSON.parse(localStorage.getItem('btnLimit'))
    //   if (limits) {
    //     limits.forEach((data, ind) => {
    //       if (data.name === this.$route.name) {
    //         data.children.forEach((val, i) => {
    //           if (val.menuCode === 'LOG_COLL') {
    //             this.collect = true
    //             this.collectData = val.children
    //           } else if (val.menuCode === 'LOG_DEL') {
    //             this.cut = true
    //             this.cutData = val.children
    //           } else if (val.menuCode === 'LOG_CONFIG') {
    //             this.high = true
    //             this.highData = val.children
    //           }
    //         })
    //       }
    //     })
    //   }
    // },
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
