<style lang="less" scoped>
@import '../index.less';
</style>
<template>
  <div class="fusion-manage">
    <div class="fusion-header serve">
      <Row class="row-bottom" v-if="limitAdd">
        <Button @click="addEditModel('创建策略', '', '1')" class="fusion-new" type="primary">
          <Icon type="md-add" />
          创建策略
        </Button>
      </Row>
      <Row class="check-condition clearfix">
        <Form :label-width="80">
          <FormItem label="时间范围" class="mgr">
            <DatePicker
              :options="options"
              :clearable="false"
              confirm
              id="date"
              @on-ok="applyList(1)"
              placement="bottom-end"
              separator="~"
              type="daterange"
              v-model="date"
            ></DatePicker>
          </FormItem>
          <FormItem label="策略对象" class="mgr">
            <Select v-model="policyScopeCode" @on-change="searchListContent" clearable>
              <Option :key="item.opId" :value="item.opId" v-for="item in openArray">
                {{ item.policyName }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="策略内容" class="mgr" v-if="scoped">
            <Select v-model="policyDetailCode" @on-change="applyList(1)" clearable>
              <Option :key="item.opId" :value="item.opId" v-for="item in detailCode">
                {{ item.policyName }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="策略名称" class="mgr">
            <Input placeholder="请输入" v-model="policyName" />
          </FormItem>
          <FormItem label="输入值">
            <Input placeholder="请输入" v-model="policyValue" />
          </FormItem>
          <div class="btns">
            <Button @click="applyList(1)" class="search apply">查询</Button>
            <Button @click="reset" class="reset">重置</Button>
            <span @click="applyList(1)" class="refurbish iconfont icon-refresh"></span>
          </div>
        </Form>
      </Row>
    </div>
    <div class="middle"></div>
    <div class="policy-table">
      <Table :columns="columnuser" :data="datauser" stripe>
        <template slot="operate" slot-scope="{ row }">
          <span
            @click="addEditModel('管理', row.opId, '2')"
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
        :total="userTotal"
        :currentPage="current"
        @on-change="applyList"
        @on-page-size-change="applySize"
      />
    </div>
    <!-- 添加/编辑弹框 -->
    <Modal
      :title="userTitle"
      footer-hide
      id="userModel"
      class="pop-up"
      @on-visible-change="closeModal('formValidate')"
      v-model="userModel"
      width="683"
    >
      <Form :label-width="80" :model="formValidate" :rules="ruleValidate" ref="formValidate">
        <FormItem label="策略名称" prop="policyName">
          <Input
            maxlength="15"
            placeholder="请输入策略名称"
            show-word-limit
            v-model="formValidate.policyName"
          />
        </FormItem>
        <FormItem label="策略对象" prop="policyScopeCode">
          <Select
            @on-change="initDetailSelect(formValidate.policyScopeCode)"
            v-model="formValidate.policyScopeCode"
            clearable
          >
            <Option :key="item.opId" :value="item.opId" v-for="item in openArray">
              {{ item.policyName }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="策略内容" prop="policyDetailCode">
          <Select
            v-model="formValidate.policyDetailCode"
            :disabled="scopedCreat"
            placeholder="限制访问"
            clearable
          >
            <Option :key="item.opId" :value="item.opId" v-for="item in detailCode">
              {{ item.policyName }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="策略值" prop="policyValue">
          <Input placeholder="请按策略对象输入相对应值" v-model="formValidate.policyValue" />
        </FormItem>
        <FormItem label="有效期">
          <RadioGroup v-model="policyValidityType">
            <span @click="timeChange('0')"><Radio label="永久"></Radio></span>
            <span @click="timeChange('1')"><Radio label="限时"></Radio></span>
          </RadioGroup>
        </FormItem>
        <FormItem v-if="timeC === true">
          <Row>
            <i-col span="10">
              <FormItem label="" prop="policyValidityValue">
                <Input placeholder="请输入正整数" v-model="formValidate.policyValidityValue" />
              </FormItem>
            </i-col>
            <i-col span="10" style="float:right">
              <FormItem label="" prop="policyValidityTimeUnit">
                <Select v-model="formValidate.policyValidityTimeUnit" clearable>
                  <Option :key="item.value" :value="item.value" v-for="item in policyTimes">
                    {{ item.label }}
                  </Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
        </FormItem>
      </Form>
      <div class="add-footer">
        <Button @click="addCollect('formValidate')" class="fusion-add-ok">
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
  apiConfigCreate,
  apiConfigDelete,
  apiConfigInit,
  apiConfigList,
  apiConfigObject,
  apiConfigSwith,
  configEditOk,
  configInit
} from '../../../../api/policy/policy'
import { dateFormat } from '../../../../libs/tools'

export default {
  props: ['applyData'],
  data() {
    return {
      date: [],
      policyTime: [],
      userModel: false,
      policyValue: '',
      policyTypeCode: '',
      policyName: '',
      policyObjectOpId: '',
      userTitle: '',
      policyScopeCode: '',
      policyDetailCode: '',
      scoped: false,
      scopedCreat: true,
      eventStartTime: '',
      eventEndTime: '',
      animal: '永久',
      policyValidityType: '',
      timeC: false,
      userTotal: 0,
      size: 10,
      current: 1,
      delModel: false,
      isDelColse: '',
      delId: '',
      useropId: '',
      editId: '',
      options: {
        disabledDate(date) {
          return date && date.valueOf() >= new Date()
        }
      },
      cityList: [],
      openArray: [],
      detailCode: [],
      policyTimes: [
        {
          value: '分钟',
          label: '分钟'
        },
        {
          value: '时',
          label: '时'
        },
        {
          value: '天',
          label: '天'
        },
        {
          value: '月',
          label: '月'
        },
        {
          value: '年',
          label: '年'
        }
      ],
      columnuser: [
        {
          title: '策略名称',
          key: 'policyName',
          tooltip: true
        },
        {
          title: '策略对象',
          key: 'policyScopeValue',
          tooltip: true
        },
        {
          title: '策略内容',
          key: 'policyDetailValue',
          tooltip: true
        },
        {
          title: '策略值',
          key: 'policyValue',
          tooltip: true
        },
        {
          title: '策略有效期',
          key: 'timeStr',
          tooltip: true
        },
        {
          title: '创建时间',
          key: 'createTime',
          width: 170
        },
        {
          title: '操作',
          slot: 'operate',
          width: 200
        }
      ],
      datauser: [],
      formValidate: {
        policyName: '',
        policyScopeCode: '',
        policyDetailCode: '',
        policyValue: '',
        policyValidityValue: '',
        policyValidityTimeUnit: '分钟'
      },
      ruleValidate: {
        policyName: [{ required: true, type: 'string', message: '输入不能为空', trigger: 'blur' }],
        policyValidityValue: [
          { required: true, type: 'string', message: '输入不能为空', trigger: 'blur' },
          { pattern: /^[1-9]+[0-9]*$/, message: '请输入正整数' }
        ],
        policyScopeCode: [{ required: true, message: '请选择策略对象', trigger: 'change' }],
        policyDetailCode: [
          { required: true, type: 'string', message: '请选择策略内容', trigger: 'change' }
        ],
        policyValue: [{ required: true, type: 'string', message: '输入不能为空', trigger: 'blur' }]
        // policyValidityType: [{ required: true, trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.date = [this.today, this.today]
  },
  computed: {
    limitAdd() {
      let limit = false
      this.applyData.forEach((data, ind) => {
        if (data.menuCode === 'DEPLOY_APP_CREATE') {
          limit = true
        }
      })
      return limit
    },
    limitManage() {
      let limit = false
      this.applyData.forEach((data, ind) => {
        if (data.menuCode === 'DEPLOY_APP_EDIT') {
          limit = true
        }
      })
      return limit
    },
    limitStop() {
      let limit = false
      this.applyData.forEach((data, ind) => {
        if (data.menuCode === 'DEPLOY_APP_STATUS') {
          limit = true
        }
      })
      return limit
    },
    limitDelete() {
      let limit = false
      this.applyData.forEach((data, ind) => {
        if (data.menuCode === 'DEPLOY_APP_DELETE') {
          limit = true
        }
      })
      return limit
    }
  },
  created() {
    this.getToday()
    this.applyList()
    this.initopId()
    this.formValidate.policyValidTimeUnit = this.policyTimes[0].value
  },
  methods: {
    // 获取当天的时间
    getToday: function() {
      var nowdate = new Date()
      var y = nowdate.getFullYear()
      var m = nowdate.getMonth() + 1
      var d = nowdate.getDate()
      if (m < 10) {
        m = '0' + m
      }
      if (d < 10) {
        d = '0' + d
      }
      this.today = y + '-' + m + '-' + d
      this.date = [this.today, this.today]
    },
    // 搜索条件筛选列表和获取策略内容
    searchListContent: function() {
      if (this.policyScopeCode !== '' && this.policyScopeCode !== undefined) {
        this.scoped = true
        this.initDetailSelect(this.policyScopeCode)
      } else {
        this.scoped = false
      }
    },
    // 获取opId
    initopId() {
      let params = {
        key: 'app'
      }
      apiConfigInit(params).then(res => {
        if (res.status === 0) {
          this.useropId = res.results
          this.initObjectSelect()
        }
      })
    },
    // 获取下拉框
    initObjectSelect() {
      let params = {
        opId: this.useropId
      }
      apiConfigObject(params).then(res => {
        if (res.status === 0) {
          this.openArray = res.results
          if (this.formValidate.policyScopeCode !== '') {
            this.initDetailSelect(this.formValidate.policyScopeCode)
          }
        }
      })
    },
    // 通过第一个下拉框获取第二个下拉框内容
    initDetailSelect(code) {
      if (code !== '') {
        this.scopedCreat = false
      } else {
        this.scopedCreat = true
      }
      let params = {
        opId: code
      }
      apiConfigObject(params).then(res => {
        if (res.status === 0) {
          this.detailCode = res.results
        }
      })
    },
    // 创建和管理弹框
    addEditModel(title, id) {
      this.userModel = true
      this.userTitle = title
      this.initopId()
      if (title === '创建策略') {
        this.collectEditData = {}
        this.formValidate.opId = ''
        this.timeC = false
        this.policyValidityType = '永久'
        this.formValidate.policyValidityValue = ''
        this.formValidate.policyValidityTimeUnit = '分钟'
        this.scopedCreat = true
      } else {
        this.editId = id
        // this.initObjectSelect()
        // this.initDetailSelect(this.formValidate.policyScopeCode)
        this.initCollect(id)
      }
    },
    handleReset(name) {
      this.userModel = false
      this.$refs[name].resetFields()
    },
    // 永久和限时切换
    timeChange(animal) {
      if (animal === '0') {
        this.timeC = false
      } else {
        this.timeC = true
        this.formValidate.policyValidityValue = ''
        this.formValidate.policyValidityTimeUnit = '分钟'
      }
    },
    // 获取列表
    applyList: function(current) {
      if (current) this.current = current
      if (typeof this.date[0] === 'object') {
        this.date[0] = dateFormat('YYYY-mm-dd', this.date[0])
      }
      if (typeof this.date[1] === 'object') {
        this.date[1] = dateFormat('YYYY-mm-dd', this.date[1])
      }
      let params = {
        eventStartTime: this.date[0],
        eventEndTime: this.date[1],
        policyScopeCode: this.policyScopeCode,
        policyDetailCode: this.policyDetailCode,
        policyName: this.policyName,
        policyValue: this.policyValue,
        policyTypeCode: 'app',
        size: this.size,
        current: this.current
      }
      apiConfigList(params).then(res => {
        if (res.status === 0) {
          this.datauser = res.results.records
          this.userTotal = res.results.total
        }
      })
    },
    applySize: function(limit) {
      this.size = limit
      this.current = 1
      this.applyList()
    },
    applyCurrent: function(limit) {
      this.current = limit
      this.applyList()
    },
    reset: function() {
      this.date = [this.today, this.today]
      this.policyScopeCode = ''
      this.policyDetailCode = ''
      this.policyName = ''
      this.policyValue = ''
      this.applyList(1)
    },
    // 创建和管理策略
    addCollect(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.userTitle === '创建策略') {
            this.formValidate.policyTypeCode = 'app'
            if (this.policyValidityType === '永久') {
              this.formValidate.policyValidityType = '0'
              this.formValidate.policyValidityValue = ''
              this.formValidate.policyValidityTimeUnit = ''
            } else {
              this.formValidate.policyValidityType = '1'
            }
            apiConfigCreate(this.formValidate).then(res => {
              if (res.status === 0) {
                this.$Message.success(res.msg || '成功!')
                this.userModel = false
                this.applyList()
                this.$refs[name].resetFields()
              } else {
                this.$Message.error(res.msg || '失败!')
              }
            })
          } else {
            this.formValidate.opId = this.editId
            this.formValidate.policyTypeCode = 'app'
            if (this.policyValidityType === '永久') {
              this.formValidate.policyValidityType = '0'
              this.formValidate.policyValidityValue = ''
              this.formValidate.policyValidityTimeUnit = ''
            } else {
              this.formValidate.policyValidityType = '1'
            }
            let params = this.formValidate
            configEditOk(params).then(res => {
              if (res.status === 0) {
                this.$Message.success(res.msg || '成功!')
                this.userModel = false
                this.applyList()
                this.$refs[name].resetFields()
              } else {
                this.$Message.error(res.msg || '失败!')
              }
            })
          }
        }
      })
    },
    // 管理初始化
    initCollect(id) {
      let params = {
        opId: id
      }
      configInit(params).then(res => {
        if (res.status === 0) {
          this.collectEditData = res.results
          this.initDetailSelect(res.results.policyDetailCode)
          this.formValidate.policyName = this.collectEditData.policyName
          this.formValidate.policyScopeCode = this.collectEditData.policyScopeCode
          this.formValidate.policyDetailCode = this.collectEditData.policyDetailCode
          this.formValidate.policyValue = this.collectEditData.policyValue
          this.policyValidityType = this.collectEditData.policyValidityType
          if (this.policyValidityType === '0') {
            this.timeC = false
            this.policyValidityType = '永久'
          } else {
            this.timeC = true
            this.policyValidityType = '限时'
            this.formValidate.policyValidityValue = this.collectEditData.policyValidityValue
            this.formValidate.policyValidityTimeUnit = this.collectEditData.policyValidityTimeUnit
          }
        } else {
          this.$Message.error(res.msg || '失败!')
        }
      })
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
        apiConfigDelete(params).then(res => {
          if (res.status === 0) {
            this.$Message.success(res.msg || '成功!')
            this.delModel = false
            this.applyList()
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
      apiConfigSwith(params).then(res => {
        if (res.status === 0) {
          this.applyList()
          this.delModel = false
        }
      })
    },
    //点击右上角按钮关闭
    closeModal(name) {
      this.$refs[name].resetFields()
    }
  }
}
</script>
