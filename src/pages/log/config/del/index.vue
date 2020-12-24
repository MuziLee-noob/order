<style lang="less" scoped>
@import '../index.less';
</style>
<template>
  <div class="fusion-manage">
    <div class="fusion-header serve">
      <Row class="check-condition clearfix">
        <Form :label-width="80">
          <FormItem label="es索引" class="mgr">
            <Input placeholder="请输入" v-model="indexName" />
          </FormItem>
          <div class="btns">
            <Button class="search apply" @click="delList(1)">查询</Button>
            <Button class="reset" @click="reset">重置</Button>
            <span class="refurbish iconfont icon-refresh" @click="delList(1)"></span>
          </div>
        </Form>
      </Row>
    </div>
    <div class="middle"></div>
    <div class="policy-table">
      <Table :columns="columnLogDel" :data="dataLogDel" stripe>
        <template slot="operate" slot-scope="{ row }">
          <span
            @click="addEditModel(row.opId)"
            class="new-color"
            style="margin-right: 20px"
            v-if="limitManage"
          >
            管理
          </span>
          <span
            @click="swithClick(row.opId, '0')"
            class="new-color"
            style="margin-right: 20px"
            v-if="row.status === '1' && limitStop"
          >
            启用
          </span>
          <span
            @click="isDelete(row.opId, '1')"
            class="new-color"
            style="margin-right: 20px"
            v-if="row.status === '0' && limitStop"
          >
            禁用
          </span>
          <span @click="isDelete(row.opId, '删除')" class="new-color" v-if="limitDelete">删除</span>
        </template>
      </Table>
      <pagination
        :page-size="size"
        :show-info="true"
        :currentPage="current"
        :total="logDelTotal"
        @on-change="delList"
        @on-page-size-change="logDelSize"
      />
    </div>
    <!-- 管理弹框 -->
    <Modal footer-hide id="userModel" class="pop-up" title="管理" v-model="editModel" width="683">
      <Form :label-width="118">
        <FormItem label="modbus-acc-xa" prop="title">
          <Select v-model="formObject" clearable>
            <Option :key="item.value" :value="item.value" v-for="item in delLabel">
              {{ item.label }}
            </Option>
          </Select>
        </FormItem>
      </Form>
      <div class="add-footer">
        <Button @click="editOk" class="fusion-add-ok">
          确定
        </Button>
        <Button @click="handleReset" class="fusion-add-cancel" style="margin-left: 8px">
          取消
        </Button>
      </div>
    </Modal>
    <!-- 删除弹框 -->
    <Modal id="fusion-del" footer-hide class="pop-up delete" v-model="delModel" width="451">
      <p slot="header">
        <span>提示</span>
      </p>
      <div class="content">
        <span class="new-icon-del iconfont icon-tixing"></span>
        <span class="close-left" v-if="isDelColse === '1'">确认禁用此策略?</span>
        <span class="close-left" v-if="isDelColse === '删除'">确定要删除此策略?</span>
      </div>
      <div class="add-footer">
        <Button @click="delOk" class="fusion-del-ok" type="primary">
          确定
        </Button>
        <Button @click="cancel_del()" class="fusion-del-cancel" style="margin-left: 8px">
          取消
        </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { delLog, delLogSwith, delManage, logDelList } from '../../../../api/log/log'

export default {
  props: ['cutData'],
  data() {
    return {
      date: [],
      indexName: '',
      editModel: false,
      delModel: false,
      size: 10,
      current: 1,
      logDelTotal: 0,
      formObject: '3天',
      delId: '',
      editId: '',
      isDelColse: '',
      options: {
        disabledDate(date) {
          return date && date.valueOf() >= new Date()
        }
      },
      cityList: [],
      delLabel: [
        {
          value: '3天',
          label: '3天'
        },
        {
          value: '5天',
          label: '5天'
        },
        {
          value: '1周',
          label: '1周'
        },
        {
          value: '1个月',
          label: '1个月'
        },
        {
          value: '3个月',
          label: '3个月'
        },
        {
          value: '半年',
          label: '半年'
        }
      ],
      openArray: [
        {
          value: '用户名',
          label: '用户名'
        },
        {
          value: '用户ID',
          label: '用户ID'
        },
        {
          value: 'IP地址',
          label: 'IP地址'
        },
        {
          value: '企业',
          label: '企业'
        }
      ],
      columnLogDel: [
        {
          title: '日志索引名称',
          key: 'indexName'
        },
        {
          title: '删除策略',
          key: 'delPolicy'
        },
        {
          title: '操作',
          slot: 'operate',
          width: 200
        }
      ],
      dataLogDel: []
    }
  },
  created() {
    this.delList()
  },
  computed: {
    limitDelete() {
      let limit = false
      this.cutData.forEach((data, ind) => {
        if (data.menuCode === 'LOG_DEL_DELETE') {
          limit = true
        }
      })
      return limit
    },
    limitManage() {
      let limit = false
      this.cutData.forEach((data, ind) => {
        if (data.menuCode === 'LOG_DEL_EDIT') {
          limit = true
        }
      })
      return limit
    },
    limitStop() {
      let limit = false
      this.cutData.forEach((data, ind) => {
        if (data.menuCode === 'LOG_DEL_STATUS') {
          limit = true
        }
      })
      return limit
    }
  },
  methods: {
    // 管理更新弹框
    addEditModel(id) {
      this.editModel = true
      this.editId = id
    },
    // 确定更新
    editOk() {
      let params = {
        opId: this.editId,
        formObject: this.formObject
      }
      delManage(params).then(res => {
        if (res.status === 0) {
          this.$Message.success(res.msg || '成功!')
          this.editModel = false
          this.delList()
        } else {
          this.$Message.success(res.msg || '成功!')
        }
      })
    },
    // 管理取消按钮
    handleReset(name) {
      this.editModel = false
    },
    // 获取列表
    delList: function(current) {
      if (current) this.current = current
      let params = {
        indexName: this.indexName,
        size: this.size,
        current: this.current
      }
      logDelList(params).then(res => {
        if (res.status === 0) {
          this.dataLogDel = res.results.records
          this.logDelTotal = res.results.total
        }
      })
    },
    logDelSize: function(limit) {
      this.size = limit
      this.current = 1
      this.delList()
    },
    logDelCurrent: function(limit) {
      this.current = limit
      this.delList()
    },
    // 重置按钮
    reset: function() {
      this.indexName = ''
      this.current = 1
      this.size = 10
      this.delList()
    },
    // 是否删除
    isDelete: function(id, text) {
      this.delModel = true
      this.delId = id
      this.isDelColse = text
    },
    // 确定删除
    delOk: function() {
      if (this.isDelColse === '删除') {
        let params = {
          opId: this.delId
        }
        delLog(params).then(res => {
          if (res.status === 0) {
            this.$Message.success(res.msg || '成功!')
            this.delModel = false
            this.delList()
          } else {
            this.$Message.success(res.msg || '成功!')
          }
        })
      } else {
        this.swithClick(this.delId, this.isDelColse)
      }
    },
    // 删除取消按钮
    cancel_del: function() {
      this.delModel = false
    },
    // 启用禁用
    swithClick: function(id, type) {
      let params = {
        opId: id,
        switchs: type
      }
      delLogSwith(params).then(res => {
        if (res.status === 0) {
          this.delList()
          this.delModel = false
        }
      })
    }
  }
}
</script>
