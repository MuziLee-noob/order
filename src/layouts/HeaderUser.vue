<template>
  <div class="header-user">
    <div class="roleName">{{ roleName }}：{{ userNames }}</div>
    <i-dropdown>
      <ul name="setting" style="float: left;margin-right: 20px;margin-top:5px;" @click="userSet">
        <img src="../assets/images/shezhi.png" alt="" />
        <!-- <i-icon
          class="header-user__icon"
          size="18"
          style="color:#fff"
          type="ios-settings-outline"
        /> -->
        <!-- <span>个人设置</span> -->
      </ul>
      <ul
        name="user"
        style="float: left;margin-right: 20px;margin-top:7px;position:relative"
        @click="info"
      >
        <img src="../assets/images/ling.png" alt="" />
        <sup class="ivu-badge-count">{{ num }}</sup>
        <!-- <i-icon class="header-user__icon" size="18" style="color:#fff" type="ios-person-outline" /> -->
        <!-- <span>消息</span> -->
      </ul>
      <ul name="logout" style="float: left;margin-right: 20px;margin-top:7px;" @click="isOut">
        <img src="../assets/images/close.png" alt="" />
        <!-- <i-icon class="header-user__icon" size="18" style="color:#fff" type="ios-power-outline" /> -->
        <!-- <span>退出登录</span> -->
      </ul>
    </i-dropdown>

    <!-- 退出登录 -->
    <Modal
      id="fusion-del"
      class="pop-up delete"
      :closable="false"
      footer-hide
      v-model="delModel"
      width="416"
    >
      <p slot="header">
        <span>提示</span>
      </p>
      <div class="content">
        <span class="new-icon-del iconfont icon-tixing"></span>
        <span class="close-left" style="color:#333;">确定退出登录?</span>
      </div>
      <div class="add-footer">
        <Button @click="delOk" class="fusion-del-ok" type="primary">
          确定
        </Button>
        <Button @click="cancel_del" class="fusion-del-cancel" style="margin-left: 8px">
          取消
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { getNum } from '../api/login'
import store from '@/store'
import { getUrlQuery } from '../libs/tools'
import { getUser } from '../api/login'
export default {
  name: 'HeaderUser',

  components: {},

  data() {
    return {
      realName: '',
      token: '',
      delModel: false,
      num: 0,
      roleName: '',
      account: '',
      userNames: ''
    }
  },
  created() {
    this.getusers()
    this.getMessgeNum()
  },
  computed: {
    ...mapGetters(['userName', 'avatar'])
  },

  methods: {
    ...mapActions('user', ['userLogOut']),

    // handleClick(name) {
    //   switch (name) {
    //     case 'user':
    //       this.$router.push({ name: 'UserCenter' })
    //       break
    //     case 'setting':
    //       this.$router.push({ name: 'UserSet' })
    //       break
    //     case 'logout':
    //       this.delModel = true
    //       break
    //   }
    // },
    userSet() {
      this.$router.push('/setting')
    },
    info() {
      this.$router.push('/info')
      this.getMessgeNum()
    },
    isOut() {
      this.delModel = true
    },
    cancel_del() {
      this.delModel = false
    },
    // 获取用户
    getusers() {
      let params = {
        uuid: localStorage.getItem('uuid')
      }
      getUser(params).then(res => {
        if (res.state === '1') {
          this.account = res.data.userAcount
          this.userNames = res.data.userName
          this.roleName = res.data.roleName
        }
      })
    },
    // 获取未读消息的条数
    getMessgeNum() {
      getNum().then(res => {
        if (res.state === 1) {
          this.num = res.total
        }
      })
    },
    //退出登录确定
    delOk() {
      this.delModel = false
      this.$router.push('/login')
      // this.userLogOut().then(_ => {
      //   this.$Message.success({
      //     content: '退出登录成功~',
      //     onClose: () => {
      //       this.delModel = false
      //       localStorage.clear()
      //       sessionStorage.clear()
      //       this.$router.push('/login')
      //       // const url = process.env.NODE_ENV === 'demo' ? window.demo.admin : window.g.admin
      //       // window.location.href = url + '/login?redirectUrl=' + window.location.origin
      //     }
      //   })
      // })
    }
    // getUser() {
    //   this.token = getUrlQuery('p') ? getUrlQuery('p') : localStorage.getItem('tokenVal')
    //   let params = {
    //     token: this.token
    //   }
    //   getUserInfo(params).then(res => {
    //     if (res.status === 0) {
    //       this.realName = res.results.userName
    //     }
    //   })
    // }
  }
}
</script>
<style lang="less">
.header-user {
  cursor: pointer;
  display: inline-block;
  height: 100%;
  vertical-align: middle;

  &__text {
    font-size: 14px;
    padding-left: 15px;
    color: #fff;
    // color: rgba(0, 0, 0, 0.65);
  }

  &__icon {
    margin-right: 8px;
    vertical-align: middle;
  }

  .ivu-avatar {
    width: 26px;
    height: 26px;
  }
  .ivu-dropdown-item-divided {
    margin-top: 0;
    border-top: 0;
  }
  .span-img {
    width: 26px;
    height: 26px;
    margin-top: 17px;
  }
  .header-user__text {
    padding-left: 40px;
    margin-top: -68px;
  }
  .ivu-badge-count {
    top: 5px;
    right: 0;
    height: 12px;
    border-radius: 10px;
    min-width: 17px;
    background: #ed4014;
    color: #fff;
    line-height: 10px;
    text-align: center;
    padding: 0 2px;
    font-size: 10px;
    box-shadow: none;
  }
  .roleName {
    font-size: 16px;
    float: left;
    margin-right: 50px;
    color: #fff;
  }
}
</style>
