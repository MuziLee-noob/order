<style lang="less" scoped>
@import './index.less';
</style>
<template>
  <div class="fusion-manage">
    <div class="middle"></div>
    <div class="fusion-header serve">
      <Row class="row-bottom" v-if="limitAdd">
        <Button @click="addEditModel('创建字典', '', '1')" class="fusion-new" type="primary">
          <Icon type="md-add" />
          创建字典
        </Button>
      </Row>
      <Row class="check-condition clearfix">
        <Form :label-width="80">
          <FormItem label="字典编码" class="mgr">
            <Input placeholder="请输入" v-model="dictCode" />
          </FormItem>
          <FormItem label="字典名称" class="mgr">
            <Input placeholder="请输入" v-model="dictName" />
          </FormItem>
          <FormItem label="字典类型">
            <Select v-model="dictClass" @on-change="dictionList(1)" clearable>
              <Option :key="item.itemCode" :value="item.itemCode" v-for="item in policyTimes">
                {{ item.itemName }}
              </Option>
            </Select>
          </FormItem>
          <div class="btns">
            <Button @click="dictionList(1)" class="search apply">查询</Button>
            <Button @click="reset" class="reset">重置</Button>
            <span @click="dictionList(1)" class="refurbish iconfont icon-refresh"></span>
          </div>
        </Form>
      </Row>
    </div>
    <div class="middle"></div>
    <div class="policy-table">
      <Table :columns="columndic" :data="datadic" stripe>
        <template slot="operate" slot-scope="{ row }">
          <span
            @click="addEditModel('编辑字典', row.opId, '2')"
            class="new-color"
            style="margin-right: 20px"
            v-if="limitEdit"
          >
            编辑
          </span>
          <span
            @click="jump(row.dictCode)"
            class="new-color"
            style="margin-right: 20px"
            v-if="limitManage"
          >
            管理
          </span>
          <span @click="isDelete(row.opId, '删除')" class="new-color" v-if="limitDelete">删除</span>
        </template>
      </Table>
      <pagination
        :page-size="size"
        :show-info="true"
        :currentPage="current"
        :total="userTotal"
        @on-change="dictionList"
        @on-page-size-change="userSize"
      />
    </div>
    <!-- 添加/编辑弹框 -->
    <Modal
      :title="userTitle"
      footer-hide
      class="pop-up"
      @on-visible-change="closeModal('formValidate')"
      v-model="userModel"
      width="683"
    >
      <Form :label-width="80" :model="formValidate" :rules="ruleValidate" ref="formValidate">
        <FormItem label="字典编码" prop="dictCode">
          <Input
            maxlength="50"
            placeholder="字典编码"
            show-word-limit
            v-model="formValidate.dictCode"
          />
        </FormItem>
        <FormItem label="字典名称" prop="dictName">
          <Input
            maxlength="30"
            placeholder="请输入字典名称"
            show-word-limit
            v-model="formValidate.dictName"
          />
        </FormItem>
        <FormItem label="字典类型" prop="dictClass">
          <Select v-model="formValidate.dictClass" clearable>
            <Option v-for="item in policyTimes" :value="item.itemCode" :key="item.itemCode">
              {{ item.itemName }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="字典备注">
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
        <Button @click="addic('formValidate')" class="fusion-add-ok">
          确定
        </Button>
        <Button @click="handleReset('formValidate')" class="fusion-add-cancel">
          取消
        </Button>
      </div>
    </Modal>
    <!-- 查看用户信息 -->
    <Modal title="查看用户" footer-hide class="pop-up" v-model="userInfoModel">
      <div class="search">
        <Row class="serch-row">
          <i-col span="12">
            <span class="search-span">用户账户：</span>
            <span>A1</span>
          </i-col>
          <i-col span="12">
            <span class="search-span">用户姓名：</span>
            <span>a11</span>
          </i-col>
        </Row>
        <Row class="serch-row">
          <i-col span="12">
            <span class="search-span">手机号码：</span>
            <span>13439855737</span>
          </i-col>
          <i-col span="12">
            <span class="search-span">邮箱地址：</span>
            <span>1312788455@qq.com</span>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <span class="search-span">用户组：</span>
            <span>
              用户组A
            </span>
          </i-col>
          <i-col span="12">
            <span class="search-span">状态：</span>
            <span>启用</span>
          </i-col>
        </Row>
      </div>
      <div class="add-footer">
        <Button @click="userInfoModel = false" class="fusion-add-ok">
          确定
        </Button>
        <Button @click="userInfoModel = false" class="fusion-add-cancel">
          取消
        </Button>
      </div>
    </Modal>
    <!-- 删除和重置密码弹框 -->
    <Modal id="fusion-del" footer-hide class="pop-up delete" v-model="delModel" width="451">
      <p slot="header">
        <span>提示</span>
      </p>
      <div class="content">
        <span class="new-icon-del iconfont icon-tixing"></span>
        <span class="close-left" v-if="isDelColse === '删除'">确定要删除此字典?</span>
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
  dictionaryCreate,
  dictionaryDelete,
  dictionaryInit,
  dictionaryList,
  dictionarySelect,
  dictionaryEdit
} from '../../api/dictionary/dictionary'

