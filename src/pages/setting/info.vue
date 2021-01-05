<template>
  <div class="contentData">
    <Tabs @on-click="tabs">
      <TabPane label="全部消息" name="first">
        <Button type="primary" class="delete-info" @click="del('批量', 'all', '')">批量删除</Button>
        <Button type="primary" class="cancel" ghost @click="cancel()">返回</Button>
        <Table
          :data="allData"
          :columns="columns"
          ref="selection"
          @on-select="select"
          @on-select-cancel="selectCancel"
          @on-select-all="selectAll"
          @on-select-all-cancel="selectAllCancel"
          class="form"
        >
          <template slot-scope="{ row }" slot="action">
            <span class="new-color" @click="show(row)">详情</span>
            <span class="new-color" @click="del('单个', 'all', row)">删除</span>
          </template>
        </Table>
        <pagination
          :page-size="pageSize"
          :show-info="true"
          :currentPage="current"
          @on-change="getMessageList"
          @on-page-size-change="userSize"
          :total="total"
        />
      </TabPane>
      <TabPane label="未读消息" name="second">
        <Button type="primary" class="delete" @click="del('批量', 'unread', '')">批量删除</Button>
        <Button type="primary" class="cancel" ghost @click="cancel()">返回</Button>
        <Table
          :data="unReadData"
          :columns="columns"
          ref="selection"
          @on-select="select"
          @on-select-cancel="selectCancel"
          @on-select-all="selectAll"
          @on-select-all-cancel="selectAllCancel"
          class="form"
        >
          <template slot-scope="{ row }" slot="action">
            <span class="new-color" @click="show(row)">详情</span>
            <span class="new-color" @click="del('单个', 'unread', row)">删除</span>
          </template>
        </Table>
        <pagination
          :page-size="pageSize"
          :show-info="true"
          :currentPage="current"
          :total="total"
          @on-change="getUnreadMessageList"
          @on-page-size-change="userSize"
        />
      </TabPane>
      <TabPane label="已读消息" name="已读">
        <Button type="primary" class="delete">批量删除</Button>
        <Button type="primary" class="cancel" ghost @click="cancel()">返回</Button>
        <Table
          :data="readData"
          :columns="columns"
          ref="selection"
          @on-select="select"
          @on-select-cancel="selectCancel"
          @on-select-all="selectAll"
          @on-select-all-cancel="selectAllCancel"
          class="form"
        >
          <template slot-scope="{ row }" slot="action">
            <span class="new-color" @click="show(row)">详情</span>
            <span class="new-color" @click="del(row)">删除</span>
          </template>
        </Table>
        <pagination
          :page-size="pageSize"
          :show-info="true"
          :currentPage="current"
          @on-change="getReadMessageList"
          @on-page-size-change="userSize"
          :total="total"
        />
      </TabPane>
    </Tabs>
    <!-- 详情弹框 -->
    <Modal footer-hide v-model="infoModel" title="信息">
      <div style="padding-bottom: 80px">您好，最新发布的{{ messTitle }}等待您派单，请知悉!</div>
    </Modal>
    <!-- 删除弹框 -->
    <Modal id="fusion-del" footer-hide v-model="delModel" width="451">
      <p slot="header">
        <span>提示</span>
      </p>
      <div class="content">
        <span class="close-left">
          此操作将永久删除相关数据，是否确认删除？
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
  </div>
