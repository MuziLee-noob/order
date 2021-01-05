<style lang="less" scoped>
@import '../index.less';
</style>
<template>
  <div class="fusion-manage">
    <!-- <div class="fusion-header serve">
      <div class="btnsCreate">
        <Button @click="userList(1)" class="create">新建角色</Button>
      </div>
      <Row class="check-condition clearfix">
        <Form :label-width="10">
          <FormItem label="" class="mgr">
            <Select clearable placeholder="选择角色">
              <Option :key="item.uuid" :value="item.uuid" v-for="item in roleData">
                {{ item.roleName }}
              </Option>
            </Select>
          </FormItem>
          <div class="btns">
            <Button @click="userRoleList" class="search">查询</Button>
          </div>
        </Form>
      </Row>
    </div> -->
    <div class="policy-table">
      <!-- <div class="btns">
        <Button @click="userList(1)" class="search">下载</Button>
        <Button @click="reset(1)" class="reset">删除</Button>
      </div> -->
      <Table :columns="roleColums" :data="roleData" stripe>
        <template slot-scope="{ row }" slot="opeare">
          <span class="new-color" @click="look(row)">查看</span>
          <span class="new-color" @click="assign(row)">分配用户</span>
        </template>
      </Table>
      <!-- <pagination
        :page-size="size"
        :show-info="true"
        :currentPage="current"
        :total="userTotal"
        @on-change="userList"
        @on-page-size-change="userSize"
      /> -->
    </div>
    <!-- 分配用户弹框 -->
    <Modal
      title="分配用户"
      footer-hide
      id="userModel"
      class="pop-up"
      v-model="assignModel"
      width="883"
    >
      <Form :label-width="10" style="padding: 18px 40px 0 20px;">
        <Row class="check-condition clearfix">
          <FormItem label="" class="mgr">
            <Input
              v-model="companySearch"
              search
              @on-search="userRoleList"
              style="width: 55%;"
              clearable
              placeholder="姓名/手机号"
            />
            <span style="float: right;">角色名称：{{ roleName }}</span>
          </FormItem>
        </Row>
      </Form>
      <Table
        :columns="assignColums"
        :data="assignData"
        style="margin:0 10px 10px;"
        @on-select="select"
        @on-select-cancel="selectCancel"
        @on-select-all="selectAll"
        @on-select-all-cancel="selectAllCancel"
      ></Table>
      <div class="add-footer" style="border: none;">
        <Button @click="setRoles" class="fusion-add-ok">
          确定
        </Button>
        <Button @click="handleReset" class="fusion-add-cancel">
          取消
        </Button>
      </div>
    </Modal>
  </div>
</template>
<style lang="less" scoped></style>
<script>
// import { dateFormat } from '../../../../libs/tools'
import { roleAll, allUser, setRole } from '../../../api/login'
export default {
  data() {
    return {
      companySearch: '',
      assignModel: false,
      roleName: '',
      roleUuid: '',
      selected: [],
      //列表
      roleColums: [
        {
          title: '角色名称',
          key: 'roleName'
        },
        {
          title: '状态',
          key: 'state',
          render: (h, params) => {
            // let tmpStr = ''
            if (params.row.state === 0) {
              return h(
                'div',
                {
                  style: {
                    width: '60px',
                    height: '22px',
                    lineHeight: '22px',
                    borderRadius: '4px',
                    color: '#11DA16',
                    textAlign: 'center',
                    background: '#DAFCDB'
                  }
                },
                params.row.state === 0 ? '启用' : '禁用'
              )
            } else {
              return h(
                'div',
                {
                  style: {
                    color: '#E02020',
                    background: '#FFDBDB',
                    borderRadius: '4px',
                    width: '60px',
                    height: '22px',
                    lineHeight: '22px',
                    textAlign: 'center'
                  }
                },
                params.row.state === 0 ? '启用' : '禁用'
              )
            }
          }
        },
        {
          title: '创建时间',
          key: 'createTime',
          tooltip: true
        },
        {
          title: '操作',
          slot: 'opeare'
        }
      ],
      roleData: [],
      // 分配用户列表
      assignColums: [
        {
          type: 'selection',
          align: 'center'
        },
        {
          title: '用户姓名',
          key: 'userName'
        },
        {
          title: '手机号',
          key: 'telphone',
          tooltip: true
        }
      ],
      assignData: []
    }
  },
  created() {
    this.userRoleList()
  },
  methods: {
    // 获取列表
    userRoleList: function() {
      roleAll().then(res => {
        if (res.state === '1') {
          this.roleData = res.data
        }
      })
    },
    // 查看
    look(row) {
      this.$router.push({ path: '/user', query: { row: row } })
    },
    // 分配用户
    assign(row) {
      this.assignModel = true
      this.getAllUser()
      this.roleName = row.roleName
      this.roleUuid = row.uuid
    },
    // 获取所有用户
    getAllUser: function() {
      allUser().then(res => {
        if (res.state === '1') {
          this.assignData = res.data
        }
      })
    },
    select(selection, row) {
      // console.log(selection, row)
      for (var i = 0; i < selection.length; i++) {
        this.selected[i] = selection[i].uuid
      }
      // console.log(this.selected)
    },
    selectCancel(selection, row) {
      // console.log(selection, row)
      for (var i = 0; i < selection.length; i++) {
        this.selected[i] = selection[i].uuid
      }
    },
    selectAll(selection) {
      // console.log(selection)
      for (var i = 0; i < selection.length; i++) {
        this.selected[i] = selection[i].uuid
      }
    },
    selectAllCancel(selection) {
      // console.log(selection)
      for (var i = 0; i < selection.length; i++) {
        this.selected[i] = selection[i].uuid
      }
    },
    // 确定分配角色
    setRoles() {
      if (this.selected.length === 0) {
        this.$Message.error('请选择要分配的用户')
        return
      } else {
        let params = {
          userUuidList: this.selected,
          roleUuid: this.roleUuid
        }
        setRole(params).then(res => {
          if (res.state === '1') {
            this.$Message.success('更新成功')
            this.assignModel = false
            this.userRoleList()
          } else {
            this.$Message.error('更新失败')
          }
        })
      }
    },
    // 取消
    handleReset() {
      this.assignModel = false
    }
    // userSize: function(limit) {
    //   this.size = limit
    //   this.current = 1
    //   this.userRoleList()
    // }
  }
}
</script>
