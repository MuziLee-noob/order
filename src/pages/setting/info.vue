<template>
  <div class="contentData">
    <Tabs>
      <TabPane label="全部消息" name="first">
        <Button class="delete">批量删除</Button>
        <Button type="primary" class="cancel" ghost @click="cancel()">返回</Button>
        <Table :data="allData" :columns="columns" ref="selection" class="form">
          <template slot-scope="{ row, index }" slot="action">
            <span class="new-color" @click="show(index)">详情</span>
            <span class="new-color" @click="del(index)">删除</span>
          </template>
        </Table>
        <pagination
          :page-size="pageSize"
          :show-info="true"
          :currentPage="current"
          @on-change="getMessageList"
          @on-page-size-change="userSize"
          :total="100"
        />
      </TabPane>
      <TabPane label="未读消息" name="second">
        <Button class="delete">批量删除</Button>
        <Button type="primary" class="cancel" ghost @click="cancel()">返回</Button>
        <Table :data="unReadData" :columns="columns" ref="selection" class="form">
          <template slot-scope="{ row, index }" slot="action">
            <Button type="text" size="small" @click="show(index)">详情</Button>
            <Button type="text" size="small" @click="del(index)">删除</Button>
          </template>
        </Table>
        <pagination :page-size="10" :show-info="true" :currentPage="1" :total="100" />
      </TabPane>
      <TabPane label="已读消息" name="已读消息">
        <Button class="delete">批量删除</Button>
        <Button type="primary" class="cancel" ghost @click="cancel()">返回</Button>
        <Table :data="readData" :columns="columns" ref="selection" class="form">
          <template slot-scope="{ row }" slot="action">
            <Button type="text" size="small" @click="show(row)">详情</Button>
            <Button type="text" size="small" @click="del(row)">删除</Button>
          </template>
        </Table>
        <pagination :page-size="10" :show-info="true" :currentPage="1" :total="100" />
      </TabPane>
    </Tabs>
    <!-- 详情弹框 -->
    <Modal footer-hide v-model="infoModel" title="信息">
      <div>您好，最新发布的{{ messTitle }}等待您派单，请知悉!</div>
    </Modal>
    删除弹框
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
import { messageList, allUser, setRole } from '../../api/login'
export default {
  data() {
    return {
      state: '全部消息',
      infoModel: false,
      delModel: false,
      messTitle: '',
      allData: [],
      unReadData: [],
      readData: [],
      current: 1,
      pageSize: 10,
      total: 0,
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
    getMessageList(current) {
      if (current) this.current = current
      let params = {
        pageSize: this.pageSize,
        currentPage: this.current
      }
      messageList(params).then(res => {
        this.allData = res.noData
      })
    },
    userSize: function(limit) {
      this.size = limit
      this.getMessageList(1)
    },
    show(row) {
      this.infoModel = true
      this.messTitle = row.messTitle
    },
    del(row) {
      this.delModel = true
      this.messTitle = row.messTitle
    },
    delOk() {
      this.delModel = false
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
<style lang="less" scope>
.contentData {
  background: #fff;
  margin: 0 20px;
  padding: 0 20px;
}
.ivu-tabs-bar {
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
  box-shadow: 0px 1px 2px 0px #c7c7c7, 0px 0px 4px 0px rgba(158, 158, 158, 0.5);
}
.delete {
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
/deep/ .ivu-modal-body {
  padding-bottom: 100px !important;
}
</style>