export default {
  data() {
    return {
      userModel: false,
      userInfoModel: false,
      dictClass: '',
      dictCode: '',
      dictName: '',
      userTitle: '',
      userTotal: 0,
      size: 10,
      current: 1,
      delModel: false,
      isDelColse: '',
      delId: '',
      useropId: '',
      editId: '',
      policyTimes: [],
      columndic: [
        {
          title: '序号',
          type: 'index',
          width: 80,
          align: 'center'
        },
        {
          title: '字典编码',
          key: 'dictCode',
          tooltip: true
        },
        {
          title: '字典名称',
          key: 'dictName',
          tooltip: true
        },
        {
          title: '字典类型',
          key: 'dictClass',
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
          width: 200
        }
      ],
      datadic: [],
      formValidate: {
        dictName: '',
        dictCode: '',
        dictClass: '',
        remark: ''
      },
      ruleValidate: {
        dictName: [
          { required: true, type: 'string', message: '输入不能为空', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: '请输入中文、英文、数字或下划线' }
        ],
        dictCode: [
          { required: true, type: 'string', message: '输入不能为空', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z_]{1,}$/, message: '请输入英文、数字或下划线' }
        ],
        // policyValidityValue: [
        //   { required: true, type: 'string', message: '输入不能为空', trigger: 'blur' },
        //   { pattern: /^[1-9]+[0-9]*$/, message: '请输入正整数' }
        // ],
        dictClass: [
          { required: true, type: 'string', message: '请选择字典类型', trigger: 'change' }
        ]
      },
      limitAdd: false,
      limitEdit: false,
      limitManage: false,
      limitDelete: false
    }
  },
  created() {
    this.dictionList(1)
    this.initdisSel()
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      let limits = JSON.parse(localStorage.getItem('btnLimit'))
      if (limits) {
        limits.forEach((data, ind) => {
          if (data.name === this.$route.name) {
            data.children.forEach((val, i) => {
              if (val.menuCode === 'OM_DICT_CREATE') {
                this.limitAdd = true
              } else if (val.menuCode === 'OM_DICT_UPDATE') {
                this.limitEdit = true
              } else if (val.menuCode === 'OM_DICT_DETAIL') {
                this.limitManage = true
                localStorage.setItem('dicData', JSON.stringify(val.children))
              } else if (val.menuCode === 'OM_DICT_DELETE') {
                this.limitDelete = true
              }
            })
          }
        })
      }
    },
    //点击管理跳转页面
    jump: function(dictCode) {
      this.$router.push({ path: '/dictionary-manage', query: { dictCode: dictCode } })
    },
    // 获取字典类型
    initdisSel() {
      let params = {
        dictCode: 'zy_standard_type'
      }
      dictionarySelect(params).then(res => {
        if (res.status === 0) {
          this.policyTimes = res.results
        }
      })
    },
    // 创建和管理弹框
    addEditModel(title, id) {
      this.userModel = true
      this.userTitle = title
      if (title === '创建字典') {
        this.dicEditData = {}
        this.formValidate.opId = ''
      } else {
        this.editId = id
        this.initdic(id)
      }
    },
    handleReset(name) {
      this.userModel = false
      this.$refs[name].resetFields()
      this.formValidate.remark = ''
    },
    // 获取列表
    dictionList: function(current) {
      if (current) this.current = current
      let params = {
        dictCode: this.dictCode,
        dictName: this.dictName,
        dictClass: this.dictClass,
        size: this.size,
        current: this.current
      }
      dictionaryList(params).then(res => {
        if (res.status === 0) {
          this.datadic = res.results.records
          this.userTotal = res.results.total
          this.datadic.forEach(data => {
            if (data.dictClass === '9') {
              data.dictClass = '自定义'
            } else if (data.dictClass === '1') {
              data.dictClass = '国际标准'
            } else if (data.dictClass === '2') {
              data.dictClass = '国家标准'
            } else {
              data.dictClass = '行业标准'
            }
          })
        }
      })
    },
    userSize: function(limit) {
      this.size = limit
      this.current = 1
      this.dictionList()
    },
    userCurrent: function(limit) {
      this.current = limit
      this.dictionList()
    },
    reset: function() {
      this.dictClass = ''
      this.dictCode = ''
      this.dictName = ''
      this.dictionList(1)
    },
    // 创建和管理字典
    addic(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.userTitle === '创建字典') {
            dictionaryCreate(this.formValidate).then(res => {
              if (res.status === 0) {
                this.$Message.success(res.msg || '成功!')
                this.userModel = false
                this.dictionList()
                this.$refs[name].resetFields()
                this.formValidate.remark = ''
              } else {
                this.$Message.error(res.msg || '失败!')
              }
            })
          } else {
            this.formValidate.opId = this.editId
            let params = this.formValidate
            dictionaryEdit(params).then(res => {
              if (res.status === 0) {
                this.$Message.success(res.msg || '成功!')
                this.userModel = false
                this.dictionList()
                this.$refs[name].resetFields()
                this.formValidate.remark = ''
              } else {
                this.$Message.error(res.msg || '失败!')
              }
            })
          }
        }
      })
    },
    // 管理初始化
    initdic(id) {
      let params = {
        opId: id
      }
      dictionaryInit(params).then(res => {
        if (res.status === 0) {
          this.dicEditData = res.results
          this.formValidate.dictClass = this.dicEditData.dictClass
          this.formValidate.dictCode = this.dicEditData.dictCode
          this.formValidate.dictName = this.dicEditData.dictName
          this.formValidate.remark = this.dicEditData.remark
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
        dictionaryDelete(params).then(res => {
          if (res.status === 0) {
            this.$Message.success(res.msg || '成功!')
            this.delModel = false
            this.dictionList()
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
    //点击右上角按钮关闭
    closeModal(name) {
      this.$refs[name].resetFields()
    }
  }
}
</script>
