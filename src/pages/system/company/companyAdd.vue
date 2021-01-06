<template>
  <div class="companyOperate">
    <Content>
      <!-- <Row>系统管理>公司管理</Row> -->
      <Card dis-hover :bordered="false">
        <!-- <Icon type="ios-create" size="48" />
        <Row>请填写公司信息</Row> -->
        <Row class="listFile">
          <i-col class="addInfo">
            <Form ref="newData" :model="newData" :label-width="120" :rules="ruleValidate">
              <FormItem label="公司名称" prop="comName">
                <Input
                  v-model="newData.comName"
                  :disabled="disabled"
                  placeholder="请输入公司名称"
                />
              </FormItem>
              <FormItem label="公司类别">
                <RadioGroup v-model="newData.flag">
                  <Radio label="1" :disabled="disabled">
                    <span>对内</span>
                  </Radio>
                  <Radio label="2" :disabled="disabled">
                    <span>对外</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="所在区域" prop="region">
                <Row type="flex" justify="space-between">
                  <i-col span="11">
                    <Select v-model="city" :disabled="disabled">
                      <Option value="武汉">武汉</Option>
                    </Select>
                  </i-col>
                  <i-col span="11">
                    <Select v-model="newData.region" :disabled="disabled">
                      <Option v-for="item in arealist" :value="item.value" :key="item.value">
                        {{ item.lable }}
                      </Option>
                    </Select>
                  </i-col>
                </Row>
              </FormItem>
              <FormItem label="排序" prop="sort">
                <Input v-model="newData.sort" :disabled="disabled" placeholder="请输入排序" />
              </FormItem>
              <FormItem label="是否启用">
                <i-switch v-model="newData.state" @on-change="change" :disabled="disabled" />
              </FormItem>
              <FormItem>
                <Button type="primary" v-if="disabled !== true" @click="submit('newData')">
                  提交
                </Button>
                <Button class="colse" @click="cancel">取消</Button>
              </FormItem>
            </Form>
          </i-col>
        </Row>
      </Card>
    </Content>
  </div>
</template>

<script>
import { companyAdd, companyEdit, companyInfo } from '../../../api/login'
export default {
  data() {
    return {
      flag: false,
      auditflag: false,
      disabled: false,
      data: '',
      uuid: '',
      city: '武汉',
      newData: {
        comName: '',
        region: '',
        flag: '1',
        sort: '',
        state: '2'
      },
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
      ],
      ruleValidate: {
        comName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        region: [{ required: true, message: '请选择所在区域', trigger: 'change' }],
        sort: [{ required: true, message: '请输入排序', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.companyTitle = this.$route.query.title
    // 判断状态
    if (this.companyTitle === '查看') {
      this.disabled = true
    } else {
      this.disabled = false
    }
  },
  created() {
    this.getdata()
  },
  methods: {
    getdata() {
      let params = {
        uuid: this.$route.query.data.uuid
      }
      companyInfo(params).then(res => {
        if (res.state === '1') {
          this.data = res.data
          this.newData.comName = this.data.comName
          this.newData.flag = this.data.flag === 1 ? '1' : '2'
          this.newData.region = this.data.region
          this.newData.sort = this.data.sort.toString()
          this.newData.state = this.data.state === 1 ? true : false
        } else {
          this.$Message.error(res.msg || '失败!')
        }
      })
    },
    submit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.companyTitle === '新建') {
            companyAdd(this.newData).then(res => {
              if (res.state === '1') {
                this.$Message.success(res.message || '成功!')
                this.cancel()
              } else {
                this.$Message.error(res.message || '失败!')
              }
            })
          } else {
            this.newData.uuid = this.$route.query.data.uuid
            this.newData.state = this.data.state === true ? '1' : '2'
            let params = this.newData
            companyEdit(params).then(res => {
              if (res.state === '1') {
                this.$Message.success(res.msg || '成功!')
                this.cancel()
              } else {
                this.$Message.error(res.msg || '失败!')
              }
            })
          }
        }
      })
    },
    cancel() {
      this.$router.push('/commany')
    },
    change(status) {
      if (status) {
        this.newData.state = '1'
      } else {
        this.newData.state = '2'
      }
    }
  }
}
</script>
