<template>
  <div class="contentData">
    <Tabs>
      <TabPane label="个人设置" name="first">
        <!-- <div class="userName">{{ userName }}</div> -->
        <Form label-position="left" :label-width="80" class="form">
          <FormItem label="登录账号">{{ account }}</FormItem>
          <FormItem label="用户姓名">
            <Input v-model="userName" />
          </FormItem>
          <FormItem label="手机">
            <Input v-model="phoneNumber" />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="submit()">提交</Button>
            <Button type="primary" class="cancel" ghost @click="cancel()">取消</Button>
          </FormItem>
        </Form>
      </TabPane>
      <TabPane label="修改密码" name="second">
        <!-- <div class="userName">{{ userName }}</div> -->
        <Form
          :model="formItem"
          v-model="formItem.id"
          ref="formItem"
          class="form"
          :rules="validateRules"
          :label-width="110"
          label-position="left"
        >
          <FormItem label="登录账号">{{ account }}</FormItem>
          <FormItem label="请输入新密码" prop="password">
            <Input
              maxlength="16"
              minlength="6"
              οnkeyup="this.value=this.value.replace(/[^\w]/g,'')"
              οnpaste="this.value=this.value.replace(/[^\w]/g,'')"
              v-model="formItem.password"
            />
            <span class="newpassword">6-16位,仅允许数字\下划线\字母组合</span>
          </FormItem>
          <FormItem label="确认密码" prop="pwdCheck">
            <Input
              maxlength="16"
              minlength="6"
              οnkeyup="this.value=this.value.replace(/[^\w]/g,'')"
              οnpaste="this.value=this.value.replace(/[^\w]/g,'')"
              v-model="formItem.pwdCheck"
            />
            <div class="newpassword2">6-16位,仅允许数字\下划线\字母组合</div>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="submit1()">提交</Button>
            <Button type="primary" class="cancel" ghost @click="cancel()">取消</Button>
          </FormItem>
        </Form>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
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
        id: '',
        password: '',
        pwdCheck: ''
      },
      userName: '',
      account: '',
      phoneNumber: '',
      validateRules: {
        password: [{ required: true, validator: pwdValidate, trigger: 'blur' }],
        pwdCheck: [{ required: true, validator: pwdCheckValidate, trigger: 'blur' }]
      }
    }
  },
  methods: {
    submit() {
      //Todo 这里写更新用户信息的方法
    },
    submit1() {
      //Todo 这里写更新密码的方法
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
  padding: 23px 670px;
  margin-top: 20px;
  box-shadow: 0px 1px 2px 0px #c7c7c7, 0px 0px 4px 0px rgba(158, 158, 158, 0.5);
}
.cancel {
  margin-left: 20px;
}
</style>
