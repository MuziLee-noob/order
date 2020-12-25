<template>
  <div class="menuCheck">
    <Menu
      :theme="theme2"
      width="320px"
      :open-names="['1', '2', '3']"
      :active-name="active"
      :style="{ fontSize: '21px' }"
    >
      <Submenu name="1">
        <template slot="title">
          <Icon type="ios-paper" />
          工单管理
        </template>
        <MenuItem name="1-1" to="/todoList" :style="{ textAglin: 'center' }">待办工单</MenuItem>
        <MenuItem name="1-2" to="/doneList">已办工单</MenuItem>
      </Submenu>
      <Submenu name="2">
        <template slot="title">
          <Icon type="ios-globe" />
          系统管理
        </template>
        <MenuItem name="2-1" to="/company">公司管理</MenuItem>
        <MenuItem name="2-2" to="/user">用户管理</MenuItem>
        <MenuItem name="2-3" to="/role">角色管理</MenuItem>
      </Submenu>
      <Submenu name="3">
        <template slot="title">
          <Icon type="ios-stats" />
          数据统计
        </template>
        <MenuItem name="3-1" to="/listSta">工单统计</MenuItem>
        <MenuItem name="3-2" to="/allSta">满意度统计</MenuItem>
        <MenuItem name="3-3" to="/areaSta">区域统计</MenuItem>
        <MenuItem name="3-4" to="/supportCompanySta">支撑单位统计</MenuItem>
      </Submenu>
    </Menu>
  </div>
</template>

<script>
export default {
  props: {
    active: String
  },
  data() {
    return {
      theme2: 'light'
    }
  }
}
</script>

<style lang="less" scoped>
.menuCheck {
  height: 100%;
}
</style>
