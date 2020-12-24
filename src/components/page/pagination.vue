<template>
  <div :class="showInfo ? 'hw-pagination' : 'hw-pagination-right'" v-if="total">
    <div class="hw-pagination-info" v-if="showInfo">
      <span style="margin-right:10px;">共 {{ total }} 条记录</span>
      <span>第 {{ iPage }} / {{ iPageCount }} 页</span>
    </div>

    <div class="hw-pagination-handler">
      <!-- :page-size="pageSize" -->
      <Page
        :current="iPage"
        :page-size="pageSize"
        :page-size-opts="[10, 20, 30, 40, 50]"
        :show-elevator="showElevator"
        :show-sizer="showSizer"
        :show-total="false"
        :total="total"
        @on-change="handleCurrentChange"
        @on-page-size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BasePage',
  props: {
    // 一页展示多少条
    pageSize: {
      type: Number,
      default: 10
    },
    // 共有多少条数据
    total: {
      type: Number,
      default: null
    },
    // 当前页码
    currentPage: {
      type: Number,
      default: 1
    },
    // 控制是否显示前面 总数多少条，当前是第几页
    showInfo: {
      type: Boolean,
      default: true
    },
    // 控制是否显示快速跳转到某一页
    showElevator: {
      type: Boolean,
      default: true
    },
    // 控制是否显示一页展示多少条
    showSizer: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      iPage: 1,
      // 是否触发了iview分页控件的bug
      isPageBug: false
    }
  },
  computed: {
    iPageCount() {
      if (this.total === 0) return 1
      return Math.ceil(this.total / this.pageSize)
    }
  },
  watch: {
    iPage: {
      immediate: false,
      handler(newV) {
        this.$emit('update:currentPage', newV)
      }
    },
    currentPage: {
      immediate: true,
      handler(newV) {
        this.iPage = newV
      }
    }
  },
  methods: {
    handleCurrentChange(val) {
      if (val) {
        this.iPage = val
      }
      if (this.isPageBug) {
        // todo 这里是ivew分页控件的bug
      } else {
        this.$emit('on-change', val)
      }
    },
    handleSizeChange(val) {
      if (this.iPage !== 1) {
        this.isPageBug = true
      }

      this.$emit('on-page-size-change', val)
    }
  }
}
</script>

<style scoped>
.hw-pagination {
  width: 100%;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  padding-top: 15px;
  padding-bottom: 15px;
}

.hw-pagination-right {
  width: 100%;
  font-size: 12px;
  display: flex;
  justify-content: flex-end;
  height: 80px;
  padding-top: 15px;
  padding-bottom: 15px;
}

.hw-pagination-info {
  color: #999999;
}

.hw-pagination-handler {
  display: flex;
  align-items: center;
}
</style>
