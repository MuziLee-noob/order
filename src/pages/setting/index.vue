<template>
  <div class="contentData">
    <Tabs>
      <TabPane label="个人设置" name="first">
        <!-- <div class="userName">{{ userName }}</div> -->
        <Form
          ref="formValidate"
          :model="formValidate"
          :rules="ruleValidate"
          :label-width="80"
          class="form"
        >
          <FormItem label="登录账号">{{ account }}</FormItem>
          <FormItem label="用户姓名" prop="userName">
            <Input v-model="formValidate.userName" />
          </FormItem>
          <FormItem label="手机" prop="telphone">
            <Input v-model="formValidate.telphone" />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="submit('formValidate')">提交</Button>
            <Button type="primary" class="cancel" ghost @click="cancel()">取消</Button>
          </FormItem>
        </Form>
      </TabPane>
      <TabPane label="修改密码" name="second">
        <!-- <div class="userName">{{ userName }}</div> -->
        <Form
          :model="formItem"
          ref="formItem"
          class="form"
          :rules="formItemValidate"
          :label-width="110"
        >
          <FormItem label="登录账号">{{ account }}</FormItem>
          <FormItem label="请输入新密码" prop="newPassword">
            <Input maxlength="16" minlength="6" type="password" v-model="formItem.newPassword" />
            <!-- <span class="newpassword">6-16位,仅允许数字\下划线\字母组合</span> -->
          </FormItem>
          <FormItem label="确认密码" prop="pwdCheck">
            <Input maxlength="16" minlength="6" type="password" v-model="formItem.pwdCheck" />
            <!-- <div class="newpassword2">6-16位,仅允许数字\下划线\字母组合</div> -->
          </FormItem>
          <FormItem>
            <Button type="primary" @click="submit1('formItem')">提交</Button>
            <Button type="primary" ghost @click="cancel()" style="width: 60px;">
              取消
            </Button>
          </FormItem>
        </Form>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import { getUser, userEdit, passWorkEdit } from '../../api/login'
export default {
  //要从后台获取当前用户的数据
  data() {
    const pwdValidate = (rule, value, callback) => {
      this.$refs.formItem.validateField('pwdCheck')
      callback()
    }
    const pwdCheckValidate = (rule, value, callback) => {
      if (this.formItem.password != '' && value == '') {
        callback(new Error('确认密码不能为空'))
      } else if (this.formItem.password != value) {
        callback(new Error('新密码和确认密码应相同'))
      } else {
        callback()
      }
    }
    return {
      formItem: {
        newPassword: '',
        pwdCheck: ''
      },
      userName: '',
      account: '',
      telphone: '',
      formValidate: {
        userName: '',
        telphone: '',
        uuid: '',
        region: '',
        roleUuid: '',
        company: ''
      },
      ruleValidate: {
        userName: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
        telphone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
        ]
      },
      formItemValidate: {
        newPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z_]{1,}$/, message: '请输入数字、下划线或字母' }
        ],
        pwdCheck: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z_]{1,}$/, message: '请输入数字、下划线或字母' }
        ]
      }
      // validateRules: {
      //   password: [{ required: true, validator: pwdValidate, trigger: 'blur' }],
      //   pwdCheck: [{ required: true, validator: pwdCheckValidate, trigger: 'blur' }]
      // }
    }
  },
  created() {
    this.getuser()
  },
  methods: {
    // 获取用户
    getuser() {
      let params = {
        uuid: localStorage.getItem('uuid')
      }
      getUser(params).then(res => {
        if (res.state === '1') {
          this.account = res.data.userAcount
          this.formValidate.userName = res.data.userName
          this.formValidate.telphone = res.data.telphone
          this.formValidate.uuid = res.data.uuid
          this.formValidate.region = res.data.region
          this.formValidate.roleUuid = res.data.roleUuid
          this.formValidate.company = res.data.company
        }
      })
    },
    submit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          userEdit(this.formValidate).then(res => {
            if (res.state === '1') {
              this.$Message.success(res.message || '更新成功')
            } else {
              this.$Message.error(res.message || '更新失败')
            }
          })
        }
      })
    },
    submit1(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.formItem.pwdCheck !== this.formItem.newPassword) {
            this.$Message.error('两次密码不一致')
            return
          }
          let params = {
            newPassword: this.formItem.newPassword
          }
          passWorkEdit(params).then(res => {
            if (res.state === '1') {
              this.$Message.success(res.message || '修改成功')
            } else {
              this.$Message.error(res.message || '修改失败')
            }
          })
        }
      })
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
}
/deep/ .ivu-tabs-bar {
  height: 48px;
  //   background: #f5f5f5;
  // border-bottom: 1px solid #dcdee2;
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
  padding: 23px 670px;
  margin-top: 20px;
  // box-shadow: 0px 1px 2px 0px #c7c7c7, 0px 0px 4px 0px rgba(158, 158, 158, 0.5);
}
.cancel {
  margin-left: 20px;
}
</style>
