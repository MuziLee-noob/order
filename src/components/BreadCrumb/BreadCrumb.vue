<template>
  <div class="bread-crumb">
    <i-breadcrumb :style="{ fontSize: `${fontSize}px` }">
      <i-breadcrumb-item :key="index" :to="item.router" v-for="(item, index) in breadCrumbList">
        <i-icon :type="item.icon || ''" class="icon" v-if="showIcon" />
        {{ item.name }}
      </i-breadcrumb-item>
    </i-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'BreadCrumb',

  props: {
    breadCrumbList: {
      type: Array,
      default: () => []
    },

    fontSize: {
      type: Number,
      default: 14
    },

    showIcon: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less">
.bread-crumb {
  display: inline-block;
  vertical-align: top;
  /deep/.ivu-breadcrumb > span:last-child {
    font-weight: normal;
  }
  a {
    color: #515a6e;
    font-size: 16px;
  }
  span {
    &:last-child {
      a:hover {
        cursor: default;
        color: #515a6e;
      }
    }
  }
  .icon {
    margin-right: 4px;
  }
}
</style>
