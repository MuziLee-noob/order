<style lang="less" scoped>
@import '../index.less';
</style>
<template>
  <div class="fusion-manage">
    <div class="fusion-header serve">
      <div class="btnsCreate">
        <Button @click="newUser('新建', '')" class="create">新建用户</Button>
        <Poptip trigger="hover" content="批量导入数据">
          <Button icon="ios-open-outline" class="exportButton" @click="leadIn" />
        </Poptip>
      </div>
      <Row class="check-condition clearfix">
        <Form :label-width="10">
          <FormItem label="" class="mgr">
            <Select v-model="userCompany" placeholder="选择公司" :label-in-value="true" clearable>
              <Option v-for="item in companyList" :value="item.comName" :key="item.uuid">
                {{ item.comName }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="" class="mgr">
            <Select v-model="userState" placeholder="选择角色" clearable>
              <Option v-for="item in roleList" :value="item.roleName" :key="item.uuid">
                {{ item.roleName }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="" class="mgr">
            <Input v-model="companySearch" placeholder="姓名/手机号" clearable />
          </FormItem>
          <div class="btns">
            <Button @click="getData(1)" class="search">查询</Button>
          </div>
        </Form>
      </Row>
    </div>
    <div class="policy-table">
      <!-- <div class="btns">
        <Button @click="userList(1)" class="search">下载</Button>
        <Button @click="reset(1)" class="reset">删除</Button>
      </div>         @on-row-click="goto"-->
      <Table
        :data="data"
        :columns="columns"
        @on-select="select"
        @on-select-cancel="selectCancel"
        @on-select-all="selectAll"
        @on-select-all-cancel="selectAllCancel"
      >
        <template slot-scope="{ row }" slot="action">
          <span class="new-color" @click="isDel(row, '删除')">删除</span>
          <span class="new-color" @click="newUser('修改', row)">修改</span>
          <span class="new-color" @click="isDel(row, '重置')">重置密码</span>
        </template>
      </Table>
      <pagination
        :page-size="size"
        :show-info="true"
        :currentPage="current"
        :total="total"
        @on-change="getData"
        @on-page-size-change="userSize"
      />
    </div>
    <!-- 删除和重置密码弹框 -->
    <Modal id="fusion-del" footer-hide class="pop-up delete" v-model="delModel" width="451">
      <p slot="header">
        <span>提示</span>
      </p>
      <div class="content">
        <span class="close-left" v-if="isDelColse === '重置'">
          确定重置密码？（默认密码为123456）
        </span>
        <span class="close-left" v-if="isDelColse === '删除'">
          此操作将永久删除用户相关数据，是否确认删除？
        </span>
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
    <!-- 批量导入 -->
    <Modal v-model="exportModel" footer-hide title="">
      <Form
        :label-width="150"
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        style="margin-top:40px;"
      >
        <FormItem label="模板下载：">
          <a @click="downLoad" class="upload-a">用户导入模板.xls</a>
        </FormItem>
        <FormItem label="导入模板：" prop="uploadLogo">
          <Upload
            ref="uploadFile"
            :auto-upload="false"
            action=""
            :multiple="false"
            :show-upload-list="false"
            :before-upload="handleBefore"
            accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          >
            <Button type="primary">选择文件</Button>
            <div v-if="newfile !== null" style="margin-top:10px;">{{ newfile.name }}</div>
          </Upload>
        </FormItem>
      </Form>
      <div style="text-align: right">
        <Button type="primary" style="margin-right:15px;" @click="exportExcelOk">确定</Button>
        <Button type="text" @click="exportModel = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<style lang="less" scoped></style>
<script>
import axios from '../../../api/axios'
import qs from 'qs'
import {
  userList,
  commanyAll,
  roleAll,
  userDelete,
  resetPassword,
  userExport
} from '../../../api/login'
import { urlPrefix } from '../../../libs/tools'
export default {
  data() {
    return {
      selected: [], //存放选择到的选项
      uuidList: [],
      total: 0,
      delModel: false,
      isDelColse: '',
      uuid: '',
      userState: '',
      // delFlag: false,
      progressData: [], //调用接口获取数据
      current: 1, //默认为第一页
      size: 10,
      userCompany: '', //用户的公司
      companySearch: '', //搜索公司的字段
      data: [], //后台来的数据
      companyList: [], //下拉菜单公司列表的
      roleList: [],
      exportModel: false,
      newfile: '',
      formValidate: {
        uploadLogo: null
      },
      ruleValidate: {
        uploadLogo: [{ required: true, trigger: 'change' }]
      },
      columns: [
        //Todo写成和后台一样的
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '登录账号',
          key: 'userAcount'
        },
        {
          title: '用户姓名',
          key: 'userName'
        },
        {
          title: '手机',
          key: 'telphone'
        },
        {
          title: '所属公司',
          key: 'companyName'
        },
        {
          title: '用户角色',
          key: 'roleName'
        },
        {
          title: '注册时间',
          key: 'createTimeStr'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ]
    }
  },
  created() {
    this.getData(1)
    this.getCompany()
    this.getUserRole()
  },
  methods: {
    select(selection, row) {
      console.log(selection, row)
      for (var i = 0; i < selection.length; i++) {
        this.selected[i] = selection[i].uuid
      }
      console.log(this.selected)
    },
    selectCancel(selection, row) {
      console.log(selection, row)
      for (var i = 0; i < selection.length; i++) {
        this.selected[i] = selection[i].uuid
      }
    },
    selectAll(selection) {
      console.log(selection)
      for (var i = 0; i < selection.length; i++) {
        this.selected[i] = selection[i].uuid
      }
    },
    selectAllCancel(selection) {
      console.log(selection)
      for (var i = 0; i < selection.length; i++) {
        this.selected[i] = selection[i].uuid
      }
    },
    // 获取公司
    getCompany() {
      commanyAll().then(res => {
        this.companyList = res.data
      })
    },
    //获取角色
    getUserRole() {
      roleAll().then(res => {
        this.roleList = res.data
      })
    },
    // 是否删除
    isDel(row, title) {
      this.delModel = true
      this.isDelColse = title
      this.uuid = row.uuid
    },
    // 确认删除
    delOk() {
      if (this.isDelColse === '删除') {
        var uuidLists = []
        uuidLists.push(this.uuid)
        userDelete(uuidLists).then(res => {
          if (res.state === '1') {
            this.$Message.success(res.message || '删除成功!')
            this.delModel = false
            this.getData(1)
          } else {
            this.$Message.error(res.message || '删除失败!')
          }
        })
      } else {
        resetPassword().then(res => {
          if (res.state === '1') {
            this.$Message.success(res.message || '删除成功!')
            this.delModel = false
            this.getData(1)
          } else {
            this.$Message.error(res.message || '删除失败!')
          }
        })
      }
    },
    // 批量删除
    delBatchOk() {
      var selected = qs.stringify(this.selected)
      let params = {
        uuidList: selected
      }
      userDelete(params).then(res => {
        if (res.state === '1') {
          this.$Message.success(res.message || '删除成功!')
          this.delModel = false
          this.getData(1)
        } else {
          this.$Message.error(res.message || '删除失败!')
        }
      })
    },
    // 关闭弹框
    cancel_del() {
      this.delModel = false
    },
    // 导入弹框
    leadIn() {
      this.exportModel = true
      this.newfile = ''
    },
    // 模板下载
    downLoad() {
      window.location.href = `${urlPrefix}/api/userinfo/userDownload`
    },
    // 上传文件
    handleBefore(file) {
      this.newfile = file
      return false
    },
    // 确定导入
    exportExcelOk() {
      if (this.newfile === '') {
        this.$Message.error('请选择要导入文件')
      } else {
        var formData = new FormData()
        formData.append('file', this.newfile)
        userExport(formData).then(res => {
          console.log(res.state)
          if (res.data.state === '1') {
            this.$Message.success(res.data.message || '成功!')
            this.exportModel = false
            this.getData(1)
          } else {
            this.$Message.error(res.data.message || '失败!')
          }
        })
      }
    },
    // 跳入新增页面
    newUser(title, data) {
      this.$router.push({ path: '/userAdd', query: { title: title, data: data } })
    },
    // 获取列表
    getData(current) {
      if (current) this.current = current
      let params = {
        pageSize: this.size,
        currentPage: this.current,
        condition: {
          roleName: this.userState,
          company: this.userCompany,
          key: this.companySearch
        }
      }
      userList(params).then(res => {
        this.total = res.total
        this.data = res.data
      })
    },
    userSize: function(limit) {
      this.size = limit
      this.current = 1
      this.getData()
    }
  }
}
</script>
