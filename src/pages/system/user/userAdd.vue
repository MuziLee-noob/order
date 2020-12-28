<template>
  <div class="companyOperate">
    <Content>
      <!-- <Row>系统管理>用户管理</Row> -->
      <Card dis-hover style="height:100%">
        <!-- <Icon type="ios-create" size="48" /> -->
        <!-- <Row>请填写用户信息</Row> -->
        <Row class="listFile">
          <i-col class="addInfo">
            <Form ref="newData" :model="newData" :label-width="120" :rules="ruleValidate">
              <FormItem label="用户姓名" prop="userName">
                <Input v-model="newData.userName" placeholder="请输入用户姓名" />
              </FormItem>
              <FormItem label="所在区域" prop="area">
                <Row type="flex" justify="space-between">
                  <i-col span="11">
                    <Select v-model="newData.city1">
                      <Option value="武汉">武汉</Option>
                    </Select>
                  </i-col>
                  <i-col span="11">
                    <Select v-model="newData.area">
                      <Option v-for="item in newData.city" :value="item.value" :key="item.value">
                        {{ item.lable }}
                      </Option>
                    </Select>
                  </i-col>
                </Row>
              </FormItem>
              <FormItem label="手机号" prop="phoneNumber">
                <Input v-model="newData.phoneNumber" placeholder="请输入手机号码" />
              </FormItem>
              <FormItem label="用户角色" prop="userState">
                <Select v-model="newData.userState" placeholder="请选择选择角色">
                  <Option value="fea98ada6624476aa960c02a13e771fb">需求发起人</Option>
                  <Option value="abafab65e99345898cdc9ec66225e59d">支撑接口人</Option>
                </Select>
              </FormItem>
              <FormItem label="所属公司" prop="userCompany">
                <Select
                  v-model="newData.userCompany"
                  placeholder="请选择公司"
                  @on-change="
                    v => {
                      enable(v, 'type')
                    }
                  "
                  :label-in-value="true"
                >
                  <Option v-for="item in companyList" :value="item.value" :key="item.value">
                    {{ item.label }}
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="是否启用">
                <i-switch v-model="newData.switch1" @on-change="change" />
              </FormItem>
              <FormItem>
                <Button type="primary" @click="submit('newData')">提交</Button>
              </FormItem>
            </Form>
          </i-col>
        </Row>
      </Card>
    </Content>
  </div>
</template>

<script>
import axios from '../../../api/axios'
// import above from '../../components/layout/above'
// import menuCheck from '../../components/layout/menuCheck'
export default {
  components: {
    // above,
    // menuCheck
  },
  data() {
    return {
      aduitFlag: false,
      data: '',
      companyId: '',
      userUuid: '',
      newData: {
        city1: '',
        userName: '',
        area: '',
        phoneNumber: '',
        userState: '',
        userCompany: '',
        switch1: false,
        city: [
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
      companyList: '', //公司列表，从后台来
      ruleValidate: {
        phoneNumber: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
        area: [{ required: true, message: '请选择所在区域', trigger: 'change' }],
        userName: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
        userState: [{ required: true, message: '请选择用户角色', trigger: 'change' }],
        userCompany: [{ required: true, message: '请选择用户公司', trigger: 'select' }]
      }
    }
  },
  created() {
    this.data = ''
    this.getCompany()
  },
  mounted() {
    this.getUSer()
  },
  methods: {
    getUSer() {
      this.data = this.$route.query.data
      if (this.data) {
        this.aduitFlag = true
        this.newData.userName = this.data.userName
        this.newData.area = this.data.region
        this.newData.phoneNumber = this.data.telphone
        this.newData.Userompany = this.data.company
        this.newData.userState = this.data.roleUuid
        this.userUuid = this.data.uuid
      }
      console.log(this.data)
    },
    getCompany() {
      axios
        .axios({
          method: 'get',
          url: 'userinfo/getAllCompany'
        })
        .then(data => {
          this.companyList = data.data.data
          for (var i = 0; i < this.companyList.length; i++) {
            this.companyList[i].value = this.companyList[i].uuid
            this.companyList[i].label = this.companyList[i].comName
          }
          console.log(this.companyList)
        })
    },
    newUSer() {
      axios
        .axios({
          method: 'post',
          url: 'userinfo/addUser',
          data: {
            userName: this.newData.userName,
            region: this.newData.area,
            telphone: this.newData.phoneNumber,
            company: this.newData.userCompany,
            roleUuid: this.newData.userState
          }
        })
        .then(data => {
          console.log(data)
          this.$Modal.success({
            title: '提示',
            content: '提交成功',
            onOk: () => {
              this.$router.push('/user')
            }
          })
        })
    },
    auditUser() {
      if (this.data) {
        axios
          .axios({
            method: 'post',
            url: 'userinfo/editUser',
            data: {
              uuid: this.userUuid,
              userName: this.newData.userName,
              region: this.newData.area,
              telphone: this.newData.phoneNumber,
              company: this.newData.userCompany,
              roleUuid: this.newData.userState
            }
          })
          .then(data => {
            console.log(data)
            this.$Modal.success({
              title: '提示',
              content: '更新成功',
              onOk: () => {
                this.$router.push('/user')
              }
            })
          })
      }
    },
    change(status) {
      this.newData.switch1 = status
    },
    submit(name) {
      var that = this
      this.$refs[name].validate(valid => {
        if (valid) {
          //Todo 这里写新建和修改用户的方法
          console.log(this.aduitFlag)
          if (!that.aduitFlag) {
            this.newUSer()
          }
          if (that.aduitFlag) {
            this.auditUser()
          }
          console.log(this.aduitFlag)
        }
      })
    }
  }
}
</script>
