<template>
  <div class="menuRequire">
    <Menu :theme="theme2" width="320px" :open-names="['1']" :active-name="active">
      <Submenu name="1">
        <template slot="title">
          <Icon type="ios-paper" />
          工单管理
        </template>
        <MenuItem name="1-4" to="newList">新建工单</MenuItem>
        <MenuItem name="1-1" to="todoList">待办工单</MenuItem>
        <MenuItem name="1-2" to="doneList">已办工单</MenuItem>
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
