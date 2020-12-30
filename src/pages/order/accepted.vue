<template>
  <div class="accepted">
    <Tabs value="list1" type="card">
      <TabPane label="工单处理信息" name="list1">
        <Table :columns="columns" :data="data1">
          <template slot-scope="{ row, index }" slot="action">
            <span class="del" @click="del(index)" v-show="flag">删除</span>
            <span @click="downLoad(index)">下载</span>
          </template>
        </Table>
      </TabPane>
      <TabPane label="结算处理信息" name="list2" v-show="doing">
        <Table :columns="columns" :data="data1">
          <template slot-scope="{ row, index }" slot="action">
            <span class="del" @click="del(index)" v-show="flag">删除</span>
            <span @click="downLoad(index)">下载</span>
          </template>
        </Table>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        //Todo 这里的key要改成和后台相同的
        {
          title: '序号',
          key: 'order'
        },
        {
          title: '支撑人',
          key: 'supportName'
        },
        {
          title: '手机',
          key: 'phoneNumber'
        },
        {
          title: '上传时间',
          key: 'uploadTime'
        },
        {
          title: '工作内容',
          key: 'description'
        },
        {
          title: '附件',
          key: 'annex'
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],
      data1: [] //Todo表格里的数据，从后台来
    }
  },
  methods: {
    flag: {
      //Todo 这个方法是控制删除按键是否可见的，只对支撑接口人可见
    },
    doing: {
      //Todo 这个方法是控制结算处理信息标签栏是否可见的
    }
  }
}
</script>