</template>
<script>
import { messageList, messageDelete, messageUnReadList, messageReadList } from '../../api/login'
export default {
  data() {
    return {
      state: '全部消息',
      infoModel: false,
      delModel: false,
      messTitle: '',
      delTitle: '',
      deletUuid: '',
      type: '',
      allData: [],
      unReadData: [],
      readData: [],
      current: 1,
      pageSize: 10,
      total: 0,
      selected: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '标题',
          key: 'messTitle'
        },
        {
          title: '发布时间',
          key: 'createTime'
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
    this.getMessageList(1)
  },
  methods: {
    tabs(name) {
      if (name === 'first') {
        this.getMessageList(1)
      } else if (name === 'second') {
        this.getUnreadMessageList(1)
      } else {
        this.getReadMessageList(1)
      }
    },
    // 获取全部消息列表
    getMessageList(current) {
      if (current) this.current = current
      let params = {
        pageSize: this.pageSize,
        currentPage: this.current
      }
      messageList(params).then(res => {
        this.allData = res.Data
        this.total = res.total
      })
    },
    // 获取未读消息
    getUnreadMessageList(current) {
      if (current) this.current = current
      let params = {
        pageSize: this.pageSize,
        currentPage: this.current
      }
      messageUnReadList(params).then(res => {
        this.unReadData = res.Data
        this.total = res.total
      })
    },
    // 获取已读消息
    getReadMessageList(current) {
      if (current) this.current = current
      let params = {
        pageSize: this.pageSize,
        currentPage: this.current
      }
      messageReadList(params).then(res => {
        this.readData = res.Data
        this.total = res.total
      })
    },
    userSize: function(limit) {
      this.size = limit
      this.getMessageList(1)
    },
    select(selection, row) {
      for (var i = 0; i < selection.length; i++) {
        this.selected[i] = selection[i].uuid
      }
    },
    selectCancel(selection, row) {
      for (var i = 0; i < selection.length; i++) {
        this.selected[i] = selection[i].uuid
      }
    },
    selectAll(selection) {
      for (var i = 0; i < selection.length; i++) {
        this.selected[i] = selection[i].uuid
      }
    },
    selectAllCancel(selection) {
      for (var i = 0; i < selection.length; i++) {
        this.selected[i] = selection[i].uuid
      }
    },
    show(row) {
      this.infoModel = true
      this.messTitle = row.messTitle
    },
    del(title, type, row) {
      this.delModel = true
      this.delTitle = title
      this.messTitle = row.messTitle
      this.deletUuid = row.uuid
      this.type = type
    },
    delOk() {
      if (this.delTitle === '单个') {
        var uuidLists = []
        uuidLists.push(this.deletUuid)
        messageDelete(uuidLists).then(res => {
          if (res.state === '1') {
            this.$Message.success(res.message || '删除成功!')
            this.delModel = false
            if (this.type === 'all') {
              this.getMessageList(1)
            } else if (this.type === 'unread') {
              this.getUnreadMessageList(1)
            } else {
              this.getReadMessageList(1)
            }
          } else {
            this.$Message.error(res.message || '删除失败!')
          }
        })
      } else {
        this.delBatch()
      }
    },
    // 批量删除
    delBatch() {
      messageDelete(this.selected).then(res => {
        if (res.state === '1') {
          this.$Message.success(res.message || '删除成功!')
          this.delModel = false
          if (this.type === 'all') {
            this.getMessageList(1)
          } else if (this.type === 'unread') {
            this.getUnreadMessageList(1)
          } else {
            this.getReadMessageList(1)
          }
        } else {
          this.$Message.error(res.message || '删除失败!')
        }
      })
    },
    cancel_del() {
      this.delModel = false
    },
    delSelected() {
      //删除所有选中的工单信息
    },
    cancel() {
      this.$router.push('/pedding')
    }
  }
}
</script>
<style lang="less" scoped>
.contentData {
  background: #fff;
  margin: 0 20px;
  padding: 0 20px;
}
/deep/ .ivu-tabs-bar {
  height: 48px;
  //   background: #f5f5f5;
  //   border-bottom: 1px solid #dcdee2;
  //   border-top: 1px solid #dcdee2;
  margin-bottom: 16px;
  padding-left: 758px;
  border-bottom: none;
}

.ivu-tabs-nav .ivu-tabs-tab {
  padding: 14px 28px;
}

.ivu-tabs-ink-bar {
  height: 4px;
}
.form {
  padding: 23px 0;
  margin-top: 20px;
  // box-shadow: 0px 1px 2px 0px #c7c7c7, 0px 0px 4px 0px rgba(158, 158, 158, 0.5);
}
.delete-info {
  width: 114px;
  height: 36px;
  padding: 0;
  line-height: 36px;
  text-align: center;
  border-radius: 7px;
  border: none;
  background: #347ff7;
  color: #fff;
  margin-left: 10px;
}
.cancel {
  width: 110px;
  height: 32px;
  margin-left: 20px;
}
</style>
