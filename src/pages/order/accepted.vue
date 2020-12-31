<template>
  <!-- 这个是处理 支撑记录的组件 只被引入了detailsDone里 -->
  <div class="accepted">
    <Tabs value="list1" type="card">
      <TabPane label="工单处理信息" name="list1">
        <Table :columns="columns1" :data="data1">
          <template slot-scope="{ row, index }" slot="action">
            <Button class="del" @click="del(row, index)" v-show="flag">删除</Button>
            <Button @click="downLoad(rwo, index)">下载</Button>
          </template>
        </Table>
      </TabPane>
      <TabPane label="结算处理信息" name="list2" v-show="doing">
        <Table :columns="columns2" :data="data2">
          <template slot-scope="{ row, index }" slot="action">
            <Button class="del" @click="del(row, index)" v-show="flag">删除</Button>
            <Button @click="downLoad(row, index)">下载</Button>
          </template>
        </Table>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import axios from '../../api/axios'
export default {
  props: {
    uuid: String
  },
  data() {
    return {
      role: this.$store.state.role,
      columns1: [
        //Todo 这里的key要改成和后台相同的
        {
          title: '序号',
          key: 'id'
        },
        {
          title: '支撑人',
          key: 'supportName'
        },
        {
          title: '手机',
          key: 'phone'
        },
        {
          title: '上传时间',
          key: 'createTime'
        },
        {
          title: '工作内容',
          key: 'conment'
        },
        {
          title: '附件',
          key: 'fileName' //Todo 这里差个展示文件名字点击下载的方法
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],
      data1: [], //Todo表格里的数据，从后台来
      columns2: [
        //Todo 这里的key要改成和后台相同的
        {
          title: '序号',
          key: 'id'
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
          title: '附件', //Todo 这里差个展示文件名字点击下载的方法
          key: 'annex'
        },
        {
          title: '备注说明',
          key: 'description'
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],
      data2: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    flag() {
      if (this.role == 3) {
        return true
      }
      return false
      //这个方法是控制删除按键是否可见的，只对支撑接口人可见
    },
    doing() {
      //Todo 这个方法是控制结算处理信息标签栏是否可见的
      return true
    },
    getData() {
      axios
        .axios({
          method: 'get',
          url: '/api/workflow/getSupportList',
          params: {
            orderUuid: this.uuid
          }
        })
        .then(data => {
          console.log(data)
          this.data1 = data.data.data
          console.log(this.data1)
        })
      axios
        .axios({
          method: 'get',
          url: '/api/workflow/getPayoff',
          params: {
            orderUuid: this.uuid
          }
        })
        .then(data => {
          console.log(data)
          this.data2 = data.data.data
          console.log(this.data2)
        })
    }
  }
}
</script>
