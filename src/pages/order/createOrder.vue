<template>
  <div class="companyOperate">
    <!-- <Layout>
      <Header>
        <above />
      </Header>
      <Layout style="position:absolute;top: 64px;bottom: 0px;left: 0px;right: 0px;"> -->
    <!-- <Sider hide-trigger :style="{ background: '#fff' }">
          <menuRequire active="1-4" />
        </Sider> -->
    <Content>
      <!-- <Icon type="ios-create" size="48" />
      <Row>请填写工单信息</Row> -->
      <Card dis-hover :bordered="false">
        <Row class="listFile">
          <i-col class="addInfo">
            <Form ref="newData" :model="newData" :label-width="130" :rules="ruleValidate">
              <FormItem label="工单标题" prop="listHead">
                <Input v-model="newData.listHead" placeholder="请输入工单标题" />
              </FormItem>
              <FormItem label="所在区域" prop="city">
                <Row type="flex" justify="space-between">
                  <i-col span="11">
                    <Select v-model="newData.city">
                      <Option value="武汉">武汉</Option>
                    </Select>
                  </i-col>
                  <i-col span="11">
                    <Select v-model="newData.area">
                      <Option
                        v-for="item in newData.arealist"
                        :value="item.value"
                        :key="item.value"
                      >
                        {{ item.lable }}
                      </Option>
                    </Select>
                  </i-col>
                </Row>
              </FormItem>
              <FormItem label="需求开始时间" prop="beginDate">
                <Row>
                  <i-col>
                    <DatePicker
                      style="width: 46%;"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm"
                      v-model="newData.beginDate"
                    ></DatePicker>
                  </i-col>
                </Row>
              </FormItem>
              <FormItem label="需求结束时间" prop="endDate">
                <Row>
                  <i-col>
                    <DatePicker
                      type="datetime"
                      style="width: 46%;"
                      format="yyyy-MM-dd HH:mm"
                      v-model="newData.endDate"
                    ></DatePicker>
                  </i-col>
                </Row>
              </FormItem>
              <FormItem label="项目预估金额" prop="cost">
                <Input v-model="newData.cost" />
              </FormItem>
              <FormItem label="需求内容描述" prop="description">
                <Input
                  v-model="newData.description"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 5 }"
                />
              </FormItem>
              <FormItem label="上传附件（选填）">
                <input type="file" @change="upload($event)" id="files" multiple="multiple" />
              </FormItem>
              <FormItem>
                <Button type="primary" @click="submit('newData')">提交</Button>
              </FormItem>
            </Form>
          </i-col>
        </Row>
      </Card>
    </Content>
    <!-- </Layout>
    </Layout> -->
    <Modal v-model="flag1" title="提示" @on-ok="ok">
      <p>提交成功</p>
    </Modal>
  </div>
</template>

<script>
import moment from 'moment'
import axios from '../../api/axios'
//import Qs from 'qs'
// import above from '../../components/layout/above'
// import menuRequire from '../../components/layout/menuRequire'
export default {
  components: {
    // above,
    // menuRequire
  },
  data() {
    return {
      flag1: false,
      formData: new FormData(),
      file: '',
      newData: {
        listHead: '',
        city: '',
        area: '',
        beginDate: '',
        endDate: '',
        cost: '',
        description: '',
        arealist: [
          {
            value: '江岸区',
            lable: '江岸区'
          },
          {
            value: '江汉区',
            lable: '江汉区'
          },
          {
            value: '硚口区',
            lable: '硚口区'
          },
          {
            value: '汉阳区',
            lable: '汉阳区'
          },
          {
            value: '武昌区',
            lable: '武昌区'
          },
          {
            value: '青山区',
            lable: '青山区'
          },
          {
            value: '洪山区',
            lable: '洪山区'
          },
          {
            value: '东西湖区',
            lable: '东西湖区'
          },
          {
            value: '汉南区',
            lable: '汉南区'
          },
          {
            value: '蔡甸区',
            lable: '蔡甸区'
          },
          {
            value: '江夏区',
            lable: '江夏区'
          },
          {
            value: '黄陂区',
            lable: '黄陂区'
          },
          {
            value: '新洲区',
            lable: '新洲区'
          }
        ]
      },
      ruleValidate: {
        listHead: [{ required: true, message: '请输入工单标题', trigger: 'blur' }],
        city: [{ required: true, message: '请选择所在区域', trigger: 'change' }],
        cost: [{ required: true, message: '请输入预估金额', trigger: 'blur' }],
        beginDate: [{ required: true, type: 'date', message: '请选择开始日期', trigger: 'change' }],
        endDate: [{ required: true, type: 'date', message: '请选择结束日期', trigger: 'change' }],
        description: [{ required: true, message: '请输入工单描述', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submit(name) {
      var startTime = moment(this.newData.beginDate).format('yyyy/MM/DD HH:mm:ss')
      var endTime = moment(this.newData.endDate).format('yyyy/MM/DD HH:mm:ss')
      this.$refs[name].validate(valid => {
        if (valid) {
          //上传工单的方法
          this.formData.append('orderName', this.newData.listHead)
          this.formData.append('orderDesr', this.newData.description)
          this.formData.append('capital', this.newData.cost)
          this.formData.append('nodeFlag', '1')
          this.formData.append('region', this.newData.area)
          this.formData.append('startTime', startTime)
          this.formData.append('finishTime', endTime)
          //this.formData.append('files',this.file)
          console.log(this.files)
          axios
            .axios({
              method: 'post',
              url: 'workflow/handleWorkflowFiles',
              data: this.formData,
              headers: {
                token: localStorage.getItem('token')
              }
            })
            .then(data => {
              console.log(data)
            })
          this.flag1 = true
        }
      })
    },
    upload(e) {
      var that = this
      console.log(e.target.files.length)
      console
      for (var i = 0; i < e.target.files.length; i++) {
        that.formData.append('files', e.target.files[i])
      }
    },
    ok() {
      //Todo 这里写弹出的确认对话框的方法：转到代办工单界面
    }
  }
}
</script>
