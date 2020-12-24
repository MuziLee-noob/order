<style lang="less" scoped>
@import '../index.less';
</style>
<template>
  <div class="fusion-manage">
    <div class="policy-table">
      <Table :columns="columnHigh" :data="dataHigh" stripe>
        <template slot="config" slot-scope="{ row }">{{ row.configValue }} {{ row.unit }}</template>
        <template slot="operate" slot-scope="{ row }">
          <span
            @click="addEditModel(row.opId, row.remark)"
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
          <span class="new-color del" v-if="limitDelete && row.status === '1'">删除</span>
          <span
            @click="isDelete(row.opId, '删除')"
            class="new-color"
            v-if="limitDelete && row.status === '0'"
          >
            删除
          </span>
        </template>
      </Table>
      <pagination
        :page-size="10"
        :show-info="true"
        :total="highTotal"
        @on-change="highCurrent"
        @on-page-size-change="highSize"
      />
    </div>
    <!-- 管理弹框 -->
    <Modal
      footer-hide
      id="userModel"
      class="pop-up param"
      title="参数值"
      v-model="highModel"
      width="683"
    >
      <Form :label-width="165" :model="formValidate" :rules="ruleValidate" ref="formValidate">
        <FormItem label="用户登录失败次数上限" prop="configValue">
          <Input v-model="formValidate.configValue" />
          <Select style="width:90px" v-model="unitCode" clearable>
            <Option :key="item.code" :value="item.code" v-for="item in editSelect">
              {{ item.name }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="备注信息">
          {{ remark }}
        </FormItem>
      </Form>
      <div class="add-footer">
        <Button @click="editOk('formValidate')" class="fusion-add-ok">
          确定
        </Button>
        <Button @click="handleReset('formValidate')" class="fusion-add-cancel">
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
        <Button @click="cancel_del()" class="fusion-del-cancel">
          取消
        </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  highLog,
  highLogSelect,
  highLogSwith,
  initHigh,
  highManage,
  logCofigList
} from '../../../../api/log/log'

export default {
  props: ['highData'],
  data() {
    return {
      highModel: false,
      editId: '',
      delId: '',
      isDelColse: '',
      size: 10,
      current: 1,
      highTotal: 0,
      delModel: false,
      cityList: [],
      remark: '',
      unitCode: '',
      editSelect: [],
      columnHigh: [
        {
          title: '参数名称',
          key: 'configName'
        },
        {
          title: '参数值',
          slot: 'config'
        },
        {
          title: '参数范围',
          key: 'configRange'
        },
        {
          title: '备注',
          key: 'remark',
          tooltip: true
        },
        {
          title: '操作',
          slot: 'operate',
          width: 200
        }
      ],
      dataHigh: [],
      formValidate: {
        configValue: ''
      },
      ruleValidate: {
        configValue: [
          { required: true, type: 'string', message: '输入不能为空', trigger: 'blur' },
          { pattern: /^[1-9]+[0-9]*$/, message: '请输入正整数' }
        ]
      }
    }
  },
  created() {
    this.highList()
  },
  computed: {
    limitDelete() {
      let limit = false
      this.highData.forEach((data, ind) => {
        if (data.menuCode === 'LOG_CONFIG_DELETE') {
          limit = true
        }
      })
      return limit
    },
    limitManage() {
      let limit = false
      this.highData.forEach((data, ind) => {
        if (data.menuCode === 'LOG_CONFIG_EDIT') {
          limit = true
        }
      })
      return limit
    },
    limitStop() {
      let limit = false
      this.highData.forEach((data, ind) => {
        if (data.menuCode === 'LOG_CONFIG_STATUS') {
          limit = true
        }
      })
      return limit
    }
  },
  methods: {
    // 初始化管理下拉框
    initSelect(id) {
      let params = {
        opId: id
      }
      highLogSelect(params).then(res => {
        if (res.status === 0) {
          this.editSelect = res.results
        }
      })
    },
    addEditModel(id, remark) {
      this.highModel = true
      this.initSelect(id)
      this.initUpdate(id)
      this.remark = remark
      this.editId = id
    },
    // 初始化更新
    initUpdate(id) {
      let params = {
        opId: id
      }
      initHigh(params).then(res => {
        if (res.status === 0) {
          this.formValidate.configValue = res.results.configValue
          this.unitCode = res.results.unit
        }
      })
    },
    // 确定更新
    editOk(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let params = {
            opId: this.editId,
            configValue: this.formValidate.configValue,
            unitCode: this.unitCode
          }
          highManage(params).then(res => {
            if (res.status === 0) {
              this.$Message.success(res.msg || '成功!')
              this.highModel = false
              this.highList()
            } else {
              this.$Message.success(res.msg || '成功!')
            }
          })
        }
      })
    },
    handleReset(name) {
      this.$refs[name].resetFields()
      this.highModel = false
    },
    // 获取列表
    highList: function() {
      let params = {
        size: this.size,
        current: this.current
      }
      logCofigList(params).then(res => {
        if (res.status === 0) {
          this.dataHigh = res.results.records
          this.highTotal = res.results.total
        }
      })
    },
    highSize: function(limit) {
      this.size = limit
      this.current = 1
      this.highList()
    },
    highCurrent: function(limit) {
      this.current = limit
      this.highList()
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
        highLog(params).then(res => {
          if (res.status === 0) {
            this.$Message.success(res.msg || '成功!')
            this.delModel = false
            this.highList()
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
      highLogSwith(params).then(res => {
        if (res.status === 0) {
          this.highList()
          this.delModel = false
        }
      })
    }
  }
}
</script>
