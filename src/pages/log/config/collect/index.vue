<style lang="less" scoped>
@import '../index.less';
</style>
<template>
  <div class="fusion-manage">
    <div class="fusion-header serve">
      <Row class="row-bottom">
        <Button @click="addEditModel('CREATE', '', '1')" class="fusion-new" type="primary">
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
              placement="bottom-end"
              separator="~"
              @on-ok="collectList(1)"
              type="daterange"
              v-model="date"
            ></DatePicker>
          </FormItem>
          <FormItem label="es索引" class="mgr">
            <Input placeholder="请输入" v-model="indexName" />
          </FormItem>
          <div class="btns">
            <Button @click="collectList(1)" class="search apply">查询</Button>
            <Button class="reset" @click="reset">重置</Button>
            <span @click="collectList(1)" class="refurbish iconfont icon-refresh"></span>
          </div>
        </Form>
      </Row>
    </div>
    <div class="middle"></div>
    <div class="policy-table">
      <Table :columns="columncollect" :data="datacollect" stripe>
        <template slot="operate" slot-scope="{ row }">
          <span
            @click="addEditModel('EDIT', row.opId, '2')"
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
            停止
          </span>
          <!-- <span @click="isDelete(row.opId, '删除')" class="new-color">删除</span> -->
        </template>
      </Table>
      <pagination
        :page-size="size"
        :show-info="true"
        :currentPage="current"
        :total="collectTotal"
        @on-change="collectList"
        @on-page-size-change="collectSize"
      />
    </div>
    <!-- 添加/编辑弹框 -->
    <Modal
      :title="collectTitle"
      footer-hide
      id="userModel"
      class="pop-up"
      @on-visible-change="closeModal('formValidate')"
      v-model="collectModel"
      width="683"
    >
      <Form :label-width="110" :model="formValidate" :rules="ruleValidate" ref="formValidate">
        <!-- <FormItem label="配置ID" v-if="edit">
          <Input v-model="opId" disabled />
        </FormItem> -->
        <FormItem label="策略名称" prop="policyName">
          <Input
            maxlength="20"
            placeholder="请输入策略名称"
            show-word-limit
            v-model="formValidate.policyName"
          />
        </FormItem>
        <!-- v-if="add" -->
        <FormItem label="目标主机IP" prop="objectIp">
          <Input placeholder="请输入目标主机IP" v-model="formValidate.objectIp" />
        </FormItem>
        <!-- <FormItem label="目标主机IP" prop="objectIp" v-if="edit">
          <Input v-model="formValidate.objectIp" placeholder="请输入目标主机IP" disabled />
        </FormItem> -->
        <FormItem label="目标主机名称" prop="objectName">
          <Input placeholder="请输入目标主机名称" v-model="formValidate.objectName" />
        </FormItem>
        <FormItem label="日志文件位置" prop="logPath">
          <Input placeholder="请输入日志文件位置" v-model="formValidate.logPath" />
        </FormItem>
        <FormItem label="索引名称" prop="indexName">
          <Input placeholder="请输入索引名称" v-model="formValidate.indexName" />
        </FormItem>
        <FormItem label="保存位置" prop="savePath">
          <Input placeholder="请输入保存位置" v-model="formValidate.savePath" />
        </FormItem>
        <FormItem label="解析规则" prop="parsingRule">
          <Input placeholder="请输入解析规则" v-model="formValidate.parsingRule" />
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
    <Modal id="fusion-del" class="pop-up delete" v-model="delModel" footer-hide width="451">
      <p slot="header">
        <span>提示</span>
      </p>
      <div class="content">
        <span class="new-icon-del iconfont icon-tixing"></span>
        <span class="close-left" v-if="isDelColse === '1'">确认停用此采集吗?</span>
        <span class="close-left" v-if="isDelColse === '删除'">确定删除此采集吗?</span>
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
  logCollectCreat,
  logCollectDel,
  logCollectEdit,
  logCollectInit,
  logCollectList,
  logCollectSwith
} from '../../../../api/log/log'
import { dateFormat } from '../../../../libs/tools'

