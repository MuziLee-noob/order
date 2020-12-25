<template>
  <div class="contentData">
    <Tabs>
      <TabPane label="全部消息" name="first">
        <Button class="delete">批量删除</Button>
        <Button type="primary" class="cancel" ghost @click="cancel()">返回</Button>
        <Table :data="allData" :columns="columns" border ref="selection" class="form">
          <template slot-scope="{ row, index }" slot="action">
            <Button type="text" size="small" @click="show(index)">详情</Button>
            <Button type="text" size="small" @click="del(index)">删除</Button>
          </template>
        </Table>
        <pagination :page-size="10" :show-info="true" :currentPage="1" :total="100" />
      </TabPane>
      <TabPane label="未读消息" name="second">
        <Button class="delete">批量删除</Button>
        <Button type="primary" class="cancel" ghost @click="cancel()">返回</Button>
        <Table :data="unReadData" :columns="columns" border ref="selection" class="form">
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
        <Table :data="readData" :columns="columns" border ref="selection" class="form">
          <template slot-scope="{ row, index }" slot="action">
            <Button type="text" size="small" @click="show(index)">详情</Button>
            <Button type="text" size="small" @click="del(index)">删除</Button>
          </template>
        </Table>
        <pagination :page-size="10" :show-info="true" :currentPage="1" :total="100" />
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      state: '全部消息',
      allData: [],
      unReadData: [],
      readData: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '标题',
          key: ''
        },
        {
          title: '发布时间',
          key: ''
        },
        {
          title: '操作',
          solt: 'action',
          align: 'center'
        }
      ]
    }
  },
  methods: {
    show() {
      //点击'详情'，弹框显示信息详情内容。
    },
    del() {
      //删除一条工单信息
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
</style>
