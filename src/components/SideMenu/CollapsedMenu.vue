<template>
  <i-dropdown
    :class="['collapsed-menu', hideTitle ? '' : 'collased-menu-dropdown']"
    :placement="placement"
    :transfer="hideTitle"
    @on-click="handleClick"
    ref="dropdown"
  >
    <a
      :style="{ textAlign: !hideTitle ? 'left' : '' }"
      @mouseover="handleMousemove($event, children)"
      class="side-menu__drop-menu-a"
      type="text"
    >
      <i-icon :color="textColor" :size="rootIconSize" :type="parentItem.icon" />
      <span class="collapsed-menu__menu-title" v-if="!hideTitle">{{ parentItem.title }}</span>
      <i-icon :size="16" style="float: right;" type="ios-arrow-forward" v-if="!hideTitle" />
    </a>
    <i-dropdown-menu ref="dropdown" slot="list">
      <template v-for="(child, index) in children">
        <CollapsedMenu
          :icon-size="iconSize"
          :key="index"
          :parent-item="child"
          v-if="showChildren(child)"
        ></CollapsedMenu>
        <i-dropdown-item :key="index" :name="child.name" v-else>
          <i-icon :size="iconSize" :type="child.icon" />
          <span class="collapsed-menu__menu-title">{{ child.title }}</span>
        </i-dropdown-item>
      </template>
    </i-dropdown-menu>
  </i-dropdown>
</template>

<script>
import mixin from './mixin'

export default {
  name: 'CollapsedMenu',

  mixins: [mixin],

  components: {},

  props: {
    parentItem: {
      type: Object,
      default: () => {}
    },

    theme: String,

    iconSize: Number,

    hideTitle: {
      type: Boolean,
      default: false
    },

    rootIconSize: Number
  },

  data() {
    return {
      placement: 'right-end'
    }
  },

  computed: {
    parentName() {
      return this.parentItem.name
    },

    children() {
      return this.parentItem.children
    },

    textColor() {
      return this.theme === 'dark' ? '#fff' : '#495060'
    }
  },

  mounted() {
    let dropdown = this.findNodeUpperByClasses(this.$refs.dropdown.$el, [
      'ivu-select-dropdown',
      'ivu-dropdown-transfer'
    ])
    if (dropdown) dropdown.style.overflow = 'visible'
  },

  methods: {
    handleClick(name) {
      this.$emit('on-click', name)
    },

    handleMousemove(event, children) {
      const { pageY } = event
      const height = children.length * 38
      const isOverflow = pageY + height < window.innerHeight
      this.placement = isOverflow ? 'right-start' : 'right-end'
    },

    findNodeUpperByClasses(ele, classes) {
      let parentNode = ele.parentNode
      if (parentNode) {
        let classList = parentNode.classList
        if (classList && classes.every(className => classList.contains(className))) {
          return parentNode
        } else {
          return this.findNodeUpperByClasses(parentNode, classes)
        }
      }
    }
  }
}
</script>

<style lang="less">
.collapsed-menu {
  &__menu-title {
    padding-left: 6px;
  }
}
</style>
