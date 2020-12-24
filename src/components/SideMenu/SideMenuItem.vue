<template>
  <i-submenu :name="`${parentName}`">
    <template slot="title">
      <i-icon :size="rootIconSize" :type="parentItem.icon || ''" />
      <span>{{ parentTitle }}</span>
    </template>
    <template v-for="(item, index) in children">
      <template v-if="item.children && item.children.length === 1">
        <i-menu-item :key="index" :name="getRouteNameOrHref(item.children[0])">
          <i-icon :size="iconSize" :type="item.children[0].icon || ''" />
          <span>{{ item.children[0].title }}</span>
        </i-menu-item>
      </template>
      <template v-else>
        <SideMenuItem :key="index" :parent-item="item" v-if="showChildren(item)" />
        <i-menu-item :key="index" :name="getRouteNameOrHref(item)" v-else>
          <i-icon :size="iconSize" :type="item.icon || ''" />
          <span>{{ item.title }}</span>
        </i-menu-item>
      </template>
    </template>
  </i-submenu>
</template>

<script>
import mixin from './mixin'

export default {
  name: 'SideMenuItem',

  mixins: [mixin],

  components: {},

  props: {
    parentItem: {
      type: Object,
      default: () => {}
    },

    theme: String,

    iconSize: Number,

    rootIconSize: Number
  },

  computed: {
    parentName() {
      return this.parentItem.name
    },

    parentTitle() {
      return this.parentItem.title
    },

    children() {
      return this.parentItem.children
    },

    textColor() {
      return this.theme === 'dark' ? '#fff' : '#495060'
    }
  }
}
</script>