export default {
  // props: ['collectData'],
  data() {
    return {
      date: [],
      collectModel: false,
      delModel: false,
      indexName: '',
      value: '',
      collectTitle: '',
      collectTotal: 0,
      edit: false,
      opId: '',
      add: false,
      size: 10,
      current: 1,
      editId: '',
      isDelColse: '',
      options: {
        disabledDate(date) {
          return date && date.valueOf() >= new Date()
        }
      },
      cityList: [],
      columncollect: [
        {
          title: '策略ID',
          key: 'id',
          tooltip: true,
          minWidth: 100
        },
        {
          title: '策略名称',
          key: 'policyName',
          tooltip: true,
          minWidth: 100
        },
        {
          title: '目标主机IP',
          key: 'objectIp',
          tooltip: true,
          minWidth: 120
        },
        {
          title: '日志文件位置',
          key: 'logPath',
          tooltip: true,
          minWidth: 140
        },
        {
          title: '保存位置',
          key: 'savePath',
          tooltip: true,
          minWidth: 100
        },
        {
          title: '解析规则',
          key: 'parsingRule',
          tooltip: true,
          minWidth: 100
        },
        {
          title: '创建人',
          key: 'createBy',
          tooltip: true,
          minWidth: 100
        },
        {
          title: '创建时间',
          key: 'createTime',
          width: 170
        },
        {
          title: '索引名称',
          key: 'indexName',
          tooltip: true,
          minWidth: 100
        },
        {
          title: '操作',
          width: 180,
          slot: 'operate'
        }
      ],
      datacollect: [],
      formValidate: {
        policyName: '',
        objectIp: '',
        objectName: '',
        logPath: '',
        indexName: '',
        savePath: '',
        parsingRule: ''
      },
      ruleValidate: {
        policyName: [{ required: true, type: 'string', message: '输入不能为空', trigger: 'blur' }],
        objectIp: [
          { required: true, type: 'string', message: '输入不能为空', trigger: 'blur' },
          {
            pattern:
              '^((25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d))$',
            message: '请输入正确的ip地址',
            trigger: 'blur'
          }
        ],
        objectName: [
          // { required: true, type: 'string', message: '输入不能为空', trigger: 'blur' }
        ],
        logPath: [{ required: true, type: 'string', message: '输入不能为空', trigger: 'blur' }],
        indexName: [
          { required: true, type: 'string', message: '输入不能为空', trigger: 'blur' },
          {
            pattern: '^[\u4e00-\u9fa5_a-z0-9-_]{1,30}$',
            message: '只能1-30个字符，支持小写英文、数字、符号、_、-',
            trigger: 'blur'
          }
        ],
        savePath: [
          { required: true, type: 'string', message: '输入不能为空', trigger: 'blur' },
          { min: 1, max: 100, message: '保存位置不能超过100个字符', trigger: 'blur' }
        ],
        parsingRule: [
          // { required: true, type: 'string', message: '输入不能为空', trigger: 'blur' },
          { min: 1, max: 100, message: '规则解析不能超过100个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.date = [this.prevMonth, this.today]
  },
  created() {
    this.getToday()
    this.collectList()
  },
  computed: {
    // limitAdd() {
    //   let limit = false
    //   for (let i = 0; i < this.collectData.length; i++) {
    //     if (this.collectData[i].menuCode === 'LOG_COLL_CREATE') {
    //       limit = true
    //     }
    //   }
    //   return limit
    // },
    // limitManage() {
    //   let limit = false
    //   for (let i = 0; i < this.collectData.length; i++) {
    //     if (this.collectData[i].menuCode === 'LOG_COLL_EDIT') {
    //       limit = true
    //     }
    //   }
    //   return limit
    // },
    // limitStop() {
    //   let limit = false
    //   for (let i = 0; i < this.collectData.length; i++) {
    //     if (this.collectData[i].menuCode === 'LOG_COLL_STATUS') {
    //       limit = true
    //     }
    //   }
    //   return limit
    // }
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
      this.getPrevMonth()
      this.date = [this.prevMonth, this.today]
    },
    // 获取前一个月的时间
    getPrevMonth: function() {
      const nowdates = new Date()
      nowdates.setMonth(nowdates.getMonth() - 1)
      var y = nowdates.getFullYear()
      var m = nowdates.getMonth() + 1
      var d = nowdates.getDate()
      if (m < 10) {
        m = '0' + m
      }
      if (d < 10) {
        d = '0' + d
      }
      this.prevMonth = y + '-' + m + '-' + d
      console.log(this.prevMonth)
    },
    // 创建和管理弹框
    addEditModel(title, id) {
      this.collectModel = true
      this.collectTitle = title
      if (title === 'CREATE') {
        this.collectEditData = {}
        // this.formValidate = {}
        this.formValidate.opId = ''
        this.edit = false
        this.add = true
      } else if (title === 'EDIT') {
        this.editId = id
        this.edit = true
        this.add = false
        this.initCollect(id)
      }
    },
    handleReset(name) {
      this.collectModel = false
      this.$refs[name].resetFields()
    },
    // 获取列表
    collectList: function(current) {
      if (current) this.current = current
      if (typeof this.date[0] === 'object') {
        this.date[0] = dateFormat('YYYY-mm-dd', this.date[0])
      }
      if (typeof this.date[1] === 'object') {
        this.date[1] = dateFormat('YYYY-mm-dd', this.date[1])
      }
      let params = {
        startTime: this.date[0],
        endTime: this.date[1],
        indexName: this.indexName,
        size: this.size,
        current: this.current
      }
      logCollectList(params).then(res => {
        if (res.status === 0) {
          this.datacollect = res.results.records
          this.collectTotal = res.results.total
        }
      })
    },
    collectSize: function(limit) {
      this.size = limit
      this.current = 1
      this.collectList()
    },
    collectCurrent: function(limit) {
      this.current = limit
      this.collectList()
    },
    // 创建和管理策略
    addCollect(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.collectTitle === '创建策略') {
            logCollectCreat(this.formValidate).then(res => {
              if (res.status === 0) {
                this.$Message.success(res.msg || '成功!')
                this.collectModel = false
                this.collectList()
                this.$refs[name].resetFields()
              } else {
                this.$Message.error(res.msg || '失败!')
              }
            })
          } else {
            this.formValidate.opId = this.editId
            let params = this.formValidate
            logCollectEdit(params).then(res => {
              if (res.status === 0) {
                this.$Message.success(res.msg || '成功!')
                this.collectModel = false
                this.collectList()
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
      this.$refs.formValidate.resetFields()
      logCollectInit(params).then(res => {
        if (res.status === 0) {
          this.collectEditData = res.results
          this.opId = this.collectEditData.id
          this.formValidate.policyName = this.collectEditData.policyName
          this.formValidate.objectIp = this.collectEditData.objectIp
          this.formValidate.objectName = this.collectEditData.objectName
          this.formValidate.logPath = this.collectEditData.logPath
          this.formValidate.indexName = this.collectEditData.indexName
          this.formValidate.savePath = this.collectEditData.savePath
          this.formValidate.parsingRule = this.collectEditData.parsingRule
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
        logCollectDel(params).then(res => {
          if (res.status === 0) {
            this.$Message.success(res.msg || '成功!')
            this.delModel = false
            this.collectList()
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
      logCollectSwith(params).then(res => {
        if (res.status === 0) {
          this.collectList()
          this.delModel = false
        }
      })
    },
    reset: function() {
      this.indexName = ''
      this.collectList(1)
    },
    //点击右上角按钮关闭
    closeModal(name) {
      this.$refs[name].resetFields()
    }
  }
}
</script>
