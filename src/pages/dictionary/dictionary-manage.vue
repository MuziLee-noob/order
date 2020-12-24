<style lang="less" scoped>
@import './index.less';
</style>
<template>
  <div class="fusion-manage">
    <div class="middle"></div>
    <div class="fusion-header serve">
      <Row class="row-bottom" v-if="limitAdd">
        <Button @click="addEditModel('创建字典项', '')" class="fusion-new" type="primary">
          <Icon type="md-add" />
          创建字典项
        </Button>
      </Row>
      <Row class="check-condition clearfix">
        <Form :label-width="100">
          <FormItem label="字典项编码" class="mgr">
            <Input placeholder="请输入" v-model="itemCode" />
          </FormItem>
          <FormItem label="字典项名称" class="mgr">
            <Input placeholder="请输入" v-model="itemName" />
          </FormItem>
          <div class="btns">
            <Button @click="detailList(1)" class="search apply">查询</Button>
            <Button @click="reset" class="reset">重置</Button>
            <span @click="detailList(1)" class="refurbish iconfont icon-refresh"></span>
          </div>
        </Form>
      </Row>
    </div>
    <div class="middle"></div>
    <div class="policy-table">
      <Table :columns="columnDetails" :data="dataDetails" stripe>
        <template slot="operate" slot-scope="{ row }">
          <span
            @click="addEditModel('编辑字典', row.opId, '2')"
            class="new-color"
            style="margin-right: 20px"
            v-if="limitEdit"
          >
            编辑
          </span>
          <span @click="isDelete(row.opId, '删除')" class="new-color" v-if="limitDelete">删除</span>
        </template>
      </Table>
      <pagination
        :page-size="size"
        :show-info="true"
        :currentPage="current"
        :total="userTotal"
        @on-change="detailList"
        @on-page-size-change="userSize"
      />
    </div>
    <!-- 添加/编辑弹框 -->
    <Modal
      :title="userTitle"
      footer-hide
      id="userModel"
      class="pop-up"
      v-model="userModel"
      width="683"
    >
      <Form :label-width="120" :model="formValidate" :rules="ruleValidate" ref="formValidate">
        <FormItem label="字典项编码" prop="itemCode">
          <Input
            maxlength="50"
            placeholder="请输入字典项编码"
            show-word-limit
            v-model="formValidate.itemCode"
          />
        </FormItem>
        <FormItem label="字典项名称" prop="itemName">
          <Input
            maxlength="30"
            placeholder="请输入字典项名称"
            show-word-limit
            v-model="formValidate.itemName"
          />
        </FormItem>
        <FormItem label="字典项顺序" prop="sort">
          <Input
            maxlength="100"
            placeholder="请输入字典项顺序"
            show-word-limit
            v-model.number="formValidate.sort"
          />
        </FormItem>
        <FormItem label="字典项备注">
          <Input
            class="dis-input"
            v-model="formValidate.remark"
            type="textarea"
            maxlength="100"
            show-word-limit
            :rows="20"
            placeholder="请输入字典备注"
          />
        </FormItem>
      </Form>
      <div class="add-footer">
        <Button @click="addDetails('formValidate')" class="fusion-add-ok">
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
        <span class="close-left" v-if="isDelColse === '删除'">确定要删除此字典项?</span>
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
  detailsCreate,
  detailsyDelete,
  detailsInit,
  detailsList,
  detailsEdit
} from '../../api/dictionary/dictionary'

