<template>
  <div class="login">
    <div class="title">
      <img src="../../assets/images/编组2.png" />
    </div>
    <div class="in">
      <li>
        <img src="../../assets/images/wode.png" />
        <input type="text" placeholder="请输入手机号" v-model="phoneNumber" />
      </li>
      <HR />
      <li>
        <img src="../../assets/images/lock.png" />
        <input type="password" placeholder="请输入密码" v-model="password" />
      </li>
      <HR />
      <li>
        <button @click="login()">登录</button>
      </li>
    </div>
  </div>
</template>

<script>
import axios from '../../api/axios'
import { loginAuth } from '../../api/login'
const cryptoJS = require('crypto-js')
const key = 'njxtqgjyptfromonlinedisp'
export default {
  data() {
    return {
      phoneNumber: '',
      password: '',
      uid: '',
      role: Number,
      token: ''
    }
  },
  methods: {
    encryptByDES(value, key) {
      if (value == '') return ''
      var keyHex = cryptoJS.enc.Utf8.parse(key)
      var iv = cryptoJS.enc.Utf8.parse('01234567')
      var encrypted = cryptoJS.TripleDES.encrypt(value, keyHex, {
        iv: iv,
        mode: cryptoJS.mode.CBC,
        padding: cryptoJS.pad.Pkcs7
      })
      return encrypted.toString()
    },
    login() {
      //this.$router.push('/pedding')
      var account = this.encryptByDES(this.phoneNumber, key)
      var pwdMd5 = cryptoJS.MD5(this.password).toString()
      var pwd = this.encryptByDES(pwdMd5, key)
      var role = 0
      console.log(account, pwd, pwdMd5)
      console.log(this.phoneNumber, this.password)
      // let params = {
      //   account: account,
      //   pwd: pwd
      // }
      // console.log(account, pwd)
      // loginAuth(params).then(res => {
      //   console.log(res)
      //   this.uid = res.data.data.uuid
      //   this.token = res.data.token
      //   if (res.data.data.roleUuid === 'fea98ada6624476aa960c02a13e771fb') {
      //     role = 2 //需求发起人
      //   }
      //   if (res.data.data.roleUuid === '7ce7b05588154db694a1383bc515fa92') {
      //     role = 1 //审核人
      //   }
      //   if (res.data.data.roleUuid === 'abafab65e99345898cdc9ec66225e59d') {
      //     role = 3 //支撑接口人
      //   }
      //   this.$store.commit('setRole', role)
      //   this.$store.commit('setUserUuid', this.uid)
      //   console.log(this.uid, this.token, role)
      //   localStorage.setItem('token', this.token)
      //   if (role == 2) {
      //     console.log(role)
      //     this.$router.push('/pedding')
      //   } else {
      //     this.$router.push('/pedding')
      //   }
      // })
      axios
        .axios({
          method: 'get',
          url: '/api/login/manageuserlogin',
          params: {
            account: account,
            pwd: pwd
          }
        })
        .then(data => {
          console.log(data)
          this.uid = data.data.data.uuid
          this.token = data.data.token
          if (data.data.data.roleUuid === 'fea98ada6624476aa960c02a13e771fb') {
            role = 2 //需求发起人
          }
          if (data.data.data.roleUuid === '7ce7b05588154db694a1383bc515fa92') {
            role = 1 //审核人
          }
          if (data.data.data.roleUuid === 'abafab65e99345898cdc9ec66225e59d') {
            role = 3 //支撑接口人
          }
          this.$store.commit('setRole', role)
          this.$store.commit('setUserUuid', this.uid)
          console.log(this.uid, this.token, role)
          localStorage.setItem('token', this.token)
          localStorage.setItem('uuid', this.uid)
          if (role == 2) {
            console.log(role)
            this.$router.push('/pedding')
          } else {
            this.$router.push('/pedding')
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
li {
  list-style: none;
}
.login {
  width: 100%;
  height: 100%;
  background-image: url(../../assets/images/编组8.png);
  .title {
    position: absolute;
    height: auto;
    width: auto;
    left: 454px;
    top: 296px;
  }
  .in {
    position: absolute;
    left: 454px;
    top: 406px;
    width: 402px;
    height: 300px;
    li {
      input {
        display: inline-block;
        height: 64px;
        width: 360px;
        border: none;
        outline: none;
        font-size: 24px;
        margin-left: 10px;
        :-moz-placeholder {
          color: #dddddd;
        }
      }
      img {
        display: inline-block;
      }
    }
    li:nth-child(3) {
      margin-top: 88px;
    }
    li:nth-child(5) {
      margin-top: 80px;
      height: 76px;
      button {
        width: 412px; /* 宽度 */
        height: 76px; /* 高度 */
        border-width: 0px; /* 边框宽度 */
        border-radius: 3px; /* 边框半径 */
        background: #1e90ff; /* 背景颜色 */
        cursor: pointer; /* 鼠标移入按钮范围时出现手势 */
        outline: none; /* 不显示轮廓线 */
        font-family: Microsoft YaHei; /* 设置字体 */
        color: white; /* 字体颜色 */
        font-size: 30px; /* 字体大小 */
        border-radius: 40px;
      }
    }
  }
}
</style>
