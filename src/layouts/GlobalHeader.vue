<template>
  <div class="global-header">
    <span class="headerLine"></span>
    <span class="headerNew" @click="reback">武分派单系统</span>
    <div class="global-header__custom-content">
      <HeaderUser />
    </div>
  </div>
</template>

<script>
import HeaderUser from './HeaderUser'

export default {
  name: 'GlobalHeader',

  components: {
    HeaderUser
  },

  props: {
    isCollapsed: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isFullscreen: false
    }
  },

  computed: {
    rotateIcon() {
      return this.isCollapsed
        ? 'global-header__menu-icon global-header__menu-icon_rotate'
        : 'global-header__menu-icon'
    }
  },

  watch: {},

  created() {},

  mounted() {},

  methods: {
    toggleCollapse() {
      this.$emit('toggleCollapse')
    },
    reback() {
      const url = process.env.NODE_ENV === 'demo' ? window.demo.admin : window.g.admin
      window.location.href = url + '/home/overview'
    }
  }
}
</script>

<style lang="less">
.global-header {
  display: flex;
  align-items: center;
  height: 59px;

  &__menu-icon {
    transition: all 0.3s;
    margin-right: 30px;
    cursor: pointer;
    font-size: 20px;

    &:hover {
      color: #1890ff;
    }

    &_rotate {
      transform: rotate(-180deg);
    }
  }

  &__custom-content {
    display: flex;
    margin-left: auto;
    height: 100%;

    & > * {
      margin-right: 35px;
    }
  }
}

.headerNew {
  height: 59px;
  color: #fff;
  font-weight: 400;
  font-size: 20px;
  margin-left: 20px;
}

.headerLine {
  width: 1px;
  height: 30px;
  background: #fff;
  opacity: 0.34;
}
</style>