export default {
  data() {
    return {
      userModel: false,
      userInfoModel: false,
      itemName: '',
      itemCode: '',
      userTitle: '',
      userTotal: 0,
      size: 10,
      current: 1,
      delModel: false,
      isDelColse: '',
      delId: '',
      useropId: '',
      editId: '',
      columnDetails: [
        {
          title: '序号',
          type: 'index',
          width: 80,
          align: 'center'
        },
        {
          title: '字典项编码',
          key: 'itemCode',
          width: 150
        },
        {
          title: '字典项名称',
          key: 'itemName',
          tooltip: true
        },
        {
          title: '备注',
          key: 'remark',
          tooltip: true
        },
        {
          title: '操作',
          slot: 'operate',
          width: 150
        }
      ],
      dataDetails: [],
      formValidate: {
        itemCode: '',
        itemName: '',
        sort: '',
        remark: ''
      },
      ruleValidate: {
        itemCode: [
          { required: true, type: 'string', message: '输入不能为空', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z_]{1,}$/, message: '请输入英文、数字或下划线' }
        ],
        itemName: [
          { required: true, type: 'string', message: '输入不能为空', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: '请输入中文、英文、数字或下划线' }
        ],
        sort: [
          { required: true, type: 'number', message: '输入不能为空', trigger: 'blur' },
          { pattern: /^[1-9]+[0-9]*$/, message: '请输入正整数' }
        ]
      },
      limitAdd: true,
      limitEdit: true,
      limitDelete: true
    }
  },
  mounted() {
    // this.detialsCode = this.$route.query.dictCode
    this.init()
  },
  created() {
    this.detailList(1)
  },
  methods: {
    init() {
      let limits = JSON.parse(localStorage.getItem('dicData'))
      if (limits) {
        limits.forEach((data, ind) => {
          if (data.menuName === 'OM_DICT_DE_CREATE') {
            this.limitAdd = true
          } else if (data.menuName === 'OM_DICT_DE_UPDATE') {
            this.limitEdit = true
          } else if (data.menuName === 'OM_DICT_DE_DELETE') {
            this.limitDelete = true
          }
        })
      }
    },
    // 创建和管理弹框
    addEditModel(title, id) {
      this.userModel = true
      this.userTitle = title
      this.formValidate.remark = ''
      if (title === '创建字典项') {
        this.detailsData = {}
        this.formValidate.opId = ''
      } else {
        this.editId = id
        this.initDetails(id)
      }
    },
    handleReset(name) {
      this.userModel = false
      this.$refs[name].resetFields()
    },
    // 获取列表
    detailList: function(current) {
      if (current) this.current = current
      let params = {
        dictCode: this.$route.query.dictCode,
        itemCode: this.itemCode,
        itemName: this.itemName,
        size: this.size,
        current: this.current
      }
      detailsList(params).then(res => {
        if (res.status === 0) {
          this.dataDetails = res.results.records
          this.userTotal = res.results.total
        }
      })
    },
    userSize: function(limit) {
      this.size = limit
      this.current = 1
      this.detailList()
    },
    userCurrent: function(limit) {
      this.current = limit
      this.detailList()
    },
    reset: function() {
      this.itemCode = ''
      this.itemName = ''
      this.detailList(1)
    },
    // 创建和管理策略
    addDetails(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.userTitle === '创建字典项') {
            this.formValidate.dictCode = this.$route.query.dictCode
            detailsCreate(this.formValidate).then(res => {
              if (res.status === 0) {
                this.$Message.success(res.msg || '成功!')
                this.userModel = false
                this.detailList()
                this.$refs[name].resetFields()
              } else {
                this.$Message.error(res.msg || '失败!')
              }
            })
          } else {
            this.formValidate.opId = this.editId
            this.formValidate.dictCode = this.$route.query.dictCode
            let params = this.formValidate
            detailsEdit(params).then(res => {
              if (res.status === 0) {
                this.$Message.success(res.msg || '成功!')
                this.userModel = false
                this.detailList()
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
    initDetails(id) {
      let params = {
        opId: id
      }
      detailsInit(params).then(res => {
        if (res.status === 0) {
          this.detailsData = res.results
          this.formValidate.itemCode = this.detailsData.itemCode
          this.formValidate.itemName = this.detailsData.itemName
          this.formValidate.remark = this.detailsData.remark
          this.formValidate.sort = this.detailsData.sort
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
        detailsyDelete(params).then(res => {
          if (res.status === 0) {
            this.$Message.success(res.msg || '成功!')
            this.delModel = false
            this.detailList()
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
    }
  }
}
</script>
