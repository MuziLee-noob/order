<template>
  <!-- 处理打分用 -->
  <div class="point">
    <Modal title="满意度打分" v-model="pointFlag" width="1400px" @on-cancel="cancel">
      <Row>工单编号{{ listNumber }}</Row>
      <Table border :columns="columns" :data="data" :span-method="handleSpan"></Table>
      <div slot="footer">
        <Button type="Primary" @click="confirm">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from '../../api/axios'
export default {
  props: {
    pointFlag: Boolean,
    orderData: {}
  },
  data() {
    return {
      merits: '',
      uuid: '',
      createUuid: '',
      supportUuid: '',
      flag: false,
      listNumber: '', //工单编号
      sum: 0, //打分的总分数
      columns: [
        {
          title: '考核点',
          key: 'point'
        },
        {
          title: '权重',
          key: 'weight'
        },
        {
          title: '分数界值',
          key: 'divde'
        },
        {
          title: '评价标准',
          key: 'stander'
        },
        {
          title: '打分',
          key: 'points',
          render: (h, params) => {
            return h('div', [
              h('Input', {
                props: {
                  type: 'number',
                  value: params.row.points
                },
                style: {},
                on: {
                  input: event => {
                    this.data[params.index].points = event
                    console.log(event, this.data)
                  }
                }
              })
            ])
          }
        }
      ],
      data: [
        {
          point: '任务完成质量',
          weight: '50分',
          divde: '40--50',
          stander: '项目输出结果完整、翔实、准确，项目支撑质量优秀。'
        },
        {
          point: '',
          weight: '',
          divde: '30--40',
          stander: '项目输出结果完整，项目支撑质量良好'
        },
        {
          point: '',
          weight: '',
          divde: '0--30',
          stander: '项目输出结果不完整，项目支撑质量较差。'
        },
        {
          point: '任务完成及时率',
          weight: '30分',
          divde: '0--30',
          stander:
            '任务完成及时率=在规定时间内完成的项目个数加权合计值/本月派发的项目个数加权合计值，其中权值根据项目的工作量、重要及紧急程度，由派发单位进行指定，范围是0-100。'
        },
        {
          point: '团队纪律表现',
          weight: '20分',
          divde: '16--20',
          stander: '表现优秀，能严格遵守合作方各项规章制度；工作纪律性强，全身心投入工作。'
        },
        {
          point: '',
          weight: '',
          divde: '11--15',
          stander:
            '表现良好，能较好的遵守合作方各项规章制度；能较好地遵守工作纪律，工作时间不做与工作无关的事。'
        },
        {
          point: '',
          weight: '',
          divde: '5--10',
          stander:
            '表现一般，基本上可以遵守合作方的各项规章制度；大体上遵守工作纪律，上班时间与工作无关的言行较少。'
        },
        {
          point: '',
          weight: '',
          divde: '0--5',
          stander: '违反合作方规章制度的情况较多；工作时间与工作无关的言行较多。'
        },
        {
          point: '合计',
          weight: '',
          divde: '',
          stander: ''
        }
      ]
    }
  },
  // created() {
  //   this.getData()
  // },
  methods: {
    cancel() {
      this.$emit('disable', false)
    },
    getData() {
      this.uuid = this.orderData.uuid
      this.listNumber = this.orderData.orderCode
      this.supportUuid = this.orderData.supportUuid
      this.createUuid = this.orderData.createUuid
      console.log(this.orderData)
    },
    confirm() {
      axios
        .axios({
          method: 'post',
          url: '/api/workflow/handleWorkflow',
          data: {
            uuid: this.orderData.uuid,
            orderCode: this.orderData.orderCode,
            supportUuid: this.orderData.supportUuid,
            createUuid: this.orderData.createUuid,
            nodeFlag: 4,
            merits: 'A', //内部绩效，页面没给我先写死
            score: 80 //外部评分我先写死
          }
        })
        .then(data => {
          console.log(data)
          this.$router.push('/pedding')
        })
    },
    handleSpan({ rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 0) {
        return [3, 1]
      }
      if (rowIndex === 1 && columnIndex == 0) {
        return [0, 0]
      }
      if (rowIndex === 2 && columnIndex == 0) {
        return [0, 0]
      }
      if (rowIndex === 0 && columnIndex === 1) {
        return [3, 1]
      }
      if (rowIndex === 1 && columnIndex == 1) {
        return [0, 0]
      }
      if (rowIndex === 2 && columnIndex == 1) {
        return [0, 0]
      }
      if (rowIndex === 0 && columnIndex === 4) {
        return [3, 1]
      }
      if (rowIndex === 1 && columnIndex == 4) {
        return [0, 0]
      }
      if (rowIndex === 2 && columnIndex == 4) {
        return [0, 0]
      }
      if (rowIndex === 4 && columnIndex === 0) {
        return [4, 1]
      }
      if (rowIndex === 5 && columnIndex == 0) {
        return [0, 0]
      }
      if (rowIndex === 6 && columnIndex == 0) {
        return [0, 0]
      }
      if (rowIndex === 7 && columnIndex === 0) {
        return [0, 0]
      }
      if (rowIndex === 4 && columnIndex === 1) {
        return [4, 1]
      }
      if (rowIndex === 5 && columnIndex == 1) {
        return [0, 0]
      }
      if (rowIndex === 6 && columnIndex == 1) {
        return [0, 0]
      }
      if (rowIndex === 7 && columnIndex === 1) {
        return [0, 0]
      }
      if (rowIndex === 4 && columnIndex === 4) {
        return [4, 1]
      }
      if (rowIndex === 5 && columnIndex == 4) {
        return [0, 0]
      }
      if (rowIndex === 6 && columnIndex == 4) {
        return [0, 0]
      }
      if (rowIndex === 7 && columnIndex === 4) {
        return [0, 0]
      }
      if (rowIndex === 8 && columnIndex === 0) {
        return [1, 4]
      }
      if (rowIndex === 8 && columnIndex === 1) {
        return [0, 0]
      }
      if (rowIndex === 8 && columnIndex === 2) {
        return [0, 0]
      }
      if (rowIndex === 8 && columnIndex === 3) {
        return [0, 0]
      }
    }
  }
}
</script>
