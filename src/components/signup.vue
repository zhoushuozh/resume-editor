<template>
  <div class="dialog-mask">
    <div class="dialog-box" v-if="!signUpSuccess">
      <router-link to="/" class="close-btn" title="关闭" replace>&times;</router-link>
      <div class="dialog-header">注册账号</div>
      <form name="sign-up-form" action="" @submit.prevent="onSignUp">
        <ul>
          <li>
            <span class="error-message iconfont icon-cuowu" v-if="signUpForm.nameError">{{signUpForm.nameError}}</span>
            <label for="sign-up-name"><i class="iconfont icon-zhanghao"></i></label>
            <input type="text" id="sign-up-name" name="name" placeholder="请输入用户名" v-model="signUpForm.name">
          </li>
          <li>
            <span class="error-message iconfont icon-cuowu" v-if="signUpForm.emailError">{{signUpForm.emailError}}</span>
            <label for="sign-up-email"><i class="iconfont icon-email"></i></label>
            <input type="text" id="sign-up-email" name="email" placeholder="请输入注册邮箱" v-model="signUpForm.email">
          </li>
          <li>
            <span class="error-message iconfont" v-if="signUpForm.passwdError">{{signUpForm.passwdError}}</span>
            <label for="sign-up-userPass"><i class="iconfont icon-mima"></i></label>
            <input type="password" name="password" id="sign-up-userPass" placeholder="请输入6到24位的密码" v-model="signUpForm.passwd">
          </li>
          <li>
            <span class="error-message iconfont" v-if="signUpForm.confirmPasswdError">{{signUpForm.confirmPasswdError}}</span>
            <label for="signup-passwd-confirm"><i class="iconfont icon-querenmima"></i></label>
            <input type="password" name="passwdConfirm" id="signup-passwd-confirm" placeholder="请再次确认密码" v-model="signUpForm.confirmPasswd">
          </li>
          <li><button type="submit">注册</button></li>
        </ul>
      </form>
      <div class="links-area">已有账号？<router-link to="login" replace>立即登录</router-link></div>
    </div>
    <div class="dialog-box" v-if="signUpSuccess">
      <router-link to="/" class="close-btn" title="关闭" replace>&times;</router-link>
      <div class="dialog-message">注册成功，请检查邮箱并验证，邮箱验证后才可登录。</div>
      <router-link to="login" tag="button" replace>已验证，立即登录</router-link>
    </div>
  </div>
</template>

<script>
import AV from 'leancloud-storage'

export default {
  data () {
    return {
      signUpForm: {
        name: '',
        email: '',
        passwd: '',
        confirmPasswd: '',
        nameError: '',
        emailError: '',
        passwdError: '',
        signupPasswdConfirm: ''
      },
      signUpSuccess: false
    }
  },
  methods: {
    onSignUp () {
      let pattern = /^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/i
      let reg = /^[\w]{6,24}$/
      let nameError,
        emailError
      if (!this.signUpForm.name) {
        this.signUpForm.nameError = '用户名不能为空'
        return
      } else {
        this.signUpForm.nameError = ''
      }

      if (!this.signUpForm.email) {
        this.signUpForm.emailError = '邮箱不能为空'
        return
      } else if (!pattern.test(this.signUpForm.email)) {
        this.signUpForm.emailError = '邮箱格式不正确'
        return
      } else {
        this.signUpForm.emailError = ''
      }

      if (!this.signUpForm.passwd) {
        this.signUpForm.passwdError = '密码不能为空！'
        return
      } else if (!this.signUpForm.passwd.match(reg)) {
        this.signUpForm.passwdError = '请输入6到24位的密码！'
        return
      } else {
        this.signUpForm.passwdError = ''
      }

      if (!this.signUpForm.confirmPasswd) {
        this.signUpForm.confirmPasswdError = '请再次确认密码！'
        return
      } else if (!(this.signUpForm.passwd === this.signUpForm.confirmPasswd)) {
        this.signUpForm.confirmPasswdError = '密码不一致！'
        return
      } else {
        this.signUpForm.confirmPasswdError = ''
      }

      // 新建 AVUser 对象实例
      let user = new AV.User()
      // 设置用户名
      user.setUsername(this.signUpForm.name)
      // 设置密码
      user.setPassword(this.signUpForm.passwd)
      // 设置邮箱
      user.setEmail(this.signUpForm.email)
      user.signUp().then((user) => {
        this.signUpSuccess = true
        this.$parent.hasLogin()
      }, (error) => {
        switch (error.code) {
          case 202:
            nameError = '用户名已被占用！'
            break
          case 203:
            emailError = '此邮箱已被注册！'
            break
          default:
            emailError = error.code + '：' + error.error
        }
        this.signUpForm.nameError = nameError
        this.signUpForm.emailError = emailError
      })
    }
  }
}
</script>
